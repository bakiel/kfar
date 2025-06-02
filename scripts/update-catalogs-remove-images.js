#!/usr/bin/env node

/**
 * Update Catalog Files to Remove Hardcoded Image Paths
 * Images will be resolved by the enhanced image manager instead
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Update complete-catalog.ts to use image manager
 */
async function updateCompleteCatalog() {
  console.log('📝 Updating complete-catalog.ts to use enhanced image manager...\n');
  
  const catalogPath = path.join(__dirname, '../lib/data/complete-catalog.ts');
  
  try {
    let content = await fs.readFile(catalogPath, 'utf-8');
    
    // Add import for enhanced image manager
    if (!content.includes('enhanced-image-manager')) {
      const importStatement = `import { getProductImage, getVendorLogo, getVendorBanner } from '../utils/enhanced-image-manager';\n`;
      
      // Add after other imports
      const lastImportIndex = content.lastIndexOf('import');
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);
      
      console.log('✅ Added enhanced image manager import');
    }
    
    // Update the transformation functions to use image manager
    const transformationUpdates = [
      {
        old: 'image: p.image,',
        new: 'image: getProductImage(p.vendorId, p.id),'
      }
    ];
    
    for (const update of transformationUpdates) {
      if (content.includes(update.old)) {
        content = content.replace(new RegExp(update.old, 'g'), update.new);
        console.log('✅ Updated transformation to use getProductImage()');
      }
    }
    
    // Update inline product definitions to remove hardcoded images
    // This regex matches image: '...' patterns
    const imageLineRegex = /\s*image:\s*'[^']+',?\s*\n/g;
    const matches = content.match(imageLineRegex);
    
    if (matches) {
      console.log(`🔍 Found ${matches.length} hardcoded image paths to remove`);
      
      // Remove image lines from inline product definitions
      content = content.replace(imageLineRegex, '\n');
      console.log('✅ Removed hardcoded image paths');
    }
    
    // Update vendor logo references
    content = content.replace(
      /vendorLogo:\s*'[^']+'/g,
      'vendorLogo: getVendorLogo(vendorKey)'
    );
    
    // Save updated file
    await fs.writeFile(catalogPath, content);
    console.log('✅ Updated complete-catalog.ts\n');
    
  } catch (error) {
    console.error('❌ Error updating complete-catalog.ts:', error.message);
  }
}

/**
 * Update API endpoint to ensure it uses enhanced image manager
 */
async function updateAPIEndpoint() {
  console.log('📝 Checking API endpoint...\n');
  
  const apiPath = path.join(__dirname, '../app/api/products-enhanced/route.ts');
  
  try {
    let content = await fs.readFile(apiPath, 'utf-8');
    
    // Check if already using enhanced image manager
    if (content.includes('enhanced-image-manager')) {
      console.log('✅ API endpoint already using enhanced image manager');
      return;
    }
    
    // Update import
    if (content.includes("from '@/lib/utils/image-manager'")) {
      content = content.replace(
        "from '@/lib/utils/image-manager'",
        "from '@/lib/utils/enhanced-image-manager'"
      );
      
      await fs.writeFile(apiPath, content);
      console.log('✅ Updated API endpoint to use enhanced image manager\n');
    }
    
  } catch (error) {
    console.error('❌ Error updating API endpoint:', error.message);
  }
}

/**
 * Update vendor catalog files
 */
async function updateVendorCatalogs() {
  console.log('📝 Updating vendor catalog files...\n');
  
  const catalogFiles = [
    'teva-deli-complete-catalog.ts',
    'people-store-catalog.ts'
  ];
  
  for (const filename of catalogFiles) {
    const filePath = path.join(__dirname, '../lib/data', filename);
    
    try {
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Count image properties
      const imageMatches = content.match(/image:\s*'[^']+'/g);
      
      if (imageMatches) {
        console.log(`📄 ${filename}: Found ${imageMatches.length} image properties`);
        
        // Comment out image properties instead of removing
        // This preserves the data for reference
        content = content.replace(
          /(\s*)(image:\s*'[^']+')/g,
          '$1// $2 // Moved to enhanced-image-manager.ts'
        );
        
        await fs.writeFile(filePath, content);
        console.log(`✅ Commented out image properties in ${filename}`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${filename}:`, error.message);
    }
  }
  
  console.log();
}

/**
 * Create a type definition update for catalogs
 */
async function createTypeUpdate() {
  console.log('📝 Creating type definition update...\n');
  
  const typeUpdateContent = `/**
 * Updated Product Type without hardcoded images
 * Images are now resolved by enhanced-image-manager.ts
 */

export interface Product {
  id: string;
  name: string;
  nameHe?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  vendorId: string;
  // image property removed - resolved by image manager
  badge?: string;
  isVegan: boolean;
  isKosher: boolean;
  inStock: boolean;
  tags: string[];
  // ... other properties
}

/**
 * How to get product images:
 * 
 * import { getProductImage } from '@/lib/utils/enhanced-image-manager';
 * 
 * const image = getProductImage(product.vendorId, product.id);
 */
`;

  await fs.writeFile(
    path.join(__dirname, '../lib/data/product-type-update.ts'),
    typeUpdateContent
  );
  
  console.log('✅ Created product type update reference\n');
}

/**
 * Main update process
 */
async function main() {
  console.log('🚀 Starting Catalog Update Process...\n');
  console.log('This will update catalogs to use the enhanced image management system.\n');
  
  // Update main files
  await updateCompleteCatalog();
  await updateAPIEndpoint();
  await updateVendorCatalogs();
  await createTypeUpdate();
  
  console.log('📋 Summary:');
  console.log('1. Updated complete-catalog.ts to use enhanced image manager');
  console.log('2. Checked API endpoint for image manager usage');
  console.log('3. Commented out hardcoded images in vendor catalogs');
  console.log('4. Created type definition reference');
  
  console.log('\n⚠️  Important Next Steps:');
  console.log('1. Run: node scripts/organize-vendor-images.js');
  console.log('2. Test image loading in the application');
  console.log('3. Verify all products display correct images');
  console.log('4. Update any remaining components using old image paths');
  
  console.log('\n✨ Catalog update complete!');
}

// Run the update
main().catch(console.error);