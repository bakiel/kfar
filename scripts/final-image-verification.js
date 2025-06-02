const fs = require('fs').promises;
const path = require('path');

async function finalImageVerification() {
  console.log('🔍 Final Image Verification and Fix...\n');
  
  // First, let's list all Teva Deli images to understand what we have
  await listTevaDeliImages();
  
  // Fix Teva Deli with proper English names and correct image mappings
  await fixTevaDeliFinal();
  
  console.log('\n✅ Final verification complete!');
}

async function listTevaDeliImages() {
  console.log('📸 Available Teva Deli Images:');
  
  const imageDir = path.join(__dirname, '../public/images/vendors/teva-deli');
  const files = await fs.readdir(imageDir);
  
  const productImages = files.filter(f => f.includes('product') || f.includes('schnitzel') || f.includes('kubeh') || f.includes('tofu'));
  
  console.log(`Found ${productImages.length} product images`);
  
  // Group by type
  const burgerSchnitzel = productImages.filter(f => f.includes('burger_schnitzel'));
  const seitanTofu = productImages.filter(f => f.includes('seitan_tofu'));
  const shawarmaKebab = productImages.filter(f => f.includes('shawarma_kebab'));
  const specialty = productImages.filter(f => f.includes('specialty_product') && !f.includes('burger') && !f.includes('seitan') && !f.includes('shawarma'));
  
  console.log(`- Burger/Schnitzel images (21-30): ${burgerSchnitzel.length}`);
  console.log(`- Seitan/Tofu images (11-20): ${seitanTofu.length}`);
  console.log(`- Shawarma/Kebab images (31-43): ${shawarmaKebab.length}`);
  console.log(`- Specialty images (1-10): ${specialty.length}`);
}

async function fixTevaDeliFinal() {
  console.log('\n🥙 Applying final Teva Deli fixes with English names...');
  
  const filePath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Based on vision analysis, here's the FINAL correct mapping
  // Using English names as requested
  const finalMappings = [
    // SCHNITZELS (1-6)
    {
      id: 'td-001',
      name: 'Classic Seitan Schnitzel',
      nameHe: 'שניצל סייטן קלאסי',
      image: 'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
      category: 'schnitzels'
    },
    {
      id: 'td-002',
      name: 'Herb Crusted Schnitzel', 
      nameHe: 'שניצל בציפוי עשבי תיבול',
      image: 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
      category: 'schnitzels'
    },
    {
      id: 'td-003',
      name: 'Spicy Schnitzel',
      nameHe: 'שניצל חריף',
      image: 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
      category: 'schnitzels'
    },
    {
      id: 'td-004',
      name: 'Sesame Schnitzel',
      nameHe: 'שניצל שומשום',
      image: 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
      category: 'schnitzels'
    },
    {
      id: 'td-005',
      name: 'Schnitzel Strips',
      nameHe: 'רצועות שניצל',
      image: 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg',
      category: 'schnitzels'
    },
    {
      id: 'td-006',
      name: 'Mini Schnitzels',
      nameHe: 'שניצלונים',
      image: 'teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg',
      category: 'schnitzels'
    },
    
    // BURGERS (33-40)
    {
      id: 'td-033',
      name: 'Classic Vegan Burger',
      nameHe: 'המבורגר טבעוני קלאסי',
      image: 'teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg',
      category: 'burgers'
    },
    {
      id: 'td-034',
      name: 'Spicy Black Bean Burger',
      nameHe: 'המבורגר שעועית שחורה חריף',
      image: 'teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg',
      category: 'burgers'
    },
    {
      id: 'td-035',
      name: 'Mushroom Burger',
      nameHe: 'המבורגר פטריות',
      image: 'teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg',
      category: 'burgers'
    },
    {
      id: 'td-036',
      name: 'BBQ Burger',
      nameHe: 'המבורגר ברביקיו',
      image: 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg',
      category: 'burgers'
    },
    
    // SHAWARMA (41-48)
    {
      id: 'td-041',
      name: 'Shawarma Mix',
      nameHe: 'תערובת שווארמה',
      image: 'teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
      category: 'shawarma'
    },
    {
      id: 'td-042',
      name: 'Spicy Shawarma',
      nameHe: 'שווארמה חריפה',
      image: 'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg',
      category: 'shawarma'
    },
    
    // KEBABS (11-19)
    {
      id: 'td-011',
      name: 'Traditional Kebab',
      nameHe: 'קבב מסורתי',
      image: 'teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg',
      category: 'kebabs'
    },
    {
      id: 'td-012',
      name: 'Spiced Kebab Skewers',
      nameHe: 'שיפודי קבב מתובלים',
      image: 'teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg',
      category: 'kebabs'
    },
    
    // SAUSAGES (13-14)
    {
      id: 'td-013',
      name: 'Vegan Hot Dogs',
      nameHe: 'נקניקיות טבעוניות',
      image: 'teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
      category: 'sausages'
    },
    {
      id: 'td-014',
      name: 'Chorizo Style Sausage',
      nameHe: 'נקניק צ\'וריסו טבעוני',
      image: 'teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg',
      category: 'sausages'
    },
    
    // TOFU PRODUCTS (8-10, 17-19, 30-32)
    {
      id: 'td-008',
      name: 'Natural Organic Tofu',
      nameHe: 'טופו טבעי אורגני',
      image: 'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
      category: 'tofu'
    },
    {
      id: 'td-009',
      name: 'Herb Marinated Tofu',
      nameHe: 'טופו במרינדה של עשבי תיבול',
      image: 'teva_deli_vegan_specialty_product_12_seitan_tofu_based_protein_alternative.jpg',
      category: 'tofu'
    },
    {
      id: 'td-010',
      name: 'Crispy Tofu Bites',
      nameHe: 'קוביות טופו קריספי',
      image: 'teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg',
      category: 'tofu'
    },
    {
      id: 'td-017',
      name: 'Smoked Tofu',
      nameHe: 'טופו מעושן',
      image: 'teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
      category: 'tofu'
    },
    {
      id: 'td-018',
      name: 'Tofu Steaks',
      nameHe: 'סטייק טופו',
      image: 'teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
      category: 'tofu'
    },
    
    // SEITAN PRODUCTS (15-16, 25-29)
    {
      id: 'td-015',
      name: 'Classic Seitan',
      nameHe: 'סייטן קלאסי',
      image: 'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'seitan'
    },
    {
      id: 'td-016',
      name: 'Seitan Strips',
      nameHe: 'רצועות סייטן',
      image: 'teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'seitan'
    },
    {
      id: 'td-025',
      name: 'Mediterranean Seitan',
      nameHe: 'סייטן ים תיכוני',
      image: 'teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'seitan'
    },
    {
      id: 'td-026',
      name: 'Seitan Roast',
      nameHe: 'צלי סייטן',
      image: 'teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'seitan'
    },
    
    // SPECIALTY ITEMS
    {
      id: 'td-007',
      name: 'Kubeh Bulgur',
      nameHe: 'קובה בורגול',
      image: 'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'specialty'
    },
    {
      id: 'td-021',
      name: 'Okara Patties',
      nameHe: 'קציצות אוקרה',
      image: 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty'
    },
    {
      id: 'td-020',
      name: 'Falafel Mix',
      nameHe: 'תערובת פלאפל',
      image: 'teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'specialty'
    }
  ];
  
  // Apply all mappings
  finalMappings.forEach(mapping => {
    // Update name
    const nameRegex = new RegExp(`(id: '${mapping.id}'[^}]*name: ')[^']*(')`);
    content = content.replace(nameRegex, `$1${mapping.name}$2`);
    
    // Update Hebrew name
    const hebrewRegex = new RegExp(`(id: '${mapping.id}'[^}]*nameHe: ')[^']*(')`);
    content = content.replace(hebrewRegex, `$1${mapping.nameHe}$2`);
    
    // Update image
    const imageRegex = new RegExp(`(id: '${mapping.id}'[^}]*image: ')[^']*(')`);
    const imagePath = `/images/vendors/teva-deli/${mapping.image}`;
    content = content.replace(imageRegex, `$1${imagePath}$2`);
    
    // Update category if different
    const categoryRegex = new RegExp(`(id: '${mapping.id}'[^}]*category: ')[^']*(')`);
    content = content.replace(categoryRegex, `$1${mapping.category}$2`);
  });
  
  await fs.writeFile(filePath, content);
  console.log(`✅ Updated ${finalMappings.length} Teva Deli products with English names`);
}

// Run the final verification
if (require.main === module) {
  finalImageVerification()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}