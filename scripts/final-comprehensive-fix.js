const fs = require('fs').promises;
const path = require('path');

async function finalComprehensiveFix() {
  console.log('🎯 Final Comprehensive Fix - Addressing all remaining issues\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  // Fix 1: td-004 should not use OKARA image (22)
  console.log('Fixing td-004 (Sesame Schnitzel) - removing OKARA image...');
  content = content.replace(
    /"id": "td-004",[\s\S]*?"image": "\/images\/vendors\/teva-deli\/teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli\.jpg"/,
    `"id": "td-004",
    "name": "Sesame Schnitzel",
    "nameHe": "שניצל שומשום",
    "description": "Premium schnitzels product from Teva Deli. Made with high-quality plant-based ingredients.",
    "price": 45,
    "category": "schnitzels",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg"`
  );
  
  // Fix 2: Add missing OKARA products (td-021, td-022, td-023)
  console.log('Adding OKARA products that should exist...');
  
  // Find where to insert (after td-020 or before td-025)
  const insertPosition = content.lastIndexOf('},\n  {');
  
  const okraProducts = `,
  {
    "id": "td-021",
    "name": "Okara Patties with Herbs",
    "nameHe": "קציצות אוקרה עם ירק",
    "description": "Okara patties with herbs and vegetables. Green box packaging, 400g serves 4.",
    "price": 42,
    "category": "specialty",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg",
    "vendorId": "teva-deli",
    "inStock": true,
    "isVegan": true,
    "isKosher": true,
    "tags": ["high-fiber", "low-fat"]
  },
  {
    "id": "td-022",
    "name": "Okara Patties with Broccoli",
    "nameHe": "קציצות אוקרה עם ברוקולי",
    "description": "Okara patties with broccoli and grains. Green box packaging, 400g serves 8.",
    "price": 42,
    "category": "specialty",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg",
    "vendorId": "teva-deli",
    "inStock": true,
    "isVegan": true,
    "isKosher": true,
    "tags": ["high-fiber", "low-fat"]
  },
  {
    "id": "td-023",
    "name": "Plant-Based Ground Meat",
    "nameHe": "טוחון מהצומח",
    "description": "Plant-based ground for making patties and burgers. 500g with 15% protein.",
    "price": 38,
    "category": "specialty",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg",
    "vendorId": "teva-deli",
    "inStock": true,
    "isVegan": true,
    "isKosher": true,
    "badge": "15% Protein"
  }`;
  
  // Check if OKARA products already exist
  if (!content.includes('td-021')) {
    console.log('Inserting OKARA products...');
    content = content.slice(0, insertPosition) + okraProducts + content.slice(insertPosition);
  }
  
  // Fix 3: Update product count
  console.log('Updating product count...');
  content = content.replace(
    /export const tevaDeliProductCount = \d+;/,
    'export const tevaDeliProductCount = 38;'
  );
  
  // Fix 4: Update categories to include 'specialty' if missing
  if (!content.includes("'specialty'")) {
    content = content.replace(
      /export const tevaDeliCategories = \[[\s\S]*?\];/,
      `export const tevaDeliCategories = [
  'schnitzels',
  'burgers',
  'shawarma',
  'kebabs',
  'tofu',
  'seitan',
  'specialty',
  'ready-meals'
];`
    );
  }
  
  await fs.writeFile(tevaPath, content);
  console.log('\n✅ Comprehensive fix complete!');
  console.log('Total Teva Deli products: 38 (35 + 3 OKARA)');
}

finalComprehensiveFix().catch(console.error);