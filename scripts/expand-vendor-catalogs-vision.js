#!/usr/bin/env node

/**
 * Expand Vendor Catalogs with Vision-Based Products
 * This script adds more products to each vendor based on available images
 */

const fs = require('fs').promises;
const path = require('path');

// Additional Queen's Cuisine products based on available images
const queensCuisineExpansion = [
  {
    id: 'qc-004',
    name: 'Glazed Teriyaki Seitan Ribs',
    nameHe: 'צלעות סייטן בזיגוג טריאקי',
    description: 'Tender seitan ribs glazed with house-made teriyaki sauce, topped with sesame seeds and fresh scallions. A show-stopping dish for special occasions.',
    price: 72,
    originalPrice: 86,
    category: 'meat-alternatives',
    image: '/images/vendors/queens_cuisine_product_banner_vegan_meat_alternatives_plant_based_cuisine_display_01.jpg',
    vendorId: 'queens-cuisine',
    badge: 'Signature Dish',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'ribs', 'teriyaki', 'asian-fusion', 'signature', 'glazed'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Gluten', 'Soy', 'Sesame'],
    qrCode: 'QR-QC004'
  },
  {
    id: 'qc-005',
    name: 'Mediterranean Kebab Platter',
    nameHe: 'מגש קבב ים תיכוני',
    description: 'Assorted grilled kebabs including kafta, shish tawook style, and vegetable skewers. Served with rice pilaf and grilled vegetables.',
    price: 85,
    originalPrice: 105,
    category: 'meat-alternatives',
    image: '/images/vendors/queens_cuisine_vegan_meat_kabab_skewer_dish_plant_based_middle_eastern_cuisine.jpg',
    vendorId: 'queens-cuisine',
    badge: 'Party Size',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'kebab', 'mediterranean', 'platter', 'party-size', 'grilled', 'middle-eastern'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Gluten'],
    qrCode: 'QR-QC005'
  },
  {
    id: 'qc-006',
    name: 'Italian Seitan Meatballs',
    nameHe: 'כדורי בשר סייטן איטלקיים',
    description: 'Hand-rolled seitan meatballs simmered in rich tomato sauce with fresh basil. Perfect over pasta or as a sub sandwich.',
    price: 46,
    originalPrice: 55,
    category: 'meat-alternatives',
    image: '/images/vendors/queens_cuisine_vegan_meatballs_pasta_dish_plant_based_italian_cuisine_tomato_sauce.jpg',
    vendorId: 'queens-cuisine',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'meatballs', 'italian', 'pasta', 'comfort-food', 'tomato-sauce'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Gluten'],
    qrCode: 'QR-QC006'
  },
  {
    id: 'qc-007',
    name: 'Crispy Seitan Cutlets',
    nameHe: 'קציצות סייטן פריכות',
    description: 'Golden-breaded seitan cutlets with herb crust, served with arugula salad and lemon-herb dipping sauce.',
    price: 54,
    originalPrice: 65,
    category: 'meat-alternatives',
    image: '/images/vendors/queens_cuisine_vegan_seitan_cutlets_breaded_crispy_herb_dip_arugula_salad_cherry_tomatoes.jpg',
    vendorId: 'queens-cuisine',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'cutlets', 'breaded', 'crispy', 'herbs', 'salad'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Gluten'],
    qrCode: 'QR-QC007'
  },
  {
    id: 'qc-008',
    name: 'Grilled Seitan Steaks',
    nameHe: 'סטייק סייטן על הגריל',
    description: 'Premium thick-cut seitan steaks marinated in herbs and grilled to perfection. Served with caramelized onions.',
    price: 65,
    originalPrice: 78,
    category: 'meat-alternatives',
    image: '/images/vendors/queens_cuisine_vegan_meat_grilled_seitan_steaks_plant_based_protein_alternative.jpg',
    vendorId: 'queens-cuisine',
    badge: 'Premium',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'steak', 'grilled', 'premium', 'fine-dining', 'herbs'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Gluten'],
    qrCode: 'QR-QC008'
  }
];

// Additional Gahn Delight products
const gahnDelightExpansion = [
  {
    id: 'gd-004',
    name: 'Chocolate Almond Caramel Parfait',
    nameHe: 'פרפה שוקולד שקדים וקרמל',
    description: 'Layered frozen dessert with rich chocolate ice cream, roasted almonds, and caramel swirls in elegant glass.',
    price: 42,
    originalPrice: 52,
    category: 'desserts',
    image: '/images/vendors/gahn_delight_parfait_chocolate_almond_caramel_layered_glass.jpg',
    vendorId: 'gahn-delight',
    badge: 'Premium',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'dessert', 'parfait', 'chocolate', 'almonds', 'caramel', 'premium', 'layered'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Tree Nuts', 'Cocoa'],
    qrCode: 'QR-GD004'
  },
  {
    id: 'gd-005',
    name: 'Berry Hibiscus Popsicle',
    nameHe: 'ארטיק יער היביסקוס',
    description: 'Refreshing frozen bar with wild berries and hibiscus flower infusion. Natural fruit sweetness on a wooden stick.',
    price: 18,
    category: 'desserts',
    image: '/images/vendors/gahn_delight_popsicle_berry_hibiscus_frozen_bar_wooden_stick.jpeg',
    vendorId: 'gahn-delight',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'dessert', 'popsicle', 'berry', 'hibiscus', 'refreshing', 'natural', 'frozen'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    qrCode: 'QR-GD005'
  },
  {
    id: 'gd-006',
    name: 'Lime Coconut Sorbet',
    nameHe: 'סורבה ליים קוקוס',
    description: 'Tropical sorbet with zesty lime and creamy coconut, garnished with fresh lime zest and coconut flakes.',
    price: 28,
    category: 'desserts',
    image: '/images/vendors/gahn_delight_sorbet_lime_coconut_fresh_garnish_bowl.jpg',
    vendorId: 'gahn-delight',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'dessert', 'sorbet', 'lime', 'coconut', 'tropical', 'refreshing', 'citrus'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Coconut'],
    qrCode: 'QR-GD006'
  },
  {
    id: 'gd-007',
    name: 'Date Caramel Vanilla Sundae',
    nameHe: 'סאנדיי וניל קרמל תמרים',
    description: 'Decadent sundae with vanilla ice cream, date caramel sauce, and toasted walnut pieces in classic glass.',
    price: 45,
    originalPrice: 55,
    category: 'desserts',
    image: '/images/vendors/gahn_delight_sundae_date_caramel_vanilla_walnut_toppings_glass.jpeg',
    vendorId: 'gahn-delight',
    badge: 'House Special',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'dessert', 'sundae', 'vanilla', 'date', 'caramel', 'walnuts', 'special'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Tree Nuts'],
    qrCode: 'QR-GD007'
  }
];

// Additional Garden of Light products
const gardenOfLightExpansion = [
  {
    id: 'gol-001',
    name: 'Mediterranean Quinoa Bowl',
    nameHe: 'קערת קינואה ים תיכונית',
    description: 'Nutritious quinoa bowl with roasted vegetables, chickpeas, tahini dressing, and fresh herbs.',
    price: 52,
    category: 'prepared-foods',
    image: '/images/vendors/garden_of_light_vegan_deli_prepared_foods_healthy_bowls.jpg',
    vendorId: 'atur-avior',
    badge: 'Healthy Choice',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'prepared', 'quinoa', 'mediterranean', 'healthy', 'protein-rich', 'bowl'],
    certifications: ['Vegan Certified', 'Kosher Certified'],
    allergens: ['Sesame'],
    qrCode: 'QR-GOL001'
  },
  {
    id: 'gol-002',
    name: 'Raw Energy Balls',
    nameHe: 'כדורי אנרגיה גולמיים',
    description: 'Date-based energy balls with nuts, seeds, and superfoods. Perfect pre-workout snack.',
    price: 28,
    category: 'snacks',
    image: '/images/vendors/garden_of_light_raw_energy_balls_healthy_snacks.jpg',
    vendorId: 'atur-avior',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'raw', 'energy', 'snack', 'dates', 'nuts', 'superfood', 'protein'],
    certifications: ['Raw Certified', 'Kosher Certified'],
    allergens: ['Tree Nuts', 'Sesame'],
    qrCode: 'QR-GOL002'
  },
  {
    id: 'gol-003',
    name: 'Green Goddess Salad',
    nameHe: 'סלט האלה הירוקה',
    description: 'Fresh organic greens with avocado, sprouted seeds, and house-made green goddess dressing.',
    price: 48,
    category: 'salads',
    image: '/images/vendors/garden_of_light_green_goddess_salad_fresh_organic.jpg',
    vendorId: 'atur-avior',
    badge: 'Organic',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['vegan', 'kosher', 'organic', 'salad', 'fresh', 'greens', 'avocado', 'raw', 'healthy'],
    certifications: ['Organic Certified', 'Kosher Certified'],
    qrCode: 'QR-GOL003'
  }
];

// Additional VOP Shop products
const vopShopExpansion = [
  {
    id: 'vs-004',
    name: 'Heritage Tote Bag',
    nameHe: 'תיק מורשת',
    description: 'Durable canvas tote featuring Village of Peace 50-year celebration artwork. Perfect for shopping or daily use.',
    price: 85,
    category: 'accessories',
    image: '/images/vendors/vop_shop_heritage_home_decor_product_07_50_year_celebration_cultural_art_community_pride.jpg',
    vendorId: 'vop-shop',
    badge: '50 Years',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['accessories', 'tote-bag', 'heritage', 'anniversary', 'sustainable', 'canvas', 'community'],
    qrCode: 'QR-VS004'
  },
  {
    id: 'vs-005',
    name: 'Wellness Journal',
    nameHe: 'יומן בריאות',
    description: 'Guided wellness journal with daily prompts for health, gratitude, and spiritual growth.',
    price: 65,
    category: 'wellness',
    image: '/images/vendors/vop_shop_wellness_education_product_14_healing_books_holistic_health_community_wisdom.jpg',
    vendorId: 'vop-shop',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['wellness', 'journal', 'health', 'mindfulness', 'spiritual', 'self-care', 'guided'],
    qrCode: 'QR-VS005'
  },
  {
    id: 'vs-006',
    name: 'Community Cookbook',
    nameHe: 'ספר בישול קהילתי',
    description: 'Collection of traditional vegan recipes from Village of Peace families. 50 years of culinary heritage.',
    price: 120,
    originalPrice: 150,
    category: 'books',
    image: '/images/vendors/vop_shop_wellness_education_product_15_healing_books_holistic_health_community_wisdom.jpg',
    vendorId: 'vop-shop',
    badge: 'Best Seller',
    isVegan: true,
    isKosher: true,
    inStock: true,
    tags: ['book', 'cookbook', 'recipes', 'vegan', 'heritage', 'community', 'traditional', 'anniversary'],
    qrCode: 'QR-VS006'
  }
];

async function updateCompleteCatalog() {
  console.log('📚 Expanding Vendor Catalogs with Vision-Based Products...\n');
  
  try {
    const catalogPath = path.join(__dirname, '../lib/data/complete-catalog.ts');
    let content = await fs.readFile(catalogPath, 'utf-8');
    
    // Find Queen's Cuisine section and count current products
    const qcMatch = content.match(/'queens-cuisine':\s*{[\s\S]*?products:\s*\[([\s\S]*?)\]/);
    if (qcMatch) {
      const currentQCProducts = (qcMatch[1].match(/id:\s*'qc-/g) || []).length;
      console.log(`📊 Queen's Cuisine: ${currentQCProducts} products -> ${currentQCProducts + queensCuisineExpansion.length} products`);
    }
    
    // Find Gahn Delight section
    const gdMatch = content.match(/'gahn-delight':\s*{[\s\S]*?products:\s*\[([\s\S]*?)\]/);
    if (gdMatch) {
      const currentGDProducts = (gdMatch[1].match(/id:\s*'gd-/g) || []).length;
      console.log(`📊 Gahn Delight: ${currentGDProducts} products -> ${currentGDProducts + gahnDelightExpansion.length} products`);
    }
    
    // Find Garden of Light section
    const golMatch = content.match(/'atur-avior':\s*{[\s\S]*?products:\s*\[([\s\S]*?)\]/);
    if (golMatch) {
      const currentGOLProducts = (golMatch[1].match(/id:\s*'aa-/g) || []).length;
      console.log(`📊 Garden of Light: ${currentGOLProducts} products -> ${currentGOLProducts + gardenOfLightExpansion.length} products`);
    }
    
    // Find VOP Shop section
    const vsMatch = content.match(/'vop-shop':\s*{[\s\S]*?products:\s*\[([\s\S]*?)\]/);
    if (vsMatch) {
      const currentVSProducts = (vsMatch[1].match(/id:\s*'vs-/g) || []).length;
      console.log(`📊 VOP Shop: ${currentVSProducts} products -> ${currentVSProducts + vopShopExpansion.length} products`);
    }
    
    console.log('\n✅ Vision-based product expansion data prepared');
    console.log('\nTo apply these expansions:');
    console.log('1. Manually add the new products to complete-catalog.ts');
    console.log('2. Or create a separate expansion file to import');
    console.log('3. Ensure all product images exist in the correct paths');
    
    // Save expansion data for reference
    const expansionData = {
      queensCuisine: queensCuisineExpansion,
      gahnDelight: gahnDelightExpansion,
      gardenOfLight: gardenOfLightExpansion,
      vopShop: vopShopExpansion,
      totalNewProducts: 
        queensCuisineExpansion.length + 
        gahnDelightExpansion.length + 
        gardenOfLightExpansion.length + 
        vopShopExpansion.length
    };
    
    await fs.writeFile(
      path.join(__dirname, '../lib/data/vendor-catalog-expansions.json'),
      JSON.stringify(expansionData, null, 2)
    );
    
    console.log(`\n📄 Expansion data saved to: lib/data/vendor-catalog-expansions.json`);
    console.log(`📈 Total new products to add: ${expansionData.totalNewProducts}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the expansion
updateCompleteCatalog();