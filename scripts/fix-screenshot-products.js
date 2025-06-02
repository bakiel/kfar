const fs = require('fs').promises;
const path = require('path');

async function fixScreenshotProducts() {
  console.log('🔧 Fixing specific products from screenshot...\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  // Fix 1: td-009 "Schnitzel Strips Pack" should not show OKARA image
  console.log('Fix 1: Schnitzel Strips Pack (td-009)...');
  content = content.replace(
    /id: 'td-009',[\s\S]*?image: '[^']*'/,
    `id: 'td-009',
    name: 'Schnitzel Strips Pack',
    nameHe: 'רצועות שניצל',
    description: 'Pre-cut schnitzel strips for easy serving',
    price: 42,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg'`
  );
  
  // Fix 2: td-006 "Moroccan Spiced Meatballs" is showing wrong product
  console.log('Fix 2: Moroccan Spiced Meatballs (td-006) - fixing image...');
  // This product shouldn't show a Sano product, use a proper Teva Deli image
  content = content.replace(
    /id: 'td-006',[\s\S]*?image: '[^']*'/,
    `id: 'td-006',
    name: 'Moroccan Spiced Meatballs',
    nameHe: 'קציצות מרוקאיות',
    description: 'Aromatic plant-based meatballs in tomato sauce',
    price: 42,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg'`
  );
  
  // Fix 3: td-014 "Seitan Roast" showing tofu - this is a name/product mismatch
  console.log('Fix 3: Seitan Roast (td-014) - fixing to match tofu image...');
  // Since the image shows tofu, let's update the product to be tofu
  content = content.replace(
    /id: 'td-014',[\s\S]*?tags: \[[^\]]*\]/,
    `id: 'td-014',
    name: 'Natural Organic Tofu',
    nameHe: 'טופו טבעי אורגני',
    description: 'Natural Organic Tofu made with organic soybeans, water, calcium salts. Keep refrigerated at 4°C.',
    price: 35,
    originalPrice: 45,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Organic',
    tags: ['vegan', 'kosher', 'tofu', 'organic', 'soy', 'protein-rich']`
  );
  
  await fs.writeFile(tevaPath, content);
  console.log('\n✅ Screenshot fixes applied!');
  
  // Verify the products
  console.log('\nVerifying fixed products:');
  const fixedProducts = ['td-009', 'td-006', 'td-014'];
  
  for (const id of fixedProducts) {
    const regex = new RegExp(`id: '${id}',[\\s\\S]*?name: '([^']+)',[\\s\\S]*?image: '[^/]*\\/([^']+)'`);
    const match = content.match(regex);
    if (match) {
      console.log(`${id}: ${match[1]} - ${match[2]}`);
    }
  }
}

fixScreenshotProducts().catch(console.error);