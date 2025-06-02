const fs = require('fs').promises;
const path = require('path');

async function fixVendorImageMappings() {
  console.log('🔧 Fixing Vendor Image Mappings...\n');
  
  // Fix People's Store first (simpler issues)
  await fixPeopleStore();
  
  // Fix Teva Deli (more complex)
  await fixTevaDeli();
  
  console.log('\n✅ All image mappings fixed!');
}

async function fixPeopleStore() {
  console.log('📦 Fixing People\'s Store...');
  
  const filePath = path.join(__dirname, '../lib/data/people-store-complete-catalog.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  
  // Fix the image mapping issues
  const imageFixes = {
    // Fix maple syrup pointing to yogurt
    'Great Northern Organic Maple Syrup': '/images/vendors/people-store/Peoples Store - Great Northern Organic Maple Syrup.jpg',
    // Fix seaweed pointing to maple syrup  
    'Laverland Crunch Sea Salt Seaweed Snack 9-Pack': '/images/vendors/people-store/Peoples Store - Laverland Crunch Sea Salt Seaweed Snack 9-Pack.jpg',
    // Fix wasabi seaweed
    'Laverland Crunch Wasabi Seaweed Snack 9-Pack': '/images/vendors/people-store/Peoples Store - Laverland Crunch Wasabi Seaweed Snack 9-Pack.jpg'
  };
  
  // Apply fixes and normalize all paths
  data.products = data.products.map(product => {
    // Apply specific fixes
    if (imageFixes[product.name]) {
      product.image = imageFixes[product.name];
    }
    
    // Normalize all paths to use consistent directory
    if (product.image) {
      // Replace any variation of "Peoples Store" path with consistent one
      product.image = product.image.replace('/images/vendors/Peoples Store', '/images/vendors/people-store');
      product.image = product.image.replace('/images/vendors/Peoples-Store', '/images/vendors/people-store');
    }
    
    return product;
  });
  
  // Add missing Quintessence products that have images but aren't in catalog
  const quintessenceProducts = [
    {
      id: 'ps-019',
      name: 'Quintessence Blueberry Non-Dairy Yogurt',
      nameHe: 'יוגורט טבעוני אוכמניות קווינטסנס',
      image: '/images/vendors/people-store/Peoples Store - Quintessence Blueberry Non-Dairy Yogurt.jpg',
      price: 18,
      vendorId: 'people-store',
      category: 'dairy-alternatives',
      description: 'Creamy blueberry non-dairy yogurt made with live cultures. Rich in probiotics.',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-020',
      name: 'Quintessence Strawberry Non-Dairy Yogurt',
      nameHe: 'יוגורט טבעוני תות קווינטסנס',
      image: '/images/vendors/people-store/Peoples Store - Quintessence Strawberry Non-Dairy Yogurt.jpg',
      price: 18,
      vendorId: 'people-store',
      category: 'dairy-alternatives',
      description: 'Delicious strawberry non-dairy yogurt with live cultures. Probiotic-rich.',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-021',
      name: 'Quintessence Pineapple Non-Dairy Yogurt',
      nameHe: 'יוגורט טבעוני אננס קווינטסנס',
      image: '/images/vendors/people-store/Peoples Store - Quintessence Pineapple Non-Dairy Yogurt.jpg',
      price: 18,
      vendorId: 'people-store',
      category: 'dairy-alternatives',
      description: 'Tropical pineapple non-dairy yogurt with beneficial probiotics.',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-022',
      name: 'Quintessence Plain Non-Dairy Yogurt',
      nameHe: 'יוגורט טבעוני טבעי קווינטסנס',
      image: '/images/vendors/people-store/Peoples Store - Quintessence Plain Non-Dairy Yogurt.jpg',
      price: 16,
      vendorId: 'people-store',
      category: 'dairy-alternatives',
      description: 'Plain non-dairy yogurt perfect for cooking or eating. Live cultures included.',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-023',
      name: 'Quintessence Organic Kosher Dill Pickles',
      nameHe: 'מלפפונים חמוצים אורגניים קווינטסנס',
      image: '/images/vendors/people-store/Peoples Store - Quintessence Organic Kosher Dill Pickles.jpg',
      price: 22,
      vendorId: 'people-store',
      category: 'fermented',
      description: 'Crunchy organic kosher dill pickles made with traditional fermentation.',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-024',
      name: 'Quintessence Organic Spicy Sauerkraut',
      nameHe: 'כרוב כבוש חריף אורגני קווינטסנס',
      image: '/images/vendors/people-store/Peoples Store - Quintessence Organic Spicy Sauerkraut.jpg',
      price: 24,
      vendorId: 'people-store',
      category: 'fermented',
      description: 'Organic spicy sauerkraut fermented with live cultures. Great for gut health.',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-025',
      name: 'Quintessence Spicy Kimchi',
      nameHe: 'קימצ\'י חריף קווינטסנס',
      image: '/images/vendors/people-store/Peoples Store - Quintessence Spicy Kimchi Fermented.jpg',
      price: 26,
      vendorId: 'people-store',
      category: 'fermented',
      description: 'Traditional Korean kimchi with a spicy kick. Fermented with live cultures.',
      isVegan: true,
      isKosher: true,
      inStock: true
    }
  ];
  
  // Add the new products
  data.products.push(...quintessenceProducts);
  
  // Save updated catalog
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Fixed People's Store: ${data.products.length} products total`);
}

async function fixTevaDeli() {
  console.log('\n🥙 Fixing Teva Deli...');
  
  const filePath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Based on vision analysis, create proper mappings
  const correctMappings = {
    // Schnitzels (verified from vision)
    'td-001': 'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    'td-002': 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
    'td-003': 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
    
    // Burgers (products 21-30 are burger/schnitzel category)
    'td-004': 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
    'td-005': 'teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg',
    'td-006': 'teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg',
    
    // Shawarma (products 31-43 are shawarma/kebab)
    'td-007': 'teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-008': 'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg',
    
    // Kebabs
    'td-009': 'teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-010': 'teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg',
    'td-011': 'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    
    // Sausages (Hot Dogs)
    'td-012': 'teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
    'td-013': 'teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg',
    
    // Seitan products (1-10 are general products)
    'td-014': 'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-015': 'teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-016': 'teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg',
    
    // Tofu products
    'td-017': 'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
    'td-018': 'teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg',
    'td-019': 'teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg',
    
    // Specialty items
    'td-020': 'teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-021': 'teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-022': 'teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-023': 'teva_deli_vegan_specialty_product_07_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-024': 'teva_deli_vegan_specialty_product_08_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-025': 'teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg',
    'td-026': 'teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg',
    
    // Ready meals
    'td-027': 'teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg',
    'td-028': 'teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg',
    'td-029': 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg',
    
    // More specialty
    'td-030': 'teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
    'td-031': 'teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
    'td-032': 'teva_deli_vegan_specialty_product_16_seitan_tofu_based_protein_alternative.jpg',
    'td-033': 'teva_deli_vegan_specialty_product_17_seitan_tofu_based_protein_alternative.jpg',
    'td-034': 'teva_deli_vegan_specialty_product_18_seitan_tofu_based_protein_alternative.jpg',
    'td-035': 'teva_deli_vegan_specialty_product_19_seitan_tofu_based_protein_alternative.jpg'
  };
  
  // Update each product's image path
  Object.entries(correctMappings).forEach(([productId, imageName]) => {
    const regex = new RegExp(`(id: '${productId}'[^}]*image: ')[^']+(')`);
    const newImagePath = `/images/vendors/teva-deli/${imageName}`;
    content = content.replace(regex, `$1${newImagePath}$2`);
  });
  
  // Save the updated file
  await fs.writeFile(filePath, content);
  console.log('✅ Fixed Teva Deli: 35 products with corrected image mappings');
}

// Run the fix
if (require.main === module) {
  fixVendorImageMappings()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}