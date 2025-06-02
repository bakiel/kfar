// Teva Deli Complete Product Catalog
// Integrated with vendor admin system for dynamic management

export interface TevaDeligProduct {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images: string[];
  vendor: string;
  vendorId: string;
  vendorLogo: string;
  sku: string;
  barcode?: string;
  inStock: boolean;
  stockQuantity: number;
  unit: string;
  minimumOrder: number;
  tags: string[];
  features: string[];
  specifications: Array<{
    label: string;
    value: string;
  }>;
  kashrut: string;
  organic: boolean;
  vegan: boolean;
  glutenFree: boolean;
  rating?: number;
  reviewCount?: number;
  preparationTime?: string;
  servingSize?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  allergens?: string[];
  shippingInfo: {
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    localPickup: boolean;
    delivery: boolean;
    international: boolean;
    refrigerated: boolean;
  };
  adminSettings: {
    featured: boolean;
    displayOrder: number;
    published: boolean;
    seoTitle?: string;
    seoDescription?: string;
    lastUpdated: string;
    updatedBy: string;
  };
}

// Product categories for Teva Deli
export const TEVA_DELI_CATEGORIES = {
  'schnitzels': {
    name: 'Schnitzels & Cutlets',
    nameHe: 'שניצלים וקציצות',
    icon: 'fa-drumstick-bite',
    description: 'Breaded plant-based cutlets'
  },
  'burgers': {
    name: 'Burgers & Patties',
    nameHe: 'המבורגרים וקציצות',
    icon: 'fa-hamburger',
    description: 'Plant-based burger patties'
  },
  'shawarma-kebab': {
    name: 'Shawarma & Kebabs',
    nameHe: 'שווארמה וקבב',
    icon: 'fa-pepper-hot',
    description: 'Middle Eastern specialties'
  },
  'sausages': {
    name: 'Sausages & Hot Dogs',
    nameHe: 'נקניקיות',
    icon: 'fa-hotdog',
    description: 'Plant-based sausages'
  },
  'deli-meats': {
    name: 'Deli Slices',
    nameHe: 'פרוסות דלי',
    icon: 'fa-bacon',
    description: 'Sliced deli alternatives'
  },
  'tofu-seitan': {
    name: 'Tofu & Seitan',
    nameHe: 'טופו וסייטן',
    icon: 'fa-cube',
    description: 'Basic protein blocks'
  },
  'ready-meals': {
    name: 'Ready Meals',
    nameHe: 'מנות מוכנות',
    icon: 'fa-utensils',
    description: 'Heat and serve meals'
  },
  'specialty': {
    name: 'Specialty Items',
    nameHe: 'מוצרים מיוחדים',
    icon: 'fa-star',
    description: 'Unique Israeli specialties'
  }
};

// Complete Teva Deli product catalog
export const tevaDeliProducts: TevaDeligProduct[] = [
  // HERO PRODUCTS (Currently Active)
  {
    id: 'td-001',
    name: 'Classic Seitan Schnitzel',
    nameHe: 'שניצל סייטן קלאסי',
    description: 'Golden breaded cutlet, Israeli comfort food favorite',
    longDescription: 'Our signature seitan schnitzel is the ultimate Israeli comfort food made vegan. Each cutlet is carefully crafted from premium wheat protein, seasoned with our secret spice blend, and coated in crispy golden breadcrumbs. Perfect for a quick dinner, sandwich filling, or cut into strips for salads.',
    price: 45,
    originalPrice: 55,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    images: [
      '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg'
    ],
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    sku: 'TD-SCH-001',
    barcode: '7290000000001',
    inStock: true,
    stockQuantity: 150,
    unit: 'pack',
    minimumOrder: 1,
    tags: ['schnitzel', 'seitan', 'breaded', 'israeli', 'comfort-food', 'best-seller'],
    features: ['Ready to heat', 'Family size', 'Kid-friendly'],
    specifications: [
      { label: 'Package Size', value: '4 pieces' },
      { label: 'Weight', value: '400g' },
      { label: 'Preparation', value: 'Pan fry 3-4 min each side' },
      { label: 'Shelf Life', value: '5 days refrigerated' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.9,
    reviewCount: 342,
    preparationTime: '8 minutes',
    servingSize: '1 piece (100g)',
    ingredients: ['Wheat protein (seitan)', 'Breadcrumbs', 'Spices', 'Salt', 'Vegetable oil'],
    nutritionalInfo: {
      calories: 220,
      protein: 18,
      carbs: 24,
      fat: 8,
      fiber: 2
    },
    allergens: ['Gluten', 'Wheat'],
    shippingInfo: {
      weight: 0.4,
      localPickup: true,
      delivery: true,
      international: false,
      refrigerated: true
    },
    adminSettings: {
      featured: true,
      displayOrder: 1,
      published: true,
      seoTitle: 'Vegan Schnitzel - Israeli Plant-Based Comfort Food',
      seoDescription: 'Classic Israeli schnitzel made from seitan. Golden, crispy, and delicious plant-based alternative.',
      lastUpdated: '2025-01-27',
      updatedBy: 'admin'
    }
  },
  {
    id: 'td-002',
    name: 'Traditional Vegan Kubeh',
    nameHe: 'קובה טבעוני מסורתי',
    description: 'Authentic Middle Eastern dumplings in rich broth',
    longDescription: 'Experience the authentic taste of Middle Eastern cuisine with our vegan kubeh. These traditional dumplings are filled with seasoned plant-based meat and herbs, served in a rich vegetable broth. A cherished recipe passed down through generations, now made accessible to everyone.',
    price: 38,
    originalPrice: 45,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    images: [
      '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg'
    ],
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    sku: 'TD-KUB-001',
    barcode: '7290000000002',
    inStock: true,
    stockQuantity: 80,
    unit: 'container',
    minimumOrder: 1,
    tags: ['kubeh', 'middle-eastern', 'soup', 'traditional', 'comfort-food'],
    features: ['Authentic recipe', 'Ready to heat', 'Complete meal'],
    specifications: [
      { label: 'Container Size', value: '500ml' },
      { label: 'Dumplings', value: '6 pieces' },
      { label: 'Preparation', value: 'Heat 5-7 minutes' },
      { label: 'Shelf Life', value: '3 days refrigerated' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.8,
    reviewCount: 156,
    preparationTime: '7 minutes',
    servingSize: '1 container',
    ingredients: ['Semolina', 'Plant protein', 'Vegetables', 'Herbs', 'Spices', 'Vegetable broth'],
    nutritionalInfo: {
      calories: 280,
      protein: 12,
      carbs: 38,
      fat: 10,
      fiber: 4
    },
    allergens: ['Gluten', 'Wheat'],
    shippingInfo: {
      weight: 0.5,
      localPickup: true,
      delivery: true,
      international: false,
      refrigerated: true
    },
    adminSettings: {
      featured: true,
      displayOrder: 2,
      published: true,
      seoTitle: 'Vegan Kubeh - Traditional Middle Eastern Dumplings',
      seoDescription: 'Authentic kubeh dumplings made vegan. Traditional Middle Eastern comfort food.',
      lastUpdated: '2025-01-27',
      updatedBy: 'admin'
    }
  },
  
  // BURGERS & PATTIES
  {
    id: 'td-021',
    name: 'Classic Vegan Burger Patty',
    nameHe: 'קציצת המבורגר טבעונית קלאסית',
    description: 'Juicy plant-based burger patty with authentic grilled flavor',
    longDescription: 'Our classic burger patty delivers the perfect burger experience. Made from a blend of plant proteins, each patty is seasoned to perfection and designed to satisfy even the most devoted burger lovers. Grill, pan-fry, or BBQ for best results.',
    price: 52,
    originalPrice: 65,
    category: 'burgers',
    image: '/images/vendors/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
    images: [
      '/images/vendors/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
      '/images/vendors/teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg'
    ],
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    sku: 'TD-BRG-001',
    barcode: '7290000000021',
    inStock: true,
    stockQuantity: 200,
    unit: 'pack',
    minimumOrder: 1,
    tags: ['burger', 'patty', 'grill', 'bbq', 'american-style'],
    features: ['Grill marks', 'Juicy texture', 'High protein'],
    specifications: [
      { label: 'Package Size', value: '4 patties' },
      { label: 'Weight', value: '480g (120g each)' },
      { label: 'Preparation', value: 'Grill 4-5 min each side' },
      { label: 'Shelf Life', value: '7 days refrigerated' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.7,
    reviewCount: 289,
    preparationTime: '10 minutes',
    servingSize: '1 patty (120g)',
    ingredients: ['Pea protein', 'Wheat protein', 'Coconut oil', 'Spices', 'Natural flavors'],
    nutritionalInfo: {
      calories: 250,
      protein: 20,
      carbs: 15,
      fat: 14,
      fiber: 3
    },
    allergens: ['Gluten', 'Wheat'],
    shippingInfo: {
      weight: 0.48,
      localPickup: true,
      delivery: true,
      international: false,
      refrigerated: true
    },
    adminSettings: {
      featured: true,
      displayOrder: 3,
      published: true,
      seoTitle: 'Vegan Burger Patties - Plant-Based Grill Ready',
      seoDescription: 'Juicy vegan burger patties perfect for grilling. High protein plant-based alternative.',
      lastUpdated: '2025-01-27',
      updatedBy: 'admin'
    }
  },
  
  // SHAWARMA & KEBABS
  {
    id: 'td-031',
    name: 'Spicy Shawarma Strips',
    nameHe: 'רצועות שווארמה חריפות',
    description: 'Authentic Middle Eastern shawarma with perfect spice blend',
    longDescription: 'Bring the taste of the Middle Eastern street food home with our shawarma strips. Marinated in traditional spices including cumin, coriander, and paprika, these strips are perfect for pita sandwiches, salads, or rice bowls.',
    price: 48,
    originalPrice: 58,
    category: 'shawarma-kebab',
    image: '/images/vendors/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
    images: [
      '/images/vendors/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
      '/images/vendors/teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg'
    ],
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    sku: 'TD-SHW-001',
    barcode: '7290000000031',
    inStock: true,
    stockQuantity: 120,
    unit: 'pack',
    minimumOrder: 1,
    tags: ['shawarma', 'middle-eastern', 'spicy', 'street-food'],
    features: ['Pre-marinated', 'Restaurant quality', 'Authentic spices'],
    specifications: [
      { label: 'Package Size', value: '300g' },
      { label: 'Preparation', value: 'Pan fry 5-6 minutes' },
      { label: 'Spice Level', value: 'Medium-Hot' },
      { label: 'Shelf Life', value: '5 days refrigerated' }
    ],
    kashrut: 'Badatz',
    organic: false,
    vegan: true,
    glutenFree: false,
    rating: 4.8,
    reviewCount: 198,
    preparationTime: '6 minutes',
    servingSize: '100g',
    ingredients: ['Wheat protein', 'Shawarma spice blend', 'Onion', 'Garlic', 'Lemon juice'],
    nutritionalInfo: {
      calories: 180,
      protein: 22,
      carbs: 8,
      fat: 7,
      fiber: 2
    },
    allergens: ['Gluten', 'Wheat'],
    shippingInfo: {
      weight: 0.3,
      localPickup: true,
      delivery: true,
      international: false,
      refrigerated: true
    },
    adminSettings: {
      featured: true,
      displayOrder: 4,
      published: true,
      seoTitle: 'Vegan Shawarma - Authentic Middle Eastern Plant-Based',
      seoDescription: 'Spicy vegan shawarma strips with authentic Middle Eastern flavors.',
      lastUpdated: '2025-01-27',
      updatedBy: 'admin'
    }
  },
  
  // TOFU & SEITAN BASICS
  {
    id: 'td-003',
    name: 'Organic Natural Tofu Block',
    nameHe: 'טופו טבעי אורגני',
    description: 'Premium organic tofu, locally made fresh daily',
    longDescription: 'Our organic tofu is made fresh daily from premium non-GMO soybeans. With its firm texture and neutral taste, it\'s perfect for marinating, grilling, stir-frying, or adding to any dish. A versatile protein source for endless culinary possibilities.',
    price: 22,
    originalPrice: 28,
    category: 'tofu-seitan',
    image: '/images/vendors/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
    images: [
      '/images/vendors/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png'
    ],
    vendor: 'Teva Deli',
    vendorId: 'teva-deli',
    vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    sku: 'TD-TFU-001',
    barcode: '7290000000003',
    inStock: true,
    stockQuantity: 300,
    unit: 'block',
    minimumOrder: 1,
    tags: ['tofu', 'organic', 'protein', 'basic', 'versatile'],
    features: ['Organic certified', 'High protein', 'Non-GMO'],
    specifications: [
      { label: 'Weight', value: '350g' },
      { label: 'Type', value: 'Firm tofu' },
      { label: 'Storage', value: 'Keep refrigerated' },
      { label: 'Shelf Life', value: '10 days unopened' }
    ],
    kashrut: 'Badatz',
    organic: true,
    vegan: true,
    glutenFree: true,
    rating: 4.6,
    reviewCount: 234,
    preparationTime: 'Varies',
    servingSize: '100g',
    ingredients: ['Organic soybeans', 'Water', 'Nigari (magnesium chloride)'],
    nutritionalInfo: {
      calories: 70,
      protein: 8,
      carbs: 2,
      fat: 4,
      fiber: 1
    },
    allergens: ['Soy'],
    shippingInfo: {
      weight: 0.35,
      localPickup: true,
      delivery: true,
      international: false,
      refrigerated: true
    },
    adminSettings: {
      featured: false,
      displayOrder: 10,
      published: true,
      seoTitle: 'Organic Tofu - Fresh Israeli Made Plant Protein',
      seoDescription: 'Fresh organic tofu made daily. High protein, versatile plant-based ingredient.',
      lastUpdated: '2025-01-27',
      updatedBy: 'admin'
    }
  },
  
  // Additional products would continue here...
  // Including all 48 products with proper categorization
];

// Vendor admin integration functions
export const tevaDeliAdminConfig = {
  vendorId: 'teva-deli',
  vendorName: 'Teva Deli',
  vendorNameHe: 'טבע דלי',
  
  // Dynamic product management
  getProductById: (productId: string) => {
    return tevaDeliProducts.find(p => p.id === productId);
  },
  
  // Get products by category
  getProductsByCategory: (category: string) => {
    return tevaDeliProducts.filter(p => p.category === category);
  },
  
  // Get featured products
  getFeaturedProducts: () => {
    return tevaDeliProducts.filter(p => p.adminSettings.featured);
  },
  
  // Search products
  searchProducts: (query: string) => {
    const searchTerm = query.toLowerCase();
    return tevaDeliProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.nameHe.includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.includes(searchTerm))
    );
  },
  
  // Get low stock products for admin alerts
  getLowStockProducts: (threshold: number = 50) => {
    return tevaDeliProducts.filter(p => p.stockQuantity < threshold);
  },
  
  // Calculate total inventory value
  getInventoryValue: () => {
    return tevaDeliProducts.reduce((total, product) => {
      return total + (product.price * product.stockQuantity);
    }, 0);
  },
  
  // Get product analytics
  getProductAnalytics: (productId: string) => {
    const product = tevaDeliProducts.find(p => p.id === productId);
    if (!product) return null;
    
    return {
      views: Math.floor(Math.random() * 1000) + 100, // Mock data
      addedToCart: Math.floor(Math.random() * 100) + 20,
      purchased: Math.floor(Math.random() * 50) + 10,
      revenue: product.price * (Math.floor(Math.random() * 50) + 10),
      conversionRate: `${(Math.random() * 10 + 5).toFixed(1)}%`
    };
  }
};

// Export for vendor admin integration
export default {
  products: tevaDeliProducts,
  categories: TEVA_DELI_CATEGORIES,
  adminConfig: tevaDeliAdminConfig
};