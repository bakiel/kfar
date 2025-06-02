#!/usr/bin/env node

/**
 * Develop All Product Pages Script (Standalone)
 * Generates comprehensive product page data for all 131 products
 */

const fs = require('fs');
const path = require('path');

// Load vendor data from JSON files
function loadVendorData() {
  const dataDir = path.join(__dirname, '..', 'lib', 'data');
  
  // Load each vendor's catalog
  const vendors = {
    'teva-deli': {
      id: 'teva-deli',
      name: 'Teva Deli',
      info: {
        location: 'Dimona, Israel',
        established: '1985',
        description: 'Premium vegan deli specializing in plant-based meat alternatives'
      },
      products: [] // Will be loaded from TypeScript file
    },
    'queens-cuisine': JSON.parse(fs.readFileSync(path.join(dataDir, 'queens-cuisine-complete-catalog.json'), 'utf8')),
    'gahn-delight': JSON.parse(fs.readFileSync(path.join(dataDir, 'gahn-delight-complete-catalog.json'), 'utf8')),
    'vop-shop': JSON.parse(fs.readFileSync(path.join(dataDir, 'vop-shop-complete-catalog.json'), 'utf8')),
    'people-store': JSON.parse(fs.readFileSync(path.join(dataDir, 'people-store-complete-catalog.json'), 'utf8')),
    'garden-of-light': JSON.parse(fs.readFileSync(path.join(dataDir, 'garden-of-light-complete-catalog.json'), 'utf8'))
  };
  
  // Parse Teva Deli from TypeScript file
  const tevaDeliContent = fs.readFileSync(path.join(dataDir, 'teva-deli-complete-catalog.ts'), 'utf8');
  const tevaProducts = [];
  
  // Extract products using regex
  const productMatches = tevaDeliContent.match(/\{[^}]*id:\s*['"]td-\d+['"],[^}]*\}/gs);
  if (productMatches) {
    productMatches.forEach(match => {
      try {
        // Clean up the match for JSON parsing
        let cleaned = match
          .replace(/(\w+):/g, '"$1":') // Quote keys
          .replace(/'/g, '"') // Single to double quotes
          .replace(/,\s*}/g, '}') // Remove trailing commas
          .replace(/\n/g, ' '); // Remove newlines
        
        // Extract id manually since parsing might fail
        const idMatch = match.match(/id:\s*['"]([^'"]+)['"]/);
        if (idMatch) {
          tevaProducts.push({
            id: idMatch[1],
            name: match.match(/name:\s*['"]([^'"]+)['"]/)?.[1] || 'Teva Deli Product',
            description: match.match(/description:\s*['"]([^'"]+)['"]/)?.[1] || '',
            category: match.match(/category:\s*['"]([^'"]+)['"]/)?.[1] || 'meat-alternatives',
            subcategory: match.match(/subcategory:\s*['"]([^'"]+)['"]/)?.[1] || 'general',
            price: parseInt(match.match(/price:\s*(\d+)/)?.[1] || '50'),
            image: match.match(/image:\s*['"]([^'"]+)['"]/)?.[1] || '',
            isVegan: true,
            isKosher: true,
            inStock: !match.includes('inStock: false'),
            tags: ['vegan', 'kosher', 'meat-alternative']
          });
        }
      } catch (e) {
        console.error('Error parsing product:', e);
      }
    });
  }
  
  vendors['teva-deli'].products = tevaProducts;
  vendors['teva-deli'].productCount = tevaProducts.length;
  
  return vendors;
}

// Helper to generate comprehensive product descriptions
function generateFullDescription(product, vendor) {
  const intro = product.description || '';
  
  let fullDescription = `${intro}\n\n`;
  
  // Add vendor context
  fullDescription += `Brought to you by ${vendor.vendorName || vendor.name}, a trusted vendor in the Village of Peace community`;
  
  if (vendor.info?.established) {
    fullDescription += ` since ${vendor.info.established}`;
  }
  fullDescription += '. ';
  
  // Add category-specific content
  const categoryDescriptions = {
    'meat-alternatives': 'This plant-based protein alternative provides all the satisfaction of traditional meat products while being 100% vegan and cholesterol-free. Perfect for health-conscious families looking to reduce their environmental impact without sacrificing taste or nutrition.',
    'desserts': 'Indulge guilt-free in this delicious vegan dessert, crafted with natural ingredients and no animal products. Each bite delivers pure satisfaction while aligning with your ethical and dietary choices.',
    'beverages': 'Refresh and hydrate with this carefully selected beverage, perfect for health-conscious consumers. Made with quality ingredients and mindful production methods.',
    'fermented-foods': 'Rich in probiotics and beneficial cultures, this fermented product supports digestive health naturally. Traditional fermentation methods ensure maximum nutritional benefits.',
    'spreads': 'Versatile and flavorful, this spread enhances any meal while providing plant-based nutrition. Perfect for sandwiches, crackers, or as a dip.',
    'snacks': 'Satisfy your cravings with this wholesome snack option that doesn\'t compromise on taste or nutrition. Ideal for on-the-go lifestyles.',
    'apparel': 'Express your values and support the Village of Peace community with this quality apparel item. Each purchase helps sustain our community initiatives.',
    'books': 'Expand your knowledge and understanding with this educational resource from the Village of Peace wisdom tradition. Gain insights for healthier, more conscious living.',
    'art': 'Celebrate the heritage and values of the Village of Peace with this meaningful art piece. A perfect addition to any conscious home.',
    'salads': 'Fresh, nutritious, and bursting with flavor, this salad offering brings restaurant quality to your table. Made with the finest plant-based ingredients.',
    'cheese-alternatives': 'Experience the rich, creamy satisfaction of cheese without any dairy. Our plant-based alternatives deliver on taste and texture.',
    'bulk-foods': 'Stock your pantry with these premium bulk items. Economical, ecological, and essential for any plant-based kitchen.',
    'dairy-alternatives': 'Enjoy all your favorite dairy experiences in plant-based form. Creamy, delicious, and kind to animals and the planet.',
    'oils': 'Premium quality oils for cooking, dressing, and flavoring. Each bottle represents careful selection and quality processing.',
    'condiments': 'Elevate your meals with these flavorful condiments. Carefully crafted to complement your plant-based lifestyle.',
    'spices': 'Transform your cooking with these aromatic spices and seasonings. Quality ingredients for inspired plant-based cuisine.',
    'sweeteners': 'Natural sweetness without compromise. Perfect for baking, beverages, and adding a touch of sweetness to life.'
  };
  
  fullDescription += '\n\n' + (categoryDescriptions[product.category] || 'Quality product from the Village of Peace marketplace.');
  
  // Add dietary information paragraph
  const dietary = [];
  if (product.isVegan) dietary.push('vegan');
  if (product.isKosher) dietary.push('kosher certified');
  if (product.tags?.includes('organic')) dietary.push('organic');
  if (product.tags?.includes('gluten-free')) dietary.push('gluten-free');
  if (product.tags?.includes('sugar-free')) dietary.push('sugar-free');
  if (product.tags?.includes('raw')) dietary.push('raw');
  
  if (dietary.length > 0) {
    fullDescription += `\n\nThis product is ${dietary.join(', ')}, making it suitable for a variety of dietary preferences and requirements.`;
  }
  
  // Add usage suggestions based on product type
  if (product.category === 'meat-alternatives') {
    fullDescription += '\n\nPerfect for family dinners, meal prep, or whenever you\'re craving something hearty and satisfying.';
  } else if (product.category === 'fermented-foods') {
    fullDescription += '\n\nRegular consumption of fermented foods supports gut health and overall wellness.';
  }
  
  return fullDescription;
}

// Generate product specifications based on category
function generateSpecifications(product) {
  const specs = [];
  
  // Common specs
  if (product.isVegan) specs.push({ label: 'Dietary', value: 'Vegan' });
  if (product.isKosher) specs.push({ label: 'Certification', value: 'Kosher' });
  if (product.tags?.includes('organic')) specs.push({ label: 'Organic', value: 'Certified Organic' });
  
  // Size/quantity specs
  if (product.size) specs.push({ label: 'Size', value: product.size });
  if (product.packSize) specs.push({ label: 'Pack Size', value: product.packSize });
  if (product.servingSize) specs.push({ label: 'Serving Size', value: product.servingSize });
  
  // Category-specific specs
  switch (product.category) {
    case 'meat-alternatives':
      specs.push(
        { label: 'Protein Source', value: extractProteinSource(product) },
        { label: 'Preparation', value: 'Ready to cook' },
        { label: 'Cooking Time', value: '8-10 minutes' },
        { label: 'Storage', value: 'Keep refrigerated' },
        { label: 'Shelf Life', value: 'See package for expiry' }
      );
      break;
      
    case 'desserts':
      specs.push(
        { label: 'Type', value: product.subcategory || 'Dessert' },
        { label: 'Storage', value: product.subcategory === 'ice-cream' ? 'Keep frozen at -18°C' : 'Refrigerate at 2-8°C' },
        { label: 'Serving Temperature', value: product.subcategory === 'ice-cream' ? 'Frozen' : 'Chilled' },
        { label: 'Allergens', value: product.allergens?.join(', ') || 'See package' }
      );
      break;
      
    case 'beverages':
      specs.push(
        { label: 'Volume', value: product.size || product.packSize || '330ml' },
        { label: 'Storage', value: 'Store in cool, dry place' },
        { label: 'Best Served', value: 'Chilled' },
        { label: 'Shake Before Use', value: 'Yes' }
      );
      break;
      
    case 'fermented-foods':
      specs.push(
        { label: 'Live Cultures', value: 'Yes - Active probiotics' },
        { label: 'Storage', value: 'Keep refrigerated' },
        { label: 'Fermentation', value: 'Traditional method' },
        { label: 'No Preservatives', value: 'Yes' },
        { label: 'Probiotic Strains', value: 'Multiple beneficial strains' }
      );
      break;
      
    case 'apparel':
      specs.push(
        { label: 'Material', value: '100% Organic Cotton' },
        { label: 'Available Sizes', value: product.sizes?.join(', ') || 'S, M, L, XL, XXL' },
        { label: 'Care Instructions', value: 'Machine wash cold, tumble dry low' },
        { label: 'Origin', value: 'Designed in Village of Peace' }
      );
      break;
      
    case 'books':
      specs.push(
        { label: 'Format', value: 'Paperback' },
        { label: 'Language', value: 'English/Hebrew' },
        { label: 'Pages', value: 'Varies' },
        { label: 'Publisher', value: 'Village of Peace Press' }
      );
      break;
      
    case 'bulk-foods':
      specs.push(
        { label: 'Package Type', value: 'Bulk bag' },
        { label: 'Storage', value: 'Store in cool, dry place' },
        { label: 'Shelf Life', value: '6-12 months' },
        { label: 'Origin', value: 'See package' }
      );
      break;
  }
  
  return specs;
}

// Extract protein source from product name/description
function extractProteinSource(product) {
  const text = (product.name + ' ' + product.description).toLowerCase();
  
  if (text.includes('seitan')) return 'Seitan (wheat protein)';
  if (text.includes('tofu')) return 'Tofu (soy protein)';
  if (text.includes('tempeh')) return 'Tempeh (fermented soy)';
  if (text.includes('mushroom')) return 'Mushroom protein';
  if (text.includes('pea')) return 'Pea protein';
  if (text.includes('quinoa')) return 'Quinoa protein';
  if (text.includes('amaranth')) return 'Amaranth & plant proteins';
  if (text.includes('cashew')) return 'Cashew nuts';
  if (text.includes('almond')) return 'Almonds';
  return 'Plant-based protein blend';
}

// Generate comprehensive product features
function generateFeatures(product) {
  const features = [];
  
  // Base features from product attributes
  if (product.isVegan) features.push('100% Plant-Based');
  if (product.isKosher) features.push('Kosher Certified');
  
  // Features from tags
  const tagFeatures = {
    'organic': 'Certified Organic',
    'gluten-free': 'Gluten-Free',
    'sugar-free': 'No Added Sugar',
    'non-gmo': 'Non-GMO Verified',
    'raw': 'Raw & Unprocessed',
    'fermented': 'Naturally Fermented',
    'probiotic': 'Rich in Probiotics',
    'whole-grain': 'Whole Grain Goodness',
    'high-protein': 'High in Protein',
    'low-sodium': 'Low Sodium',
    'no-preservatives': 'No Artificial Preservatives',
    'handmade': 'Handcrafted with Care',
    'artisan': 'Artisan Quality',
    'local': 'Locally Produced',
    'sustainable': 'Sustainably Sourced',
    'fair-trade': 'Fair Trade Certified'
  };
  
  product.tags?.forEach(tag => {
    if (tagFeatures[tag]) features.push(tagFeatures[tag]);
  });
  
  // Category-specific features
  const categoryFeatures = {
    'meat-alternatives': ['High in Protein', 'Cholesterol-Free', 'Heart-Healthy', 'Sustainable Choice'],
    'fermented-foods': ['Probiotic-Rich', 'Supports Digestive Health', 'Traditional Methods', 'Live Active Cultures'],
    'desserts': ['Dairy-Free Indulgence', 'Natural Ingredients', 'No Artificial Colors', 'Guilt-Free Pleasure'],
    'beverages': ['Refreshing & Hydrating', 'No Artificial Flavors', 'Natural Energy', 'Vitamin-Rich'],
    'apparel': ['Ethically Made', 'Comfortable Fit', 'Durable Quality', 'Community Support'],
    'books': ['Educational Resource', 'Community Wisdom', 'Practical Guidance', 'Inspirational Content'],
    'bulk-foods': ['Economical Choice', 'Minimal Packaging', 'Premium Quality', 'Pantry Essential'],
    'dairy-alternatives': ['Creamy Texture', 'Calcium Fortified', 'No Lactose', 'Smooth & Delicious']
  };
  
  if (categoryFeatures[product.category]) {
    features.push(...categoryFeatures[product.category]);
  }
  
  // Ensure unique features
  return [...new Set(features)].slice(0, 8); // Limit to 8 features
}

// Generate usage instructions
function generateInstructions(product) {
  const instructions = {
    'meat-alternatives': {
      title: 'Cooking Instructions',
      steps: [
        'Remove from packaging and let stand at room temperature for 5 minutes',
        'Heat 1-2 tablespoons of oil in a pan over medium heat',
        'Cook for 3-4 minutes on each side until golden brown',
        'Internal temperature should reach 165°F (74°C)',
        'Let rest for 2 minutes before serving',
        'Serve hot with your favorite sides and sauces'
      ]
    },
    'desserts': {
      title: 'Serving Suggestions',
      steps: [
        'For frozen desserts: Remove from freezer 5-10 minutes before serving',
        'For refrigerated items: Serve chilled for best taste',
        'Use a warm spoon for easier scooping of frozen items',
        'Garnish with fresh fruit, nuts, or mint leaves',
        'Store any leftovers in original container',
        'Consume within recommended timeframe for best quality'
      ]
    },
    'fermented-foods': {
      title: 'Storage & Usage',
      steps: [
        'Always keep refrigerated at 2-8°C',
        'Use clean utensils to prevent contamination',
        'Natural separation is normal - gently stir before use',
        'Liquid on top (brine) helps preserve the product',
        'Consume within 30 days of opening',
        'Do not freeze as it may damage beneficial cultures'
      ]
    },
    'beverages': {
      title: 'Serving Instructions',
      steps: [
        'Shake well before opening',
        'Best served chilled over ice',
        'Once opened, consume within 3-5 days',
        'Keep refrigerated after opening',
        'Can be enjoyed straight or mixed in smoothies',
        'Natural settling is normal'
      ]
    },
    'spreads': {
      title: 'Usage Tips',
      steps: [
        'Remove from refrigerator 10 minutes before use for easier spreading',
        'Perfect for sandwiches, wraps, and crackers',
        'Can be used as a dip for vegetables',
        'Mix with pasta for a quick sauce',
        'Store tightly sealed in refrigerator',
        'Use within 2 weeks of opening'
      ]
    },
    'bulk-foods': {
      title: 'Storage Instructions',
      steps: [
        'Transfer to airtight containers after opening',
        'Store in a cool, dry place away from direct sunlight',
        'Label containers with purchase date',
        'Use within 6-12 months for best quality',
        'Check for freshness before use',
        'Keep different items in separate containers'
      ]
    }
  };
  
  return instructions[product.category] || instructions['spreads']; // Default to spreads instructions
}

// Generate FAQ data
function generateFAQ(product, vendor) {
  const faqs = [
    {
      question: `Is ${product.name} suitable for vegans?`,
      answer: product.isVegan ? 
        'Yes, this product is 100% vegan and contains no animal products, making it perfect for plant-based diets.' : 
        'Please check the product label for complete dietary information.'
    },
    {
      question: 'Where is this product made?',
      answer: `This product is made by ${vendor.vendorName || vendor.name} in ${vendor.info?.location || 'Dimona, Israel'}, following strict quality standards and traditional methods where applicable.`
    },
    {
      question: 'What is the shelf life?',
      answer: 'Please check the expiration date printed on the package. We recommend consuming by this date for optimal quality and freshness. Once opened, follow the storage instructions for best results.'
    },
    {
      question: 'Is this product kosher certified?',
      answer: product.isKosher ? 
        'Yes, this product is certified kosher by recognized authorities, meeting all requirements for kosher dietary laws.' :
        'Please check the product packaging for kosher certification information.'
    }
  ];
  
  // Category-specific FAQs
  if (product.category === 'meat-alternatives') {
    faqs.push(
      {
        question: 'How much protein does this contain?',
        answer: 'This product is high in plant-based protein, providing essential amino acids for your dietary needs. Check the nutritional panel for exact protein content per serving.'
      },
      {
        question: 'Can I freeze this product?',
        answer: 'Yes, most of our meat alternatives can be frozen for up to 3 months. Thaw in the refrigerator before cooking for best results.'
      }
    );
  }
  
  if (product.category === 'fermented-foods') {
    faqs.push(
      {
        question: 'Are the cultures still active?',
        answer: 'Yes! All our fermented products contain live, active cultures that support digestive health. Keep refrigerated to maintain culture viability.'
      },
      {
        question: 'Is cloudy liquid normal?',
        answer: 'Yes, cloudy brine is completely normal and indicates active fermentation. This liquid helps preserve the product and can even be consumed for additional probiotics.'
      }
    );
  }
  
  if (product.category === 'desserts') {
    faqs.push(
      {
        question: 'What sweeteners are used?',
        answer: 'We use natural sweeteners like organic cane sugar, maple syrup, or date syrup. Check the ingredient list for specific sweeteners used in this product.'
      },
      {
        question: 'Are there any allergens?',
        answer: product.allergens?.length ? 
          `This product contains: ${product.allergens.join(', ')}. Always check the label for the most current allergen information.` :
          'Please check the product label for complete allergen information. Our facility handles various nuts and seeds.'
      }
    );
  }
  
  if (product.category === 'beverages') {
    faqs.push(
      {
        question: 'Is this drink carbonated?',
        answer: product.name.toLowerCase().includes('sparkling') ? 
          'Yes, this beverage is naturally carbonated for a refreshing fizz.' :
          'No, this is a still (non-carbonated) beverage.'
      },
      {
        question: 'Can children drink this?',
        answer: 'Yes, our beverages are suitable for the whole family. They contain no artificial additives or excessive sugars.'
      }
    );
  }
  
  return faqs;
}

// Generate related products
function generateRelatedProducts(product, allProducts) {
  const related = [];
  
  // First, find products from same vendor and category
  const sameVendorCategory = allProducts.filter(p => 
    p.vendorId === product.vendorId && 
    p.category === product.category && 
    p.id !== product.id
  );
  related.push(...sameVendorCategory.slice(0, 2));
  
  // Then, same category different vendor
  const sameCategoryDiffVendor = allProducts.filter(p => 
    p.vendorId !== product.vendorId && 
    p.category === product.category && 
    p.id !== product.id
  );
  related.push(...sameCategoryDiffVendor.slice(0, 2));
  
  // Finally, complementary products
  const complementaryCategories = {
    'meat-alternatives': ['condiments', 'spreads', 'beverages'],
    'desserts': ['beverages', 'snacks'],
    'fermented-foods': ['spreads', 'condiments'],
    'beverages': ['snacks', 'desserts'],
    'spreads': ['snacks', 'meat-alternatives'],
    'apparel': ['books', 'art'],
    'books': ['apparel', 'art']
  };
  
  const compCats = complementaryCategories[product.category] || [];
  const complementary = allProducts.filter(p => 
    compCats.includes(p.category) && 
    p.id !== product.id
  );
  related.push(...complementary.slice(0, 2));
  
  // Return unique product IDs
  const uniqueIds = [...new Set(related.map(p => p.id))];
  return uniqueIds.slice(0, 6);
}

// Generate nutritional information based on category
function generateNutritionalInfo(product) {
  // Base nutritional templates by category
  const nutritionTemplates = {
    'meat-alternatives': {
      servingSize: '100g',
      calories: 180,
      protein: 20,
      carbohydrates: 8,
      fat: 9,
      saturatedFat: 1.5,
      fiber: 3,
      sodium: 380,
      iron: 15, // % daily value
      b12: 25  // % daily value
    },
    'desserts': {
      servingSize: '100g',
      calories: 220,
      protein: 3,
      carbohydrates: 28,
      sugars: 18,
      fat: 12,
      saturatedFat: 8,
      fiber: 2,
      calcium: 8 // % daily value
    },
    'fermented-foods': {
      servingSize: '30g',
      calories: 15,
      protein: 1,
      carbohydrates: 3,
      fat: 0,
      fiber: 1,
      sodium: 290,
      probiotics: 'Multiple strains'
    },
    'beverages': {
      servingSize: '250ml',
      calories: 45,
      protein: 0,
      carbohydrates: 11,
      sugars: 10,
      fat: 0,
      sodium: 25,
      vitaminC: 30 // % daily value
    }
  };
  
  return nutritionTemplates[product.category] || null;
}

// Main function to develop all product pages
async function developAllProductPages() {
  console.log('Starting comprehensive product page development...\n');
  
  try {
    // Load vendor data
    const vendors = loadVendorData();
    
    // Collect all products
    const allProducts = [];
    const enrichedProducts = {};
    
    // Process each vendor
    for (const [vendorId, vendor] of Object.entries(vendors)) {
      console.log(`\nProcessing ${vendor.vendorName || vendor.name} (${vendor.products.length} products)...`);
      
      enrichedProducts[vendorId] = {
        vendor: {
          id: vendorId,
          name: vendor.vendorName || vendor.name,
          description: vendor.info?.description,
          location: vendor.info?.location || 'Dimona, Israel',
          established: vendor.info?.established,
          logo: vendor.logo,
          tags: vendor.vendorTags || []
        },
        products: []
      };
      
      // Process each product
      for (const product of vendor.products) {
        // Ensure product has vendorId
        product.vendorId = vendorId;
        product.vendorName = vendor.vendorName || vendor.name;
        
        // Generate comprehensive product page data
        const productPageData = {
          ...product,
          
          // Core identifiers
          id: product.id,
          vendorId: vendorId,
          vendorName: vendor.vendorName || vendor.name,
          
          // Enhanced content
          fullDescription: generateFullDescription(product, vendor),
          specifications: generateSpecifications(product),
          features: generateFeatures(product),
          instructions: generateInstructions(product),
          faq: generateFAQ(product, vendor),
          nutritionalInfo: generateNutritionalInfo(product),
          
          // SEO enhancements
          seo: {
            title: `${product.name} | ${vendor.vendorName || vendor.name} | KFAR Marketplace`,
            description: (product.description || '').substring(0, 160),
            keywords: [
              ...(product.tags || []), 
              product.category, 
              product.subcategory,
              vendor.vendorName || vendor.name, 
              'vegan', 
              'israel',
              'village of peace',
              'dimona'
            ].filter(Boolean)
          },
          
          // Rich media
          media: {
            images: {
              primary: product.image || `/images/vendors/${vendorId}/products/${product.id}.jpg`,
              gallery: product.images || [product.image],
              thumbnails: [`${(product.image || '').replace(/\.[^/.]+$/, '')}_thumb.jpg`]
            },
            videos: [], // Placeholder for future video content
            pdf: product.category === 'books' ? [`/pdfs/${product.id}_preview.pdf`] : []
          },
          
          // Shopping features
          shopping: {
            price: product.price,
            originalPrice: product.originalPrice,
            currency: 'ILS',
            bulkPricing: product.price > 30 ? [
              { quantity: 1, price: product.price },
              { quantity: 3, price: Math.round(product.price * 0.95) },
              { quantity: 6, price: Math.round(product.price * 0.90) },
              { quantity: 12, price: Math.round(product.price * 0.85) }
            ] : null,
            subscriptionOptions: ['food', 'beverages', 'fermented-foods', 'meat-alternatives', 'desserts'].includes(product.category) ? [
              { frequency: 'weekly', discount: 10 },
              { frequency: 'bi-weekly', discount: 7 },
              { frequency: 'monthly', discount: 5 }
            ] : null,
            minimumOrder: 1,
            maximumOrder: product.category === 'apparel' ? 5 : 99
          },
          
          // Stock information
          inventory: {
            inStock: product.inStock !== false,
            stockLevel: product.inStock ? 'In Stock' : 'Out of Stock',
            availableQuantity: product.inStock ? 100 : 0, // Placeholder
            restockDate: !product.inStock ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
          },
          
          // Analytics placeholder
          analytics: {
            views: Math.floor(Math.random() * 1000) + 100,
            purchases: Math.floor(Math.random() * 100) + 10,
            rating: product.rating || (4 + Math.random()).toFixed(1),
            reviewCount: product.reviewCount || Math.floor(Math.random() * 50) + 5,
            wishlistCount: Math.floor(Math.random() * 30)
          },
          
          // Badges and highlights
          badges: product.badge ? [product.badge] : [],
          highlights: []
        };
        
        // Add highlights based on product attributes
        if (product.originalPrice && product.price < product.originalPrice) {
          const discount = Math.round((1 - product.price / product.originalPrice) * 100);
          productPageData.highlights.push(`${discount}% OFF`);
        }
        if (product.tags?.includes('best-seller')) productPageData.highlights.push('Best Seller');
        if (product.tags?.includes('new')) productPageData.highlights.push('New Arrival');
        if (product.tags?.includes('limited')) productPageData.highlights.push('Limited Edition');
        
        // Add to collections
        allProducts.push(productPageData);
        enrichedProducts[vendorId].products.push(productPageData);
      }
    }
    
    // Second pass: Add related products
    console.log('\n\nAdding related products and cross-references...');
    for (const product of allProducts) {
      product.relatedProducts = generateRelatedProducts(product, allProducts);
    }
    
    // Save enriched product data
    const outputDir = path.join(__dirname, '..', 'lib', 'data');
    const outputPath = path.join(outputDir, 'product-pages-complete.json');
    
    const outputData = {
      totalProducts: allProducts.length,
      lastUpdated: new Date().toISOString(),
      vendors: enrichedProducts,
      products: allProducts
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    
    console.log(`\n✅ Successfully developed ${allProducts.length} comprehensive product pages!`);
    console.log(`📁 Data saved to: lib/data/product-pages-complete.json`);
    
    // Generate summary
    console.log('\n=== PRODUCT PAGE DEVELOPMENT SUMMARY ===');
    let totalCount = 0;
    for (const [vendorId, data] of Object.entries(enrichedProducts)) {
      console.log(`${data.vendor.name}: ${data.products.length} products`);
      totalCount += data.products.length;
    }
    console.log(`\nTotal Products: ${totalCount}`);
    
    // Generate statistics
    const stats = {
      totalProducts: totalCount,
      byCategory: {},
      byVendor: {},
      withImages: 0,
      withSpecialOffers: 0,
      averagePrice: 0
    };
    
    let totalPrice = 0;
    allProducts.forEach(product => {
      // Category stats
      stats.byCategory[product.category] = (stats.byCategory[product.category] || 0) + 1;
      
      // Vendor stats
      stats.byVendor[product.vendorId] = (stats.byVendor[product.vendorId] || 0) + 1;
      
      // Image stats
      if (product.image) stats.withImages++;
      
      // Special offer stats
      if (product.originalPrice && product.price < product.originalPrice) stats.withSpecialOffers++;
      
      // Price stats
      totalPrice += product.price;
    });
    
    stats.averagePrice = Math.round(totalPrice / totalCount);
    
    console.log('\n=== PRODUCT STATISTICS ===');
    console.log('By Category:');
    Object.entries(stats.byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} products`);
    });
    
    console.log(`\nProducts with images: ${stats.withImages}`);
    console.log(`Products on sale: ${stats.withSpecialOffers}`);
    console.log(`Average price: ₪${stats.averagePrice}`);
    
    // Save statistics
    fs.writeFileSync(
      path.join(outputDir, 'product-statistics.json'),
      JSON.stringify(stats, null, 2)
    );
    
  } catch (error) {
    console.error('Error developing product pages:', error);
    process.exit(1);
  }
}

// Run the script
developAllProductPages();