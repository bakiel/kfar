#!/usr/bin/env node

/**
 * Develop All Product Pages Script
 * Generates comprehensive product page data for all 131 products
 * Enriches each product with full page-ready content
 */

const fs = require('fs');
const path = require('path');

// Helper to generate comprehensive product descriptions
function generateFullDescription(product, vendor) {
  const intro = product.description || '';
  
  let fullDescription = `${intro}\n\n`;
  
  // Add vendor context
  fullDescription += `Brought to you by ${vendor.name}, a trusted vendor in the Village of Peace community`;
  
  if (vendor.info?.established) {
    fullDescription += ` since ${vendor.info.established}`;
  }
  fullDescription += '. ';
  
  // Add category-specific content
  const categoryDescriptions = {
    'meat-alternatives': 'This plant-based protein alternative provides all the satisfaction of traditional meat products while being 100% vegan and cholesterol-free. ',
    'desserts': 'Indulge guilt-free in this delicious vegan dessert, crafted with natural ingredients and no animal products. ',
    'beverages': 'Refresh and hydrate with this carefully selected beverage, perfect for health-conscious consumers. ',
    'fermented-foods': 'Rich in probiotics and beneficial cultures, this fermented product supports digestive health naturally. ',
    'spreads': 'Versatile and flavorful, this spread enhances any meal while providing plant-based nutrition. ',
    'snacks': 'Satisfy your cravings with this wholesome snack option that doesn\'t compromise on taste or nutrition. ',
    'apparel': 'Express your values and support the Village of Peace community with this quality apparel item. ',
    'books': 'Expand your knowledge and understanding with this educational resource from the Village of Peace wisdom tradition. '
  };
  
  fullDescription += categoryDescriptions[product.category] || '';
  
  // Add dietary information
  if (product.isVegan) fullDescription += 'Certified vegan. ';
  if (product.isKosher) fullDescription += 'Kosher certified. ';
  if (product.tags?.includes('organic')) fullDescription += 'Made with organic ingredients. ';
  if (product.tags?.includes('gluten-free')) fullDescription += 'Gluten-free. ';
  
  return fullDescription;
}

// Generate product specifications based on category
function generateSpecifications(product) {
  const specs = [];
  
  // Common specs
  if (product.isVegan) specs.push({ label: 'Dietary', value: 'Vegan' });
  if (product.isKosher) specs.push({ label: 'Certification', value: 'Kosher' });
  
  // Category-specific specs
  switch (product.category) {
    case 'meat-alternatives':
      specs.push(
        { label: 'Protein Source', value: extractProteinSource(product) },
        { label: 'Preparation', value: 'Ready to cook' },
        { label: 'Shelf Life', value: 'See package' }
      );
      break;
      
    case 'desserts':
      specs.push(
        { label: 'Serving Size', value: product.servingSize || 'Individual' },
        { label: 'Storage', value: product.subcategory === 'ice-cream' ? 'Keep frozen' : 'Refrigerate' },
        { label: 'Allergens', value: product.allergens?.join(', ') || 'See package' }
      );
      break;
      
    case 'beverages':
      specs.push(
        { label: 'Volume', value: product.size || product.packSize || 'Standard' },
        { label: 'Storage', value: 'Room temperature' },
        { label: 'Best Served', value: 'Chilled' }
      );
      break;
      
    case 'fermented-foods':
      specs.push(
        { label: 'Live Cultures', value: 'Yes' },
        { label: 'Storage', value: 'Refrigerate' },
        { label: 'Fermentation', value: 'Natural' }
      );
      break;
      
    case 'apparel':
      specs.push(
        { label: 'Material', value: '100% Cotton' },
        { label: 'Sizes', value: product.sizes?.join(', ') || 'S-XXL' },
        { label: 'Care', value: 'Machine washable' }
      );
      break;
  }
  
  return specs;
}

// Extract protein source from product name/description
function extractProteinSource(product) {
  const name = product.name.toLowerCase();
  const desc = product.description.toLowerCase();
  
  if (name.includes('seitan') || desc.includes('seitan')) return 'Seitan (wheat protein)';
  if (name.includes('tofu') || desc.includes('tofu')) return 'Tofu (soy)';
  if (name.includes('tempeh') || desc.includes('tempeh')) return 'Tempeh';
  if (name.includes('mushroom') || desc.includes('mushroom')) return 'Mushroom-based';
  return 'Plant-based blend';
}

// Generate comprehensive product features
function generateFeatures(product) {
  const features = [];
  
  // Base features from tags
  if (product.tags?.includes('vegan')) features.push('100% Plant-Based');
  if (product.tags?.includes('organic')) features.push('Certified Organic');
  if (product.tags?.includes('kosher')) features.push('Kosher Certified');
  if (product.tags?.includes('gluten-free')) features.push('Gluten-Free');
  if (product.tags?.includes('non-gmo')) features.push('Non-GMO');
  
  // Category-specific features
  switch (product.category) {
    case 'meat-alternatives':
      features.push('High in Protein', 'Cholesterol-Free', 'No Trans Fats');
      break;
    case 'fermented-foods':
      features.push('Probiotic Rich', 'Supports Gut Health', 'Naturally Fermented');
      break;
    case 'desserts':
      features.push('No Dairy', 'Natural Sweeteners', 'Artisan Crafted');
      break;
  }
  
  return [...new Set(features)]; // Remove duplicates
}

// Generate usage instructions
function generateInstructions(product) {
  const instructions = {
    'meat-alternatives': {
      title: 'Cooking Instructions',
      steps: [
        'Remove from packaging',
        'Heat 1-2 tablespoons of oil in a pan over medium heat',
        'Cook for 3-4 minutes on each side until golden brown',
        'Serve hot with your favorite sides'
      ]
    },
    'desserts': {
      title: 'Serving Suggestions',
      steps: [
        'Remove from freezer 5-10 minutes before serving',
        'Serve in individual portions',
        'Garnish with fresh fruit or nuts if desired',
        'Enjoy immediately for best texture'
      ]
    },
    'fermented-foods': {
      title: 'Storage & Usage',
      steps: [
        'Keep refrigerated at all times',
        'Use clean utensils to maintain cultures',
        'Consume within 30 days of opening',
        'Natural separation is normal - stir before use'
      ]
    },
    'beverages': {
      title: 'Serving Suggestions',
      steps: [
        'Shake well before opening',
        'Best served chilled',
        'Refrigerate after opening',
        'Consume within 3 days of opening'
      ]
    }
  };
  
  return instructions[product.category] || null;
}

// Generate FAQ data
function generateFAQ(product, vendor) {
  const faqs = [
    {
      question: `Is ${product.name} vegan?`,
      answer: product.isVegan ? 'Yes, this product is 100% vegan and contains no animal products.' : 'Please check the product label for dietary information.'
    },
    {
      question: 'Where is this product made?',
      answer: `This product is made by ${vendor.name} in ${vendor.info?.location || 'Dimona, Israel'}.`
    },
    {
      question: 'What is the shelf life?',
      answer: 'Please check the expiration date on the package. We recommend consuming by the date indicated for best quality.'
    }
  ];
  
  // Category-specific FAQs
  if (product.category === 'meat-alternatives') {
    faqs.push({
      question: 'How much protein does this contain?',
      answer: `This product is high in plant-based protein. ${product.nutritionalInfo?.protein ? `Contains ${product.nutritionalInfo.protein}g protein per serving.` : 'See nutritional panel for details.'}`
    });
  }
  
  if (product.category === 'fermented-foods') {
    faqs.push({
      question: 'Does this contain live cultures?',
      answer: 'Yes, all our fermented products contain live active cultures for digestive health benefits.'
    });
  }
  
  return faqs;
}

// Generate related products
function generateRelatedProducts(product, allProducts) {
  // Find products from same category
  let related = allProducts.filter(p => 
    p.category === product.category && 
    p.id !== product.id
  );
  
  // Prioritize same vendor
  related.sort((a, b) => {
    if (a.vendorId === product.vendorId && b.vendorId !== product.vendorId) return -1;
    if (b.vendorId === product.vendorId && a.vendorId !== product.vendorId) return 1;
    return 0;
  });
  
  return related.slice(0, 6).map(p => p.id);
}

// Main function to develop all product pages
async function developAllProductPages() {
  console.log('Starting comprehensive product page development...\n');
  
  // Load vendor and product data
  const dataDir = path.join(__dirname, '..', 'lib', 'data');
  
  // Import the WordPress-style data layer
  const { vendorStores } = require(path.join(dataDir, 'wordpress-style-data-layer.ts'));
  
  // Collect all products
  const allProducts = [];
  const enrichedProducts = {};
  
  for (const [vendorId, vendor] of Object.entries(vendorStores)) {
    console.log(`Processing ${vendor.name} (${vendor.products.length} products)...`);
    
    for (const product of vendor.products) {
      // Generate comprehensive product page data
      const productPageData = {
        ...product,
        
        // Enhanced content
        fullDescription: generateFullDescription(product, vendor),
        specifications: generateSpecifications(product),
        features: generateFeatures(product),
        instructions: generateInstructions(product),
        faq: generateFAQ(product, vendor),
        
        // SEO enhancements
        seo: {
          title: `${product.name} | ${vendor.name} | KFAR Marketplace`,
          description: product.description.substring(0, 160),
          keywords: [...(product.tags || []), product.category, vendor.name, 'vegan', 'israel'].filter(Boolean)
        },
        
        // Rich media
        media: {
          images: {
            primary: product.image,
            gallery: product.images || [product.image],
            thumbnails: [`${product.image.replace(/\.[^/.]+$/, '')}_thumb.jpg`]
          },
          videos: [], // Placeholder for future video content
          pdf: product.category === 'books' ? [`/pdfs/${product.id}_preview.pdf`] : []
        },
        
        // Shopping features
        shopping: {
          bulkPricing: product.price > 30 ? [
            { quantity: 1, price: product.price },
            { quantity: 3, price: Math.round(product.price * 0.95) },
            { quantity: 6, price: Math.round(product.price * 0.90) }
          ] : null,
          subscriptionOptions: ['food', 'beverages', 'fermented-foods'].includes(product.category) ? [
            { frequency: 'weekly', discount: 10 },
            { frequency: 'bi-weekly', discount: 7 },
            { frequency: 'monthly', discount: 5 }
          ] : null
        },
        
        // Analytics placeholder
        analytics: {
          views: 0,
          purchases: 0,
          rating: product.rating || 4.5,
          reviewCount: product.reviewCount || 0
        }
      };
      
      // Add to collections
      allProducts.push(productPageData);
      
      if (!enrichedProducts[vendorId]) {
        enrichedProducts[vendorId] = {
          vendor,
          products: []
        };
      }
      enrichedProducts[vendorId].products.push(productPageData);
    }
  }
  
  // Second pass: Add related products
  console.log('\nAdding related products...');
  for (const product of allProducts) {
    product.relatedProducts = generateRelatedProducts(product, allProducts);
  }
  
  // Save enriched product data
  const outputPath = path.join(dataDir, 'product-pages-complete.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify({
      totalProducts: allProducts.length,
      lastUpdated: new Date().toISOString(),
      vendors: enrichedProducts,
      products: allProducts
    }, null, 2)
  );
  
  console.log(`\n✅ Successfully developed ${allProducts.length} product pages!`);
  console.log(`Data saved to: product-pages-complete.json`);
  
  // Generate summary
  console.log('\n=== PRODUCT PAGE DEVELOPMENT SUMMARY ===');
  for (const [vendorId, data] of Object.entries(enrichedProducts)) {
    console.log(`${data.vendor.name}: ${data.products.length} products`);
  }
  
  // Create TypeScript interface for the enhanced products
  const interfaceContent = `// Generated TypeScript interfaces for enhanced product pages
  
export interface ProductPageData extends Product {
  fullDescription: string;
  specifications: Array<{ label: string; value: string }>;
  features: string[];
  instructions?: {
    title: string;
    steps: string[];
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  media: {
    images: {
      primary: string;
      gallery: string[];
      thumbnails: string[];
    };
    videos: string[];
    pdf: string[];
  };
  shopping: {
    bulkPricing?: Array<{
      quantity: number;
      price: number;
    }>;
    subscriptionOptions?: Array<{
      frequency: string;
      discount: number;
    }>;
  };
  analytics: {
    views: number;
    purchases: number;
    rating: number;
    reviewCount: number;
  };
  relatedProducts: string[];
}

export interface VendorProductPages {
  vendor: VendorStore;
  products: ProductPageData[];
}

export interface ProductPagesComplete {
  totalProducts: number;
  lastUpdated: string;
  vendors: Record<string, VendorProductPages>;
  products: ProductPageData[];
}
`;
  
  fs.writeFileSync(
    path.join(dataDir, 'product-page-types.ts'),
    interfaceContent
  );
  
  console.log('\n✅ TypeScript interfaces generated!');
}

// Run the script
developAllProductPages().catch(console.error);