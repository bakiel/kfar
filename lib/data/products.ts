// Product database for KFAR Marketplace
// All products are 100% vegan, aligned with Village of Peace principles

export interface Product {
  id: string;
  name: string;
  nameHebrew?: string;
  vendor: string;
  vendorId: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  descriptionHebrew?: string;
  ingredients?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
    sodium?: string;
  };
  allergens?: string[];
  certifications?: string[];
  preparationTime?: string;
  servingSize?: string;
  storageInstructions?: string;
  shelfLife?: string;
  isKosher: boolean;
  isGlutenFree?: boolean;
  isOrganic?: boolean;
  isRaw?: boolean;
  isSeasonal?: boolean;
  seasonalMonths?: number[];
  minimumOrder?: number;
  bulkPricing?: {
    quantity: number;
    price: number;
  }[];
  tags: string[];
  rating?: number;
  reviews?: number;
  inStock: boolean;
  featured?: boolean;
  badge?: string;
}

export interface Vendor {
  id: string;
  name: string;
  nameHebrew?: string;
  logo: string;
  description: string;
  established?: number;
  categories: string[];
  certifications?: string[];
  deliveryTime: string;
  minimumOrder?: number;
  rating: number;
  totalProducts: number;
  tags: string[];
}

// Vendor definitions
export const vendors: Record<string, Vendor> = {
  'teva-deli': {
    id: 'teva-deli',
    name: 'Teva Deli',
    nameHebrew: 'טבע דלי',
    logo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    description: 'Pioneer in Israeli vegan food manufacturing since 1983. Born from the Village of Peace community\'s self-sufficiency needs.',
    established: 1983,
    categories: ['meat-alternatives', 'tofu-products', 'prepared-foods'],
    certifications: ['Kosher', 'ISO 9001', 'HACCP'],
    deliveryTime: '1-2 business days',
    minimumOrder: 50,
    rating: 4.8,
    totalProducts: 46,
    tags: ['wholesale', 'b2b', 'export', 'community-founded']
  },
  'gahn-delight': {
    id: 'gahn-delight',
    name: 'Gahn Delight',
    nameHebrew: 'גן תענוג',
    logo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
    description: 'Artisanal vegan ice creams and frozen desserts, handcrafted with natural ingredients.',
    categories: ['desserts', 'frozen-treats'],
    certifications: ['Kosher'],
    deliveryTime: 'Same day (order before 2PM)',
    rating: 4.9,
    totalProducts: 8,
    tags: ['premium', 'artisanal', 'gift-ready', 'seasonal']
  },
  'queens-cuisine': {
    id: 'queens-cuisine',
    name: 'Queens Cuisine',
    nameHebrew: 'מטבח המלכות',
    logo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
    description: '100% vegan restaurant and catering service specializing in seitan and tofu-based meat alternatives.',
    categories: ['catering', 'prepared-foods', 'meat-alternatives'],
    certifications: ['Kosher'],
    deliveryTime: '2-3 business days',
    rating: 4.7,
    totalProducts: 26,
    tags: ['catering', 'events', 'fine-dining', 'custom-orders']
  },
  'atur-avior': {
    id: 'atur-avior',
    name: 'Garden of Light',
    nameHebrew: 'גן האור',
    logo: '/images/vendors/Garden of Light Logo.jpg',
    description: 'Organic superfood blends and wellness products for healthy living. Premium nutrition and natural foods.',
    established: 1990,
    categories: ['health', 'wellness', 'superfoods', 'organic'],
    certifications: ['Kosher', 'Organic'],
    deliveryTime: '2-3 business days',
    rating: 4.9,
    totalProducts: 23,
    tags: ['organic', 'wellness', 'superfoods', 'nutrition']
  },
  'people-store': {
    id: 'people-store',
    name: 'People Store',
    nameHebrew: 'חנות העם',
    logo: '/images/vendors/people_store_logo_community_retail.jpg',
    description: 'Community retail hub offering international vegan products, bulk goods, and specialty items.',
    categories: ['groceries', 'bulk-foods', 'beverages', 'fermented-foods'],
    deliveryTime: '2-3 business days',
    rating: 4.6,
    totalProducts: 30,
    tags: ['retail', 'international', 'bulk', 'community']
  },
  'vop-shop': {
    id: 'vop-shop',
    name: 'VOP Shop',
    nameHebrew: 'חנות כפר השלום',
    logo: '/images/vendors/vop_shop_logo_village_marketplace.jpg',
    description: 'Official Village of Peace community store featuring apparel, home décor, and educational materials.',
    categories: ['apparel', 'home-decor', 'books', 'gifts'],
    deliveryTime: '3-5 business days',
    rating: 4.8,
    totalProducts: 306,
    tags: ['official', 'community', 'heritage', 'educational']
  }
};

// Product catalog
export const products: Product[] = [
  // TEVA DELI PRODUCTS
  {
    id: 'td-001',
    name: 'Classic Seitan Schnitzel',
    nameHebrew: 'שניצל סייטן קלאסי',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    category: 'meat-alternatives',
    subcategory: 'schnitzels',
    price: 45,
    originalPrice: 55,
    image: '/images/vendors/teva-deli/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    description: 'Golden breaded seitan cutlet, a vegan version of Israel\'s beloved schnitzel. Crispy outside, tender inside.',
    ingredients: ['Wheat protein (seitan)', 'Breadcrumbs', 'Spices', 'Vegetable oil', 'Soy sauce'],
    nutritionInfo: {
      calories: 220,
      protein: '18g',
      carbs: '15g',
      fat: '8g',
      fiber: '2g',
      sodium: '380mg'
    },
    allergens: ['Gluten', 'Soy'],
    certifications: ['Kosher', 'Vegan'],
    preparationTime: '10-12 minutes',
    servingSize: '2 schnitzels (150g)',
    storageInstructions: 'Keep frozen. Once thawed, consume within 3 days.',
    shelfLife: '12 months frozen',
    isKosher: true,
    isGlutenFree: false,
    tags: ['best-seller', 'quick-meal', 'kid-friendly'],
    rating: 4.9,
    reviews: 234,
    inStock: true,
    featured: true,
    badge: 'Best Seller'
  },
  {
    id: 'td-002',
    name: 'Seitan Kubeh Soup Balls',
    nameHebrew: 'כובה סייטן',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    category: 'prepared-foods',
    subcategory: 'traditional',
    price: 52,
    image: '/images/vendors/teva-deli/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    description: 'Traditional Middle Eastern kubeh reimagined vegan. Wheat bulgur shells filled with seasoned seitan and herbs.',
    ingredients: ['Bulgur wheat', 'Seitan', 'Onions', 'Pine nuts', 'Middle Eastern spices'],
    nutritionInfo: {
      calories: 180,
      protein: '12g',
      carbs: '22g',
      fat: '5g',
      fiber: '4g',
      sodium: '320mg'
    },
    allergens: ['Gluten', 'Tree nuts'],
    certifications: ['Kosher', 'Vegan'],
    preparationTime: '20 minutes in soup',
    servingSize: '4 pieces (120g)',
    isKosher: true,
    tags: ['traditional', 'comfort-food', 'soup-ready'],
    rating: 4.8,
    reviews: 156,
    inStock: true
  },
  {
    id: 'td-003',
    name: 'Organic Tofu Block - Natural',
    nameHebrew: 'טופו אורגני טבעי',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    category: 'tofu-products',
    subcategory: 'plain',
    price: 18,
    image: '/images/vendors/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
    description: 'Premium organic tofu made from Israeli-grown soybeans. Firm texture perfect for grilling, frying, or marinating.',
    ingredients: ['Organic soybeans', 'Water', 'Nigari (magnesium chloride)'],
    nutritionInfo: {
      calories: 140,
      protein: '15g',
      carbs: '3g',
      fat: '8g',
      fiber: '2g',
      sodium: '10mg'
    },
    allergens: ['Soy'],
    certifications: ['Kosher', 'Organic', 'Vegan'],
    servingSize: '100g',
    storageInstructions: 'Keep refrigerated. Use within 5 days after opening.',
    isKosher: true,
    isOrganic: true,
    tags: ['organic', 'high-protein', 'versatile'],
    rating: 4.7,
    reviews: 312,
    inStock: true
  },
  {
    id: 'td-004',
    name: 'Spicy Seitan Shawarma',
    nameHebrew: 'שווארמה סייטן חריפה',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    category: 'meat-alternatives',
    subcategory: 'shawarma',
    price: 38,
    image: '/images/vendors/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
    description: 'Thinly sliced seitan marinated in authentic Middle Eastern spices. Ready to heat and serve in pita or laffa.',
    ingredients: ['Seitan', 'Shawarma spice blend', 'Olive oil', 'Lemon juice', 'Garlic'],
    nutritionInfo: {
      calories: 190,
      protein: '22g',
      carbs: '8g',
      fat: '7g',
      fiber: '1g',
      sodium: '420mg'
    },
    allergens: ['Gluten'],
    certifications: ['Kosher', 'Vegan'],
    preparationTime: '5-7 minutes',
    servingSize: '150g',
    isKosher: true,
    tags: ['spicy', 'ready-to-eat', 'street-food'],
    rating: 4.8,
    reviews: 189,
    inStock: true
  },
  {
    id: 'td-005',
    name: 'Herb-Marinated Tofu Steaks',
    nameHebrew: 'סטייק טופו בעשבי תיבול',
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    category: 'tofu-products',
    subcategory: 'marinated',
    price: 32,
    image: '/images/vendors/teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
    description: 'Pre-marinated tofu steaks infused with Mediterranean herbs. Grill or pan-fry for a gourmet plant-based meal.',
    ingredients: ['Tofu', 'Olive oil', 'Rosemary', 'Thyme', 'Garlic', 'Sea salt'],
    nutritionInfo: {
      calories: 160,
      protein: '14g',
      carbs: '4g',
      fat: '10g',
      fiber: '2g',
      sodium: '280mg'
    },
    allergens: ['Soy'],
    certifications: ['Kosher', 'Vegan'],
    preparationTime: '8-10 minutes',
    servingSize: '2 steaks (180g)',
    isKosher: true,
    tags: ['gourmet', 'pre-marinated', 'mediterranean'],
    rating: 4.7,
    reviews: 145,
    inStock: true
  },

  // GAHN DELIGHT PRODUCTS
  {
    id: 'gd-001',
    name: 'Chocolate Tahini Swirl Ice Cream',
    nameHebrew: 'גלידת שוקולד טחינה',
    vendor: 'Gahn Delight',
    vendorId: 'gahn-delight',
    category: 'desserts',
    subcategory: 'ice-cream',
    price: 35,
    image: '/images/vendors/gahn_delight_ice_cream_chocolate_tahini_swirl_cup_with_cacao_nibs.jpeg',
    description: 'Rich chocolate ice cream swirled with creamy tahini and topped with cacao nibs. A perfect Middle Eastern fusion dessert.',
    ingredients: ['Coconut milk', 'Cacao', 'Tahini', 'Maple syrup', 'Vanilla', 'Cacao nibs'],
    nutritionInfo: {
      calories: 240,
      protein: '4g',
      carbs: '28g',
      fat: '14g',
      fiber: '3g',
      sodium: '45mg'
    },
    allergens: ['Sesame', 'Coconut'],
    certifications: ['Kosher', 'Vegan'],
    servingSize: '120ml',
    storageInstructions: 'Keep frozen at -18°C',
    isKosher: true,
    tags: ['artisanal', 'middle-eastern', 'premium'],
    rating: 4.9,
    reviews: 78,
    inStock: true,
    featured: true
  },
  {
    id: 'gd-002',
    name: 'Passion Mango Double Scoop',
    nameHebrew: 'גלידת פסיפלורה מנגו',
    vendor: 'Gahn Delight',
    vendorId: 'gahn-delight',
    category: 'desserts',
    subcategory: 'ice-cream',
    price: 32,
    image: '/images/vendors/gahn_delight_ice_cream_passion_mango_double_scoop_cup.jpg',
    description: 'Tropical paradise in a cup. Fresh passion fruit and ripe mango create this refreshing vegan delight.',
    ingredients: ['Mango puree', 'Passion fruit', 'Coconut cream', 'Agave nectar', 'Lemon juice'],
    nutritionInfo: {
      calories: 210,
      protein: '2g',
      carbs: '32g',
      fat: '9g',
      fiber: '2g',
      sodium: '20mg'
    },
    allergens: ['Coconut'],
    certifications: ['Kosher', 'Vegan'],
    servingSize: '120ml',
    isKosher: true,
    isSeasonal: true,
    seasonalMonths: [5, 6, 7, 8], // May-August
    tags: ['tropical', 'refreshing', 'summer'],
    rating: 4.8,
    reviews: 92,
    inStock: true
  },
  {
    id: 'gd-003',
    name: 'Date Caramel Vanilla Walnut Sundae',
    nameHebrew: 'סאנדיי תמר קרמל וניל אגוז',
    vendor: 'Gahn Delight',
    vendorId: 'gahn-delight',
    category: 'desserts',
    subcategory: 'sundae',
    price: 42,
    originalPrice: 48,
    image: '/images/vendors/gahn_delight_sundae_date_caramel_vanilla_walnut_toppings_glass.jpeg',
    description: 'Vanilla bean ice cream layered with date caramel sauce and topped with candied walnuts. Pure indulgence.',
    ingredients: ['Cashew cream', 'Vanilla bean', 'Dates', 'Walnuts', 'Coconut sugar', 'Sea salt'],
    nutritionInfo: {
      calories: 320,
      protein: '6g',
      carbs: '38g',
      fat: '18g',
      fiber: '4g',
      sodium: '85mg'
    },
    allergens: ['Tree nuts', 'Coconut'],
    certifications: ['Kosher', 'Vegan'],
    servingSize: '180ml with toppings',
    isKosher: true,
    tags: ['indulgent', 'special-occasion', 'nuts'],
    rating: 5.0,
    reviews: 45,
    inStock: true,
    badge: 'Limited Edition'
  },

  // QUEENS CUISINE PRODUCTS
  {
    id: 'qc-001',
    name: 'Vegan Shawarma Kit',
    nameHebrew: 'ערכת שווארמה טבעונית',
    vendor: 'Queens Cuisine',
    vendorId: 'queens-cuisine',
    category: 'prepared-foods',
    subcategory: 'meal-kits',
    price: 68,
    image: '/images/vendors/queens-cuisine/queens_cuisine_middle_eastern_shawarma_pita_wrap_plant_based_meat_alternative.jpg',
    description: 'Complete shawarma experience with marinated seitan strips, tahini sauce, pickles, and fresh pita bread.',
    ingredients: ['Seitan', 'Pita bread', 'Tahini', 'Pickled vegetables', 'Shawarma spices'],
    nutritionInfo: {
      calories: 420,
      protein: '28g',
      carbs: '45g',
      fat: '16g',
      fiber: '6g',
      sodium: '680mg'
    },
    allergens: ['Gluten', 'Sesame'],
    certifications: ['Kosher', 'Vegan'],
    servingSize: 'Serves 2',
    preparationTime: '15 minutes',
    isKosher: true,
    tags: ['meal-kit', 'middle-eastern', 'party-favorite'],
    rating: 4.8,
    reviews: 167,
    inStock: true
  },
  {
    id: 'qc-002',
    name: 'Italian Herb Seitan Meatballs',
    nameHebrew: 'כדורי סייטן איטלקיים',
    vendor: 'Queens Cuisine',
    vendorId: 'queens-cuisine',
    category: 'meat-alternatives',
    subcategory: 'meatballs',
    price: 45,
    image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_meatballs_pasta_dish_plant_based_italian_cuisine_tomato_sauce.jpg',
    description: 'Hand-rolled seitan meatballs seasoned with Italian herbs. Perfect for pasta, subs, or appetizers.',
    ingredients: ['Seitan', 'Italian herbs', 'Garlic', 'Onion', 'Tomato paste', 'Olive oil'],
    nutritionInfo: {
      calories: 180,
      protein: '20g',
      carbs: '12g',
      fat: '6g',
      fiber: '3g',
      sodium: '390mg'
    },
    allergens: ['Gluten'],
    certifications: ['Kosher', 'Vegan'],
    servingSize: '6 meatballs (180g)',
    preparationTime: '20 minutes',
    isKosher: true,
    tags: ['italian', 'versatile', 'family-meal'],
    rating: 4.7,
    reviews: 134,
    inStock: true
  },
  {
    id: 'qc-003',
    name: 'Asian Teriyaki Seitan Strips',
    nameHebrew: 'רצועות סייטן טריאקי',
    vendor: 'Queens Cuisine',
    vendorId: 'queens-cuisine',
    category: 'meat-alternatives',
    subcategory: 'asian',
    price: 52,
    image: '/images/vendors/queens-cuisine/queens_cuisine_vegan_seitan_strips_teriyaki_sauce_sesame_seeds_scallions_asian_style.jpg',
    description: 'Tender seitan strips glazed with house-made teriyaki sauce. Restaurant quality for your home kitchen.',
    ingredients: ['Seitan', 'Soy sauce', 'Mirin', 'Ginger', 'Sesame seeds', 'Scallions'],
    nutritionInfo: {
      calories: 210,
      protein: '24g',
      carbs: '18g',
      fat: '5g',
      fiber: '2g',
      sodium: '580mg'
    },
    allergens: ['Gluten', 'Soy', 'Sesame'],
    certifications: ['Kosher', 'Vegan'],
    servingSize: '200g',
    preparationTime: '10 minutes',
    isKosher: true,
    tags: ['asian', 'quick-meal', 'stir-fry'],
    rating: 4.8,
    reviews: 98,
    inStock: true
  },

  // ATUR AVIOR PRODUCTS
  {
    id: 'aa-001',
    name: 'Heritage Chocolate Gift Box',
    nameHebrew: 'מארז שוקולד מורשת',
    vendor: 'Atur Avior',
    vendorId: 'atur-avior',
    category: 'chocolates',
    subcategory: 'gift-boxes',
    price: 85,
    image: '/images/vendors/atur_aturah_logo_edenic_traditions.jpg',
    description: 'Artisan vegan chocolates crafted using traditional "Aturah Hestilyah" methods. 12-piece assortment.',
    ingredients: ['Cacao', 'Coconut sugar', 'Cashew cream', 'Natural flavors', 'Sea salt'],
    allergens: ['Tree nuts'],
    certifications: ['Kosher', 'Organic', 'Vegan'],
    servingSize: '12 pieces (180g)',
    isKosher: true,
    isOrganic: true,
    tags: ['gift', 'premium', 'traditional'],
    rating: 5.0,
    reviews: 67,
    inStock: true,
    featured: true
  },
  {
    id: 'aa-002',
    name: 'Garden of Light Herb Cheese Spread',
    nameHebrew: 'ממרח גבינה עשבי גן אור',
    vendor: 'Atur Avior',
    vendorId: 'atur-avior',
    category: 'cheese-alternatives',
    subcategory: 'spreads',
    price: 28,
    image: '/images/vendors/atur_aturah_logo_edenic_traditions.jpg',
    description: 'Creamy cashew-based cheese spread infused with garden herbs. Perfect for bagels or crackers.',
    ingredients: ['Cashews', 'Nutritional yeast', 'Fresh herbs', 'Lemon juice', 'Garlic', 'Sea salt'],
    nutritionInfo: {
      calories: 120,
      protein: '5g',
      carbs: '6g',
      fat: '9g',
      fiber: '1g',
      sodium: '240mg'
    },
    allergens: ['Tree nuts'],
    certifications: ['Kosher', 'Vegan'],
    servingSize: '30g',
    storageInstructions: 'Keep refrigerated. Use within 10 days after opening.',
    isKosher: true,
    tags: ['spread', 'herbs', 'breakfast'],
    rating: 4.8,
    reviews: 89,
    inStock: true
  },

  // PEOPLE STORE PRODUCTS
  {
    id: 'ps-001',
    name: 'FOCO Organic Coconut Water Pack',
    nameHebrew: 'מי קוקוס אורגניים פוקו',
    vendor: 'People Store',
    vendorId: 'people-store',
    category: 'beverages',
    subcategory: 'coconut-water',
    price: 45,
    image: '/images/vendors/people_store_logo_community_retail.jpg',
    description: '100% pure organic coconut water. Natural hydration from young Thai coconuts. Pack of 6.',
    ingredients: ['Organic coconut water'],
    nutritionInfo: {
      calories: 45,
      protein: '0g',
      carbs: '11g',
      fat: '0g',
      fiber: '0g',
      sodium: '105mg'
    },
    certifications: ['Organic', 'Vegan'],
    servingSize: '330ml per bottle',
    isOrganic: true,
    bulkPricing: [
      { quantity: 12, price: 42 },
      { quantity: 24, price: 40 }
    ],
    tags: ['hydration', 'organic', 'bulk'],
    rating: 4.7,
    reviews: 156,
    inStock: true
  },
  {
    id: 'ps-002',
    name: 'Quintessence Coconut Yogurt - Berry',
    nameHebrew: 'יוגורט קוקוס קווינטסנס - פירות יער',
    vendor: 'People Store',
    vendorId: 'people-store',
    category: 'fermented-foods',
    subcategory: 'yogurt',
    price: 18,
    image: '/images/vendors/people_store_logo_community_retail.jpg',
    description: 'Probiotic-rich coconut yogurt with real berry compote. Live cultures for digestive health.',
    ingredients: ['Coconut cream', 'Berry compote', 'Live cultures', 'Tapioca starch', 'Natural flavors'],
    nutritionInfo: {
      calories: 140,
      protein: '2g',
      carbs: '16g',
      fat: '8g',
      fiber: '1g',
      sodium: '35mg'
    },
    allergens: ['Coconut'],
    certifications: ['Vegan'],
    servingSize: '150g',
    storageInstructions: 'Keep refrigerated. Consume within 5 days after opening.',
    tags: ['probiotic', 'breakfast', 'healthy'],
    rating: 4.6,
    reviews: 98,
    inStock: true
  },

  // VOP SHOP PRODUCTS
  {
    id: 'vop-001',
    name: 'Heritage T-Shirt - "Yah Khai"',
    nameHebrew: 'חולצת מורשת - יה חי',
    vendor: 'VOP Shop',
    vendorId: 'vop-shop',
    category: 'apparel',
    subcategory: 'shirts',
    price: 65,
    image: '/images/vendors/vop_shop_community_apparel_product_02_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
    description: 'Premium cotton t-shirt featuring the community\'s sacred greeting. Available in multiple colors.',
    ingredients: ['100% Organic cotton'],
    certifications: ['Organic', 'Fair Trade'],
    servingSize: 'Sizes: S, M, L, XL, XXL',
    tags: ['community', 'heritage', 'apparel'],
    rating: 4.9,
    reviews: 234,
    inStock: true
  },
  {
    id: 'vop-002',
    name: '50 Year Celebration Art Print',
    nameHebrew: 'הדפס אמנות 50 שנה',
    vendor: 'VOP Shop',
    vendorId: 'vop-shop',
    category: 'home-decor',
    subcategory: 'art',
    price: 120,
    image: '/images/vendors/vop_shop_heritage_home_decor_product_06_50_year_celebration_cultural_art_community_pride.jpg',
    description: 'Limited edition art print celebrating 50 years of the Village of Peace. Museum quality printing.',
    servingSize: '16" x 20" (40cm x 50cm)',
    tags: ['limited-edition', 'art', 'celebration'],
    rating: 5.0,
    reviews: 45,
    inStock: true,
    badge: 'Limited Edition'
  },
  {
    id: 'vop-003',
    name: 'Holistic Wellness Book Bundle',
    nameHebrew: 'ערכת ספרי בריאות הוליסטית',
    vendor: 'VOP Shop',
    vendorId: 'vop-shop',
    category: 'books',
    subcategory: 'wellness',
    price: 180,
    image: '/images/vendors/vop_shop_wellness_education_product_11_healing_books_holistic_health_community_wisdom.jpg',
    description: 'Collection of wellness books by community elders sharing 50+ years of holistic health wisdom.',
    tags: ['educational', 'wellness', 'wisdom'],
    rating: 4.8,
    reviews: 78,
    inStock: true
  }
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByVendor(vendorId: string): Product[] {
  return products.filter(p => p.vendorId === vendorId);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.vendor.toLowerCase().includes(lowercaseQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Categories for filtering
export const categories = [
  { id: 'all', name: 'All Products', icon: 'fa-th' },
  { id: 'meat-alternatives', name: 'Meat Alternatives', icon: 'fa-drumstick-bite' },
  { id: 'tofu-products', name: 'Tofu Products', icon: 'fa-cube' },
  { id: 'desserts', name: 'Desserts', icon: 'fa-ice-cream' },
  { id: 'prepared-foods', name: 'Prepared Foods', icon: 'fa-utensils' },
  { id: 'chocolates', name: 'Chocolates', icon: 'fa-candy-cane' },
  { id: 'cheese-alternatives', name: 'Cheese Alternatives', icon: 'fa-cheese' },
  { id: 'beverages', name: 'Beverages', icon: 'fa-glass-water' },
  { id: 'fermented-foods', name: 'Fermented Foods', icon: 'fa-jar' },
  { id: 'apparel', name: 'Apparel', icon: 'fa-tshirt' },
  { id: 'home-decor', name: 'Home & Gifts', icon: 'fa-gift' },
  { id: 'books', name: 'Books & Media', icon: 'fa-book' }
];

// Dietary filters
export const dietaryOptions = [
  'Gluten-Free',
  'Organic', 
  'Raw',
  'Sugar-Free',
  'Nut-Free',
  'Soy-Free'
];