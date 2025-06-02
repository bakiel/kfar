const fs = require('fs');
const path = require('path');

// Read the current vendor-integrated-bucket-data.ts
const bucketDataPath = path.join(__dirname, 'lib/data/vendor-integrated-bucket-data.ts');
const bucketDataContent = fs.readFileSync(bucketDataPath, 'utf8');

// Extract vendor data
const vendorDataMatch = bucketDataContent.match(/export const VENDOR_INTEGRATED_BUCKET_DATA = ({[\s\S]*});/);
if (!vendorDataMatch) {
  console.error('Could not parse vendor data');
  process.exit(1);
}

// Get actual images from file system
const vendorsDir = path.join(__dirname, 'public/images/vendors');

function getActualImages(vendorId) {
  const images = {};
  
  // Check direct vendor directory
  const directFiles = fs.readdirSync(vendorsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
  directFiles.forEach(file => {
    if (file.toLowerCase().includes(vendorId.replace('-', '_'))) {
      images[file] = `/images/vendors/${file}`;
    }
  });
  
  // Check subdirectory if exists
  const subDir = path.join(vendorsDir, vendorId);
  if (fs.existsSync(subDir)) {
    const subFiles = fs.readdirSync(subDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
    subFiles.forEach(file => {
      images[file] = `/images/vendors/${vendorId}/${file}`;
    });
  }
  
  return images;
}

// Map product IDs to actual images
const vendorImageMappings = {
  'teva-deli': {
    'td-001': 'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    'td-002': 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg',
    'td-003': 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
    'td-004': 'teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg',
    'td-005': 'teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-006': 'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-007': 'teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-008': 'teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
    'td-009': 'teva_deli_vegan_specialty_product_16_seitan_tofu_based_protein_alternative.jpg',
    'td-010': 'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
    'td-011': 'teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-012': 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg',
    'td-013': 'teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-014': 'teva_deli_vegan_specialty_product_08_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-015': 'teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg',
    'td-016': 'teva_deli_vegan_specialty_product_38_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-017': 'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-018': 'teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-019': 'teva_deli_vegan_specialty_product_07_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-020': 'teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
    'td-021': 'teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
    'td-022': 'teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-023': 'teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-024': 'teva_deli_vegan_specialty_product_39_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-025': 'teva_deli_vegan_specialty_product_18_seitan_tofu_based_protein_alternative.jpg',
    'td-026': 'teva_deli_vegan_specialty_product_19_seitan_tofu_based_protein_alternative.jpg',
    'td-027': 'teva_deli_vegan_specialty_product_20_seitan_tofu_based_protein_alternative.jpg',
    'td-028': 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
    'td-029': 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
    'td-030': 'teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg',
    'td-031': 'teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-032': 'teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg',
    'td-033': 'teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg',
    'td-034': 'teva_deli_vegan_specialty_product_40_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-035': 'teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg',
    'td-036': 'teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-037': 'teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-038': 'teva_deli_vegan_specialty_product_37_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-039': 'teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-040': 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
    'td-041': 'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-042': 'teva_deli_vegan_specialty_product_36_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-043': 'teva_deli_vegan_specialty_product_17_seitan_tofu_based_protein_alternative.jpg'
  }
};

// Print current mappings for each vendor
['teva-deli', 'queens-cuisine', 'gahn-delight', 'vop-shop', 'people-store'].forEach(vendorId => {
  console.log(`\n${vendorId}:`);
  const actualImages = getActualImages(vendorId);
  console.log(`Found ${Object.keys(actualImages).length} actual images`);
  
  // Show first 5 images
  Object.entries(actualImages).slice(0, 5).forEach(([file, path]) => {
    console.log(`  - ${file}`);
  });
});
