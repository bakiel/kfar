#!/usr/bin/env node

/**
 * Marketplace Image Restoration Script
 * Fixes all broken image links and ensures proper data linkage
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting marketplace image restoration...\n');

// Define the vendor directory structure
const vendorsDir = path.join(__dirname, '..', 'public', 'images', 'vendors');
const libDir = path.join(__dirname, '..', 'lib');

// Get all image files in the vendors directory
function getAllVendorImages() {
  const images = {};
  
  // Read main vendors directory
  const vendorFiles = fs.readdirSync(vendorsDir);
  
  vendorFiles.forEach(file => {
    const filePath = path.join(vendorsDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // This is a vendor subdirectory
      images[file] = {
        subdirectory: true,
        files: []
      };
      
      // Read files in subdirectory
      const subFiles = fs.readdirSync(filePath);
      subFiles.forEach(subFile => {
        const subFilePath = path.join(filePath, subFile);
        const subStat = fs.statSync(subFilePath);
        
        if (!subStat.isDirectory() && isImageFile(subFile)) {
          images[file].files.push(subFile);
        }
      });
    } else if (isImageFile(file)) {
      // This is an image in the main vendors directory
      // Extract vendor from filename
      const vendor = detectVendorFromFilename(file);
      if (!images[vendor]) {
        images[vendor] = {
          subdirectory: false,
          files: []
        };
      }
      images[vendor].files.push(file);
    }
  });
  
  return images;
}

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
}

function detectVendorFromFilename(filename) {
  const lowerFile = filename.toLowerCase();
  
  if (lowerFile.includes('teva_deli')) return 'teva-deli';
  if (lowerFile.includes('queens_cuisine')) return 'queens-cuisine';
  if (lowerFile.includes('gahn_delight')) return 'gahn-delight';
  if (lowerFile.includes('vop_shop')) return 'vop-shop';
  if (lowerFile.includes('peoples store') || lowerFile.includes('people_store')) return 'people-store';
  if (lowerFile.includes('garden of light') || lowerFile.includes('garden_of_light')) return 'garden-of-light';
  
  return 'unknown';
}

// Map product IDs to images based on patterns
function createProductMappings(vendorImages) {
  const mappings = {};
  
  Object.entries(vendorImages).forEach(([vendor, data]) => {
    mappings[vendor] = {
      logo: null,
      banner: null,
      products: {}
    };
    
    data.files.forEach(file => {
      const lowerFile = file.toLowerCase();
      
      // Detect logos
      if (lowerFile.includes('logo')) {
        mappings[vendor].logo = data.subdirectory 
          ? `/images/vendors/${vendor}/${file}`
          : `/images/vendors/${file}`;
      }
      // Detect banners
      else if (lowerFile.includes('banner')) {
        mappings[vendor].banner = data.subdirectory 
          ? `/images/vendors/${vendor}/${file}`
          : `/images/vendors/${file}`;
      }
      // Map product images
      else {
        const productId = extractProductId(vendor, file);
        if (productId) {
          mappings[vendor].products[productId] = data.subdirectory 
            ? `/images/vendors/${vendor}/${file}`
            : `/images/vendors/${file}`;
        }
      }
    });
  });
  
  return mappings;
}

function extractProductId(vendor, filename) {
  const patterns = {
    'teva-deli': [
      { pattern: /schnitzel/, id: 'td-001' },
      { pattern: /kubeh/, id: 'td-002' },
      { pattern: /tofu/, id: 'td-003' },
      { pattern: /_01_/, id: 'td-004' },
      { pattern: /_02_/, id: 'td-005' },
      { pattern: /_03_/, id: 'td-006' },
      { pattern: /_04_/, id: 'td-007' },
      { pattern: /_05_/, id: 'td-008' },
      { pattern: /_06_/, id: 'td-009' },
      { pattern: /_07_/, id: 'td-010' },
      { pattern: /_11_/, id: 'td-011' },
      { pattern: /_12_/, id: 'td-012' },
      { pattern: /_13_/, id: 'td-013' },
      { pattern: /_14_/, id: 'td-014' },
      { pattern: /_15_/, id: 'td-015' },
      { pattern: /_21_/, id: 'td-016' },
      { pattern: /_31_/, id: 'td-021' }
    ],
    'queens-cuisine': [
      { pattern: /burger.*sandwich/, id: 'qc-001' },
      { pattern: /meatballs.*pasta/, id: 'qc-002' },
      { pattern: /strips.*teriyaki/, id: 'qc-003' },
      { pattern: /shawarma.*pita/, id: 'qc-004' }
    ],
    'gahn-delight': [
      { pattern: /chocolate.*tahini/, id: 'gd-001' },
      { pattern: /passion.*mango/, id: 'gd-002' },
      { pattern: /pistachio.*rose/, id: 'gd-003' },
      { pattern: /lime.*coconut/, id: 'gd-004' },
      { pattern: /parfait.*chocolate/, id: 'gd-005' },
      { pattern: /sundae.*date/, id: 'gd-006' },
      { pattern: /popsicle.*berry/, id: 'gd-007' }
    ],
    'vop-shop': [
      { pattern: /_01_/, id: 'vs-001' },
      { pattern: /_02_/, id: 'vs-002' },
      { pattern: /_03_/, id: 'vs-003' },
      { pattern: /_04_/, id: 'vs-004' },
      { pattern: /_05_/, id: 'vs-005' },
      { pattern: /_06_/, id: 'vs-006' },
      { pattern: /_07_/, id: 'vs-007' },
      { pattern: /_08_/, id: 'vs-008' },
      { pattern: /_09_/, id: 'vs-009' },
      { pattern: /_10_/, id: 'vs-010' },
      { pattern: /_11_/, id: 'vs-011' },
      { pattern: /_12_/, id: 'vs-012' },
      { pattern: /_13_/, id: 'vs-013' },
      { pattern: /_14_/, id: 'vs-014' },
      { pattern: /_15_/, id: 'vs-015' }
    ],
    'people-store': [
      { pattern: /FOCO Coconut/, id: 'ps-001' },
      { pattern: /Maple Syrup/, id: 'ps-002' },
      { pattern: /Bulk Beans/, id: 'ps-003' },
      { pattern: /Bulk Flour/, id: 'ps-004' },
      { pattern: /Bulk Grains/, id: 'ps-005' },
      { pattern: /Plain Non-Dairy/, id: 'ps-006' },
      { pattern: /Blueberry Non-Dairy/, id: 'ps-007' },
      { pattern: /Sea Salt.*Seaweed/, id: 'ps-008' },
      { pattern: /Wasabi.*Seaweed/, id: 'ps-009' },
      { pattern: /Herb Seasoning/, id: 'ps-010' },
      { pattern: /Large 2L/, id: 'ps-011' },
      { pattern: /Sesame Oil Taiwan[^L]/, id: 'ps-012' },
      { pattern: /Hot Peppers/, id: 'ps-013' },
      { pattern: /Fermented Okra/, id: 'ps-014' },
      { pattern: /Cucumber Relish/, id: 'ps-015' },
      { pattern: /Dill Pickles/, id: 'ps-016' },
      { pattern: /Spicy Relish/, id: 'ps-017' },
      { pattern: /Sauerkraut/, id: 'ps-018' },
      { pattern: /Pineapple Non-Dairy/, id: 'ps-019' },
      { pattern: /Kimchi/, id: 'ps-020' },
      { pattern: /Strawberry Non-Dairy/, id: 'ps-021' },
      { pattern: /Sweet and Sour Ginger/, id: 'ps-022' },
      { pattern: /Tamari/, id: 'ps-023' }
    ],
    'garden-of-light': [
      { pattern: /1\.jpg/, id: 'gol-001' },
      { pattern: /2\.jpg/, id: 'gol-002' }
    ]
  };
  
  const vendorPatterns = patterns[vendor] || [];
  
  for (const { pattern, id } of vendorPatterns) {
    if (pattern.test(filename)) {
      return id;
    }
  }
  
  return null;
}

// Update the actual-image-paths.ts file
function updateActualImagePaths(mappings) {
  const actualPathsFile = path.join(libDir, 'utils', 'actual-image-paths.ts');
  
  const tsContent = `/**
 * Actual Image Paths for Marketplace Vendors
 * 
 * This file contains the real image paths that exist in the public/images/vendors directory
 * Updated: ${new Date().toISOString()}
 */

export const ACTUAL_IMAGE_PATHS: Record<string, {
  logo: string;
  banner?: string;
  products: Record<string, string>;
}> = ${JSON.stringify(mappings, null, 2)};

// Fallback image
export const PLACEHOLDER_IMAGE = '/images/placeholder-product.jpg';

// Helper function to get product image
export function getProductImagePath(vendorId: string, productId: string): string {
  const vendor = ACTUAL_IMAGE_PATHS[vendorId];
  if (!vendor || !vendor.products) {
    return PLACEHOLDER_IMAGE;
  }
  
  const productImage = vendor.products[productId.toLowerCase()];
  return productImage || PLACEHOLDER_IMAGE;
}

// Helper function to get vendor logo
export function getVendorLogoPath(vendorId: string): string {
  const vendor = ACTUAL_IMAGE_PATHS[vendorId];
  return vendor?.logo || '/images/vendors/default_logo.jpg';
}

// Helper function to get vendor banner
export function getVendorBannerPath(vendorId: string): string {
  const vendor = ACTUAL_IMAGE_PATHS[vendorId];
  return vendor?.banner || vendor?.logo || '/images/vendors/default_banner.jpg';
}
`;

  fs.writeFileSync(actualPathsFile, tsContent);
  console.log('✅ Updated actual-image-paths.ts');
}

// Main execution
const vendorImages = getAllVendorImages();
console.log('📁 Found vendor images:', vendorImages);

const mappings = createProductMappings(vendorImages);
console.log('\n🗺️  Created mappings:', JSON.stringify(mappings, null, 2));

updateActualImagePaths(mappings);

console.log('\n✨ Image restoration complete!');
console.log('🔄 Please restart your development server to see the changes.');
