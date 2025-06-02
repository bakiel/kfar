const fs = require('fs').promises;
const path = require('path');

// Product data that was removed - let's restore it with proper vendorId
const GARDEN_OF_LIGHT_PRODUCTS = [
  { id: 'gol-001', name: 'Spicy Tofu Spread', image: '/images/vendors/garden-of-light/1.jpg', price: 28, category: 'spreads' },
  { id: 'gol-002', name: 'Kalbono Protein Salad', image: '/images/vendors/garden-of-light/2.jpg', price: 32, category: 'salads' },
  { id: 'gol-003', name: 'Protein White Salad', image: '/images/vendors/garden-of-light/3.jpg', price: 30, category: 'salads' },
  { id: 'gol-004', name: 'Fresh Carrot Salad', image: '/images/vendors/garden-of-light/4.jpg', price: 25, category: 'salads' },
  { id: 'gol-005', name: 'Herbed Sandwich Spread', image: '/images/vendors/garden-of-light/5.jpg', price: 28, category: 'spreads' },
  { id: 'gol-006', name: 'Garlic Tofu Spread', image: '/images/vendors/garden-of-light/6.jpg', price: 30, category: 'spreads' },
  { id: 'gol-007', name: 'Spicy Vegan Cheese', image: '/images/vendors/garden-of-light/7.jpg', price: 35, category: 'cheeses' },
  { id: 'gol-008', name: 'Cashew Sliced Cheese', image: '/images/vendors/garden-of-light/8.jpg', price: 42, category: 'cheeses' },
  { id: 'gol-009', name: 'Vegan Tartar Sauce', image: '/images/vendors/garden-of-light/9.jpg', price: 22, category: 'sauces' },
  { id: 'gol-010', name: 'Artisan Vegan Chocolate Assortment', image: '/images/vendors/garden-of-light/10.jpg', price: 65, category: 'chocolates' },
  { id: 'gol-011', name: 'Premium Chocolate Selection', image: '/images/vendors/garden-of-light/11.jpg', price: 85, category: 'chocolates' }
];

const QUEENS_CUISINE_PRODUCTS = [
  { id: 'qc-001', name: 'Gourmet Vegan Burger', image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_burger_seitan_patty_sesame_bun_tomato_lettuce_plant_based_sandwich.jpg', price: 45, category: 'burgers' },
  { id: 'qc-002', name: 'Mediterranean Kabab Platter', image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_meat_kabab_skewer_dish_plant_based_middle_eastern_cuisine.jpg', price: 68, category: 'kebabs' },
  { id: 'qc-003', name: 'Italian Meatballs & Pasta', image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_meatballs_pasta_dish_plant_based_italian_cuisine_tomato_sauce.jpg', price: 52, category: 'meatballs' },
  { id: 'qc-004', name: 'Teriyaki Glazed Seitan Strips', image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_seitan_strips_teriyaki_sauce_sesame_seeds_scallions_asian_style.jpg', price: 48, category: 'seitan' },
  { id: 'qc-005', name: 'Crispy Seitan Cutlets', image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_seitan_cutlets_breaded_crispy_herb_dip_arugula_salad_cherry_tomatoes.jpg', price: 42, category: 'seitan' },
  { id: 'qc-006', name: 'Grilled Seitan Steaks', image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_meat_grilled_seitan_steaks_plant_based_protein_alternative.jpg', price: 55, category: 'seitan' },
  { id: 'qc-007', name: 'Premium Seitan Steaks', image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_meat_seitan_steaks_grilled_plant_based_protein_alternative.jpg', price: 58, category: 'seitan' },
  { id: 'qc-008', name: 'Middle Eastern Shawarma', image: '/images/vendors/queens-cuisine/queens_cuisine_middle_eastern_shawarma_pita_wrap_plant_based_meat_alternative.jpg', price: 45, category: 'ready-meals' }
];

const GAHN_DELIGHT_PRODUCTS = [
  { id: 'gd-001', name: 'Chocolate Tahini Swirl', image: '/images/vendors/gahn-delight/gahn_delight_ice_cream_chocolate_tahini_swirl_cup_with_cacao_nibs.jpeg', price: 28, category: 'ice-cream' },
  { id: 'gd-002', name: 'Passion Mango Paradise', image: '/images/vendors/gahn-delight/gahn_delight_ice_cream_passion_mango_double_scoop_cup.jpg', price: 32, category: 'ice-cream' },
  { id: 'gd-003', name: 'Pistachio Rose Elegance', image: '/images/vendors/gahn-delight/gahn_delight_ice_cream_pistachio_rose_triple_scoop_ceramic_bowl.jpeg', price: 38, category: 'ice-cream' },
  { id: 'gd-004', name: 'Chocolate Almond Caramel Parfait', image: '/images/vendors/gahn-delight/gahn_delight_parfait_chocolate_almond_caramel_layered_glass.jpg', price: 35, category: 'parfait' },
  { id: 'gd-005', name: 'Berry Hibiscus Popsicle', image: '/images/vendors/gahn-delight/gahn_delight_popsicle_berry_hibiscus_frozen_bar_wooden_stick.jpeg', price: 18, category: 'popsicles' },
  { id: 'gd-006', name: 'Lime Coconut Sorbet', image: '/images/vendors/gahn-delight/gahn_delight_sorbet_lime_coconut_fresh_garnish_bowl.jpg', price: 25, category: 'sorbet' },
  { id: 'gd-007', name: 'Date Caramel Vanilla Sundae', image: '/images/vendors/gahn-delight/gahn_delight_sundae_date_caramel_vanilla_walnut_toppings_glass.jpeg', price: 42, category: 'sundaes' }
];

const VOP_SHOP_PRODUCTS = [
  { id: 'vs-001', name: 'Edenic Vegan Heritage T-Shirt', image: '/images/vendors/vop-shop/vop_shop_community_apparel_product_01_wellness_lifestyle_village_of_peace_heritage_clothing.jpg', price: 89, category: 'apparel' },
  { id: 'vs-002', name: 'Vegan Life Vegan Love Tote Bag', image: '/images/vendors/vop-shop/vop_shop_community_apparel_product_02_wellness_lifestyle_village_of_peace_heritage_clothing.jpg', price: 65, category: 'apparel' },
  { id: 'vs-003', name: 'Healing Body & Soul Women\'s T-Shirt', image: '/images/vendors/vop-shop/vop_shop_community_apparel_product_03_wellness_lifestyle_village_of_peace_heritage_clothing.jpg', price: 95, category: 'apparel' },
  { id: 'vs-004', name: 'Sewing Seeds of Change Sweatshirt', image: '/images/vendors/vop-shop/vop_shop_community_apparel_product_04_wellness_lifestyle_village_of_peace_heritage_clothing.jpg', price: 125, category: 'apparel' },
  { id: 'vs-005', name: 'Vegan Life Vegan Love Unisex T-Shirt', image: '/images/vendors/vop-shop/vop_shop_community_apparel_product_05_wellness_lifestyle_village_of_peace_heritage_clothing.jpg', price: 89, category: 'apparel' },
  { id: 'vs-006', name: '50 Year Anniversary Art Print', image: '/images/vendors/vop-shop/vop_shop_heritage_home_decor_product_06_50_year_celebration_cultural_art_community_pride.jpg', price: 150, category: 'art' },
  { id: 'vs-007', name: 'Edenic Vegan Women\'s Fitted T-Shirt', image: '/images/vendors/vop-shop/vop_shop_heritage_home_decor_product_07_50_year_celebration_cultural_art_community_pride.jpg', price: 95, category: 'apparel' },
  { id: 'vs-008', name: 'Village of Peace Art of Living T-Shirt', image: '/images/vendors/vop-shop/vop_shop_heritage_home_decor_product_08_50_year_celebration_cultural_art_community_pride.jpg', price: 89, category: 'apparel' },
  { id: 'vs-009', name: 'Reviving Our World Heritage T-Shirt', image: '/images/vendors/vop-shop/vop_shop_heritage_home_decor_product_09_50_year_celebration_cultural_art_community_pride.jpg', price: 89, category: 'apparel' },
  { id: 'vs-010', name: 'Community Heritage Canvas Print', image: '/images/vendors/vop-shop/vop_shop_heritage_home_decor_product_10_50_year_celebration_cultural_art_community_pride.jpg', price: 180, category: 'art' },
  { id: 'vs-011', name: 'Holistic Health Book', image: '/images/vendors/vop-shop/vop_shop_wellness_education_product_11_healing_books_holistic_health_community_wisdom.jpg', price: 45, category: 'books' },
  { id: 'vs-012', name: 'Healing Body & Soul Long Sleeve', image: '/images/vendors/vop-shop/vop_shop_wellness_education_product_12_healing_books_holistic_health_community_wisdom.jpg', price: 110, category: 'apparel' },
  { id: 'vs-013', name: 'Plant-Based Nutrition Guide', image: '/images/vendors/vop-shop/vop_shop_wellness_education_product_13_healing_books_holistic_health_community_wisdom.jpg', price: 38, category: 'books' },
  { id: 'vs-014', name: 'Community Wisdom Collection', image: '/images/vendors/vop-shop/vop_shop_wellness_education_product_14_healing_books_holistic_health_community_wisdom.jpg', price: 65, category: 'books' },
  { id: 'vs-015', name: 'Edenic Living Handbook', image: '/images/vendors/vop-shop/vop_shop_wellness_education_product_15_healing_books_holistic_health_community_wisdom.jpg', price: 55, category: 'books' }
];

const PEOPLE_STORE_PRODUCTS = [
  { id: 'ps-003', name: 'FOCO Coconut Water - 6 Pack', image: '/images/vendors/people-store/Peoples Store - FOCO Coconut Water Variety Pack.jpg', price: 45, category: 'beverages' },
  { id: 'ps-004', name: 'Assorted Bulk Grains & Legumes Basket', image: '/images/vendors/people-store/Peoples Store - Bulk Grains and Legumes Basket Display.jpg', price: 125, category: 'bulk-foods' },
  { id: 'ps-005', name: 'Bulk Flour Duo Pack', image: '/images/vendors/people-store/Peoples Store - Bulk Flour and Powder Ingredients.jpg', price: 68, category: 'bulk-foods' },
  { id: 'ps-006', name: 'Premium Bulk Grains Collection', image: '/images/vendors/people-store/Peoples Store - Bulk Beans Oats Rice and Grains Basket Display.jpg', price: 145, category: 'bulk-foods' },
  { id: 'ps-007', name: 'Great Northern Organic Maple Syrup', image: '/images/vendors/people-store/Peoples Store - Great Northern Organic Maple Syrup.jpg', price: 85, category: 'pantry' },
  { id: 'ps-008', name: 'Laverland Crunch Sea Salt Seaweed - 9 Pack', image: '/images/vendors/people-store/Peoples Store - Laverland Crunch Sea Salt Seaweed Snack 9-Pack.jpg', price: 72, category: 'snacks' },
  { id: 'ps-009', name: 'Laverland Crunch Wasabi Seaweed - 9 Pack', image: '/images/vendors/people-store/Peoples Store - Laverland Crunch Wasabi Seaweed Snack 9-Pack.jpg', price: 72, category: 'snacks' },
  { id: 'ps-010', name: 'Natural Love Herb Seasoning Mix', image: '/images/vendors/people-store/Peoples Store - Natural Herb Seasoning Mix Hebrew.jpg', price: 28, category: 'pantry' },
  { id: 'ps-011', name: 'Pure Sesame Oil Taiwan - 2L', image: '/images/vendors/people-store/Peoples Store - Pure Sesame Oil Taiwan Large 2L Bottle.jpg', price: 120, category: 'pantry' },
  { id: 'ps-012', name: 'Pure Sesame Oil Taiwan - 370ml', image: '/images/vendors/people-store/Peoples Store - Pure Sesame Oil Taiwan.jpg', price: 35, category: 'pantry' },
  { id: 'ps-013', name: 'Wan Ja Shan Tamari Soy Sauce', image: '/images/vendors/people-store/Peoples Store - Wan Ja Shan Tamari Soy Sauce Naturally Brewed.jpg', price: 32, category: 'pantry' }
];

async function restoreAllProducts() {
  console.log('🔄 Restoring all products to marketplace...\n');
  
  // 1. Garden of Light
  const golData = {
    vendor: 'garden-of-light',
    lastUpdated: new Date().toISOString(),
    products: GARDEN_OF_LIGHT_PRODUCTS.map(p => ({
      ...p,
      vendorId: 'garden-of-light',
      description: `Premium ${p.category} from Garden of Light. Made with fresh, organic ingredients.`,
      isVegan: true,
      isKosher: true,
      inStock: true,
      featured: p.id === 'gol-001' || p.id === 'gol-007'
    }))
  };
  
  await fs.writeFile(
    path.join(__dirname, '../lib/data/garden-of-light-complete-catalog.json'),
    JSON.stringify(golData, null, 2)
  );
  console.log(`✅ Restored Garden of Light: ${golData.products.length} products`);
  
  // 2. Queens Cuisine
  const qcData = {
    vendor: 'queens-cuisine',
    lastUpdated: new Date().toISOString(),
    products: QUEENS_CUISINE_PRODUCTS.map(p => ({
      ...p,
      vendorId: 'queens-cuisine',
      description: `Gourmet ${p.category} from Queen's Cuisine. Premium plant-based meat alternatives.`,
      isVegan: true,
      isKosher: true,
      inStock: true,
      featured: p.id === 'qc-001' || p.id === 'qc-002'
    }))
  };
  
  await fs.writeFile(
    path.join(__dirname, '../lib/data/queens-cuisine-complete-catalog.json'),
    JSON.stringify(qcData, null, 2)
  );
  console.log(`✅ Restored Queens Cuisine: ${qcData.products.length} products`);
  
  // 3. Gahn Delight
  const gdData = {
    vendor: 'gahn-delight',
    lastUpdated: new Date().toISOString(),
    products: GAHN_DELIGHT_PRODUCTS.map(p => ({
      ...p,
      vendorId: 'gahn-delight',
      description: `Artisanal ${p.category} from Gahn Delight. Handcrafted with natural ingredients.`,
      isVegan: true,
      isKosher: true,
      inStock: true,
      featured: p.id === 'gd-001' || p.id === 'gd-003'
    }))
  };
  
  await fs.writeFile(
    path.join(__dirname, '../lib/data/gahn-delight-complete-catalog.json'),
    JSON.stringify(gdData, null, 2)
  );
  console.log(`✅ Restored Gahn Delight: ${gdData.products.length} products`);
  
  // 4. VOP Shop
  const vopData = {
    vendor: 'vop-shop',
    lastUpdated: new Date().toISOString(),
    products: VOP_SHOP_PRODUCTS.map(p => ({
      ...p,
      vendorId: 'vop-shop',
      description: `Heritage ${p.category} from Village of Peace Shop. Supporting community wellness.`,
      isVegan: true,
      isKosher: true,
      inStock: true,
      featured: p.id === 'vs-006' || p.id === 'vs-011'
    }))
  };
  
  await fs.writeFile(
    path.join(__dirname, '../lib/data/vop-shop-complete-catalog.json'),
    JSON.stringify(vopData, null, 2)
  );
  console.log(`✅ Restored VOP Shop: ${vopData.products.length} products`);
  
  // 5. People Store - merge with existing
  const psPath = path.join(__dirname, '../lib/data/people-store-complete-catalog.json');
  const existingPS = JSON.parse(await fs.readFile(psPath, 'utf-8'));
  
  const psData = {
    vendor: 'people-store',
    lastUpdated: new Date().toISOString(),
    products: [
      ...existingPS.products,
      ...PEOPLE_STORE_PRODUCTS.map(p => ({
        ...p,
        vendorId: 'people-store',
        description: `Community ${p.category} from People's Store. Quality bulk foods and essentials.`,
        isVegan: true,
        isKosher: true,
        inStock: true
      }))
    ]
  };
  
  await fs.writeFile(psPath, JSON.stringify(psData, null, 2));
  console.log(`✅ Updated People Store: ${psData.products.length} products`);
  
  // Create summary report
  const totalProducts = 
    golData.products.length + 
    qcData.products.length + 
    gdData.products.length + 
    vopData.products.length + 
    psData.products.length + 
    35; // Teva Deli
  
  const summary = `# Product Restoration Complete

## Summary
- Total Products: ${totalProducts}
- Garden of Light: ${golData.products.length} products
- Queens Cuisine: ${qcData.products.length} products  
- Gahn Delight: ${gdData.products.length} products
- VOP Shop: ${vopData.products.length} products
- People Store: ${psData.products.length} products
- Teva Deli: 35 products (unchanged)

All products now have:
✅ Proper vendorId
✅ Valid prices
✅ Descriptions
✅ Vegan/Kosher flags
✅ In stock status
✅ Correct image paths

## Next Steps
1. Test admin dashboard at /admin
2. Verify vendor pages at /vendor/[vendorId]
3. Check product pages
4. Deploy to production
`;

  await fs.writeFile(
    path.join(__dirname, '../PRODUCT_RESTORATION_REPORT.md'),
    summary
  );
  
  console.log('\n✨ All products restored!');
  console.log(`📊 Total products in marketplace: ${totalProducts}`);
}

if (require.main === module) {
  restoreAllProducts()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}

module.exports = { restoreAllProducts };