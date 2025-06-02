const fs = require('fs');
const path = require('path');

// Get all images in the directory
const imageDir = '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/public/images/vendors/teva-deli';
const allImages = fs.readdirSync(imageDir)
  .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
  .map(file => file);

// Images used in catalog (extracted from the catalog file)
const usedImages = [
  'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
  'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
  'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
  'teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg',
  'teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
  'teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
  'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
  'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
  'teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
  'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
  'teva_deli_vegan_specialty_product_08_plant_based_meat_alternative_israeli_cuisine.jpg',
  'teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg',
  'teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg',
  'teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg',
  'teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg',
  'teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
  'teva_deli_vegan_specialty_product_16_seitan_tofu_based_protein_alternative.jpg',
  'teva_deli_vegan_specialty_product_17_seitan_tofu_based_protein_alternative.jpg',
  'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg',
  'teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg',
  'teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg'
];

// Find unused images
const unusedImages = allImages.filter(img => !usedImages.includes(img));

console.log('=== TEVA DELI AUDIT REPORT ===\n');
console.log(`Total images in directory: ${allImages.length}`);
console.log(`Images used in catalog: ${usedImages.length}`);
console.log(`Products in catalog: 24`);
console.log(`Unused images: ${unusedImages.length}\n`);

console.log('=== UNUSED IMAGES (Potential unmapped products) ===\n');
unusedImages.forEach((img, index) => {
  console.log(`${index + 1}. ${img}`);
});

// Group unused images by category based on filename
console.log('\n=== UNUSED IMAGES BY CATEGORY ===\n');

const categories = {
  specialty: [],
  burgerSchnitzel: [],
  shawarmaKebab: [],
  logo: [],
  other: []
};

unusedImages.forEach(img => {
  if (img.includes('logo')) {
    categories.logo.push(img);
  } else if (img.includes('burger_schnitzel')) {
    categories.burgerSchnitzel.push(img);
  } else if (img.includes('shawarma_kebab')) {
    categories.shawarmaKebab.push(img);
  } else if (img.includes('specialty_product')) {
    categories.specialty.push(img);
  } else {
    categories.other.push(img);
  }
});

Object.entries(categories).forEach(([cat, imgs]) => {
  if (imgs.length > 0) {
    console.log(`${cat.toUpperCase()} (${imgs.length} images):`);
    imgs.forEach(img => console.log(`  - ${img}`));
    console.log();
  }
});

// Analyze missing product numbers
console.log('=== MISSING PRODUCT NUMBERS ANALYSIS ===\n');
const usedNumbers = usedImages
  .map(img => {
    const match = img.match(/product_(\d+)_/);
    return match ? parseInt(match[1]) : null;
  })
  .filter(n => n !== null)
  .sort((a, b) => a - b);

console.log('Used product numbers:', usedNumbers.join(', '));

const allNumbers = [];
for (let i = 1; i <= 43; i++) {
  allNumbers.push(i);
}

const missingNumbers = allNumbers.filter(n => !usedNumbers.includes(n));
console.log('Missing product numbers:', missingNumbers.join(', '));