const fs = require('fs').promises;
const path = require('path');

async function finalCheckAllImages() {
  console.log('🔍 Final Comprehensive Image Check...\n');
  
  // Check Teva Deli
  await checkTevaDeliImages();
  
  // Check People's Store
  await checkPeopleStoreImages();
  
  // Check other vendors
  await checkOtherVendorImages();
  
  console.log('\n✅ Final check complete!');
}

async function checkTevaDeliImages() {
  console.log('=== TEVA DELI CHECK ===');
  
  const catalogPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  const content = await fs.readFile(catalogPath, 'utf-8');
  
  // Extract all products with their images
  const productRegex = /id: '(td-\d+)'[^}]*name: '([^']+)'[^}]*image: '([^']+)'/g;
  let match;
  const products = [];
  
  while ((match = productRegex.exec(content)) !== null) {
    products.push({
      id: match[1],
      name: match[2],
      image: match[3]
    });
  }
  
  console.log(`Found ${products.length} Teva Deli products\n`);
  
  // Check for common issues
  const issues = [];
  
  products.forEach(product => {
    const imageName = product.image.split('/').pop();
    
    // Check for mismatches based on filename vs product name
    if (imageName.includes('burger') && !product.name.toLowerCase().includes('burger') && !product.name.includes('Okara') && !product.name.includes('Ground')) {
      issues.push(`${product.id}: "${product.name}" uses burger image: ${imageName}`);
    }
    
    if (imageName.includes('schnitzel') && !product.name.toLowerCase().includes('schnitzel') && !product.name.includes('Okara')) {
      issues.push(`${product.id}: "${product.name}" uses schnitzel image: ${imageName}`);
    }
    
    if (imageName.includes('shawarma') && !product.name.toLowerCase().includes('shawarma')) {
      issues.push(`${product.id}: "${product.name}" uses shawarma image: ${imageName}`);
    }
  });
  
  if (issues.length > 0) {
    console.log('⚠️  Potential issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('✅ No obvious image mismatches found');
  }
  
  // Show sample mappings
  console.log('\nSample mappings:');
  const samples = ['td-001', 'td-005', 'td-007', 'td-021', 'td-033'];
  samples.forEach(id => {
    const product = products.find(p => p.id === id);
    if (product) {
      console.log(`  ${id}: ${product.name}`);
      console.log(`        → ${product.image.split('/').pop()}`);
    }
  });
}

async function checkPeopleStoreImages() {
  console.log('\n\n=== PEOPLE\'S STORE CHECK ===');
  
  const catalogPath = path.join(__dirname, '../lib/data/people-store-complete-catalog.json');
  const data = JSON.parse(await fs.readFile(catalogPath, 'utf-8'));
  
  console.log(`Found ${data.products.length} People's Store products\n`);
  
  // Check for duplicate IDs
  const idCounts = {};
  data.products.forEach(product => {
    idCounts[product.id] = (idCounts[product.id] || 0) + 1;
  });
  
  const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
  
  if (duplicates.length > 0) {
    console.log('❌ Duplicate IDs found:');
    duplicates.forEach(([id, count]) => {
      console.log(`  - ${id}: appears ${count} times`);
    });
  } else {
    console.log('✅ No duplicate IDs');
  }
  
  // Check specific products that had issues
  const checkProducts = [
    { name: 'Great Northern Organic Maple Syrup', expectedImage: 'Maple Syrup' },
    { name: 'Laverland Crunch Sea Salt Seaweed', expectedImage: 'Sea Salt Seaweed' },
    { name: 'Pure Sesame Oil Taiwan', expectedImage: 'Sesame Oil Taiwan.jpg' }
  ];
  
  console.log('\nChecking previously problematic products:');
  checkProducts.forEach(check => {
    const product = data.products.find(p => p.name.includes(check.name));
    if (product) {
      const imageOk = product.image.includes(check.expectedImage);
      console.log(`  ${imageOk ? '✅' : '❌'} ${check.name}`);
      if (!imageOk) {
        console.log(`     Current image: ${product.image.split('/').pop()}`);
      }
    }
  });
}

async function checkOtherVendorImages() {
  console.log('\n\n=== OTHER VENDORS CHECK ===');
  
  const vendors = [
    { name: 'Garden of Light', file: 'garden-of-light-complete-catalog.json' },
    { name: 'Queens Cuisine', file: 'queens-cuisine-complete-catalog.json' },
    { name: 'Gahn Delight', file: 'gahn-delight-complete-catalog.json' },
    { name: 'VOP Shop', file: 'vop-shop-complete-catalog.json' }
  ];
  
  for (const vendor of vendors) {
    const data = JSON.parse(await fs.readFile(path.join(__dirname, '../lib/data', vendor.file), 'utf-8'));
    console.log(`\n${vendor.name}: ${data.products.length} products`);
    
    // Basic validation
    const missingImages = data.products.filter(p => !p.image);
    const invalidPaths = data.products.filter(p => p.image && !p.image.startsWith('/'));
    
    if (missingImages.length > 0) {
      console.log(`  ❌ ${missingImages.length} products missing images`);
    }
    if (invalidPaths.length > 0) {
      console.log(`  ❌ ${invalidPaths.length} products with invalid paths`);
    }
    if (missingImages.length === 0 && invalidPaths.length === 0) {
      console.log(`  ✅ All images properly configured`);
    }
  }
}

// Run the final check
if (require.main === module) {
  finalCheckAllImages()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}