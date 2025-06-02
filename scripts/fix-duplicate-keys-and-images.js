const fs = require('fs').promises;
const path = require('path');

async function fixDuplicateKeysAndImages() {
  console.log('🔧 Fixing duplicate keys and image mappings...\n');
  
  // Fix People's Store duplicate IDs
  await fixPeopleStoreDuplicates();
  
  // Fix Teva Deli image mappings based on visual inspection
  await fixTevaDeliImages();
  
  console.log('\n✅ All fixes applied!');
}

async function fixPeopleStoreDuplicates() {
  console.log('📦 Fixing People\'s Store duplicate IDs...');
  
  const filePath = path.join(__dirname, '../lib/data/people-store-complete-catalog.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  
  // The first ps-021 at line 50 should be ps-014 (Pure Sesame Oil Taiwan)
  // The second ps-021 at line 318 is correct (Quintessence Pineapple Yogurt)
  
  data.products = data.products.map((product, index) => {
    // Fix the first occurrence of ps-021 (Pure Sesame Oil Taiwan)
    if (product.id === 'ps-021' && product.name === 'Pure Sesame Oil Taiwan') {
      product.id = 'ps-014';
    }
    // Fix the other duplicate IDs with 0ps- prefix
    if (product.id.startsWith('0ps-')) {
      product.id = product.id.replace('0ps-', 'ps-0');
    }
    return product;
  });
  
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log('✅ Fixed duplicate IDs in People\'s Store');
}

async function fixTevaDeliImages() {
  console.log('\n🥙 Fixing Teva Deli image mappings based on visual inspection...');
  
  const filePath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Based on the screenshot, here are the correct mappings:
  const imageFixes = [
    // td-005: Schnitzel Strips Pack - Currently showing OKARA (green box)
    // OKARA image is actually: teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg
    {
      productId: 'td-005',
      correctImage: 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg'
    },
    
    // td-006: Kubeh Burgul - Currently showing orange/brown schnitzel package
    // This should show the actual kubeh image
    {
      productId: 'td-006',
      correctImage: 'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg'
    },
    
    // td-007: Moroccan Spiced Meatballs - Currently showing sausage/salami
    // Should show meatballs or appropriate product
    {
      productId: 'td-007',
      correctImage: 'teva_deli_vegan_specialty_product_36_shawarma_kebab_middle_eastern_plant_based.jpg'
    },
    
    // td-008: Seitan Roast - Currently showing plain white tofu
    // Should show the natural tofu image
    {
      productId: 'td-008',
      correctImage: 'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png'
    },
    
    // td-021: OKARA product needs to use the green package image
    {
      productId: 'td-021',
      correctImage: 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg'
    }
  ];
  
  // Apply the fixes
  imageFixes.forEach(fix => {
    const regex = new RegExp(`(id: '${fix.productId}'[^}]*image: ')[^']+(')`);
    const newImagePath = `/images/vendors/teva-deli/${fix.correctImage}`;
    content = content.replace(regex, `$1${newImagePath}$2`);
  });
  
  // Also update product names based on what we can see
  const nameUpdates = [
    {
      productId: 'td-021',
      name: 'Okara Patties',
      nameHe: 'מציצות אוקרה'
    }
  ];
  
  nameUpdates.forEach(update => {
    // Update name
    const nameRegex = new RegExp(`(id: '${update.productId}'[^}]*name: ')[^']+(')`);
    content = content.replace(nameRegex, `$1${update.name}$2`);
    
    // Update Hebrew name
    const hebrewRegex = new RegExp(`(id: '${update.productId}'[^}]*nameHe: ')[^']+(')`);
    content = content.replace(hebrewRegex, `$1${update.nameHe}$2`);
  });
  
  await fs.writeFile(filePath, content);
  console.log('✅ Fixed Teva Deli image mappings');
}

// Run the fixes
if (require.main === module) {
  fixDuplicateKeysAndImages()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}