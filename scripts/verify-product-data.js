const fs = require('fs');
const path = require('path');

// Load all vendor catalogs
const vendors = [
  { name: 'Garden of Light', file: './lib/data/garden-of-light-complete-catalog.json' },
  { name: 'Queens Cuisine', file: './lib/data/queens-cuisine-complete-catalog.json' },
  { name: 'Gahn Delight', file: './lib/data/gahn-delight-complete-catalog.json' },
  { name: 'VOP Shop', file: './lib/data/vop-shop-complete-catalog.json' },
  { name: 'People Store', file: './lib/data/people-store-complete-catalog.json' }
];

let allIssues = [];
let priceStats = { min: Infinity, max: 0, total: 0, count: 0 };
let categoryStats = {};

console.log('🔍 KFAR Marketplace Product Data Verification\n');

vendors.forEach(vendor => {
  const data = JSON.parse(fs.readFileSync(vendor.file, 'utf-8'));
  console.log('\n=== ' + vendor.name + ' ===');
  console.log('Products: ' + data.products.length);
  
  data.products.forEach(product => {
    // Check price
    if (!product.price || product.price <= 0) {
      allIssues.push(vendor.name + ' - ' + product.name + ': Invalid price');
    }
    priceStats.min = Math.min(priceStats.min, product.price);
    priceStats.max = Math.max(priceStats.max, product.price);
    priceStats.total += product.price;
    priceStats.count++;
    
    // Check vendorId
    if (!product.vendorId) {
      allIssues.push(vendor.name + ' - ' + product.name + ': Missing vendorId');
    }
    
    // Check image path
    if (!product.image || !product.image.startsWith('/')) {
      allIssues.push(vendor.name + ' - ' + product.name + ': Invalid image path');
    }
    
    // Check description
    if (!product.description || product.description.length < 10) {
      allIssues.push(vendor.name + ' - ' + product.name + ': Missing/short description');
    }
    
    // Track categories
    if (product.category) {
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    }
  });
});

// Check Teva Deli separately (TypeScript file)
try {
  const tevaModule = require('../lib/data/teva-deli-complete-catalog');
  const tevaProducts = tevaModule.tevaDeliCompleteProducts;
  console.log('\n=== Teva Deli ===');
  console.log('Products: ' + tevaProducts.length);
  
  tevaProducts.forEach(product => {
    if (!product.price || product.price <= 0) {
      allIssues.push('Teva Deli - ' + product.name + ': Invalid price');
    }
    priceStats.min = Math.min(priceStats.min, product.price);
    priceStats.max = Math.max(priceStats.max, product.price);
    priceStats.total += product.price;
    priceStats.count++;
    
    if (product.category) {
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    }
  });
} catch (e) {
  console.log('Note: Could not load Teva Deli TypeScript catalog');
}

console.log('\n=== PRICE STATISTICS ===');
console.log('Min price: ₪' + priceStats.min);
console.log('Max price: ₪' + priceStats.max);
console.log('Average price: ₪' + Math.round(priceStats.total / priceStats.count));

console.log('\n=== CATEGORY DISTRIBUTION ===');
Object.entries(categoryStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(cat + ': ' + count + ' products');
  });

console.log('\n=== VALIDATION RESULTS ===');
if (allIssues.length === 0) {
  console.log('✅ No issues found! All products have valid data.');
} else {
  console.log('❌ Found ' + allIssues.length + ' issues:');
  allIssues.forEach(issue => console.log('  - ' + issue));
}