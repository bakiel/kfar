// Quick test to verify Teva Deli products are accessible

import { completeProductCatalog } from '../lib/data/complete-catalog';

console.log('🔍 Testing Teva Deli Product Access\n');

const tevaDeli = completeProductCatalog['teva-deli'];

if (tevaDeli) {
  console.log(`✅ Vendor found: ${tevaDeli.vendorName}`);
  console.log(`📦 Total products: ${tevaDeli.products.length}`);
  
  // Show first 5 products
  console.log('\n📋 First 5 products:');
  tevaDeli.products.slice(0, 5).forEach((product, index) => {
    console.log(`${index + 1}. ${product.name} (${product.nameHe}) - ₪${product.price}`);
    console.log(`   Image: ${product.image}`);
  });
  
  // Check for duplicates
  const names = tevaDeli.products.map(p => p.name);
  const uniqueNames = new Set(names);
  
  console.log(`\n✅ Unique product names: ${uniqueNames.size}`);
  console.log(`${names.length === uniqueNames.size ? '✅ No duplicate names' : '❌ Duplicate names found'}`);
  
  // Check categories
  const categories = new Set(tevaDeli.products.map(p => p.category));
  console.log(`\n📁 Categories: ${Array.from(categories).join(', ')}`);
  
} else {
  console.log('❌ Teva Deli not found in catalog!');
}
