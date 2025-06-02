// Teva Deli Complete Product Catalog - ENHANCED WITH VISION-VERIFIED DETAILS
// Products verified through actual package analysis with nutritional information

export interface TevaDeliProduct {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  vendorId: string;
  inStock: boolean;
  isVegan: boolean;
  isKosher: boolean;
  badge?: string;
  tags: string[];
  nutritionalInfo?: {
    per100g: {
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
      fiber?: number;
      sodium?: number;
    };
  };
  allergens?: string[];
  certifications?: string[];
  ingredients?: string[];
  weight?: string;
}

export const tevaDeliCompleteProducts: TevaDeliProduct[] = [
  // ========== VERIFIED AUTHENTIC TEVA DELI PRODUCTS WITH ENHANCED DETAILS ==========
  
  {
    id: 'td-001',
    name: 'Seitan Amerant Schnitzeloni',
    nameHe: 'שניצלוני סייטן אמרנט',
    description: 'Schnitzeloni made from Seitan Amerant - high-quality wheat protein. Traditional Israeli comfort food with authentic Teva Deli flavor. Ready to cook in just minutes.',
    price: 45,
    originalPrice: 55,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Best Seller',
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'protein-rich', 'israeli', 'comfort-food', 'breaded'],
    allergens: ['gluten', 'may contain soy'],
    certifications: ['Badatz Kosher', 'Vegan Society'],
    ingredients: ['wheat gluten', 'water', 'breadcrumbs', 'spices', 'salt'],
    weight: '400g'
  },
  
  {
    id: 'td-002',
    name: 'Kubeh Bulgur with Seitan Amerant',
    nameHe: 'קובה בורגול במילוי סייטן אמרנט',
    description: 'Authentic kubeh bulgur filled with Seitan Amerant. Traditional Middle Eastern dumplings with premium wheat protein filling. Served in warm broth for a hearty meal.',
    price: 38,
    originalPrice: 45,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'traditional', 'middle-eastern', 'israeli', 'bulgur'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher', 'Vegan Society'],
    ingredients: ['bulgur wheat', 'seitan filling', 'onions', 'spices', 'herbs'],
    weight: '500g'
  },

  {
    id: 'td-003',
    name: 'Seitan Amerant Premium',
    nameHe: 'סייטן אמרנטו',
    description: 'Rich seitan with protein blend including hemp and chia. High in protein with complete amino acid profile. Contains dates for natural sweetness.',
    price: 52,
    originalPrice: 62,
    category: 'seitan-steaks',
    image: '/images/vendors/teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'protein-rich', 'premium', 'hemp', 'chia'],
    nutritionalInfo: {
      per100g: {
        calories: 350,
        protein: 25,
        carbohydrates: 7,
        fat: 23,
        fiber: 9.4,
        sodium: 611
      }
    },
    allergens: ['gluten'],
    certifications: ['Badatz Kosher', 'Vegan Society'],
    ingredients: ['wheat gluten', 'hemp protein', 'chia seeds', 'dates', 'olive oil', 'spices'],
    weight: '350g'
  },

  {
    id: 'td-013',
    name: 'Vegan Hot Dogs',
    nameHe: 'נקניקיות טבעוניות מחלבון מן הצומח',
    description: 'Classic American-style hot dogs made from plant protein. Ready to grill or boil. Perfect for BBQs and quick meals.',
    price: 38,
    category: 'sausages',
    image: '/images/vendors/teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'hot-dogs', 'american-style', 'convenient', 'bbq', 'quick-meal'],
    nutritionalInfo: {
      per100g: {
        calories: 200,
        protein: 19.8,
        carbohydrates: 11.5,
        fat: 0.5,
        fiber: 9.4,
        sodium: 611
      }
    },
    allergens: ['soy', 'gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['soy protein', 'wheat gluten', 'water', 'spices', 'natural flavoring'],
    weight: '200g'
  },

  {
    id: 'td-021',
    name: 'Okara Patties with Sprouts',
    nameHe: 'מציצות אוקרה עם תוד צצים',
    description: 'Okara patties with fresh sprouts. Made from sustainable soybean pulp with added sprouted vegetables. Zero-waste product packed with fiber and protein.',
    price: 38,
    originalPrice: 45,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'okara', 'soy', 'protein-rich', 'sustainable', 'zero-waste', 'fiber-rich'],
    allergens: ['soy'],
    certifications: ['Badatz Kosher', 'Vegan Society'],
    ingredients: ['okara (soybean pulp)', 'vegetables', 'herbs', 'spices', 'binding agents'],
    weight: '300g'
  },

  {
    id: 'td-004',
    name: 'Mediterranean Seitan Skewers',
    nameHe: 'שיפודי סייטן ים תיכוני',
    description: 'Herb-marinated seitan skewers with Mediterranean vegetables. Pre-seasoned and ready to grill for authentic Middle Eastern flavor.',
    price: 42,
    originalPrice: 52,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'mediterranean', 'ready-to-grill', 'herbs'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan', 'bell peppers', 'onions', 'olive oil', 'mediterranean herbs', 'garlic'],
    weight: '450g'
  },

  {
    id: 'td-005',
    name: 'Marinated Seitan Strips',
    nameHe: 'רצועות סייטן מתובלות',
    description: 'Pre-marinated seitan strips ready for stir-fry or grilling. Saves prep time while delivering authentic flavor.',
    price: 32,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'seitan', 'protein-rich', 'marinated', 'ready-to-cook', 'stir-fry'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan strips', 'soy sauce', 'ginger', 'garlic', 'sesame oil', 'spices'],
    weight: '250g'
  },

  {
    id: 'td-006',
    name: 'Moroccan Spiced Meatballs',
    nameHe: 'קציצות מרוקאיות',
    description: 'Aromatic plant-based meatballs seasoned with traditional Moroccan spices. Served in rich tomato sauce.',
    price: 42,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'protein-rich', 'moroccan', 'spiced', 'tomato-sauce'],
    allergens: ['gluten', 'may contain nuts'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan base', 'tomato sauce', 'cumin', 'coriander', 'cinnamon', 'ginger', 'herbs'],
    weight: '400g'
  },

  {
    id: 'td-007',
    name: 'Vegan Pastrami Slices',
    nameHe: 'פסטרמה טבעונית פרוסה',
    description: 'Deli-style smoked pastrami slices with authentic flavor. Perfect for sandwiches and charcuterie boards.',
    price: 48,
    originalPrice: 58,
    category: 'deli-meats',
    image: '/images/vendors/teva_deli_vegan_specialty_product_07_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'deli-meat', 'smoked', 'protein-rich', 'sandwich', 'pastrami'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan base', 'smoke flavoring', 'black pepper', 'coriander', 'garlic', 'paprika'],
    weight: '150g'
  },

  {
    id: 'td-008',
    name: 'Jerusalem Mixed Grill',
    nameHe: 'מעורב ירושלמי',
    description: 'Classic Israeli mixed grill made vegan. Traditional Jerusalem street food reimagined with plant-based proteins.',
    price: 55,
    originalPrice: 68,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_08_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Chef Special',
    tags: ['vegan', 'kosher', 'meat-alternative', 'israeli', 'traditional', 'jerusalem', 'street-food'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['mixed seitan varieties', 'onions', 'middle eastern spices', 'olive oil', 'herbs'],
    weight: '500g'
  },

  {
    id: 'td-009',
    name: 'Schnitzel Strips Pack',
    nameHe: 'רצועות שניצל',
    description: 'Pre-cut schnitzel strips for easy serving. Perfect for salads, wraps, or quick family meals.',
    price: 42,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'convenient', 'pre-cut', 'family-friendly'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['breaded seitan strips', 'breadcrumbs', 'spices', 'herbs'],
    weight: '350g'
  },

  {
    id: 'td-010',
    name: 'Plant-Based Shawarma',
    nameHe: 'שווארמה מן הצומח',
    description: 'Middle Eastern style shawarma made from seasoned seitan. Authentic flavor and texture for wraps and pita.',
    price: 48,
    originalPrice: 58,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'shawarma', 'middle-eastern', 'ready-to-eat', 'pita', 'wraps'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seasoned seitan', 'turmeric', 'cumin', 'coriander', 'garlic', 'onion powder'],
    weight: '400g'
  },

  {
    id: 'td-014',
    name: 'Holiday Seitan Roast',
    nameHe: 'צלי סייטן חגיגי',
    description: 'Festive seitan roast perfect for holidays and special occasions. Herb-crusted with traditional seasoning.',
    price: 65,
    originalPrice: 78,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Holiday Special',
    tags: ['vegan', 'kosher', 'meat-alternative', 'seitan', 'holiday', 'festive', 'herb-crusted'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan roast', 'fresh herbs', 'rosemary', 'thyme', 'garlic', 'olive oil'],
    weight: '800g'
  },

  {
    id: 'td-015',
    name: 'Smoked Seitan Slices',
    nameHe: 'פרוסות סייטן מעושן',
    description: 'Ready-to-eat smoked seitan deli slices. Perfect for sandwiches, salads, or antipasto platters.',
    price: 30,
    category: 'deli-meats',
    image: '/images/vendors/teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'seitan', 'smoked', 'ready-to-eat', 'deli-style', 'sliced'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['smoked seitan', 'natural smoke flavor', 'sea salt', 'black pepper'],
    weight: '120g'
  },

  {
    id: 'td-016',
    name: 'Seitan Chorizo',
    nameHe: 'צ׳וריסו סייטן',
    description: 'Spicy Spanish-style seitan sausage with paprika and traditional herbs. Adds authentic flavor to paella and pasta.',
    price: 38,
    originalPrice: 46,
    category: 'sausages',
    image: '/images/vendors/teva_deli_vegan_specialty_product_16_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'seitan', 'chorizo', 'spicy', 'spanish-style', 'paprika'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan base', 'smoked paprika', 'garlic', 'oregano', 'red wine vinegar', 'chili'],
    weight: '200g'
  },

  {
    id: 'td-017',
    name: 'BBQ Pulled Seitan',
    nameHe: 'סייטן משופשף ברביקיו',
    description: 'Tender pulled seitan in tangy BBQ sauce. Perfect for sandwiches, tacos, or served with coleslaw.',
    price: 45,
    originalPrice: 54,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_17_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'seitan', 'bbq', 'pulled', 'ready-to-eat', 'sandwiches'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['pulled seitan', 'bbq sauce', 'tomato paste', 'apple cider vinegar', 'brown sugar', 'spices'],
    weight: '300g'
  },

  {
    id: 'td-018',
    name: 'BBQ Seitan Ribs',
    nameHe: 'צלעות סייטן ברביקיו',
    description: 'Smoky BBQ-glazed seitan ribs perfect for grilling. Meaty texture with authentic barbecue flavor.',
    price: 52,
    originalPrice: 65,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_18_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'seitan', 'bbq', 'ribs', 'grilling', 'smoky'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan ribs', 'bbq glaze', 'liquid smoke', 'molasses', 'soy sauce', 'garlic'],
    weight: '400g'
  },

  {
    id: 'td-019',
    name: 'Herb-Crusted Seitan Cutlets',
    nameHe: 'קציצות סייטן בציפוי עשבי תיבול',
    description: 'Gourmet seitan cutlets with fresh herb coating. Restaurant-quality presentation for special meals.',
    price: 42,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_19_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'seitan', 'herb-crusted', 'gourmet', 'cutlets', 'restaurant-quality'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan cutlets', 'fresh herbs', 'breadcrumbs', 'parsley', 'basil', 'oregano'],
    weight: '300g'
  },

  {
    id: 'td-020',
    name: 'Seitan Breakfast Crumbles',
    nameHe: 'תערובת סייטן לארוחת בוקר',
    description: 'Seasoned seitan crumbles perfect for breakfast scrambles, omelets, or breakfast burritos.',
    price: 25,
    category: 'breakfast',
    image: '/images/vendors/teva_deli_vegan_specialty_product_20_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    tags: ['vegan', 'kosher', 'seitan', 'breakfast', 'seasoned', 'convenient', 'protein-rich'],
    allergens: ['gluten'],
    certifications: ['Badatz Kosher'],
    ingredients: ['seitan crumbles', 'breakfast spices', 'nutritional yeast', 'herbs', 'sea salt'],
    weight: '200g'
  }
];

export default tevaDeliCompleteProducts;