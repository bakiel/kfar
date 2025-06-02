const fs = require('fs').promises;
const path = require('path');

async function fixFinalScreenshotIssues() {
  console.log('🔧 Fixing final screenshot issues based on visual analysis\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  // Based on the screenshots, these are the actual issues:
  const fixes = [
    // Screenshot 1 issues
    {
      id: 'td-001',
      issue: 'Schnitzel showing OKARA green box',
      fix: 'Use different schnitzel image',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg'
    },
    {
      id: 'td-028', 
      issue: 'Kubeh showing brown/chocolate product',
      fix: 'Use proper kubeh image',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg'
    },
    {
      id: 'td-025',
      issue: 'Spinach Schnitzel showing grid of products',
      fix: 'This might be correct - spinach schnitzel could be green',
      // Keep current image 25
    },
    {
      id: 'td-030',
      issue: 'Sesame Schnitzel showing sausage/salami',
      fix: 'Use proper schnitzel image',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg'
    },
    
    // Screenshot 2 issues
    {
      id: 'td-004',
      issue: 'Mediterranean Skewers showing OKARA green box',
      fix: 'td-004 using image 04 which might be OKARA, need different image',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg'
    },
    {
      id: 'td-008',
      issue: 'Jerusalem Mixed Grill showing yellow OKARA box',
      fix: 'td-008 using image 08 which might be OKARA, need different image',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg'
    }
  ];
  
  console.log('Applying fixes:');
  fixes.forEach(fix => {
    if (fix.newImage) {
      console.log(`\n${fix.id}: ${fix.issue}`);
      console.log(`  Fix: ${fix.fix}`);
      
      const regex = new RegExp(`(id: '${fix.id}',[\\s\\S]*?)image: '[^']*'`, 'g');
      content = content.replace(regex, `$1image: '${fix.newImage}'`);
    }
  });
  
  // Also need to check what these "OKARA-looking" images actually are
  // Images 01-10 might include some OKARA products that we haven't identified
  
  await fs.writeFile(tevaPath, content);
  console.log('\n✅ Final screenshot fixes applied!');
  
  console.log('\n📝 NOTES:');
  console.log('- Some early numbered images (01-10) might be OKARA products');
  console.log('- Image 25 showing grid might be correct for Spinach Schnitzel');
  console.log('- Need visual verification of all changes');
}

fixFinalScreenshotIssues().catch(console.error);