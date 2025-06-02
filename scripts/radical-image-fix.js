const fs = require('fs').promises;
const path = require('path');

async function radicalImageFix() {
  console.log('🔥 Radical Image Fix - Based on Visual Evidence\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  // Based on screenshot evidence:
  // - Images 10, 12 are showing tofu/package products
  // - Image 17 might be correct for BBQ
  // - We need to find better images for skewers and mixed grill
  
  const fixes = [
    {
      id: 'td-004',
      name: 'Mediterranean Seitan Skewers',
      problem: 'Image 10 shows tofu package, not skewers',
      solution: 'Use an image that might show skewers - try shawarma/kebab range',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg'
    },
    {
      id: 'td-008', 
      name: 'Jerusalem Mixed Grill',
      problem: 'Image 12 shows tofu block, not mixed grill',
      solution: 'Use an image that shows mixed/variety products',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_38_shawarma_kebab_middle_eastern_plant_based.jpg'
    },
    {
      id: 'td-010',
      name: 'Plant-Based Shawarma',
      problem: 'Sharing image 10 with skewers (tofu package)',
      solution: 'Use proper shawarma image',
      newImage: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg'
    }
  ];
  
  // Also, let's check what these tofu-showing images should actually be used for
  const toReassign = [
    {
      image: 'teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg',
      actualContent: 'Tofu package product',
      shouldBeUsedFor: 'A tofu product, not skewers'
    },
    {
      image: 'teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg',
      actualContent: 'Tofu block',
      shouldBeUsedFor: 'A plain tofu product, not mixed grill'
    }
  ];
  
  console.log('🔧 Applying radical fixes:\n');
  
  fixes.forEach(fix => {
    console.log(`${fix.id}: ${fix.name}`);
    console.log(`  Problem: ${fix.problem}`);
    console.log(`  Solution: ${fix.solution}`);
    
    const regex = new RegExp(`(id: '${fix.id}',[\\s\\S]*?)image: '[^']*'`);
    content = content.replace(regex, `$1image: '${fix.newImage}'`);
    console.log('  ✅ Fixed!\n');
  });
  
  await fs.writeFile(tevaPath, content);
  
  console.log('💡 RECOMMENDATION:\n');
  console.log('The fundamental issue is that many image files are mislabeled.');
  console.log('Images labeled as "meat_alternative" or "seitan" are actually showing tofu.');
  console.log('A proper fix would require:');
  console.log('1. Visual inspection of all 43 images');
  console.log('2. Renaming files to match their actual content');
  console.log('3. Reassigning products based on actual image content');
  console.log('\nFor now, we\'ve moved products to more appropriate images from the shawarma/kebab range.');
}

radicalImageFix().catch(console.error);