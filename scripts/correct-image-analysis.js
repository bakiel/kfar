const fs = require('fs').promises;
const path = require('path');

async function correctImageAnalysis() {
  console.log('🔍 Correct Image Analysis\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  const content = await fs.readFile(tevaPath, 'utf-8');
  
  // Extract ALL products properly
  const products = [];
  const productBlocks = content.match(/\{[^{}]*id: '[^']+',[\s\S]*?\},/g) || [];
  
  productBlocks.forEach(block => {
    const id = block.match(/id: '([^']+)'/)?.[1];
    const name = block.match(/name: '([^']+)'/)?.[1];
    const category = block.match(/category: '([^']+)'/)?.[1];
    const image = block.match(/image: '([^']+)'/)?.[1];
    
    if (id && name && image) {
      products.push({ id, name, category, image });
    }
  });
  
  console.log(`Total products found: ${products.length}\n`);
  
  // Analyze image usage for images 1-20
  console.log('📸 ACTUAL IMAGE USAGE (Images 01-20):\n');
  
  for (let i = 1; i <= 20; i++) {
    const padded = i.toString().padStart(2, '0');
    const using = products.filter(p => p.image.includes(`_${padded}_`));
    
    if (using.length > 0) {
      console.log(`Image ${padded}:`);
      using.forEach(p => {
        console.log(`  - ${p.id}: ${p.name} [${p.category}]`);
      });
    } else {
      console.log(`Image ${padded}: NOT USED`);
    }
  }
  
  console.log('\n🔍 PROBLEMATIC PRODUCTS FROM SCREENSHOT:\n');
  
  const problematic = ['td-004', 'td-008', 'td-037', 'td-017'];
  problematic.forEach(id => {
    const product = products.find(p => p.id === id);
    if (product) {
      const imageFile = product.image.split('/').pop();
      const imageNum = imageFile.match(/_(\d+)_/)?.[1];
      console.log(`${id}: ${product.name}`);
      console.log(`  Image: ${imageFile}`);
      console.log(`  Image number: ${imageNum || 'N/A'}`);
      console.log(`  What screenshot shows: Tofu/package product`);
      console.log('');
    }
  });
  
  console.log('🎯 SOLUTION:\n');
  console.log('Based on the screenshot showing tofu/package products, these products');
  console.log('need to be reassigned to images that actually show:');
  console.log('- Skewers for td-004');
  console.log('- Mixed grill for td-008');
  console.log('- Shawarma for td-037');
  console.log('\nThe problem is the image files contain different products than their names suggest.');
}

correctImageAnalysis().catch(console.error);