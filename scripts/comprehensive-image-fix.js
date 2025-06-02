const fs = require('fs').promises;
const path = require('path');

async function comprehensiveImageFix() {
  console.log('🔧 Comprehensive Image and ID Fix...\n');
  
  // Fix People's Store duplicate IDs properly
  await fixPeopleStoreIssues();
  
  // Completely reorganize Teva Deli based on actual image analysis
  await reorganizeTevaDeli();
  
  console.log('\n✅ All fixes completed!');
}

async function fixPeopleStoreIssues() {
  console.log('📦 Fixing People\'s Store issues...');
  
  const filePath = path.join(__dirname, '../lib/data/people-store-complete-catalog.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  
  // Create a map to track used IDs and fix duplicates
  const usedIds = new Set();
  let duplicateCount = 0;
  
  data.products = data.products.map((product, index) => {
    let newId = product.id;
    
    // Fix IDs that start with 0ps-
    if (newId.startsWith('0ps-')) {
      newId = newId.replace('0ps-', 'ps-0');
    }
    
    // If ID is already used, generate a new one
    if (usedIds.has(newId)) {
      duplicateCount++;
      // For the duplicate ps-014, make it ps-015a
      if (newId === 'ps-014' && product.name.includes('2L')) {
        newId = 'ps-014b';
      } else {
        newId = `ps-${100 + duplicateCount}`;
      }
      console.log(`  Fixed duplicate: ${product.id} → ${newId} (${product.name})`);
    }
    
    usedIds.add(newId);
    product.id = newId;
    return product;
  });
  
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Fixed People's Store: ${duplicateCount} duplicates resolved`);
}

async function reorganizeTevaDeli() {
  console.log('\n🥙 Reorganizing Teva Deli products based on image analysis...');
  
  const filePath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Based on the visual analysis, here are the CORRECT mappings:
  const productUpdates = [
    // OKARA Products (Green boxes - images 21 & 22)
    {
      id: 'td-021',
      name: 'Okara Patties with Herbs',
      nameHe: 'קציצות אוקרה עם ירק',
      image: 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
      description: 'Okara patties made with herbs and grains. 400g package serves 4.'
    },
    {
      id: 'td-022',
      name: 'Okara Patties with Broccoli',
      nameHe: 'קציצות אוקרה עם ברוקולי',
      image: 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
      description: 'Okara patties with broccoli and grains. 400g package serves 8.'
    },
    
    // Plant-based Ground (Green box - image 23)
    {
      id: 'td-023',
      name: 'Plant-Based Ground',
      nameHe: 'טוחון מהצומח',
      image: 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
      description: 'Plant-based ground for making patties and burgers. 500g package with 15% protein.'
    },
    
    // BURGER Product (Black box - image 24)
    {
      id: 'td-033',
      name: 'Plant-Based Burger',
      nameHe: 'בורגר מן הצומח',
      image: 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
      description: 'Plant-based burger with whole rice, lentils and almonds. 400g package contains 4 burgers.'
    },
    
    // Seitan Schnitzel (the actual schnitzel)
    {
      id: 'td-001',
      name: 'Seitan Amerant Schnitzel',
      nameHe: 'שניצלוני סייטן אמרנט',
      image: 'teva_deli_vegan_seitan_schnitzel.jpg',
      description: 'Premium seitan schnitzel from the Home Series. Ready to heat and serve.'
    },
    
    // Fix the products shown in the screenshot
    {
      id: 'td-005',
      name: 'Schnitzel Strips',
      nameHe: 'רצועות שניצל',
      image: 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg',
      description: 'Crispy schnitzel strips, perfect for salads or as a snack.'
    },
    {
      id: 'td-006',
      name: 'Kubeh Burgul with Seitan',
      nameHe: 'קובה בורגול עם סייטן',
      image: 'teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
      description: 'Traditional Middle Eastern kubeh made with bulgur and seitan.'
    },
    {
      id: 'td-007',
      name: 'Moroccan Spiced Meatballs',
      nameHe: 'קציצות מרוקאיות',
      image: 'teva_deli_vegan_specialty_product_36_shawarma_kebab_middle_eastern_plant_based.jpg',
      description: 'Spiced plant-based meatballs in Moroccan style.'
    },
    {
      id: 'td-008',
      name: 'Natural Organic Tofu',
      nameHe: 'טופו טבעי אורגני',
      image: 'teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
      description: 'Pure organic tofu made with soybeans and calcium salts.'
    }
  ];
  
  // Apply all the updates
  productUpdates.forEach(update => {
    // Update name
    const nameRegex = new RegExp(`(id: '${update.id}'[^}]*name: ')[^']+(')`);
    content = content.replace(nameRegex, `$1${update.name}$2`);
    
    // Update Hebrew name
    const hebrewRegex = new RegExp(`(id: '${update.id}'[^}]*nameHe: ')[^']+(')`);
    content = content.replace(hebrewRegex, `$1${update.nameHe}$2`);
    
    // Update image
    const imageRegex = new RegExp(`(id: '${update.id}'[^}]*image: ')[^']+(')`);
    const imagePath = `/images/vendors/teva-deli/${update.image}`;
    content = content.replace(imageRegex, `$1${imagePath}$2`);
    
    // Update description
    const descRegex = new RegExp(`(id: '${update.id}'[^}]*description: ')[^']+(')`);
    content = content.replace(descRegex, `$1${update.description}$2`);
  });
  
  await fs.writeFile(filePath, content);
  console.log('✅ Reorganized Teva Deli products with correct images');
}

// Run the comprehensive fix
if (require.main === module) {
  comprehensiveImageFix()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}