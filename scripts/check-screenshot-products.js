const fs = require('fs').promises;
const path = require('path');

async function checkScreenshotProducts() {
  console.log('🔍 Checking products from screenshots\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  const content = await fs.readFile(tevaPath, 'utf-8');
  
  // Products from screenshots
  const checkProducts = [
    'td-001', // Seitan Amerant Schnitzeloni - showing OKARA
    'td-028', // Kubeh Burger with Bulgur - showing brown product
    'td-025', // Spinach & Herb Schnitzel - showing grid
    'td-030', // Sesame-Crusted Schnitzel - showing sausage
    'td-004', // Mediterranean Seitan Skewers - showing OKARA
    'td-008', // Jerusalem Mixed Grill - showing yellow OKARA
    'td-037', // Plant-Based Shawarma (from name)
    'td-017'  // BBQ Pulled Seitan
  ];
  
  console.log('Products to check:');
  checkProducts.forEach(id => {
    const regex = new RegExp(`id: '${id}',[\\s\\S]*?name: '([^']+)',[\\s\\S]*?nameHe: '([^']+)',[\\s\\S]*?category: '([^']+)',[\\s\\S]*?image: '([^']+)'`);
    const match = content.match(regex);
    
    if (match) {
      const imageFile = match[4].split('/').pop();
      const imageNum = imageFile.match(/_(\d+)_/)?.[1];
      
      console.log(`\n${id}: ${match[1]}`);
      console.log(`  Hebrew: ${match[2]}`);
      console.log(`  Category: ${match[3]}`);
      console.log(`  Image: ${imageFile} (Image ${imageNum || 'N/A'})`);
      
      // Check for issues
      if (imageNum) {
        const num = parseInt(imageNum);
        if (match[1].includes('Schnitzel') && (num >= 21 && num <= 23)) {
          console.log(`  ⚠️  ISSUE: Schnitzel using OKARA image!`);
        }
        if (match[1].includes('Seitan Skewers') && (num >= 21 && num <= 23)) {
          console.log(`  ⚠️  ISSUE: Skewers using OKARA image!`);
        }
        if (match[1].includes('Mixed Grill') && (num >= 21 && num <= 23)) {
          console.log(`  ⚠️  ISSUE: Grill using OKARA image!`);
        }
      }
    }
  });
}

checkScreenshotProducts().catch(console.error);