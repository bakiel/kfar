#!/usr/bin/env node

/**
 * Fix Marketplace Product Issues
 * 1. Copy Garden of Light images
 * 2. Remove non-product items
 * 3. Fix vendor branding
 */

const fs = require('fs');
const path = require('path');

// Source and target directories
const GARDEN_SOURCE = '/Users/mac/Downloads/kfar-final/Garden of Light (1)';
const GARDEN_TARGET = '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/public/images/vendors/garden-of-light/products';

// Step 1: Copy Garden of Light images
console.log('📸 Copying Garden of Light product images...');

// Ensure target directory exists
if (!fs.existsSync(GARDEN_TARGET)) {
  fs.mkdirSync(GARDEN_TARGET, { recursive: true });
}

// Copy images
const gardenImages = fs.readdirSync(GARDEN_SOURCE).filter(f => f.endsWith('.jpg'));
gardenImages.forEach(img => {
  const source = path.join(GARDEN_SOURCE, img);
  const target = path.join(GARDEN_TARGET, img);
  
  if (!fs.existsSync(target)) {
    fs.copyFileSync(source, target);
    console.log(`  ✅ Copied ${img}`);
  }
});

// Step 2: Update Garden of Light catalog to remove non-product items
const catalogPath = '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/lib/data/garden-of-light-complete-catalog.json';
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

// Filter out non-product items (logos, banners, etc.)
const filteredProducts = catalog.products.filter(product => {
  const isLogo = product.name.toLowerCase().includes('logo');
  const isBanner = product.name.toLowerCase().includes('banner');
  const isDisplay = product.name.toLowerCase().includes('display');
  
  return !isLogo && !isBanner && !isDisplay;
});

catalog.products = filteredProducts;

// Write updated catalog
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log(`\n✅ Updated Garden of Light catalog - removed ${catalog.products.length - filteredProducts.length} non-product items`);

// Step 3: Fix Queens Cuisine catalog to remove non-product items
const queensCatalogPath = '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/lib/data/queens-cuisine-complete-catalog.json';
const queensCatalog = JSON.parse(fs.readFileSync(queensCatalogPath, 'utf-8'));

// Filter out banner collections, logos, display sets
const queensFilteredProducts = queensCatalog.products.filter(product => {
  const name = product.name.toLowerCase();
  return !name.includes('banner') && 
         !name.includes('logo') && 
         !name.includes('display') &&
         !name.includes('showcase');
});

queensCatalog.products = queensFilteredProducts;

// Write updated catalog
fs.writeFileSync(queensCatalogPath, JSON.stringify(queensCatalog, null, 2));
console.log(`✅ Updated Queens Cuisine catalog - removed ${queensCatalog.products.length - queensFilteredProducts.length} non-product items`);

// Step 4: Update actual-image-paths.ts to fix mappings
const actualPathsFile = '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/lib/data/actual-image-paths.ts';

const updatedMappings = {
  "teva-deli": {
    "logo": "/images/vendors/teva_deli_official_logo_master_brand_israeli_vegan_food_company.jpg",
    "banner": "/images/vendors/teva_deli_banner_plant_based_factory.jpg",
    "products": {
      "td-001": "/images/vendors/teva-deli/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg",
      "td-002": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-003": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-004": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-005": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-006": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-007": "/images/vendors/teva-deli/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-008": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-009": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_07_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-010": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_08_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-011": "/images/vendors/teva-deli/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png",
      "td-012": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-013": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg",
      "td-014": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg",
      "td-015": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg",
      "td-016": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg",
      "td-017": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg",
      "td-018": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg",
      "td-019": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_16_seitan_tofu_based_protein_alternative.jpg",
      "td-020": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_17_seitan_tofu_based_protein_alternative.jpg",
      "td-021": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg",
      "td-022": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg",
      "td-023": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg",
      "td-024": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg",
      "td-025": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg",
      "td-026": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg",
      "td-027": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg",
      "td-028": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg",
      "td-029": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg",
      "td-030": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg",
      "td-031": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_18_seitan_tofu_based_protein_alternative.jpg",
      "td-032": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_19_seitan_tofu_based_protein_alternative.jpg",
      "td-033": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_20_seitan_tofu_based_protein_alternative.jpg"
    }
  },
  "queens-cuisine": {
    "logo": "/images/vendors/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg",
    "banner": "/images/vendors/queens_cuisine_banner_artisanal.jpg",
    "products": {
      "qc-001": "/images/vendors/queens_cuisine_vegan_burger_seitan_patty_sesame_bun_tomato_lettuce_plant_based_sandwich.jpg",
      "qc-002": "/images/vendors/queens_cuisine_vegan_meatballs_pasta_dish_plant_based_italian_cuisine_tomato_sauce.jpg",
      "qc-003": "/images/vendors/queens_cuisine_vegan_seitan_strips_teriyaki_sauce_sesame_seeds_scallions_asian_style.jpg",
      "qc-004": "/images/vendors/queens_cuisine_middle_eastern_shawarma_pita_wrap_plant_based_meat_alternative.jpg",
      "qc-005": "/images/vendors/queens_cuisine_vegan_meat_grilled_seitan_steaks_plant_based_protein_alternative.jpg",
      "qc-006": "/images/vendors/queens_cuisine_vegan_meat_kabab_skewer_dish_plant_based_middle_eastern_cuisine.jpg",
      "qc-007": "/images/vendors/queens_cuisine_vegan_meat_seitan_kebabs_grilled_skewers_plant_based_barbecue_alternative.jpg",
      "qc-008": "/images/vendors/queens_cuisine_vegan_meat_seitan_sandwich_plant_based_deli_style_bread_filling.jpg",
      "qc-009": "/images/vendors/queens_cuisine_vegan_meat_seitan_steaks_grilled_plant_based_protein_alternative.jpg",
      "qc-010": "/images/vendors/queens_cuisine_vegan_seitan_cutlets_breaded_crispy_herb_dip_arugula_salad_cherry_tomatoes.jpg",
      "qc-011": "/images/vendors/queens_cuisine_vegan_protein_seitan_tofu_specialty_item_08_plant_based_meat_alternative.jpg",
      "qc-012": "/images/vendors/queens_cuisine_vegan_protein_seitan_tofu_specialty_item_09_plant_based_meat_alternative.jpg",
      "qc-013": "/images/vendors/queens_cuisine_vegan_protein_seitan_tofu_specialty_item_10_plant_based_meat_alternative.jpg",
      "qc-014": "/images/vendors/queens_cuisine_vegan_protein_seitan_tofu_specialty_item_11_plant_based_meat_alternative.jpg",
      "qc-015": "/images/vendors/queens_cuisine_vegan_protein_seitan_tofu_specialty_item_12_plant_based_meat_alternative.jpg"
    }
  },
  "gahn-delight": {
    "logo": "/images/vendors/gahn_delight_official_logo_master_brand_ice_cream.jpg",
    "banner": "/images/vendors/gahn_delight_banner_ice_cream.jpg",
    "products": {
      "gd-001": "/images/vendors/gahn_delight_ice_cream_chocolate_tahini_swirl_cup_with_cacao_nibs.jpeg",
      "gd-002": "/images/vendors/gahn_delight_ice_cream_passion_mango_double_scoop_cup.jpg",
      "gd-003": "/images/vendors/gahn_delight_ice_cream_pistachio_rose_triple_scoop_ceramic_bowl.jpeg",
      "gd-004": "/images/vendors/gahn_delight_sorbet_lime_coconut_fresh_garnish_bowl.jpg",
      "gd-005": "/images/vendors/gahn_delight_parfait_chocolate_almond_caramel_layered_glass.jpg",
      "gd-006": "/images/vendors/gahn_delight_sundae_date_caramel_vanilla_walnut_toppings_glass.jpeg",
      "gd-007": "/images/vendors/gahn_delight_popsicle_berry_hibiscus_frozen_bar_wooden_stick.jpeg"
    }
  },
  "vop-shop": {
    "logo": "/images/vendors/vop_shop_official_logo_master_brand_village_of_peace.jpg",
    "banner": null,
    "products": {
      "vs-001": "/images/vendors/vop_shop_community_apparel_product_01_wellness_lifestyle_village_of_peace_heritage_clothing.jpg",
      "vs-002": "/images/vendors/vop_shop_community_apparel_product_02_wellness_lifestyle_village_of_peace_heritage_clothing.jpg",
      "vs-003": "/images/vendors/vop_shop_community_apparel_product_03_wellness_lifestyle_village_of_peace_heritage_clothing.jpg",
      "vs-004": "/images/vendors/vop_shop_community_apparel_product_04_wellness_lifestyle_village_of_peace_heritage_clothing.jpg",
      "vs-005": "/images/vendors/vop_shop_community_apparel_product_05_wellness_lifestyle_village_of_peace_heritage_clothing.jpg",
      "vs-006": "/images/vendors/vop_shop_heritage_home_decor_product_06_50_year_celebration_cultural_art_community_pride.jpg",
      "vs-007": "/images/vendors/vop_shop_heritage_home_decor_product_07_50_year_celebration_cultural_art_community_pride.jpg",
      "vs-008": "/images/vendors/vop_shop_heritage_home_decor_product_08_50_year_celebration_cultural_art_community_pride.jpg",
      "vs-009": "/images/vendors/vop_shop_heritage_home_decor_product_09_50_year_celebration_cultural_art_community_pride.jpg",
      "vs-010": "/images/vendors/vop_shop_heritage_home_decor_product_10_50_year_celebration_cultural_art_community_pride.jpg",
      "vs-011": "/images/vendors/vop_shop_wellness_education_product_11_healing_books_holistic_health_community_wisdom.jpg",
      "vs-012": "/images/vendors/vop_shop_wellness_education_product_12_healing_books_holistic_health_community_wisdom.jpg",
      "vs-013": "/images/vendors/vop_shop_wellness_education_product_13_healing_books_holistic_health_community_wisdom.jpg",
      "vs-014": "/images/vendors/vop_shop_wellness_education_product_14_healing_books_holistic_health_community_wisdom.jpg",
      "vs-015": "/images/vendors/vop_shop_wellness_education_product_15_healing_books_holistic_health_community_wisdom.jpg"
    }
  },
  "people-store": {
    "logo": "/images/vendors/people_store_logo_community_retail.jpg",
    "banner": "/images/vendors/people_store_banner_community.jpg",
    "products": {
      "ps-001": "/images/vendors/Peoples Store - FOCO Coconut Water Variety Pack.jpg",
      "ps-002": "/images/vendors/Peoples Store - Great Northern Organic Maple Syrup.jpg",
      "ps-003": "/images/vendors/Peoples Store - Bulk Beans Oats Rice and Grains Basket Display.jpg",
      "ps-004": "/images/vendors/Peoples Store - Bulk Flour and Powder Ingredients.jpg",
      "ps-005": "/images/vendors/Peoples Store - Bulk Grains and Legumes Basket Display.jpg",
      "ps-006": "/images/vendors/Peoples Store - Quintessence Plain Non-Dairy Yogurt.jpg",
      "ps-007": "/images/vendors/Peoples Store - Quintessence Blueberry Non-Dairy Yogurt.jpg",
      "ps-008": "/images/vendors/Peoples Store - Laverland Crunch Sea Salt Seaweed Snack 9-Pack.jpg",
      "ps-009": "/images/vendors/Peoples Store - Laverland Crunch Wasabi Seaweed Snack 9-Pack.jpg",
      "ps-010": "/images/vendors/Peoples Store - Natural Herb Seasoning Mix Hebrew.jpg",
      "ps-011": "/images/vendors/Peoples Store - Pure Sesame Oil Taiwan Large 2L Bottle.jpg",
      "ps-012": "/images/vendors/Peoples Store - Pure Sesame Oil Taiwan.jpg",
      "ps-013": "/images/vendors/Peoples Store - Quintessence Fermented Hot Peppers.jpg",
      "ps-014": "/images/vendors/Peoples Store - Quintessence Fermented Okra with Live Culture.jpg",
      "ps-015": "/images/vendors/Peoples Store - Quintessence Organic Cucumber Relish.jpg",
      "ps-016": "/images/vendors/Peoples Store - Quintessence Organic Kosher Dill Pickles.jpg",
      "ps-017": "/images/vendors/Peoples Store - Quintessence Organic Spicy Relish.jpg",
      "ps-018": "/images/vendors/Peoples Store - Quintessence Organic Spicy Sauerkraut.jpg",
      "ps-019": "/images/vendors/Peoples Store - Quintessence Pineapple Non-Dairy Yogurt.jpg",
      "ps-020": "/images/vendors/Peoples Store - Quintessence Spicy Kimchi Fermented.jpg",
      "ps-021": "/images/vendors/Peoples Store - Quintessence Strawberry Non-Dairy Yogurt.jpg",
      "ps-022": "/images/vendors/Peoples Store - Quintessence Sweet and Sour Ginger 3-Pack.jpg",
      "ps-023": "/images/vendors/Peoples Store - Wan Ja Shan Tamari Soy Sauce Naturally Brewed.jpg"
    }
  },
  "garden-of-light": {
    "logo": "/images/vendors/Garden of Light Logo.jpg",
    "banner": "/images/vendors/garden_of_light_banner_premium.jpg",
    "products": {
      "gol-001": "/images/vendors/garden-of-light/products/1.jpg",
      "gol-002": "/images/vendors/garden-of-light/products/2.jpg",
      "gol-003": "/images/vendors/garden-of-light/products/3.jpg",
      "gol-004": "/images/vendors/garden-of-light/products/4.jpg",
      "gol-005": "/images/vendors/garden-of-light/products/5.jpg",
      "gol-006": "/images/vendors/garden-of-light/products/6.jpg",
      "gol-007": "/images/vendors/garden-of-light/products/7.jpg",
      "gol-008": "/images/vendors/garden-of-light/products/8.jpg",
      "gol-009": "/images/vendors/garden-of-light/products/9.jpg",
      "gol-010": "/images/vendors/garden-of-light/products/10.jpg",
      "gol-011": "/images/vendors/garden-of-light/products/11.jpg",
      "gol-012": "/images/vendors/garden-of-light/products/12.jpg"
    }
  }
};

// Write the TypeScript file
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
}> = ${JSON.stringify(updatedMappings, null, 2)};

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

fs.writeFileSync(actualPathsFile, tsContent);
console.log('\n✅ Updated actual-image-paths.ts with correct mappings');

console.log('\n🎉 All marketplace issues fixed!');
console.log('✅ Garden of Light images copied');
console.log('✅ Non-product items removed from catalogs');
console.log('✅ Image mappings updated');
console.log('\n🔄 Please restart the development server to see the changes.');
