const fs = require('fs').promises;
const path = require('path');

async function deepImageAnalysis() {
  console.log('🔍 Deep Image Analysis - Understanding the Real Problem\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  const content = await fs.readFile(tevaPath, 'utf-8');
  
  // Let's check what images 1-20 are being used for
  console.log('📸 IMAGE USAGE ANALYSIS (Images 1-20):\n');
  
  for (let i = 1; i <= 20; i++) {
    const padded = i.toString().padStart(2, '0');
    const regex = new RegExp(`id: '([^']+)',[\\s\\S]*?name: '([^']+)',[\\s\\S]*?category: '([^']+)',[\\s\\S]*?image: '[^']*_${padded}_[^']*'`);
    const match = content.match(regex);
    
    if (match) {
      console.log(`Image ${padded}: Used by ${match[1]} - ${match[2]} [${match[3]}]`);
    } else {
      // Check if it's used at all
      if (content.includes(`_${padded}_`)) {
        console.log(`Image ${padded}: Used but couldn't parse details`);
      } else {
        console.log(`Image ${padded}: NOT USED`);
      }
    }
  }
  
  console.log('\n🔴 PRODUCTS IN SCREENSHOT (with current images):\n');
  
  const screenshotProducts = [
    'td-004', // Mediterranean Seitan Skewers
    'td-008', // Jerusalem Mixed Grill  
    'td-037', // Plant-Based Shawarma (if exists)
    'td-017'  // BBQ Pulled Seitan
  ];
  
  screenshotProducts.forEach(id => {
    const regex = new RegExp(`id: '${id}',[\\s\\S]*?name: '([^']+)',[\\s\\S]*?nameHe: '([^']+)',[\\s\\S]*?category: '([^']+)',[\\s\\S]*?image: '([^']+)'`);
    const match = content.match(regex);
    
    if (match) {
      const imageFile = match[4].split('/').pop();
      console.log(`${id}: ${match[1]}`);
      console.log(`  Current image: ${imageFile}`);
      console.log(`  Category: ${match[3]}`);
      console.log('');
    } else {
      console.log(`${id}: NOT FOUND\n`);
    }
  });
  
  console.log('💡 HYPOTHESIS:\n');
  console.log('The issue is that the image files themselves contain the wrong products.');
  console.log('For example:');
  console.log('- Files named "plant_based_meat_alternative" might actually contain tofu/OKARA');
  console.log('- Files named "seitan_tofu_based" might contain other products');
  console.log('\nWe need to map products based on what the images ACTUALLY show,');
  console.log('not what their filenames suggest.');
}

deepImageAnalysis().catch(console.error);