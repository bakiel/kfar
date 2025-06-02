#!/usr/bin/env node

/**
 * Verify Image Mappings
 * Checks that all mapped images actually exist
 */

const fs = require('fs');
const path = require('path');

// Load the actual-image-paths module
const actualPathsFile = path.join(__dirname, '..', 'lib', 'utils', 'actual-image-paths.ts');
const content = fs.readFileSync(actualPathsFile, 'utf-8');

// Extract the ACTUAL_IMAGE_PATHS object
const match = content.match(/export const ACTUAL_IMAGE_PATHS[^=]+=\s*({[\s\S]*?});/);
if (!match) {
  console.error('Could not parse ACTUAL_IMAGE_PATHS');
  process.exit(1);
}

// Parse the JSON-like structure
const pathsJSON = match[1]
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\/\/.*$/gm, '') // Remove single-line comments
  .replace(/,\s*}/, '}') // Remove trailing commas
  .replace(/,\s*]/, ']'); // Remove trailing commas in arrays

let ACTUAL_IMAGE_PATHS;
try {
  ACTUAL_IMAGE_PATHS = eval(`(${pathsJSON})`);
} catch (e) {
  console.error('Failed to parse image paths:', e);
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');
let totalImages = 0;
let missingImages = 0;
let foundImages = 0;

console.log('🔍 Verifying image mappings...\n');

// Check each vendor
Object.entries(ACTUAL_IMAGE_PATHS).forEach(([vendor, data]) => {
  console.log(`\n📦 ${vendor}:`);
  
  // Check logo
  if (data.logo) {
    totalImages++;
    const logoPath = path.join(publicDir, data.logo);
    if (fs.existsSync(logoPath)) {
      console.log(`  ✅ Logo: ${data.logo}`);
      foundImages++;
    } else {
      console.log(`  ❌ Logo MISSING: ${data.logo}`);
      missingImages++;
    }
  }
  
  // Check banner
  if (data.banner) {
    totalImages++;
    const bannerPath = path.join(publicDir, data.banner);
    if (fs.existsSync(bannerPath)) {
      console.log(`  ✅ Banner: ${data.banner}`);
      foundImages++;
    } else {
      console.log(`  ❌ Banner MISSING: ${data.banner}`);
      missingImages++;
    }
  }
  
  // Check products
  const productCount = Object.keys(data.products).length;
  console.log(`  📸 Products: ${productCount} mapped`);
  
  let vendorMissing = 0;
  Object.entries(data.products).forEach(([productId, imagePath]) => {
    totalImages++;
    const fullPath = path.join(publicDir, imagePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`    ❌ ${productId}: ${imagePath}`);
      missingImages++;
      vendorMissing++;
    } else {
      foundImages++;
    }
  });
  
  if (vendorMissing === 0 && productCount > 0) {
    console.log(`    ✅ All products images found!`);
  } else if (vendorMissing > 0) {
    console.log(`    ⚠️  ${vendorMissing} product images missing`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 SUMMARY:');
console.log(`Total images mapped: ${totalImages}`);
console.log(`✅ Found: ${foundImages} (${Math.round(foundImages/totalImages * 100)}%)`);
console.log(`❌ Missing: ${missingImages} (${Math.round(missingImages/totalImages * 100)}%)`);

if (missingImages === 0) {
  console.log('\n🎉 All images are properly mapped and exist!');
} else {
  console.log('\n⚠️  Some images need attention. Check the missing files above.');
}
