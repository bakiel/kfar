const fs = require('fs').promises;
const path = require('path');

async function analyzeTevaDeliMismatches() {
  console.log('🔍 Analyzing Teva Deli Product-Image Relationships\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  const content = await fs.readFile(tevaPath, 'utf-8');
  
  // Extract all products with detailed info
  const productRegex = /id: '([^']+)',[\s\S]*?name: '([^']+)',[\s\S]*?nameHe: '([^']+)',[\s\S]*?description: '([^']+)',[\s\S]*?category: '([^']+)',[\s\S]*?image: '([^']+)'/g;
  
  const products = [];
  let match;
  while ((match = productRegex.exec(content)) !== null) {
    const imageFile = match[6].split('/').pop();
    const imageNum = imageFile.match(/_(\d+)_/)?.[1];
    
    products.push({
      id: match[1],
      name: match[2],
      nameHe: match[3],
      description: match[4].substring(0, 50) + '...',
      category: match[5],
      image: imageFile,
      imageNum: imageNum ? parseInt(imageNum) : null
    });
  }
  
  console.log('📊 IMAGE NUMBER RANGES BY CATEGORY:\n');
  
  // Group by category and analyze image numbers
  const categories = {};
  products.forEach(p => {
    if (!categories[p.category]) {
      categories[p.category] = [];
    }
    categories[p.category].push(p);
  });
  
  Object.entries(categories).forEach(([category, prods]) => {
    const imageNums = prods.filter(p => p.imageNum).map(p => p.imageNum).sort((a, b) => a - b);
    console.log(`${category}: Images ${imageNums.join(', ')}`);
  });
  
  console.log('\n🔴 SPECIFIC ISSUES TO FIX:\n');
  
  // Check for specific known issues
  products.forEach(product => {
    const issues = [];
    
    // Issue 1: Burgers using "schnitzel" image files
    if (product.category === 'burgers' && product.image.includes('schnitzel')) {
      issues.push('Burger using schnitzel image file');
    }
    
    // Issue 2: OKARA products (should be images 21-23)
    if (product.name.toLowerCase().includes('okara') && 
        (!product.imageNum || product.imageNum < 21 || product.imageNum > 23)) {
      issues.push('OKARA product not using OKARA image (21-23)');
    }
    
    // Issue 3: Products with image 21-23 that aren't OKARA
    if (product.imageNum >= 21 && product.imageNum <= 23 && 
        !product.name.toLowerCase().includes('okara') &&
        !product.name.toLowerCase().includes('ground')) {
      issues.push('Non-OKARA product using OKARA image range');
    }
    
    // Issue 4: Schnitzels with burger images
    if (product.category === 'schnitzels' && product.image.includes('burger')) {
      issues.push('Schnitzel using burger image file');
    }
    
    // Issue 5: Wrong category for product type
    if (product.name.toLowerCase().includes('burger') && product.category !== 'burgers') {
      issues.push(`Burger in wrong category: ${product.category}`);
    }
    
    if (issues.length > 0) {
      console.log(`${product.id}: ${product.name}`);
      console.log(`  Hebrew: ${product.nameHe}`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Image: ${product.image}`);
      console.log(`  Issues: ${issues.join('; ')}`);
      console.log('');
    }
  });
  
  // Analyze what images 21-30 actually show based on our knowledge
  console.log('📸 KNOWN IMAGE CONTENTS (from vision analysis):\n');
  const knownImages = {
    21: 'OKARA green box - Herb patties',
    22: 'OKARA green box - Broccoli patties', 
    23: 'Plant-based ground (green box)',
    24: 'Black box burger - Rice/Lentils',
    25: 'Green product (spinach schnitzel?)',
    26: 'Various uses - needs verification',
    27: 'Seitan Amaranth Schnitzel (confirmed)',
    28: 'Kubeh Burger (confirmed)',
    29: 'Burger product',
    30: 'Burger or schnitzel product'
  };
  
  Object.entries(knownImages).forEach(([num, desc]) => {
    const using = products.filter(p => p.imageNum === parseInt(num));
    console.log(`Image ${num}: ${desc}`);
    if (using.length > 0) {
      using.forEach(p => {
        console.log(`  Used by: ${p.id} - ${p.name}`);
      });
    }
    console.log('');
  });
}

analyzeTevaDeliMismatches().catch(console.error);