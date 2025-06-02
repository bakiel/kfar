const fs = require('fs').promises;
const path = require('path');

async function verifyFinalImages() {
  console.log('🔍 Final Image Verification Report\n');
  
  // Load all catalog files
  const tevaContent = await fs.readFile(path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts'), 'utf-8');
  const tevaProductsMatch = tevaContent.match(/export const tevaDeliCompleteProducts[^=]*=\s*(\[[\s\S]*?\]);/);
  const tevaProducts = tevaProductsMatch ? eval(tevaProductsMatch[1]) : [];
  
  const catalogs = {
    'teva-deli': tevaProducts,
    'people-store': require('../lib/data/people-store-complete-catalog.json').products,
    'vop-shop': require('../lib/data/vop-shop-complete-catalog.json').products,
    'garden-of-light': require('../lib/data/garden-of-light-complete-catalog.json').products,
    'queens-cuisine': require('../lib/data/queens-cuisine-complete-catalog.json').products,
    'gahn-delight': require('../lib/data/gahn-delight-complete-catalog.json').products
  };
  
  let totalProducts = 0;
  let missingImages = [];
  let okraProducts = [];
  let burgerProducts = [];
  let schnitzelProducts = [];
  
  // Check each vendor
  for (const [vendor, products] of Object.entries(catalogs)) {
    console.log(`\n📦 ${vendor.toUpperCase()}: ${products.length} products`);
    totalProducts += products.length;
    
    for (const product of products) {
      // Check if image file exists
      const imagePath = path.join(__dirname, '../public', product.image);
      try {
        await fs.access(imagePath);
      } catch {
        missingImages.push({
          vendor,
          id: product.id,
          name: product.name,
          image: product.image
        });
      }
      
      // Special checks for Teva Deli
      if (vendor === 'teva-deli') {
        // Check OKARA products
        if (product.name.toLowerCase().includes('okara') || product.nameHe?.includes('אוקרה')) {
          okraProducts.push({
            id: product.id,
            name: product.name,
            image: product.image,
            category: product.category
          });
        }
        
        // Check burger products
        if (product.category === 'burgers') {
          burgerProducts.push({
            id: product.id,
            name: product.name,
            image: product.image
          });
        }
        
        // Check schnitzel products
        if (product.category === 'schnitzels') {
          schnitzelProducts.push({
            id: product.id,
            name: product.name,
            image: product.image
          });
        }
      }
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`Total Products: ${totalProducts}`);
  console.log(`Missing Images: ${missingImages.length}`);
  
  if (missingImages.length > 0) {
    console.log('\n❌ MISSING IMAGES:');
    missingImages.forEach(item => {
      console.log(`- ${item.vendor}/${item.id}: ${item.name}`);
      console.log(`  Path: ${item.image}`);
    });
  }
  
  console.log('\n🔍 TEVA DELI SPECIAL CHECKS:');
  
  console.log('\nOKARA Products (should use green box images 21-22):');
  okraProducts.forEach(p => {
    const imageNum = p.image.match(/_(\d+)_/)?.[1];
    const isCorrect = imageNum === '21' || imageNum === '22';
    console.log(`${isCorrect ? '✅' : '❌'} ${p.id}: ${p.name} - Image ${imageNum} (Category: ${p.category})`);
  });
  
  console.log('\nBurger Products:');
  burgerProducts.forEach(p => {
    const imageNum = p.image.match(/_(\d+)_/)?.[1];
    console.log(`- ${p.id}: ${p.name} - Image ${imageNum}`);
  });
  
  console.log('\nSchnitzel Products:');
  schnitzelProducts.forEach(p => {
    const imageNum = p.image.match(/_(\d+)_/)?.[1];
    const isOkraImage = imageNum === '21' || imageNum === '22';
    console.log(`${isOkraImage ? '❌' : '✅'} ${p.id}: ${p.name} - Image ${imageNum}`);
  });
  
  // Check for duplicate IDs
  console.log('\n🔍 DUPLICATE ID CHECK:');
  const allIds = [];
  for (const [vendor, products] of Object.entries(catalogs)) {
    products.forEach(p => {
      allIds.push({ vendor, id: p.id });
    });
  }
  
  const idCounts = {};
  allIds.forEach(item => {
    const key = item.id;
    if (!idCounts[key]) idCounts[key] = [];
    idCounts[key].push(item.vendor);
  });
  
  const duplicates = Object.entries(idCounts).filter(([id, vendors]) => vendors.length > 1);
  if (duplicates.length > 0) {
    console.log('❌ Found duplicate IDs:');
    duplicates.forEach(([id, vendors]) => {
      console.log(`- ${id} appears in: ${vendors.join(', ')}`);
    });
  } else {
    console.log('✅ No duplicate IDs found');
  }
  
  console.log('\n✅ Verification Complete!');
}

verifyFinalImages().catch(console.error);