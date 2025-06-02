import { TevaDeliProduct } from './lib/data/teva-deli-complete-catalog';

// Updated Teva Deli Product Catalog - No Duplicates
// Based on actual Teva Deli product lines from research

export const tevaDeliUpdatedProducts: TevaDeliProduct[] = [
  // SCHNITZELS (Products 1, 25-30)
  {
    id: 'td-001',
    name: 'Classic Seitan Schnitzel',
    nameHe: 'שניצל סייטן קלאסי',
    description: 'Golden breaded cutlet, Israeli comfort food favorite',
    longDescription: 'Our signature seitan schnitzel is the ultimate Israeli comfort food made vegan. Each cutlet is carefully crafted from premium wheat protein, seasoned with our secret spice blend, and coated in crispy golden breadcrumbs.',
    price: 45,
    originalPrice: 55,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['schnitzel', 'seitan', 'breaded', 'israeli', 'comfort-food', 'best-seller'],
    features: ['Ready to heat', 'Family size', 'Kid-friendly'],
    specifications: [
      { label: 'Package Size', value: '4 pieces' },
      { label: 'Weight', value: '400g' },
      { label: 'Preparation', value: 'Pan fry 3-4 min each side' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    stockQuantity: 150,
    unit: 'pack',
    minimumOrder: 1
  },
  
  // SPECIALTY PRODUCTS
  {
    id: 'td-002',
    name: 'Traditional Vegan Kubeh',
    nameHe: 'קובה טבעוני מסורתי',
    description: 'Authentic Middle Eastern dumplings in rich broth',
    longDescription: 'Experience the authentic taste of Middle Eastern cuisine with our vegan kubeh. These traditional dumplings are filled with seasoned plant-based meat and herbs, served in a rich vegetable broth.',
    price: 38,
    originalPrice: 45,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['kubeh', 'middle-eastern', 'soup', 'traditional', 'comfort-food'],
    features: ['Authentic recipe', 'Ready to heat', 'Complete meal'],
    specifications: [
      { label: 'Container Size', value: '500ml' },
      { label: 'Dumplings', value: '6 pieces' },
      { label: 'Preparation', value: 'Heat 5-7 minutes' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 80,
    unit: 'container',
    minimumOrder: 1
  },

  // READY MEALS - Shawarma
  {
    id: 'td-003',
    name: 'Seitan Shawarma',
    nameHe: 'שווארמה סייטן',
    description: 'Middle Eastern style shawarma made from seasoned seitan',
    longDescription: 'Our plant-based shawarma captures the authentic taste and texture of traditional Middle Eastern shawarma. Made from specially seasoned seitan, perfect for pita sandwiches or plates.',
    price: 42,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['shawarma', 'seitan', 'middle-eastern', 'ready-meal'],
    features: ['Heat and serve', 'Restaurant quality', 'Authentic spices'],
    specifications: [
      { label: 'Weight', value: '300g' },
      { label: 'Serves', value: '2-3' },
      { label: 'Preparation', value: 'Heat 5 minutes' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 120,
    unit: 'pack',
    minimumOrder: 1
  },

  // READY MEALS - Bolognese
  {
    id: 'td-004',
    name: 'Seitan Bolognese',
    nameHe: 'בולונז סייטן',
    description: 'Rich Italian-style meat sauce made with seitan',
    longDescription: 'Classic Italian bolognese sauce reimagined with plant-based seitan. Slow-cooked with tomatoes, herbs, and vegetables for an authentic pasta sauce.',
    price: 35,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['bolognese', 'pasta-sauce', 'italian', 'seitan'],
    features: ['Ready to heat', 'Family size', 'Rich flavor'],
    specifications: [
      { label: 'Weight', value: '350g' },
      { label: 'Serves', value: '3-4' },
      { label: 'Best with', value: 'Pasta, lasagna' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    stockQuantity: 95,
    unit: 'container',
    minimumOrder: 1
  },

  // READY MEALS - Mixed Grill
  {
    id: 'td-005',
    name: 'Mixed Grill Platter',
    nameHe: 'מעורב ירושלמי טבעוני',
    description: 'Jerusalem mixed grill made with seitan and tofu',
    longDescription: 'All the flavors of Jerusalem\'s famous mixed grill in plant-based form. Includes seasoned seitan pieces, tofu chunks, and grilled vegetables with Middle Eastern spices.',
    price: 48,
    originalPrice: 58,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['mixed-grill', 'jerusalem', 'israeli', 'street-food'],
    features: ['Authentic taste', 'Ready to heat', 'Complete meal'],
    specifications: [
      { label: 'Weight', value: '400g' },
      { label: 'Serves', value: '2' },
      { label: 'Spice level', value: 'Medium' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.8,
    reviewCount: 267,
    inStock: true,
    stockQuantity: 110,
    unit: 'container',
    minimumOrder: 1
  }
];

// Continue with more products...
d chicken-style kebabs',
    longDescription: 'Lebanese-style marinated plant-based chicken kebabs with garlic sauce. A Middle Eastern favorite made vegan.',
    price: 52,
    category: 'kebabs',
    image: '/images/vendors/teva_deli_vegan_specialty_product_40_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['shish-tawook', 'lebanese', 'chicken-style', 'garlic'],
    features: ['Garlic marinated', 'Lebanese style', 'Tender texture'],
    specifications: [
      { label: 'Package', value: '6 skewers' },
      { label: 'Weight', value: '420g' },
      { label: 'Marinade', value: 'Garlic & lemon' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.7,
    reviewCount: 201,
    inStock: true,
    stockQuantity: 80,
    unit: 'pack',
    minimumOrder: 1
  },

  {
    id: 'td-037',
    name: 'Chicken-Style Shawarma',
    nameHe: 'שווארמה בסגנון עוף',
    description: 'Light colored shawarma with poultry spices',
    longDescription: 'Our chicken-style shawarma offers a lighter alternative with authentic poultry seasonings and texture.',
    price: 46,
    originalPrice: 55,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_37_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['shawarma', 'chicken-style', 'light', 'middle-eastern'],
    features: ['Light texture', 'Poultry spices', 'Lower fat'],
    specifications: [
      { label: 'Weight', value: '300g' },
      { label: 'Style', value: 'Chicken-like' },
      { label: 'Preparation', value: 'Heat 5 minutes' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.6,
    reviewCount: 223,
    inStock: true,
    stockQuantity: 140,
    unit: 'pack',
    minimumOrder: 1
  },

  {
    id: 'td-043',
    name: 'Gyro-Style Shawarma',
    nameHe: 'שווארמה בסגנון גיירוס',
    description: 'Greek-inspired seasoned shawarma',
    longDescription: 'Greek-style gyros made from seasoned seitan with Mediterranean herbs and spices. Includes tzatziki sauce.',
    price: 50,
    originalPrice: 60,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_43_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['gyro', 'greek', 'shawarma', 'mediterranean'],
    features: ['Greek style', 'Tzatziki included', 'Herb blend'],
    specifications: [
      { label: 'Weight', value: '350g' },
      { label: 'Sauce', value: 'Vegan tzatziki' },
      { label: 'Origin', value: 'Greek inspired' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.7,
    reviewCount: 167,
    inStock: true,
    stockQuantity: 95,
    unit: 'pack',
    minimumOrder: 1
  },

  // ========== CORRECTED MISMATCHED PRODUCTS ==========
  {
    id: 'td-024',
    name: 'Seitan Pepperoni',
    nameHe: 'פפרוני סייטן',
    description: 'Pizza-perfect pepperoni slices',
    longDescription: 'Spicy pepperoni-style seitan perfect for pizzas, sandwiches, or snacking. Pre-sliced for convenience.',
    price: 32,
    category: 'deli-meats',
    image: '/images/vendors/teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    tags: ['pepperoni', 'pizza', 'slices', 'spicy'],
    features: ['Pre-sliced', 'Pizza ready', 'Spicy kick'],
    specifications: [
      { label: 'Weight', value: '150g' },
      { label: 'Slices', value: '30-35' },
      { label: 'Use', value: 'Pizza topping' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 170,
    unit: 'pack',
    minimumOrder: 1
  }
];

// Export the complete catalog
export default tevaDeliProducts;

// Summary statistics
export const catalogStats = {
  totalProducts: tevaDeliProducts.length,
  categories: {
    schnitzels: tevaDeliProducts.filter(p => p.category === 'schnitzels').length,
    'seitan-tofu': tevaDeliProducts.filter(p => p.category === 'seitan-tofu').length,
    burgers: tevaDeliProducts.filter(p => p.category === 'burgers').length,
    sausages: tevaDeliProducts.filter(p => p.category === 'sausages').length,
    'ready-meals': tevaDeliProducts.filter(p => p.category === 'ready-meals').length,
    kebabs: tevaDeliProducts.filter(p => p.category === 'kebabs').length,
    'deli-meats': tevaDeliProducts.filter(p => p.category === 'deli-meats').length,
    specialty: tevaDeliProducts.filter(p => p.category === 'specialty').length,
    breakfast: tevaDeliProducts.filter(p => p.category === 'breakfast').length,
    'meal-kits': tevaDeliProducts.filter(p => p.category === 'meal-kits').length
  },
  priceRange: {
    min: Math.min(...tevaDeliProducts.map(p => p.price)),
    max: Math.max(...tevaDeliProducts.map(p => p.price)),
    average: Math.round(tevaDeliProducts.reduce((sum, p) => sum + p.price, 0) / tevaDeliProducts.length)
  }
};

console.log('Teva Deli Catalog Summary:');
console.log(`Total Products: ${catalogStats.totalProducts}`);
console.log('\nProducts by Category:');
Object.entries(catalogStats.categories).forEach(([cat, count]) => {
  if (count > 0) console.log(`- ${cat}: ${count} products`);
});
console.log(`\nPrice Range: ₪${catalogStats.priceRange.min} - ₪${catalogStats.priceRange.max}`);
console.log(`Average Price: ₪${catalogStats.priceRange.average}`);
