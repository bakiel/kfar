#!/usr/bin/env node

/**
 * Organize Vendor Images into Bucket Structure
 * This script reorganizes images into vendor-specific directories
 */

const fs = require('fs').promises;
const path = require('path');

// Image mapping for reorganization
const IMAGE_REORGANIZATION = {
  'teva-deli': {
    logo: 'teva_deli_logo_vegan_factory.jpg',
    banner: 'teva_deli_banner_plant_based_factory.jpg',
    productPatterns: [
      'teva_deli_vegan_',
      'teva_deli_official_'
    ]
  },
  'queens-cuisine': {
    logo: 'queens_cuisine_logo_vegan_food_art.jpg',
    banner: 'queens_cuisine_banner_artisanal.jpg',
    productPatterns: [
      'queens_cuisine_vegan_',
      'queens_cuisine_middle_',
      'queens_cuisine_product_'
    ]
  },
  'gahn-delight': {
    logo: 'gahn_delight_logo_handcrafted_foods.jpg',
    banner: '1.jpg', // From Vendor Banners folder
    productPatterns: [
      'gahn_delight_ice_cream_',
      'gahn_delight_parfait_',
      'gahn_delight_popsicle_',
      'gahn_delight_sorbet_',
      'gahn_delight_sundae_'
    ]
  },
  'garden-of-light': {
    logo: 'garden_of_light_logo.jpg',
    banner: '2.jpg', // From Vendor Banners folder
    productPatterns: [
      'garden_of_light_',
      'atur_avior_'
    ]
  },
  'people-store': {
    logo: 'people_store_logo_community_retail.jpg',
    banner: '4.jpg', // From Vendor Banners folder
    productPatterns: [
      'Peoples Store - '
    ]
  },
  'vop-shop': {
    logo: 'vop_shop_logo_village_marketplace.jpg',
    banner: '3.jpg', // From Vendor Banners folder
    productPatterns: [
      'vop_shop_community_',
      'vop_shop_wellness_',
      'vop_shop_heritage_',
      'village_of_peace_vop_'
    ]
  }
};

/**
 * Create directory structure for vendor buckets
 */
async function createVendorBuckets() {
  const baseDir = path.join(__dirname, '../public/images/vendors');
  
  for (const vendorId of Object.keys(IMAGE_REORGANIZATION)) {
    const vendorDir = path.join(baseDir, vendorId);
    
    // Create subdirectories
    const subdirs = ['logo', 'banners', 'products', 'gallery', 'certificates', 'team', 'promotional', 'storefront'];
    
    for (const subdir of subdirs) {
      const dirPath = path.join(vendorDir, subdir);
      try {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`✅ Created: ${vendorId}/${subdir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          console.error(`❌ Error creating ${dirPath}:`, error.message);
        }
      }
    }
  }
}

/**
 * Get vendor ID from filename
 */
function getVendorFromFilename(filename) {
  for (const [vendorId, config] of Object.entries(IMAGE_REORGANIZATION)) {
    for (const pattern of config.productPatterns) {
      if (filename.includes(pattern)) {
        return vendorId;
      }
    }
    if (filename === config.logo || filename === config.banner) {
      return vendorId;
    }
  }
  return null;
}

/**
 * Categorize image by type
 */
function categorizeImage(filename, vendorConfig) {
  if (filename === vendorConfig.logo) return 'logo';
  if (filename === vendorConfig.banner) return 'banners';
  
  // Check for specific patterns
  if (filename.includes('banner')) return 'banners';
  if (filename.includes('certificate')) return 'certificates';
  if (filename.includes('team') || filename.includes('chef') || filename.includes('staff')) return 'team';
  if (filename.includes('promotional') || filename.includes('special')) return 'promotional';
  if (filename.includes('storefront') || filename.includes('entrance') || filename.includes('front')) return 'storefront';
  if (filename.includes('gallery') || filename.includes('display')) return 'gallery';
  
  // Default to products
  return 'products';
}

/**
 * Copy file to new location
 */
async function copyFile(source, destination) {
  try {
    await fs.copyFile(source, destination);
    return true;
  } catch (error) {
    console.error(`❌ Error copying ${source} to ${destination}:`, error.message);
    return false;
  }
}

/**
 * Organize images into vendor buckets
 */
async function organizeImages() {
  console.log('🗂️  Organizing Vendor Images into Buckets...\n');
  
  const vendorsDir = path.join(__dirname, '../public/images/vendors');
  
  try {
    // First, create all vendor bucket directories
    await createVendorBuckets();
    console.log('\n📁 Vendor bucket structure created\n');
    
    // Read all files in vendors directory
    const files = await fs.readdir(vendorsDir);
    const imageFiles = files.filter(f => 
      f.endsWith('.jpg') || 
      f.endsWith('.jpeg') || 
      f.endsWith('.png') || 
      f.endsWith('.webp')
    );
    
    console.log(`📸 Found ${imageFiles.length} images to organize\n`);
    
    // Track organization results
    const organized = {
      success: 0,
      failed: 0,
      unknown: 0
    };
    
    // Process each image
    for (const filename of imageFiles) {
      const vendorId = getVendorFromFilename(filename);
      
      if (!vendorId) {
        console.log(`⚠️  Unknown vendor for: ${filename}`);
        organized.unknown++;
        continue;
      }
      
      const vendorConfig = IMAGE_REORGANIZATION[vendorId];
      const category = categorizeImage(filename, vendorConfig);
      
      const sourcePath = path.join(vendorsDir, filename);
      const destPath = path.join(vendorsDir, vendorId, category, filename);
      
      const success = await copyFile(sourcePath, destPath);
      
      if (success) {
        console.log(`✅ ${vendorId}/${category}/${filename}`);
        organized.success++;
      } else {
        organized.failed++;
      }
    }
    
    // Handle special case for numbered banner files
    const bannerMappings = {
      '1.jpg': 'gahn-delight/banners/',
      '2.jpg': 'garden-of-light/banners/',
      '3.jpg': 'vop-shop/banners/',
      '4.jpg': 'people-store/banners/',
      '5.jpg': 'teva-deli/banners/',
      '6.jpg': 'queens-cuisine/banners/'
    };
    
    console.log('\n🎨 Processing vendor banners...');
    
    for (const [filename, vendorPath] of Object.entries(bannerMappings)) {
      const sourcePath = path.join(__dirname, '../../Vendor Banners', filename);
      const destPath = path.join(vendorsDir, vendorPath, filename);
      
      try {
        await fs.access(sourcePath);
        const success = await copyFile(sourcePath, destPath);
        if (success) {
          console.log(`✅ Banner: ${vendorPath}${filename}`);
          organized.success++;
        }
      } catch (error) {
        console.log(`⚠️  Banner file not found: ${filename}`);
      }
    }
    
    // Summary
    console.log('\n📊 Organization Summary:');
    console.log(`✅ Successfully organized: ${organized.success} files`);
    console.log(`❌ Failed: ${organized.failed} files`);
    console.log(`⚠️  Unknown vendor: ${organized.unknown} files`);
    
    // Create index file
    console.log('\n📝 Creating vendor image index...');
    
    const vendorIndex = {};
    for (const vendorId of Object.keys(IMAGE_REORGANIZATION)) {
      vendorIndex[vendorId] = {
        logo: '',
        banner: '',
        products: [],
        gallery: [],
        certificates: [],
        team: [],
        promotional: []
      };
      
      const vendorDir = path.join(vendorsDir, vendorId);
      
      for (const subdir of Object.keys(vendorIndex[vendorId])) {
        try {
          const subdirPath = path.join(vendorDir, subdir === 'logo' || subdir === 'banner' ? `${subdir}s` : subdir);
          const files = await fs.readdir(subdirPath);
          const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
          
          if (subdir === 'logo' && imageFiles.length > 0) {
            vendorIndex[vendorId].logo = imageFiles[0];
          } else if (subdir === 'banner' && imageFiles.length > 0) {
            vendorIndex[vendorId].banner = imageFiles[0];
          } else if (Array.isArray(vendorIndex[vendorId][subdir])) {
            vendorIndex[vendorId][subdir] = imageFiles;
          }
        } catch (error) {
          // Directory might not exist or be empty
        }
      }
    }
    
    // Save index
    await fs.writeFile(
      path.join(vendorsDir, 'vendor-image-index.json'),
      JSON.stringify(vendorIndex, null, 2)
    );
    
    console.log('✅ Vendor image index created\n');
    
    console.log('🎉 Image organization complete!');
    console.log('\n💡 Next steps:');
    console.log('1. Review organized images in vendor directories');
    console.log('2. Update enhanced-image-manager.ts paths if needed');
    console.log('3. Test image loading in the application');
    console.log('4. Remove old image files from root vendors directory');
    
  } catch (error) {
    console.error('❌ Error organizing images:', error);
  }
}

// Run the organization
organizeImages();