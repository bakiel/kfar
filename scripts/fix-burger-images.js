const fs = require('fs').promises;
const path = require('path');

async function fixBurgerImages() {
  console.log('🍔 Fixing burger images that are using schnitzel images...\n');
  
  const filePath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // The burgers (td-033 to td-040) are incorrectly using schnitzel images (27-30)
  // They should use burger images (27-30 are actually burger images based on filenames)
  const burgerFixes = [
    {
      id: 'td-033',
      name: 'Classic Vegan Burger',
      image: 'teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-034', 
      name: 'Spicy Black Bean Burger',
      image: 'teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-035',
      name: 'Mushroom Burger', 
      image: 'teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-036',
      name: 'BBQ Burger',
      image: 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-037',
      name: 'Mini Burger Sliders',
      image: 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-038',
      name: 'Mediterranean Burger',
      image: 'teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-039',
      name: 'Quinoa Beet Burger',
      image: 'teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-040',
      name: 'Protein Power Burger',
      image: 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg'
    }
  ];
  
  // Fix schnitzels that might be using wrong images
  const schnitzelFixes = [
    {
      id: 'td-004',
      name: 'Sesame Schnitzel',
      image: 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg'
    },
    {
      id: 'td-005',
      name: 'Schnitzel Strips',
      image: 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg'
    }
  ];
  
  // Apply burger fixes
  console.log('Fixing burger images:');
  burgerFixes.forEach(fix => {
    const imageRegex = new RegExp(`(id: "${fix.id}"[^}]*image: ")[^"]+(")`);
    const imagePath = `/images/vendors/teva-deli/${fix.image}`;
    const replaced = content.match(imageRegex);
    if (replaced) {
      content = content.replace(imageRegex, `$1${imagePath}$2`);
      console.log(`✓ ${fix.id}: ${fix.name} → ${fix.image}`);
    }
  });
  
  // Apply schnitzel fixes
  console.log('\nFixing schnitzel images:');
  schnitzelFixes.forEach(fix => {
    const imageRegex = new RegExp(`(id: "${fix.id}"[^}]*image: ")[^"]+(")`);
    const imagePath = `/images/vendors/teva-deli/${fix.image}`;
    const replaced = content.match(imageRegex);
    if (replaced) {
      content = content.replace(imageRegex, `$1${imagePath}$2`);
      console.log(`✓ ${fix.id}: ${fix.name} → ${fix.image}`);
    }
  });
  
  await fs.writeFile(filePath, content);
  console.log('\n✅ Fixed burger and schnitzel images!');
}

// Run the fix
if (require.main === module) {
  fixBurgerImages()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}