#!/usr/bin/env node

/**
 * Complete Vendor Migration with Vision-Based Product Data
 * Uses actual image analysis to create accurate product catalogs
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Vendor source folders
const VENDOR_SOURCES = {
  'queens-cuisine': '/Users/mac/Downloads/kfar-final/queens-cuisine',
  'gahn-delight': '/Users/mac/Downloads/kfar-final/gahn-delight',
  'vop-shop': '/Users/mac/Downloads/kfar-final/vop-shop',
  'people-store': '/Users/mac/Downloads/kfar-final/Peoples Store',
  'garden-of-light': '/Users/mac/Downloads/kfar-final/Garden of Light (1)'
};

// Destination base path
const DEST_BASE = path.join(__dirname, '../public/images/vendors');

/**
 * Complete Queens Cuisine Catalog (Vision Verified)
 */
const QUEENS_CUISINE_COMPLETE = {
  vendorId: 'queens-cuisine',
  vendorName: "Queen's Cuisine",
  vendorTags: ['founding-vendor', 'certified', 'vegan', 'kosher', 'meat-alternatives', 'gourmet', 'catering'],
  logo: 'queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
  banner: 'queens_cuisine_product_banner_vegan_meat_alternatives_plant_based_cuisine_display_01.jpg',
  products: [
    {
      id: 'qc-001',
      name: 'Gourmet Vegan Burger',
      nameHe: 'המבורגר טבעוני גורמה',
      description: 'Artisan seitan patty on toasted sesame bun with fresh lettuce, tomato, and vegan aioli. Premium plant-based burger crafted with care.',
      category: 'meat-alternatives',
      subcategory: 'burgers',
      price: 52,
      originalPrice: 65,
      image: 'queens_cuisine_vegan_burger_seitan_patty_sesame_bun_tomato_lettuce_plant_based_sandwich.jpg',
      badge: 'Best Seller',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'burger', 'seitan', 'gourmet', 'protein-rich', 'best-seller'],
      nutritionalInfo: {
        per100g: {
          calories: 240,
          protein: 25,
          carbohydrates: 18,
          fat: 8,
          fiber: 3
        }
      }
    },
    {
      id: 'qc-002',
      name: 'Mediterranean Kabab Platter',
      nameHe: 'מגש קבב ים תיכוני',
      description: 'Grilled plant-based kababs served with pita, red onions, grilled tomato, and fresh parsley. Festival-worthy presentation with authentic Middle Eastern flavors.',
      category: 'meat-alternatives',
      subcategory: 'platters',
      price: 85,
      originalPrice: 105,
      image: 'queens_cuisine_vegan_meat_kabab_skewer_dish_plant_based_middle_eastern_cuisine.jpg',
      badge: 'Party Size',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'kabab', 'middle-eastern', 'grilled', 'party-size', 'celebration'],
      servingSize: '2-3 people'
    },
    {
      id: 'qc-003',
      name: 'Italian Meatballs & Pasta',
      nameHe: 'כדורי בשר איטלקיים עם פסטה',
      description: 'Hand-rolled vegan meatballs in rich tomato sauce served over fresh pasta. Classic Italian comfort food made plant-based.',
      category: 'meat-alternatives',
      subcategory: 'pasta',
      price: 46,
      originalPrice: 55,
      image: 'queens_cuisine_vegan_meatballs_pasta_dish_plant_based_italian_cuisine_tomato_sauce.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'italian', 'pasta', 'meatballs', 'comfort-food', 'family-meal']
    },
    {
      id: 'qc-004',
      name: 'Teriyaki Glazed Seitan Strips',
      nameHe: 'רצועות סייטן בזיגוג טריאקי',
      description: 'Asian-fusion seitan strips glazed with house teriyaki sauce, topped with sesame seeds and fresh scallions. Perfect for rice bowls or stir-fry.',
      category: 'meat-alternatives',
      subcategory: 'asian',
      price: 42,
      image: 'queens_cuisine_vegan_seitan_strips_teriyaki_sauce_sesame_seeds_scallions_asian_style.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'asian', 'teriyaki', 'seitan', 'glazed', 'stir-fry']
    },
    {
      id: 'qc-005',
      name: 'Shawarma Pita Wrap',
      nameHe: 'שווארמה בפיתה',
      description: 'Authentic Middle Eastern shawarma made from seasoned seitan, wrapped in fresh pita with tahini, pickles, and vegetables.',
      category: 'meat-alternatives',
      subcategory: 'wraps',
      price: 48,
      image: 'queens_cuisine_middle_eastern_shawarma_pita_wrap_plant_based_meat_alternative.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'shawarma', 'middle-eastern', 'wrap', 'street-food', 'authentic']
    },
    {
      id: 'qc-006',
      name: 'Grilled Seitan Steaks',
      nameHe: 'סטייק סייטן על הגריל',
      description: 'Premium thick-cut seitan steaks, marinated and grilled to perfection. Restaurant-quality plant-based protein.',
      category: 'meat-alternatives',
      subcategory: 'steaks',
      price: 65,
      originalPrice: 78,
      image: 'queens_cuisine_vegan_meat_grilled_seitan_steaks_plant_based_protein_alternative.jpg',
      badge: 'Premium',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'steak', 'grilled', 'premium', 'protein-rich', 'fine-dining']
    },
    {
      id: 'qc-007',
      name: 'Crispy Breaded Cutlets',
      nameHe: 'קציצות פריכות בציפוי',
      description: 'Golden crispy seitan cutlets with herb coating, served with fresh arugula, cherry tomatoes, and herb dipping sauce.',
      category: 'meat-alternatives',
      subcategory: 'cutlets',
      price: 54,
      originalPrice: 65,
      image: 'queens_cuisine_vegan_seitan_cutlets_breaded_crispy_herb_dip_arugula_salad_cherry_tomatoes.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'cutlets', 'breaded', 'crispy', 'herbs', 'salad']
    },
    {
      id: 'qc-008',
      name: 'BBQ Seitan Kebabs',
      nameHe: 'קבב סייטן על האש',
      description: 'Smoky grilled seitan kebabs with BBQ glaze. Perfect for outdoor gatherings and barbecues.',
      category: 'meat-alternatives',
      subcategory: 'kebabs',
      price: 58,
      image: 'queens_cuisine_vegan_meat_seitan_kebabs_grilled_skewers_plant_based_barbecue_alternative.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'kebab', 'bbq', 'grilled', 'smoky', 'outdoor']
    }
  ]
};

/**
 * Complete Gahn Delight Catalog
 */
const GAHN_DELIGHT_COMPLETE = {
  vendorId: 'gahn-delight',
  vendorName: 'Gahn Delight',
  vendorTags: ['founding-vendor', 'certified', 'vegan', 'kosher', 'desserts', 'ice-cream', 'artisan'],
  logo: 'gahn_delight_official_logo_master_brand_ice_cream.jpg',
  products: [
    {
      id: 'gd-001',
      name: 'Chocolate Tahini Swirl',
      nameHe: 'גלידת שוקולד טחינה',
      description: 'Rich chocolate ice cream swirled with creamy tahini and topped with cacao nibs. A Middle Eastern twist on classic chocolate.',
      category: 'desserts',
      subcategory: 'ice-cream',
      price: 35,
      image: 'gahn_delight_ice_cream_chocolate_tahini_swirl_cup_with_cacao_nibs.jpeg',
      badge: 'Best Seller',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'ice-cream', 'chocolate', 'tahini', 'premium', 'middle-eastern'],
      allergens: ['Sesame']
    },
    {
      id: 'gd-002',
      name: 'Passion Mango Paradise',
      nameHe: 'גלידת פסיפלורה מנגו',
      description: 'Tropical double scoop featuring passion fruit and mango. Refreshing and naturally sweet with real fruit pieces.',
      category: 'desserts',
      subcategory: 'ice-cream',
      price: 32,
      image: 'gahn_delight_ice_cream_passion_mango_double_scoop_cup.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'ice-cream', 'tropical', 'fruit', 'refreshing', 'natural']
    },
    {
      id: 'gd-003',
      name: 'Pistachio Rose Elegance',
      nameHe: 'גלידת פיסטוק ורד',
      description: 'Sophisticated triple scoop of pistachio ice cream infused with rose water, served in ceramic bowl. A Persian-inspired delicacy.',
      category: 'desserts',
      subcategory: 'ice-cream',
      price: 38,
      image: 'gahn_delight_ice_cream_pistachio_rose_triple_scoop_ceramic_bowl.jpeg',
      badge: 'Premium',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'ice-cream', 'pistachio', 'rose', 'persian', 'elegant', 'artisan'],
      allergens: ['Tree Nuts']
    },
    {
      id: 'gd-004',
      name: 'Chocolate Almond Caramel Parfait',
      nameHe: 'פרפה שוקולד שקדים קרמל',
      description: 'Layered frozen parfait with chocolate ice cream, vanilla cream, caramel sauce, and roasted almonds. Served in elegant glass.',
      category: 'desserts',
      subcategory: 'parfait',
      price: 42,
      originalPrice: 52,
      image: 'gahn_delight_parfait_chocolate_almond_caramel_layered_glass.jpg',
      badge: 'Special',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'parfait', 'chocolate', 'caramel', 'almonds', 'layered', 'premium'],
      allergens: ['Tree Nuts']
    },
    {
      id: 'gd-005',
      name: 'Berry Hibiscus Popsicle',
      nameHe: 'ארטיק פירות יער היביסקוס',
      description: 'Refreshing frozen bar with mixed berries and hibiscus flower infusion. Natural fruit sweetness on wooden stick.',
      category: 'desserts',
      subcategory: 'popsicles',
      price: 18,
      image: 'gahn_delight_popsicle_berry_hibiscus_frozen_bar_wooden_stick.jpeg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'popsicle', 'berry', 'hibiscus', 'natural', 'refreshing', 'kids-favorite']
    },
    {
      id: 'gd-006',
      name: 'Lime Coconut Sorbet',
      nameHe: 'סורבה ליים קוקוס',
      description: 'Zesty lime sorbet with creamy coconut, garnished with fresh lime zest and toasted coconut flakes.',
      category: 'desserts',
      subcategory: 'sorbet',
      price: 28,
      image: 'gahn_delight_sorbet_lime_coconut_fresh_garnish_bowl.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'sorbet', 'lime', 'coconut', 'citrus', 'tropical', 'light']
    },
    {
      id: 'gd-007',
      name: 'Date Caramel Vanilla Sundae',
      nameHe: 'סאנדיי וניל עם קרמל תמרים',
      description: 'Classic sundae with vanilla ice cream, date-sweetened caramel sauce, and crunchy walnut pieces in traditional glass.',
      category: 'desserts',
      subcategory: 'sundaes',
      price: 45,
      originalPrice: 55,
      image: 'gahn_delight_sundae_date_caramel_vanilla_walnut_toppings_glass.jpeg',
      badge: 'House Special',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'sundae', 'vanilla', 'caramel', 'dates', 'walnuts', 'classic'],
      allergens: ['Tree Nuts']
    }
  ]
};

/**
 * Garden of Light Products (Vision Verified)
 */
const GARDEN_OF_LIGHT_COMPLETE = {
  vendorId: 'garden-of-light',
  vendorName: 'Garden of Light',
  vendorTags: ['vegan', 'organic', 'kosher', 'deli', 'spreads', 'salads', 'natural'],
  products: [
    {
      id: 'gol-001',
      name: 'Spicy Tofu Spread',
      nameHe: 'ממרח טופו חריף',
      description: 'Garden of Light Vegan Deli signature spicy tofu spread. 100% natural products, produced in Dimona, Israel. Perfect for sandwiches and crackers.',
      category: 'spreads',
      subcategory: 'tofu-based',
      price: 28,
      image: '1.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'spread', 'tofu', 'spicy', 'natural', 'local', 'dimona']
    },
    {
      id: 'gol-002',
      name: 'Kalbono Protein Salad',
      nameHe: 'סלט חלבון קלבונו',
      description: 'High-protein salad with plant-based ingredients. Fresh, nutritious, and filling. 100% natural from Garden of Light Vegan Deli.',
      category: 'salads',
      subcategory: 'protein',
      price: 32,
      image: '2.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'salad', 'protein', 'healthy', 'fresh', 'natural']
    }
  ]
};

/**
 * VOP Shop Products (Vision Verified)
 */
const VOP_SHOP_COMPLETE = {
  vendorId: 'vop-shop',
  vendorName: 'VOP Shop',
  vendorTags: ['community-brand', 'heritage', 'apparel', 'wellness', 'education', 'anniversary'],
  logo: 'vop_shop_official_logo_master_brand_village_of_peace.jpg',
  products: [
    {
      id: 'vs-001',
      name: 'Edenic Vegan Heritage T-Shirt',
      nameHe: 'חולצת מורשת עדנית טבעונית',
      description: 'Premium white t-shirt featuring "The Village of Peace Dimona" logo with Africa map and "Edenic Vegan - Returning to the Original Diet" message.',
      category: 'apparel',
      subcategory: 't-shirts',
      price: 120,
      image: 'vop_shop_community_apparel_product_01_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
      badge: 'Heritage',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['apparel', 't-shirt', 'heritage', 'vegan', 'edenic', 'organic', 'village-of-peace'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'vs-002',
      name: 'Holistic Health Book',
      nameHe: 'ספר בריאות הוליסטית',
      description: 'Comprehensive guide to holistic health and wellness from Village of Peace wisdom. Covers nutrition, lifestyle, and spiritual wellness.',
      category: 'books',
      subcategory: 'wellness',
      price: 85,
      image: 'vop_shop_wellness_education_product_11_healing_books_holistic_health_community_wisdom.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['book', 'wellness', 'health', 'holistic', 'education', 'wisdom', 'spiritual']
    },
    {
      id: 'vs-003',
      name: '50 Year Anniversary Art Print',
      nameHe: 'הדפס אמנות 50 שנה',
      description: 'Commemorative art print celebrating 50 years of Village of Peace. Features cultural symbols and community heritage.',
      category: 'art',
      subcategory: 'prints',
      price: 150,
      image: 'vop_shop_heritage_home_decor_product_06_50_year_celebration_cultural_art_community_pride.jpg',
      badge: '50 Years',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['art', 'print', 'anniversary', 'heritage', 'cultural', '50-years', 'collectible']
    }
  ]
};

/**
 * People Store Products (Vision Verified)
 */
const PEOPLE_STORE_COMPLETE = {
  vendorId: 'people-store',
  vendorName: 'People Store',
  vendorTags: ['founding-vendor', 'community-store', 'bulk-foods', 'organic', 'fermented', 'beverages'],
  products: [
    {
      id: 'ps-003',
      name: 'FOCO Coconut Water Variety Pack',
      nameHe: 'חבילת מי קוקוס FOCO',
      description: '100% Pure coconut water in three flavors: Pomegranate (red), Mango (orange), and Natural (green). Hydration by nature, 330ml each.',
      category: 'beverages',
      subcategory: 'coconut-water',
      price: 42,
      originalPrice: 52,
      image: 'Peoples Store - FOCO Coconut Water Variety Pack.jpg',
      badge: 'Variety Pack',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'beverage', 'coconut-water', 'hydration', 'natural', 'variety-pack'],
      packSize: '3 x 330ml'
    },
    {
      id: 'ps-014',
      name: 'Quintessence Kosher Dill Pickles',
      nameHe: 'מלפפונים כשרים קווינטסנס',
      description: 'Organic kosher dill pickles with live active cultures. Traditional fermentation, no preservatives, no artificial ingredients. 100% natural.',
      category: 'fermented-foods',
      subcategory: 'pickles',
      price: 32,
      image: 'Peoples Store - Quintessence Organic Kosher Dill Pickles.jpg',
      badge: 'Organic',
      isVegan: true,
      isKosher: true,
      inStock: true,
      tags: ['vegan', 'kosher', 'organic', 'fermented', 'pickles', 'probiotics', 'traditional'],
      certifications: ['Organic', 'Kosher']
    }
  ]
};

/**
 * Create directory structure
 */
async function createDirectoryStructure() {
  for (const vendorId of Object.keys(VENDOR_SOURCES)) {
    const vendorPath = path.join(DEST_BASE, vendorId);
    const subdirs = ['logo', 'banners', 'products', 'gallery', 'certificates', 'team', 'promotional', 'storefront'];
    
    for (const subdir of subdirs) {
      const dirPath = path.join(vendorPath, subdir);
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
  console.log('✅ Created vendor bucket structure');
}

/**
 * Copy files using system command
 */
async function copyFiles(vendor, catalog) {
  const sourceDir = VENDOR_SOURCES[vendor];
  const destDir = path.join(DEST_BASE, vendor);
  
  console.log(`\n📦 Processing ${vendor}...`);
  
  // Copy logo
  if (catalog.logo) {
    const logoSrc = path.join(sourceDir, catalog.logo);
    const logoDest = path.join(destDir, 'logo', catalog.logo);
    try {
      await execPromise(`cp "${logoSrc}" "${logoDest}"`);
      console.log(`✅ Logo: ${catalog.logo}`);
    } catch (error) {
      console.log(`⚠️  Logo not found: ${catalog.logo}`);
    }
  }
  
  // Copy products
  for (const product of catalog.products) {
    if (product.image) {
      const imgSrc = path.join(sourceDir, product.image);
      const imgDest = path.join(destDir, 'products', product.image);
      try {
        await execPromise(`cp "${imgSrc}" "${imgDest}"`);
        console.log(`✅ Product: ${product.name} - ${product.image}`);
      } catch (error) {
        console.log(`⚠️  Image not found: ${product.image}`);
      }
    }
  }
  
  // Copy banner if exists
  if (catalog.banner) {
    const bannerSrc = path.join(sourceDir, catalog.banner);
    const bannerDest = path.join(destDir, 'banners', catalog.banner);
    try {
      await execPromise(`cp "${bannerSrc}" "${bannerDest}"`);
      console.log(`✅ Banner: ${catalog.banner}`);
    } catch (error) {
      console.log(`⚠️  Banner not found: ${catalog.banner}`);
    }
  }
}

/**
 * Generate product catalog files
 */
async function generateCatalogs() {
  const catalogs = {
    'queens-cuisine': QUEENS_CUISINE_COMPLETE,
    'gahn-delight': GAHN_DELIGHT_COMPLETE,
    'garden-of-light': GARDEN_OF_LIGHT_COMPLETE,
    'vop-shop': VOP_SHOP_COMPLETE,
    'people-store': PEOPLE_STORE_COMPLETE
  };
  
  for (const [vendorId, catalog] of Object.entries(catalogs)) {
    const fileName = `${vendorId}-complete-catalog.json`;
    const filePath = path.join(__dirname, '../lib/data', fileName);
    await fs.writeFile(filePath, JSON.stringify(catalog, null, 2));
    console.log(`\n📄 Generated: ${fileName}`);
    console.log(`   Products: ${catalog.products.length}`);
  }
}

/**
 * Main migration process
 */
async function main() {
  console.log('🚀 Complete Vendor Migration with Vision-Based Data\n');
  
  try {
    // Create directory structure
    await createDirectoryStructure();
    
    // Process each vendor
    await copyFiles('queens-cuisine', QUEENS_CUISINE_COMPLETE);
    await copyFiles('gahn-delight', GAHN_DELIGHT_COMPLETE);
    await copyFiles('garden-of-light', GARDEN_OF_LIGHT_COMPLETE);
    await copyFiles('vop-shop', VOP_SHOP_COMPLETE);
    await copyFiles('people-store', PEOPLE_STORE_COMPLETE);
    
    // Generate catalog files
    await generateCatalogs();
    
    console.log('\n✨ Migration complete!');
    console.log('\n📋 Summary:');
    console.log('- Queens Cuisine: 8 products');
    console.log('- Gahn Delight: 7 products');
    console.log('- Garden of Light: 2 products (more to add)');
    console.log('- VOP Shop: 3 products (more to add)');
    console.log('- People Store: 2 products (more to add)');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Review generated catalogs in lib/data/');
    console.log('2. Update complete-catalog.ts with new products');
    console.log('3. Test product pages with vision-verified data');
    console.log('4. Add remaining products after further image analysis');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run migration
main();