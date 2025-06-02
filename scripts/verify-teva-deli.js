#!/usr/bin/env node

// Test script to verify Teva Deli catalog update

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Teva Deli catalog update...\n');

// Check if catalog files exist
const catalogPath = path.join(__dirname, '../lib/data/teva-deli-catalog.ts');
const completeCatalogPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
const vendorConfigPath = path.join(__dirname, '../lib/data/vendors/teva-deli-config.ts');

// Check files
const files = [
  { name: 'Main Catalog', path: catalogPath },
  { name: 'Complete Catalog', path: completeCatalogPath },
  { name: 'Vendor Config', path: vendorConfigPath }
];

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    const stats = fs.statSync(file.path);
    console.log(`✅ ${file.name}: ${(stats.size / 1024).toFixed(2)} KB`);
  } else {
    console.log(`❌ ${file.name}: NOT FOUND`);
  }
});

// Read and analyze catalog
try {
  const catalogContent = fs.readFileSync(completeCatalogPath, 'utf8');
  
  // Count products
  const productMatches = catalogContent.match(/id: 'td-\d+'/g);
  const productCount = productMatches ? productMatches.length : 0;
  
  // Check for duplicates
  const duplicateChecks = [
    'מריטפי טופו', // Tofu strips
    'HOT DOG'       // Hot dogs
  ];
  
  console.log('\n📊 Catalog Analysis:');
  console.log(`- Total products: ${productCount}`);
  
  duplicateChecks.forEach(check => {
    const occurrences = (catalogContent.match(new RegExp(check, 'g')) || []).length;
    console.log(`- "${check}" occurrences: ${occurrences} ${occurrences > 1 ? '⚠️ DUPLICATE!' : '✅'}`);
  });
  
  // Check categories
  const categories = new Set();
  const categoryMatches = catalogContent.match(/category: '([^']+)'/g);
  if (categoryMatches) {
    categoryMatches.forEach(match => {
      const category = match.match(/category: '([^']+)'/)[1];
      categories.add(category);
    });
  }
  
  console.log(`\n📁 Categories found: ${categories.size}`);
  categories.forEach(cat => console.log(`  - ${cat}`));
  
  console.log('\n✨ Teva Deli catalog verification complete!');
  
} catch (error) {
  console.error('❌ Error reading catalog:', error.message);
}

// Check image directory
const imageDir = path.join(__dirname, '../public/images/vendors');
console.log('\n🖼️ Image Directory:');
if (fs.existsSync(imageDir)) {
  const vendors = fs.readdirSync(imageDir);
  const tevaImages = vendors.filter(f => f.includes('teva_deli'));
  console.log(`- Teva Deli images found: ${tevaImages.length}`);
} else {
  console.log('❌ Image directory not found');
}
