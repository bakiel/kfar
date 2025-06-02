#!/usr/bin/env node

/**
 * Fix Marketplace Image Paths
 * 
 * This script updates the actual-image-paths.ts file to match the real file structure
 * and ensures all product images are correctly mapped
 */

const fs = require('fs');
const path = require('path');

const VENDORS_DIR = path.join(__dirname, '..', 'public', 'images', 'vendors');
const ACTUAL_PATHS_FILE = path.join(__dirname, '..', 'lib', 'utils', 'actual-image-paths.ts');

// Map of vendor IDs to their product mappings
const vendorProductMappings = {
  'teva-deli': {
    'td-001': 'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    'td-002': 'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-003': 'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
    'td-004': 'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-005': 'teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-006': 'teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-007': 'teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-008': 'teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-009': 'teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-010': 'teva_deli_vegan_specialty_product_07_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-011': 'teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
    'td-012': 'teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg',
    'td-013': 'teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg',
    'td-014': 'teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
    'td-015': 'teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
    'td-016': 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
    'td-017': 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
    'td-018': 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
    'td-019': 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
    'td-020': 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg',
    'td-021': 'teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-022': 'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-023': 'teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-024': 'teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-025': 'teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-026': 'teva_deli_vegan_specialty_product_36_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-027': 'teva_deli_vegan_specialty_product_37_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-028': 'teva_deli_vegan_specialty_product_38_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-029': 'teva_deli_vegan_specialty_product_39_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-030': 'teva_deli_vegan_specialty_product_40_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-031': 'teva_deli_vegan_specialty_product_08_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-032': 'teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-033': 'teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg'
  },
  'queens-cuisine': {
    'qc-001': 'queens_cuisine_vegan_burger_seitan_patty_sesame_bun_tomato_lettuce_plant_based_sandwich.jpg',
    'qc-002': 'queens_cuisine_vegan_meatballs_pasta_dish_plant_based_italian_cuisine_tomato_sauce.jpg',
    'qc-003': 'queens_cuisine_vegan_seitan_strips_teriyaki_sauce_sesame_seeds_scallions_asian_style.jpg',
    'qc-004': 'queens_cuisine_middle_eastern_shawarma_pita_wrap_plant_based_meat_alternative.jpg',
    'qc-005': 'queens_cuisine_vegan_meat_grilled_seitan_steaks_plant_based_protein_alternative.jpg',
    'qc-006': 'queens_cuisine_vegan_meat_kabab_skewer_dish_plant_based_middle_eastern_cuisine.jpg',
    'qc-007': 'queens_cuisine_vegan_meat_seitan_kebabs_grilled_skewers_plant_based_barbecue_alternative.jpg',
    'qc-008': 'queens_cuisine_vegan_meat_seitan_sandwich_plant_based_deli_style_bread_filling.jpg',
    'qc-009': 'queens_cuisine_vegan_meat_seitan_steaks_grilled_plant_based_protein_alternative.jpg',
    'qc-010': 'queens_cuisine_vegan_seitan_cutlets_breaded_crispy_herb_dip_arugula_salad_cherry_tomatoes.jpg',
    'qc-011': 'queens_cuisine_vegan_protein_seitan_tofu_specialty_item_08_plant_based_meat_alternative.jpg',
    'qc-012': 'queens_cuisine_vegan_protein_seitan_tofu_specialty_item_09_plant_based_meat_alternative.jpg',
    'qc-013': 'queens_cuisine_vegan_protein_seitan_tofu_specialty_item_10_plant_based_meat_alternative.jpg',
    'qc-014': 'queens_cuisine_vegan_protein_seitan_tofu_specialty_item_11_plant_based_meat_alternative.jpg',
    'qc-015': 'queens_cuisine_vegan_protein_seitan_tofu_specialty_item_12_plant_based_meat_alternative.jpg'
  },
  'gahn-delight': {
    'gd-001': 'gahn_delight_ice_cream_chocolate_tahini_swirl_cup_with_cacao_nibs.jpeg',
    'gd-002': 'gahn_delight_ice_cream_passion_mango_double_scoop_cup.jpg',
    'gd-003': 'gahn_delight_ice_cream_pistachio_rose_triple_scoop_ceramic_bowl.jpeg',
    'gd-004': 'gahn_delight_sorbet_lime_coconut_fresh_garnish_bowl.jpg',
    'gd-005': 'gahn_delight_parfait_chocolate_almond_caramel_layered_glass.jpg',
    'gd-006': 'gahn_delight_sundae_date_caramel_vanilla_walnut_toppings_glass.jpeg',
    'gd-007': 'gahn_delight_popsicle_berry_hibiscus_frozen_bar_wooden_stick.jpeg'
  },
  'vop-shop': {
    'vs-001': 'vop_shop_community_apparel_product_01_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
    'vs-002': 'vop_shop_community_apparel_product_02_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
    'vs-003': 'vop_shop_community_apparel_product_03_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
    'vs-004': 'vop_shop_community_apparel_product_04_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
    'vs-005': 'vop_shop_community_apparel_product_05_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
    'vs-006': 'vop_shop_heritage_home_decor_product_06_50_year_celebration_cultural_art_community_pride.jpg',
    'vs-007': 'vop_shop_heritage_home_decor_product_07_50_year_celebration_cultural_art_community_pride.jpg',
    'vs-008': 'vop_shop_heritage_home_decor_product_08_50_year_celebration_cultural_art_community_pride.jpg',
    'vs-009': 'vop_shop_heritage_home_decor_product_09_50_year_celebration_cultural_art_community_pride.jpg',
    'vs-010': 'vop_shop_heritage_home_decor_product_10_50_year_celebration_cultural_art_community_pride.jpg',
    'vs-011': 'vop_shop_wellness_education_product_11_healing_books_holistic_health_community_wisdom.jpg',
    'vs-012': 'vop_shop_wellness_education_product_12_healing_books_holistic_health_community_wisdom.jpg',
    'vs-013': 'vop_shop_wellness_education_product_13_healing_books_holistic_health_community_wisdom.jpg',
    'vs-014': 'vop_shop_wellness_education_product_14_healing_books_holistic_health_community_wisdom.jpg',
    'vs-015': 'vop_shop_wellness_education_product_15_healing_books_holistic_health_community_wisdom.jpg'
  },
  'people-store': {
    'ps-001': 'Peoples Store - FOCO Coconut Water Variety Pack.jpg',
    'ps-002': 'Peoples Store - Great Northern Organic Maple Syrup.jpg',
    'ps-003': 'Peoples Store - Bulk Beans Oats Rice and Grains Basket Display.jpg',
    'ps-004': 'Peoples Store - Bulk Flour and Powder Ingredients.jpg',
    'ps-005': 'Peoples Store - Bulk Grains and Legumes Basket Display.jpg',
    'ps-006': 'Peoples Store - Quintessence Plain Non-Dairy Yogurt.jpg',
    'ps-007': 'Peoples Store - Quintessence Blueberry Non-Dairy Yogurt.jpg',
    'ps-008': 'Peoples Store - Laverland Crunch Sea Salt Seaweed Snack 9-Pack.jpg',
    'ps-009': 'Peoples Store - Laverland Crunch Wasabi Seaweed Snack 9-Pack.jpg',
    'ps-010': 'Peoples Store - Natural Herb Seasoning Mix Hebrew.jpg',
    'ps-011': 'Peoples Store - Pure Sesame Oil Taiwan Large 2L Bottle.jpg',
    'ps-012': 'Peoples Store - Pure Sesame Oil Taiwan.jpg',
    'ps-013': 'Peoples Store - Quintessence Fermented Hot Peppers.jpg',
    'ps-014': 'Peoples Store - Quintessence Fermented Okra with Live Culture.jpg',
    'ps-015': 'Peoples Store - Quintessence Organic Cucumber Relish.jpg',
    'ps-016': 'Peoples Store - Quintessence Organic Kosher Dill Pickles.jpg',
    'ps-017': 'Peoples Store - Quintessence Organic Spicy Relish.jpg',
    'ps-018': 'Peoples Store - Quintessence Organic Spicy Sauerkraut.jpg',
    'ps-019': 'Peoples Store - Quintessence Pineapple Non-Dairy Yogurt.jpg',
    'ps-020': 'Peoples Store - Quintessence Spicy Kimchi Fermented.jpg',
    'ps-021': 'Peoples Store - Quintessence Strawberry Non-Dairy Yogurt.jpg',
    'ps-022': 'Peoples Store - Quintessence Sweet and Sour Ginger 3-Pack.jpg',
    'ps-023': 'Peoples Store - Wan Ja Shan Tamari Soy Sauce Naturally Brewed.jpg'
  },
  'garden-of-light': {
    'gol-001': '1.jpg',
    'gol-002': '2.jpg'
  }
};

// Build the actual paths data structure
const actualPaths = {
  'teva-deli': {
    logo: '/images/vendors/teva-deli/teva_deli_official_logo_master_brand_israeli_vegan_food_company.jpg',
    banner: '/images/vendors/teva_deli_banner_plant_based_factory.jpg',
    products: {}
  },
  'queens-cuisine': {
    logo: '/images/vendors/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
    banner: '/images/vendors/queens_cuisine_banner_artisanal.jpg',
    products: {}
  },
  'gahn-delight': {
    logo: '/images/vendors/gahn_delight_official_logo_master_brand_ice_cream.jpg',
    banner: '/images/vendors/gahn_delight_banner_ice_cream.jpg',
    products: {}
  },
  'vop-shop': {
    logo: '/images/vendors/vop_shop_official_logo_master_brand_village_of_peace.jpg',
    banner: '/images/vendors/vop_shop_banner_50_years.jpg',
    products: {}
  },
  'people-store': {
    logo: '/images/vendors/people_store_logo_community_retail.jpg',
    banner: '/images/vendors/people_store_banner_community.jpg',
    products: {}
  },
  'garden-of-light': {
    logo: '/images/vendors/Garden of Light Logo.jpg',
    banner: '/images/vendors/garden_of_light_banner_premium.jpg',
    products: {}
  }
};

// Map products based on the vendor mappings
Object.entries(vendorProductMappings).forEach(([vendorId, products]) => {
  Object.entries(products).forEach(([productId, filename]) => {
    // Check if the vendor has a subdirectory
    const vendorHasSubdir = ['teva-deli', 'queens-cuisine', 'garden-of-light'].includes(vendorId);
    
    if (vendorHasSubdir) {
      actualPaths[vendorId].products[productId] = `/images/vendors/${vendorId}/${filename}`;
    } else {
      // Files are in the parent vendors directory
      actualPaths[vendorId].products[productId] = `/images/vendors/${filename}`;
    }
  });
});

// Generate the TypeScript file content
const tsContent = `/**
 * Actual Image Paths for Marketplace Vendors
 * 
 * This file contains the real image paths that exist in the public/images/vendors directory
 * Updated: ${new Date().toISOString()}
 */

export const ACTUAL_IMAGE_PATHS: Record<string, {
  logo: string;
  banner?: string;
  products: Record<string, string>;
}> = ${JSON.stringify(actualPaths, null, 2)};

// Fallback image
export const PLACEHOLDER_IMAGE = '/images/placeholder-product.jpg';

// Helper function to get product image
export function getProductImagePath(vendorId: string, productId: string): string {
  const vendor = ACTUAL_IMAGE_PATHS[vendorId];
  if (!vendor || !vendor.products) {
    return PLACEHOLDER_IMAGE;
  }
  
  const productImage = vendor.products[productId.toLowerCase()];
  return productImage || PLACEHOLDER_IMAGE;
}

// Helper function to get vendor logo
export function getVendorLogoPath(vendorId: string): string {
  const vendor = ACTUAL_IMAGE_PATHS[vendorId];
  return vendor?.logo || '/images/vendors/default_logo.jpg';
}

// Helper function to get vendor banner
export function getVendorBannerPath(vendorId: string): string {
  const vendor = ACTUAL_IMAGE_PATHS[vendorId];
  return vendor?.banner || vendor?.logo || '/images/vendors/default_banner.jpg';
}
`;

// Write the updated file
fs.writeFileSync(ACTUAL_PATHS_FILE, tsContent);

console.log('✅ Updated actual-image-paths.ts with correct image paths');
console.log('📸 Total vendors updated:', Object.keys(actualPaths).length);
console.log('🖼️  Total products mapped:', Object.values(vendorProductMappings).reduce((acc, v) => acc + Object.keys(v).length, 0));

// Also create a placeholder image if it doesn't exist
const placeholderPath = path.join(__dirname, '..', 'public', 'images', 'placeholder-product.jpg');
if (!fs.existsSync(placeholderPath)) {
  console.log('\n⚠️  Warning: /images/placeholder-product.jpg does not exist!');
  console.log('Please add a placeholder image to prevent broken images');
}
