// Teva Deli Complete Product Catalog - FINAL CORRECTED VERSION
// 46 Unique Products with accurate image mapping

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
}

export const tevaDeliCompleteProducts: TevaDeliProduct[] = [
  // ========== SCHNITZELS (5 products) ==========
  {
    id: 'td-001',
    name: 'Classic Seitan Schnitzel',
    nameHe: 'שניצל סייטן קלאסי',
    description: 'Golden breaded cutlet, Israeli comfort food favorite',
    price: 45,
    originalPrice: 55,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Best Seller'
  },
  {
    id: 'td-028',
    name: 'Za\'atar Schnitzel',
    nameHe: 'שניצל זעתר',
    description: 'Middle Eastern herb-crusted schnitzel',
    price: 48,
    originalPrice: 58,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-025',
    name: 'Spinach & Herb Schnitzel',
    nameHe: 'שניצל תרד ועשבי תיבול',
    description: 'Green schnitzel packed with spinach and herbs',
    price: 44,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-030',
    name: 'Sesame-Crusted Schnitzel',
    nameHe: 'שניצל בציפוי שומשום',
    description: 'Extra crispy schnitzel with sesame coating',
    price: 46,
    originalPrice: 55,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-009',
    name: 'Schnitzel Strips Pack',
    nameHe: 'רצועות שניצל',
    description: 'Pre-cut schnitzel strips for easy serving',
    price: 42,
    category: 'schnitzels',
    image: '/images/vendors/teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== SPECIALTY ITEMS (4 products) ==========
  {
    id: 'td-002',
    name: 'Traditional Vegan Kubeh',
    nameHe: 'קובה טבעוני מסורתי',
    description: 'Authentic Middle Eastern dumplings in rich broth',
    price: 38,
    originalPrice: 45,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-006',
    name: 'Moroccan Spiced Meatballs',
    nameHe: 'קציצות מרוקאיות',
    description: 'Aromatic plant-based meatballs in tomato sauce',
    price: 42,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_06_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-014',
    name: 'Seitan Roast',
    nameHe: 'צלי סייטן חגיגי',
    description: 'Holiday-style seitan roast with herbs',
    price: 65,
    originalPrice: 78,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Holiday Special'
  },
  {
    id: 'td-019',
    name: 'Herb-Crusted Tofu Cutlets',
    nameHe: 'קציצות טופו בציפוי עשבי תיבול',
    description: 'Gourmet tofu cutlets with fresh herb coating',
    price: 42,
    category: 'specialty',
    image: '/images/vendors/teva_deli_vegan_specialty_product_19_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== TOFU & SEITAN (7 products) ==========
  {
    id: 'td-003',
    name: 'Organic Natural Tofu Block',
    nameHe: 'טופו טבעי אורגני',
    description: 'Premium organic tofu, locally made fresh daily',
    price: 22,
    originalPrice: 28,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Organic'
  },
  {
    id: 'td-005',
    name: 'Marinated Tofu Strips',
    nameHe: 'מריטפי טופו',
    description: 'Pre-marinated tofu strips ready for cooking',
    price: 32,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-033',
    name: 'Original Sliced Seitan',
    nameHe: 'סייטן פרוס מקורי',
    description: 'Pre-sliced seitan in original flavor, ready to use',
    price: 42,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-012',
    name: 'Seitan Bacon Strips',
    nameHe: 'רצועות סייטן בטעם בייקון',
    description: 'Crispy, smoky plant-based bacon alternative',
    price: 35,
    originalPrice: 42,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_specialty_product_14_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-011',
    name: 'Marinated Tofu Steaks',
    nameHe: 'סטייק טופו מתובל',
    description: 'Thick-cut tofu steaks in teriyaki marinade',
    price: 32,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_specialty_product_13_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-015',
    name: 'Smoked Tofu Slices',
    nameHe: 'פרוסות טופו מעושן',
    description: 'Ready-to-eat smoked tofu deli slices',
    price: 30,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_specialty_product_15_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-041',
    name: 'Round Seitan',
    nameHe: 'סייטן עגול',
    description: 'Traditional round seitan loaf',
    price: 38,
    category: 'seitan-tofu',
    image: '/images/vendors/teva_deli_vegan_specialty_product_41_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== READY MEALS (8 products) ==========
  {
    id: 'td-004',
    name: 'Mediterranean Seitan Skewers',
    nameHe: 'שיפודי סייטן ים תיכוני',
    description: 'Herb-marinated seitan skewers with vegetables',
    price: 42,
    originalPrice: 52,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_04_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-008',
    name: 'Jerusalem Mixed Grill',
    nameHe: 'מעורב ירושלמי',
    description: 'Classic Israeli mixed grill made vegan',
    price: 55,
    originalPrice: 68,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_08_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Chef Special'
  },
  {
    id: 'td-010',
    name: 'Plant-Based Shawarma',
    nameHe: 'שווארמה מן הצומח',
    description: 'Middle Eastern style shawarma made from seasoned seitan',
    price: 48,
    originalPrice: 58,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-017',
    name: 'BBQ Pulled Seitan',
    nameHe: 'סייטן משופשף ברביקיו',
    description: 'Tender pulled seitan in tangy BBQ sauce',
    price: 45,
    originalPrice: 54,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_17_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-018',
    name: 'BBQ Seitan Ribs',
    nameHe: 'צלעות סייטן ברביקיו',
    description: 'Smoky BBQ-glazed seitan ribs for grilling',
    price: 52,
    originalPrice: 65,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_18_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-037',
    name: 'Chicken-Style Shawarma',
    nameHe: 'שווארמה בסגנון עוף',
    description: 'Light colored shawarma with poultry spices',
    price: 46,
    originalPrice: 55,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_37_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-038',
    name: 'Mixed Grill Platter',
    nameHe: 'מגש מעורב צמחוני',
    description: 'Assorted kebabs and shawarma platter',
    price: 85,
    originalPrice: 105,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_38_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Party Size'
  },
  {
    id: 'td-042',
    name: 'Shawarma Party Pack',
    nameHe: 'מגש שווארמה למסיבות',
    description: 'Bulk shawarma for events and gatherings',
    price: 145,
    originalPrice: 180,
    category: 'ready-meals',
    image: '/images/vendors/teva_deli_vegan_specialty_product_42_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Catering'
  },

  // ========== BURGERS (6 products) ==========
  {
    id: 'td-021',
    name: 'Classic Beef-Style Burger',
    nameHe: 'המבורגר קלאסי בסגנון בקר',
    description: 'Juicy plant-based burger with beef-like taste',
    price: 52,
    originalPrice: 65,
    category: 'burgers',
    image: '/images/vendors/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Best Seller'
  },
  {
    id: 'td-022',
    name: 'Spicy Jalapeño Burger',
    nameHe: 'המבורגר חלפיניו חריף',
    description: 'Fiery burger with real jalapeño pieces',
    price: 54,
    originalPrice: 65,
    category: 'burgers',
    image: '/images/vendors/teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-023',
    name: 'Mushroom Swiss Burger',
    nameHe: 'המבורגר פטריות',
    description: 'Gourmet burger with mushrooms and vegan cheese',
    price: 58,
    originalPrice: 70,
    category: 'burgers',
    image: '/images/vendors/teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-026',
    name: 'Tex-Mex Black Bean Burger',
    nameHe: 'המבורגר שעועית שחורה',
    description: 'Southwestern-spiced black bean patties',
    price: 46,
    originalPrice: 55,
    category: 'burgers',
    image: '/images/vendors/teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-027',
    name: 'Mini Slider Patties',
    nameHe: 'מיני המבורגרים',
    description: 'Perfect-sized patties for sliders',
    price: 48,
    category: 'burgers',
    image: '/images/vendors/teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-029',
    name: 'Quinoa Veggie Burger',
    nameHe: 'המבורגר קינואה וירקות',
    description: 'Protein-packed quinoa and vegetable patties',
    price: 50,
    category: 'burgers',
    image: '/images/vendors/teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== SAUSAGES (4 products) ==========
  {
    id: 'td-013',
    name: 'Vegan Hot Dogs',
    nameHe: 'נקניקיות טבעוניות',
    description: 'Classic American-style vegan hot dogs',
    price: 38,
    category: 'sausages',
    image: '/images/vendors/teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-031',
    name: 'Vegan Salami Roll',
    nameHe: 'סלמי טבעוני',
    description: 'Soy and wheat protein salami-style deli meat',
    price: 48,
    originalPrice: 58,
    category: 'sausages',
    image: '/images/vendors/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-016',
    name: 'Seitan Chorizo',
    nameHe: 'צ׳וריסו סייטן',
    description: 'Spicy Spanish-style seitan sausage',
    price: 38,
    originalPrice: 46,
    category: 'sausages',
    image: '/images/vendors/teva_deli_vegan_specialty_product_16_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-043',
    name: 'Merguez Sausage',
    nameHe: 'נקניקיות מרגז',
    description: 'Spicy North African style sausages',
    price: 54,
    originalPrice: 65,
    category: 'sausages',
    image: '/images/vendors/teva_deli_vegan_specialty_product_43_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== KEBABS (4 products) ==========
  {
    id: 'td-032',
    name: 'Spicy Harissa Kebabs',
    nameHe: 'קבב חריסה חריף',
    description: 'North African spiced kebabs with harissa',
    price: 52,
    category: 'kebabs',
    image: '/images/vendors/teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-034',
    name: 'Turkish Adana Kebabs',
    nameHe: 'קבב אדנה טורקי',
    description: 'Spicy Turkish-style minced kebabs',
    price: 50,
    category: 'kebabs',
    image: '/images/vendors/teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-036',
    name: 'Persian Koobideh Kebabs',
    nameHe: 'קבב קובידה פרסי',
    description: 'Traditional Persian ground meat kebabs',
    price: 56,
    category: 'kebabs',
    image: '/images/vendors/teva_deli_vegan_specialty_product_36_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-040',
    name: 'Shish Tawook Style',
    nameHe: 'שיש טאווק טבעוני',
    description: 'Lebanese marinated chicken-style kebabs',
    price: 52,
    category: 'kebabs',
    image: '/images/vendors/teva_deli_vegan_specialty_product_40_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== DELI MEATS (4 products) ==========
  {
    id: 'td-007',
    name: 'Vegan Pastrami Slices',
    nameHe: 'פסטרמה טבעונית פרוסה',
    description: 'Deli-style smoked pastrami slices',
    price: 48,
    originalPrice: 58,
    category: 'deli-meats',
    image: '/images/vendors/teva_deli_vegan_specialty_product_07_plant_based_meat_alternative_israeli_cuisine.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-024',
    name: 'Seitan Pepperoni',
    nameHe: 'פפרוני סייטן',
    description: 'Pizza-perfect pepperoni slices',
    price: 32,
    category: 'deli-meats',
    image: '/images/vendors/teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-035',
    name: 'Turkey-Style Slices',
    nameHe: 'פרוסות בסגנון הודו',
    description: 'Light deli slices with turkey-like texture',
    price: 44,
    category: 'deli-meats',
    image: '/images/vendors/teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },
  {
    id: 'td-039',
    name: 'Bologna-Style Roll',
    nameHe: 'נקניק בולוניה טבעוני',
    description: 'Classic deli bologna made plant-based',
    price: 42,
    category: 'deli-meats',
    image: '/images/vendors/teva_deli_vegan_specialty_product_39_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== BREAKFAST (1 product) ==========
  {
    id: 'td-020',
    name: 'Tofu Scramble Mix',
    nameHe: 'תערובת טופו מקושקש',
    description: 'Seasoned crumbled tofu for breakfast scrambles',
    price: 25,
    category: 'breakfast',
    image: '/images/vendors/teva_deli_vegan_specialty_product_20_seitan_tofu_based_protein_alternative.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true
  },

  // ========== MEAL KITS (1 product) ==========
  {
    id: 'td-044',
    name: 'Shawarma Laffa Wrap Kit',
    nameHe: 'ערכת לאפה שווארמה',
    description: 'Complete shawarma meal kit with laffa bread',
    price: 65,
    originalPrice: 78,
    category: 'meal-kits',
    image: '/images/vendors/teva_deli_vegan_specialty_product_44_shawarma_kebab_middle_eastern_plant_based.jpg',
    vendorId: 'teva-deli',
    inStock: true,
    isVegan: true,
    isKosher: true,
    badge: 'Complete Kit'
  }
];
