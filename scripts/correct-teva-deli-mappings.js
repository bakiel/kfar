const fs = require('fs').promises;
const path = require('path');

async function correctTevaDeliMappings() {
  console.log('🔧 Correcting Teva Deli Product Mappings...\n');
  
  const filePath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Based on actual image analysis, here are the CORRECT mappings
  const corrections = [
    // Image 26 is Plain Seitan with Lentils and Quinoa (NOT mini schnitzels)
    {
      id: 'td-006',
      name: 'Seitan with Lentils and Quinoa',
      nameHe: 'סייטן עדשים וקינואה',
      image: 'teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg',
      category: 'seitan',
      description: 'Plain seitan with lentils and quinoa. 500g package. High protein vegan option.'
    },
    
    // Image 27 is Seitan Amaranth Schnitzel (correctly showing schnitzel)
    {
      id: 'td-001',
      name: 'Seitan Amaranth Schnitzel',
      nameHe: 'שניצלוני סייטן אמרנט',
      image: 'teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg',
      category: 'schnitzels',
      description: 'Breaded seitan amaranth schnitzels from the New Series. Ready to heat and serve.'
    },
    
    // Image 28 is Kubeh Burger (NOT regular burger)
    {
      id: 'td-007',
      name: 'Kubeh Burger with Seitan',
      nameHe: 'קובה בורגר במילוי סייטן אמרנט',
      image: 'teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Kubeh burger filled with seitan amaranth. Traditional Middle Eastern style.'
    },
    
    // Image 31 is NOT a Teva Deli product - it's Sano Italian Salami
    // We need to find a different image for shawarma or remove this mapping
    {
      id: 'td-041',
      name: 'Shawarma Mix',
      nameHe: 'תערובת שווארמה',
      image: 'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg', // Use next image
      category: 'shawarma',
      description: 'Seasoned shawarma mix ready for heating. Authentic Middle Eastern spices.'
    },
    
    // Image 01 is Seitan Amaranth Strips
    {
      id: 'td-015',
      name: 'Seitan Amaranth Strips',
      nameHe: 'רצועות סייטן אמרנט',
      image: 'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'seitan',
      description: 'Protein strips with wheat and amaranth, seasoned with soy sauce, silan and garlic. 350g.'
    },
    
    // Fix the actual schnitzel image
    {
      id: 'td-002',
      name: 'Classic Breaded Schnitzel',
      nameHe: 'שניצל מצופה קלאסי',
      image: 'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
      category: 'schnitzels',
      description: 'Classic breaded vegan schnitzel. Golden crispy coating.'
    },
    
    // The green OKARA boxes (images 21-22)
    {
      id: 'td-021',
      name: 'Okara Patties with Herbs',
      nameHe: 'קציצות אוקרה עם ירק',
      image: 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Okara patties with herbs and vegetables. 400g serves 4. Green box packaging.'
    },
    {
      id: 'td-022',
      name: 'Okara Patties with Broccoli',
      nameHe: 'קציצות אוקרה עם ברוקולי',
      image: 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Okara patties with broccoli and grains. 400g serves 8. Green box packaging.'
    },
    
    // The actual BURGER (black box - image 24)
    {
      id: 'td-033',
      name: 'Plant Burger with Rice and Lentils',
      nameHe: 'בורגר עם אורז מלא ועדשים',
      image: 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
      category: 'burgers',
      description: 'Plant-based burger with whole rice, lentils and almonds. 400g contains 4 burgers. 9% protein.'
    },
    
    // Plant-based Ground (image 23)
    {
      id: 'td-023',
      name: 'Plant-Based Ground Meat',
      nameHe: 'טוחון מהצומח',
      image: 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Plant-based ground for making patties and burgers. 500g with 15% protein. Green box.'
    }
  ];
  
  // Apply all corrections
  corrections.forEach(correction => {
    // Update name
    const nameRegex = new RegExp(`(id: '${correction.id}'[^}]*name: ')[^']*(')`);
    content = content.replace(nameRegex, `$1${correction.name}$2`);
    
    // Update Hebrew name
    const hebrewRegex = new RegExp(`(id: '${correction.id}'[^}]*nameHe: ')[^']*(')`);
    content = content.replace(hebrewRegex, `$1${correction.nameHe}$2`);
    
    // Update image
    const imageRegex = new RegExp(`(id: '${correction.id}'[^}]*image: ')[^']*(')`);
    const imagePath = `/images/vendors/teva-deli/${correction.image}`;
    content = content.replace(imageRegex, `$1${imagePath}$2`);
    
    // Update category
    const categoryRegex = new RegExp(`(id: '${correction.id}'[^}]*category: ')[^']*(')`);
    content = content.replace(categoryRegex, `$1${correction.category}$2`);
    
    // Update description
    const descRegex = new RegExp(`(id: '${correction.id}'[^}]*description: ')[^']*(')`);
    content = content.replace(descRegex, `$1${correction.description}$2`);
    
    console.log(`✓ ${correction.id}: ${correction.name}`);
  });
  
  await fs.writeFile(filePath, content);
  console.log(`\n✅ Corrected ${corrections.length} Teva Deli products`);
}

// Run the corrections
if (require.main === module) {
  correctTevaDeliMappings()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}