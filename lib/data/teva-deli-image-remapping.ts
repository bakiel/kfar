// Teva Deli Product-to-Image Remapping
// Based on visual inspection of actual images displayed in the store

export const productImageRemapping = {
  // VERIFIED CORRECT MAPPINGS (from screenshots)
  'td-001': 'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg', // Classic Schnitzel - CORRECT
  'td-002': 'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg', // Kubeh - CORRECT
  'td-003': 'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png', // Tofu Block - CORRECT
  
  // PRODUCTS THAT NEED REMAPPING
  'td-005': 'teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg', // Marinated Tofu Strips
  'td-006': 'teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg', // Moroccan Meatballs
  'td-009': 'teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg', // Schnitzel Strips Pack
  
  // SEITAN/TOFU PRODUCTS - NEED CORRECT MAPPING
  'td-011': 'teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg', // Marinated Tofu Steaks (NOT 11 which shows hot dogs)
  'td-012': 'teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg', // Seitan Bacon Strips (NOT 12 which shows plain tofu)
  'td-013': 'teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg', // Hot Dogs (this is what's actually in image 11)
  'td-015': 'teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg', // Smoked Tofu Slices
  
  // SCHNITZELS
  'td-025': 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg', // Spinach Schnitzel
  'td-028': 'teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg', // Za'atar Schnitzel
  'td-030': 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg', // Sesame Schnitzel
  
  // READY MEALS
  'td-014': 'teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg', // Seitan Roast
  'td-017': 'teva_deli_vegan_specialty_product_17_seitan_tofu_based_protein_alternative.jpg', // BBQ Pulled Seitan
  'td-018': 'teva_deli_vegan_specialty_product_18_seitan_tofu_based_protein_alternative.jpg', // BBQ Seitan Ribs
  'td-019': 'teva_deli_vegan_specialty_product_19_seitan_tofu_based_protein_alternative.jpg', // Herb-Crusted Tofu Cutlets
  
  // Additional mappings based on product categories
  'td-031': 'teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg', // Vegan Salami
  'td-032': 'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg', // Harissa Kebabs
  'td-033': 'teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg', // Sliced Seitan
  'td-041': 'teva_deli_vegan_specialty_product_41_shawarma_kebab_middle_eastern_plant_based.jpg', // Round Seitan
};

// Image 11 actually contains HOT DOGS (not tofu steaks)
// Image 12 actually contains plain white tofu/seitan block (not bacon strips)
// Need to swap these around to match the correct products
