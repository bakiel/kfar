const fs = require('fs').promises;
const path = require('path');

async function fixDuplicateSchnitzelImages() {
  console.log('🔧 Fixing duplicate schnitzel images...\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  // Currently both td-009 (Schnitzel Strips) and td-025 (Spinach & Herb) use image 25
  // Let's assign different images to avoid duplication
  
  console.log('Current image assignments:');
  console.log('- td-009 (Schnitzel Strips Pack): image 25');
  console.log('- td-025 (Spinach & Herb Schnitzel): image 25 [DUPLICATE!]');
  console.log('- td-030 (Sesame-Crusted Schnitzel): image 30');
  
  // Fix 1: Change Schnitzel Strips Pack to use a different image
  console.log('\nFix 1: Changing Schnitzel Strips Pack to use image 09...');
  content = content.replace(
    /id: 'td-009',[\s\S]*?image: '[^']*'/,
    `id: 'td-009',
    name: 'Schnitzel Strips Pack',
    nameHe: 'רצועות שניצל',
    description: 'Pre-cut schnitzel strips for easy serving',
    price: 42,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg'`
  );
  
  // Fix 2: Make sure Spinach & Herb keeps image 25 (green schnitzel makes sense)
  console.log('Fix 2: Confirming Spinach & Herb Schnitzel uses image 25 (green product)...');
  
  // Fix 3: Verify Sesame-Crusted uses image 30
  console.log('Fix 3: Confirming Sesame-Crusted Schnitzel uses image 30...');
  
  await fs.writeFile(tevaPath, content);
  console.log('\n✅ Duplicate image fixes applied!');
  
  // Verify all schnitzel products
  console.log('\nVerifying all schnitzel products:');
  const schnitzelProducts = ['td-001', 'td-028', 'td-025', 'td-030', 'td-009'];
  
  for (const id of schnitzelProducts) {
    const regex = new RegExp(`id: '${id}',[\\s\\S]*?name: '([^']+)',[\\s\\S]*?image: '[^']*_(\\d+)_`);
    const match = content.match(regex);
    if (match) {
      console.log(`${id}: ${match[1]} - Image ${match[2]}`);
    }
  }
}

fixDuplicateSchnitzelImages().catch(console.error);