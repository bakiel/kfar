const fs = require('fs').promises;
const path = require('path');

async function fixTevaDeliComprehensive() {
  console.log('🔧 Comprehensive Teva Deli Image Fix\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  // Based on our vision analysis, here are the correct mappings
  const fixes = [
    // Fix 1: td-001 Schnitzel should use schnitzel image, not kubeh (28)
    {
      id: 'td-001',
      reason: 'Schnitzel using kubeh image 28',
      newImage: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg'
    },
    
    // Fix 2: td-022 Jalapeño Burger should NOT use OKARA image 22
    {
      id: 'td-022', 
      reason: 'Jalapeño Burger using OKARA image',
      newName: 'Okara Patties with Broccoli',
      newNameHe: 'קציצות אוקרה עם ברוקולי',
      newDescription: 'Okara (soy pulp) patties with broccoli and grains. Green box, 400g serves 8.'
    },
    
    // Fix 3: td-023 Mushroom Burger should NOT use ground meat image 23
    {
      id: 'td-023',
      reason: 'Mushroom Burger using ground meat image', 
      newName: 'Plant-Based Ground Meat',
      newNameHe: 'טוחון מהצומח',
      newDescription: 'Plant-based ground for making patties and burgers. 500g with 15% protein.'
    },
    
    // Fix 4: td-024 Pepperoni should NOT use burger image 24
    {
      id: 'td-024',
      reason: 'Pepperoni using black burger box image',
      newName: 'Plant Burger with Rice and Lentils',
      newNameHe: 'בורגר עם אורז מלא ועדשים',
      newDescription: 'Plant-based burger with whole rice, lentils and almonds. Black box, 400g contains 4 burgers.'
    },
    
    // Fix 5: td-027 Mini Burgers should NOT use schnitzel image 27
    {
      id: 'td-027',
      reason: 'Mini Burgers using confirmed schnitzel image',
      newImage: '/images/vendors/teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg'
    },
    
    // Fix 6: td-028 (currently Za'atar Schnitzel) should be Kubeh since it uses image 28
    {
      id: 'td-028',
      reason: 'Product using kubeh image 28',
      newName: 'Kubeh Burger with Bulgur',
      newNameHe: 'קובה בורגר עם בורגול',
      newDescription: 'Traditional kubeh filled with seasoned plant-based meat',
      newCategory: 'specialty'
    }
  ];
  
  console.log('Applying fixes:');
  fixes.forEach(fix => {
    console.log(`\n${fix.id}: ${fix.reason}`);
    
    // Find the product block
    const regex = new RegExp(`(id: '${fix.id}',[\\s\\S]*?)(?=\\n  \\},|\\n\\];)`, 'g');
    const match = content.match(regex);
    
    if (match) {
      let productBlock = match[0];
      
      if (fix.newImage) {
        console.log(`  → Changing image`);
        productBlock = productBlock.replace(/image: '[^']*'/, `image: '${fix.newImage}'`);
      }
      
      if (fix.newName) {
        console.log(`  → Changing name to: ${fix.newName}`);
        productBlock = productBlock.replace(/name: '[^']*'/, `name: '${fix.newName}'`);
      }
      
      if (fix.newNameHe) {
        console.log(`  → Changing Hebrew name to: ${fix.newNameHe}`);
        productBlock = productBlock.replace(/nameHe: '[^']*'/, `nameHe: '${fix.newNameHe}'`);
      }
      
      if (fix.newDescription) {
        console.log(`  → Updating description`);
        productBlock = productBlock.replace(/description: '[^']*'/, `description: '${fix.newDescription}'`);
      }
      
      if (fix.newCategory) {
        console.log(`  → Changing category to: ${fix.newCategory}`);
        productBlock = productBlock.replace(/category: '[^']*'/, `category: '${fix.newCategory}'`);
      }
      
      content = content.replace(match[0], productBlock);
    }
  });
  
  await fs.writeFile(tevaPath, content);
  console.log('\n✅ Comprehensive fixes applied!');
  
  // Summary
  console.log('\n📊 SUMMARY OF CHANGES:');
  console.log('- td-001: Schnitzel now uses proper schnitzel image');
  console.log('- td-022: Now correctly labeled as OKARA Broccoli (was Jalapeño Burger)');
  console.log('- td-023: Now correctly labeled as Ground Meat (was Mushroom Burger)');
  console.log('- td-024: Now correctly labeled as Rice/Lentil Burger (was Pepperoni)');
  console.log('- td-027: Mini Burgers now uses burger image (was using schnitzel)');
  console.log('- td-028: Now correctly labeled as Kubeh (was Za\'atar Schnitzel)');
}

fixTevaDeliComprehensive().catch(console.error);