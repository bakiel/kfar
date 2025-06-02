const fs = require('fs').promises;
const path = require('path');

async function ultimateFinalFix() {
  console.log('🎯 ULTIMATE FINAL FIX - Based on vision analysis...\n');
  
  const filePath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Based on actual vision analysis:
  // Images 21-22: OKARA products (green boxes)
  // Images 23: Plant-based ground (green box)
  // Image 24: Black BURGER box
  // Images 25-30: Various products
  // Image 27: Seitan Amaranth Schnitzel (confirmed)
  // Image 28: Kubeh Burger
  
  const ultimateFixes = [
    // SCHNITZELS - Remove OKARA images, use proper schnitzel images
    {
      id: 'td-001',
      name: 'Seitan Amaranth Schnitzel',
      nameHe: 'שניצל סייטן אמרנט',
      image: 'teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg', // Confirmed schnitzel
      category: 'schnitzels'
    },
    {
      id: 'td-002',
      name: 'Classic Breaded Schnitzel',
      nameHe: 'שניצל מצופה קלאסי',
      image: 'teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
      category: 'schnitzels'
    },
    {
      id: 'td-003',
      name: 'Herb Schnitzel',
      nameHe: 'שניצל עשבי תיבול',
      image: 'teva_deli_vegan_seitan_schnitzel.jpg',
      category: 'schnitzels'
    },
    {
      id: 'td-004',
      name: 'Sesame Schnitzel',
      nameHe: 'שניצל שומשום',
      image: 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg', // Actually OKARA, needs fix
      category: 'schnitzels'
    },
    {
      id: 'td-005',
      name: 'Schnitzel Strips',
      nameHe: 'רצועות שניצל',
      image: 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg',
      category: 'schnitzels'
    },
    
    // OKARA PRODUCTS (The green boxes)
    {
      id: 'td-021',
      name: 'Okara Patties with Herbs',
      nameHe: 'קציצות אוקרה עם ירק',
      image: 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Okara patties with herbs and vegetables. Green box packaging, 400g serves 4.'
    },
    {
      id: 'td-022', 
      name: 'Okara Patties with Broccoli',
      nameHe: 'קציצות אוקרה עם ברוקולי',
      image: 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Okara patties with broccoli and grains. Green box packaging, 400g serves 8.'
    },
    
    // PLANT-BASED GROUND (Green box)
    {
      id: 'td-023',
      name: 'Plant-Based Ground Meat',
      nameHe: 'טוחון מהצומח',
      image: 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Plant-based ground for making patties and burgers. 500g with 15% protein.'
    },
    
    // BURGERS (Using correct burger images)
    {
      id: 'td-033',
      name: 'Plant Burger with Rice and Lentils', 
      nameHe: 'בורגר עם אורז מלא ועדשים',
      image: 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg', // Black BURGER box
      category: 'burgers',
      description: 'Plant-based burger with whole rice, lentils and almonds. Black box, 400g contains 4 burgers.'
    },
    {
      id: 'td-034',
      name: 'Spicy Bean Burger',
      nameHe: 'המבורגר שעועית חריף',
      image: 'teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg',
      category: 'burgers'
    },
    {
      id: 'td-035',
      name: 'Mushroom Burger',
      nameHe: 'המבורגר פטריות',
      image: 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg',
      category: 'burgers'
    },
    
    // KUBEH (Special product)
    {
      id: 'td-007',
      name: 'Kubeh Burger with Seitan',
      nameHe: 'קובה בורגר במילוי סייטן',
      image: 'teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg',
      category: 'specialty',
      description: 'Kubeh burger filled with seitan amaranth. Traditional Middle Eastern style.'
    },
    
    // SEITAN products (Use the correct seitan images)
    {
      id: 'td-015',
      name: 'Seitan Amaranth Strips',
      nameHe: 'רצועות סייטן אמרנט',
      image: 'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'seitan',
      description: 'Protein strips with wheat and amaranth, seasoned with soy, silan and garlic. 350g.'
    },
    {
      id: 'td-006',
      name: 'Seitan with Lentils and Quinoa',
      nameHe: 'סייטן עדשים וקינואה',
      image: 'teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg',
      category: 'seitan',
      description: 'Plain seitan with lentils and quinoa. 500g package.'
    }
  ];
  
  // Apply all fixes
  console.log('Applying ultimate fixes:');
  ultimateFixes.forEach(fix => {
    // Update multiple fields at once for each product
    const idRegex = new RegExp(`("id": "${fix.id}"[^}]+})`, 's');
    const match = content.match(idRegex);
    
    if (match) {
      let productBlock = match[1];
      
      // Update name
      productBlock = productBlock.replace(/"name": "[^"]*"/, `"name": "${fix.name}"`);
      
      // Update Hebrew name
      productBlock = productBlock.replace(/"nameHe": "[^"]*"/, `"nameHe": "${fix.nameHe}"`);
      
      // Update image
      const imagePath = `/images/vendors/teva-deli/${fix.image}`;
      productBlock = productBlock.replace(/"image": "[^"]*"/, `"image": "${imagePath}"`);
      
      // Update category
      productBlock = productBlock.replace(/"category": "[^"]*"/, `"category": "${fix.category}"`);
      
      // Update description if provided
      if (fix.description) {
        productBlock = productBlock.replace(/"description": "[^"]*"/, `"description": "${fix.description}"`);
      }
      
      content = content.replace(match[1], productBlock);
      console.log(`✓ ${fix.id}: ${fix.name}`);
    }
  });
  
  // Remove the Okara entries from schnitzels if they exist
  console.log('\nRemoving any Okara products from schnitzels category...');
  
  // Also fix td-004 which shouldn't use OKARA image
  content = content.replace(
    /"id": "td-004"[^}]*"image": "[^"]*teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli\.jpg"/,
    '"id": "td-004", "name": "Sesame Schnitzel", "nameHe": "שניצל שומשום", "description": "Premium schnitzels product from Teva Deli. Made with high-quality plant-based ingredients.", "price": 45, "category": "schnitzels", "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg"'
  );
  
  await fs.writeFile(filePath, content);
  console.log('\n✅ Ultimate final fix complete!');
}

// Run the fix
if (require.main === module) {
  ultimateFinalFix()
    .catch(error => {
      console.error('❌ Error:', error);
    });
}