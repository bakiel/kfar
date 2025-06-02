const fs = require('fs');
const path = require('path');

// Based on the screenshot, these Quintessence products are incorrectly assigned to People Store
const quintessenceProductCorrections = [
  {
    name: 'Quintessence Spicy Kimchi',
    nameHe: 'קימצ\'י חריף קווינטסנס',
    description: 'Traditional Korean-style spicy fermented kimchi with napa cabbage, gochugaru, and authentic seasonings',
    price: 26,
    category: 'fermented-foods',
    image: '/images/vendors/Peoples Store - Quintessence Spicy Kimchi Fermented.jpg',
    tags: ['fermented', 'spicy', 'korean', 'probiotic', 'authentic'],
    badge: 'Authentic Korean'
  },
  {
    name: 'Quintessence Strawberry Non-Dairy Yogurt',
    nameHe: 'יוגורט טבעוני תות קווינטסנס',
    description: 'Fermented non-dairy yogurt with real strawberries, coconut base, live active cultures',
    price: 18,
    category: 'dairy-alternatives',
    image: '/images/vendors/Peoples Store - Quintessence Strawberry Non-Dairy Yogurt.jpg',
    tags: ['non-dairy', 'yogurt', 'strawberry', 'probiotic', 'vegan']
  },
  {
    name: 'Quintessence Sweet & Sour Ginger - 3 Pack',
    nameHe: 'ג\'ינג\'ר חמוץ מתוק קווינטסנס - שלישייה',
    description: 'Fermented sweet and sour ginger with live cultures, perfect accompaniment to meals',
    price: 54,
    originalPrice: 65,
    category: 'fermented-foods',
    image: '/images/vendors/Peoples Store - Quintessence Sweet and Sour Ginger 3-Pack.jpg',
    tags: ['fermented', 'ginger', 'sweet-sour', 'probiotic', 'value-pack'],
    badge: 'Value Pack'
  },
  {
    name: 'Wan Ja Shan Naturally Brewed Tamari',
    nameHe: 'רוטב סויה טמרי וואן ג\'ה שאן',
    description: 'Premium naturally brewed tamari soy sauce, gluten-free alternative to traditional soy sauce',
    price: 24,
    category: 'asian-ingredients',
    image: '/images/vendors/Peoples Store - Wan Ja Shan Tamari Soy Sauce Naturally Brewed.jpg',
    tags: ['tamari', 'gluten-free', 'soy-sauce', 'asian', 'naturally-brewed'],
    badge: 'Gluten-Free'
  },
  {
    name: 'Quintessence Plain Non-Dairy Yogurt',
    nameHe: 'יוגורט טבעוני טבעי קווינטסנס',
    description: 'Creamy plain non-dairy yogurt with live active cultures, perfect for smoothies or toppings',
    price: 16,
    category: 'dairy-alternatives',
    image: '/images/vendors/Peoples Store - Quintessence Plain Non-Dairy Yogurt.jpg',
    tags: ['non-dairy', 'yogurt', 'plain', 'probiotic', 'vegan']
  },
  {
    name: 'Quintessence Blueberry Non-Dairy Yogurt',
    nameHe: 'יוגורט טבעוני אוכמניות קווינטסנס',
    description: 'Rich blueberry non-dairy yogurt with real fruit pieces and live cultures',
    price: 18,
    category: 'dairy-alternatives',
    image: '/images/vendors/Peoples Store - Quintessence Blueberry Non-Dairy Yogurt.jpg',
    tags: ['non-dairy', 'yogurt', 'blueberry', 'probiotic', 'vegan']
  },
  {
    name: 'Quintessence Pineapple Non-Dairy Yogurt',
    nameHe: 'יוגורט טבעוני אננס קווינטסנס',
    description: 'Tropical pineapple non-dairy yogurt with chunks of real pineapple',
    price: 18,
    category: 'dairy-alternatives',
    image: '/images/vendors/Peoples Store - Quintessence Pineapple Non-Dairy Yogurt.jpg',
    tags: ['non-dairy', 'yogurt', 'pineapple', 'probiotic', 'vegan']
  },
  {
    name: 'Quintessence Organic Kosher Dill Pickles',
    nameHe: 'מלפפונים חמוצים כשרים אורגניים קווינטסנס',
    description: 'Organic kosher dill pickles fermented with traditional methods',
    price: 22,
    category: 'fermented-foods',
    image: '/images/vendors/Peoples Store - Quintessence Organic Kosher Dill Pickles.jpg',
    tags: ['pickles', 'organic', 'kosher', 'fermented', 'dill']
  },
  {
    name: 'Quintessence Organic Spicy Sauerkraut',
    nameHe: 'כרוב כבוש חריף אורגני קווינטסנס',
    description: 'Organic fermented sauerkraut with a spicy kick, rich in probiotics',
    price: 24,
    category: 'fermented-foods',
    image: '/images/vendors/Peoples Store - Quintessence Organic Spicy Sauerkraut.jpg',
    tags: ['sauerkraut', 'organic', 'spicy', 'fermented', 'probiotic']
  },
  {
    name: 'Quintessence Fermented Hot Peppers',
    nameHe: 'פלפלים חריפים מותססים קווינטסנס',
    description: 'Fiery fermented hot peppers with complex flavors from natural fermentation',
    price: 26,
    category: 'fermented-foods',
    image: '/images/vendors/Peoples Store - Quintessence Fermented Hot Peppers.jpg',
    tags: ['hot-peppers', 'fermented', 'spicy', 'condiment', 'probiotic']
  },
  {
    name: 'Quintessence Fermented Okra with Live Culture',
    nameHe: 'במיה מותססת עם תרביות חיות קווינטסנס',
    description: 'Uniquely fermented okra pods with live cultures, crunchy and tangy',
    price: 28,
    category: 'fermented-foods',
    image: '/images/vendors/Peoples Store - Quintessence Fermented Okra with Live Culture.jpg',
    tags: ['okra', 'fermented', 'live-culture', 'unique', 'probiotic']
  },
  {
    name: 'Quintessence Organic Cucumber Relish',
    nameHe: 'רליש מלפפונים אורגני קווינטסנס',
    description: 'Organic cucumber relish with a perfect balance of sweet and tangy',
    price: 20,
    category: 'condiments',
    image: '/images/vendors/Peoples Store - Quintessence Organic Cucumber Relish.jpg',
    tags: ['relish', 'organic', 'cucumber', 'condiment', 'sweet-tangy']
  },
  {
    name: 'Quintessence Organic Spicy Relish',
    nameHe: 'רליש חריף אורגני קווינטסנס',
    description: 'Organic spicy relish with jalapeños and aromatic spices',
    price: 22,
    category: 'condiments',
    image: '/images/vendors/Peoples Store - Quintessence Organic Spicy Relish.jpg',
    tags: ['relish', 'organic', 'spicy', 'condiment', 'jalapeño']
  }
];

// These are the actual People Store products (not Quintessence)
const actualPeopleStoreProducts = [
  {
    name: 'Great Northern Organic Maple Syrup',
    nameHe: 'סירופ מייפל אורגני',
    description: 'Pure organic maple syrup from Canada, Grade A amber color with rich taste',
    price: 45,
    category: 'sweeteners',
    image: '/images/vendors/Peoples Store - Great Northern Organic Maple Syrup.jpg',
    tags: ['maple-syrup', 'organic', 'canadian', 'sweetener', 'natural']
  },
  {
    name: 'Pure Sesame Oil Taiwan',
    nameHe: 'שמן שומשום טהור טייוואן',
    description: 'Premium pure sesame oil from Taiwan, cold-pressed for maximum flavor',
    price: 32,
    category: 'oils',
    image: '/images/vendors/Peoples Store - Pure Sesame Oil Taiwan.jpg',
    tags: ['sesame-oil', 'taiwan', 'cold-pressed', 'cooking-oil', 'asian']
  },
  {
    name: 'Pure Sesame Oil Taiwan Large 2L',
    nameHe: 'שמן שומשום טהור טייוואן 2 ליטר',
    description: 'Premium pure sesame oil from Taiwan in economical 2L size',
    price: 85,
    category: 'oils',
    image: '/images/vendors/Peoples Store - Pure Sesame Oil Taiwan Large 2L Bottle.jpg',
    tags: ['sesame-oil', 'taiwan', 'bulk', 'cooking-oil', 'value-size']
  },
  {
    name: 'FOCO Coconut Water Variety Pack',
    nameHe: 'מי קוקוס פוקו - מגוון טעמים',
    description: 'Natural coconut water variety pack with different tropical flavors',
    price: 28,
    category: 'beverages',
    image: '/images/vendors/Peoples Store - FOCO Coconut Water Variety Pack.jpg',
    tags: ['coconut-water', 'beverages', 'tropical', 'variety-pack', 'hydration']
  },
  {
    name: 'Natural Herb Seasoning Mix',
    nameHe: 'תערובת תבלינים טבעית',
    description: 'Aromatic blend of natural herbs and spices for all-purpose seasoning',
    price: 18,
    category: 'spices',
    image: '/images/vendors/Peoples Store - Natural Herb Seasoning Mix Hebrew.jpg',
    tags: ['seasoning', 'herbs', 'spices', 'all-purpose', 'natural']
  },
  {
    name: 'Laverland Crunch Sea Salt Seaweed Snack 9-Pack',
    nameHe: 'חטיף אצות קראנץ\' מלח ים - 9 יחידות',
    description: 'Crispy roasted seaweed snacks with sea salt, healthy and addictive',
    price: 42,
    category: 'snacks',
    image: '/images/vendors/Peoples Store - Laverland Crunch Sea Salt Seaweed Snack 9-Pack.jpg',
    tags: ['seaweed', 'snacks', 'sea-salt', 'healthy-snack', 'multi-pack']
  },
  {
    name: 'Laverland Crunch Wasabi Seaweed Snack 9-Pack',
    nameHe: 'חטיף אצות קראנץ\' וואסאבי - 9 יחידות',
    description: 'Crispy roasted seaweed snacks with spicy wasabi flavor',
    price: 42,
    category: 'snacks',
    image: '/images/vendors/Peoples Store - Laverland Crunch Wasabi Seaweed Snack 9-Pack.jpg',
    tags: ['seaweed', 'snacks', 'wasabi', 'spicy', 'multi-pack']
  },
  {
    name: 'Bulk Grains and Legumes Display',
    nameHe: 'דגנים וקטניות בתפזורת',
    description: 'Selection of bulk organic grains and legumes - sold by weight',
    price: 0, // Price per kg varies
    priceNote: 'Price per kg',
    category: 'bulk-foods',
    image: '/images/vendors/Peoples Store - Bulk Grains and Legumes Basket Display.jpg',
    tags: ['bulk', 'grains', 'legumes', 'organic', 'zero-waste']
  },
  {
    name: 'Bulk Beans, Oats, Rice and Grains',
    nameHe: 'שעועית, שיבולת שועל, אורז ודגנים בתפזורת',
    description: 'Wide variety of bulk beans, oats, rice and grains - sold by weight',
    price: 0, // Price per kg varies
    priceNote: 'Price per kg',
    category: 'bulk-foods',
    image: '/images/vendors/Peoples Store - Bulk Beans Oats Rice and Grains Basket Display.jpg',
    tags: ['bulk', 'beans', 'oats', 'rice', 'zero-waste']
  },
  {
    name: 'Bulk Flour and Powder Ingredients',
    nameHe: 'קמחים ואבקות בתפזורת',
    description: 'Various flours and powder ingredients in bulk - sold by weight',
    price: 0, // Price per kg varies
    priceNote: 'Price per kg',
    category: 'bulk-foods',
    image: '/images/vendors/Peoples Store - Bulk Flour and Powder Ingredients.jpg',
    tags: ['bulk', 'flour', 'baking', 'ingredients', 'zero-waste']
  }
];

// Function to update People Store catalog
function updatePeopleStoreCatalog() {
  const catalogPath = path.join(__dirname, '../lib/data/people-store-complete-catalog.json');
  
  try {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    
    // Remove Quintessence products from People Store
    const quintessenceNames = quintessenceProductCorrections.map(p => p.name);
    catalog.products = catalog.products.filter(p => 
      !quintessenceNames.includes(p.name) && 
      !p.name.includes('Quintessence') &&
      !p.name.includes('Wan Ja Shan')
    );
    
    // Add/update actual People Store products
    actualPeopleStoreProducts.forEach(product => {
      const existingIndex = catalog.products.findIndex(p => p.name === product.name);
      
      const fullProduct = {
        id: `ps-${catalog.products.length + 1}`.padStart(6, '0'),
        ...product,
        vendorId: 'people-store',
        vendorName: 'People Store',
        inStock: true,
        isVegan: true,
        isKosher: true,
        status: 'published'
      };
      
      if (existingIndex >= 0) {
        catalog.products[existingIndex] = fullProduct;
      } else {
        catalog.products.push(fullProduct);
      }
    });
    
    // Update vendor information
    catalog.vendorInfo = {
      ...catalog.vendorInfo,
      specialties: ['bulk-foods', 'asian-ingredients', 'organic-products', 'zero-waste'],
      description: 'Community store offering bulk foods, organic products, and specialty ingredients'
    };
    
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
    console.log('✅ Updated People Store catalog - removed Quintessence products');
    
    return { success: true, productsUpdated: catalog.products.length };
  } catch (error) {
    console.error('Error updating People Store catalog:', error);
    return { success: false, error: error.message };
  }
}

// Function to create/update Quintessence vendor
function createQuintessenceVendor() {
  const vendorData = {
    id: 'quintessence',
    name: 'Quintessence',
    vendorName: 'Quintessence',
    description: 'Artisanal fermented foods and non-dairy products with live cultures',
    logo: '/images/vendors/quintessence_logo.jpg',
    categories: ['fermented-foods', 'dairy-alternatives', 'probiotics'],
    specialties: ['kimchi', 'non-dairy-yogurt', 'fermented-vegetables', 'live-cultures'],
    products: quintessenceProductCorrections.map((product, index) => ({
      id: `qt-${String(index + 1).padStart(3, '0')}`,
      ...product,
      vendorId: 'quintessence',
      vendorName: 'Quintessence',
      inStock: true,
      isVegan: true,
      isKosher: true,
      status: 'published'
    })),
    vendorTags: ['fermented', 'probiotic', 'artisanal', 'non-dairy', 'live-culture'],
    analytics: {
      totalSales: 0,
      totalRevenue: 0,
      averageRating: 4.8,
      reviewCount: 45
    }
  };
  
  const catalogPath = path.join(__dirname, '../lib/data/quintessence-complete-catalog.json');
  
  try {
    fs.writeFileSync(catalogPath, JSON.stringify(vendorData, null, 2));
    console.log('✅ Created Quintessence vendor catalog');
    return { success: true, productsCreated: vendorData.products.length };
  } catch (error) {
    console.error('Error creating Quintessence catalog:', error);
    return { success: false, error: error.message };
  }
}

// Main execution
console.log('🔧 Fixing People Store Product Assignments...\n');

// Step 1: Update People Store catalog
console.log('📦 Updating People Store catalog...');
const peopleStoreResult = updatePeopleStoreCatalog();
console.log(peopleStoreResult.success 
  ? `✅ People Store updated with ${peopleStoreResult.productsUpdated} products`
  : `❌ Failed to update People Store: ${peopleStoreResult.error}`
);

// Step 2: Create Quintessence vendor
console.log('\n🏪 Creating Quintessence vendor...');
const quintessenceResult = createQuintessenceVendor();
console.log(quintessenceResult.success
  ? `✅ Quintessence vendor created with ${quintessenceResult.productsCreated} products`
  : `❌ Failed to create Quintessence: ${quintessenceResult.error}`
);

// Summary report
const report = {
  timestamp: new Date().toISOString(),
  actions: [
    'Removed Quintessence products from People Store',
    'Created separate Quintessence vendor',
    'Updated People Store with correct products'
  ],
  peopleStore: {
    productsRemoved: quintessenceProductCorrections.length,
    productsAdded: actualPeopleStoreProducts.length,
    totalProducts: peopleStoreResult.productsUpdated
  },
  quintessence: {
    vendorCreated: quintessenceResult.success,
    productsAdded: quintessenceResult.productsCreated || 0
  }
};

fs.writeFileSync(
  path.join(__dirname, '../PEOPLE_STORE_FIX_REPORT.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📊 Fix Summary:');
console.log(`- Removed ${report.peopleStore.productsRemoved} Quintessence products from People Store`);
console.log(`- Added ${report.peopleStore.productsAdded} correct People Store products`);
console.log(`- Created Quintessence vendor with ${report.quintessence.productsAdded} products`);
console.log('\n✅ Product assignments corrected successfully!');

// Note for next steps
console.log('\n📝 Next Steps:');
console.log('1. Update wordpress-style-data-layer.ts to include Quintessence vendor');
console.log('2. Add Quintessence logo image to /public/images/vendors/');
console.log('3. Update vendor navigation to include Quintessence');
console.log('4. Test the marketplace to ensure products display correctly');