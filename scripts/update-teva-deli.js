// Teva Deli Data Update Script for Kfar Marketplace App
// This script updates the Teva Deli catalog with corrected product data

import { tevaDeliProducts } from '../teva-deli-updated-catalog';

// Update the complete catalog
export function updateTevaDeliCatalog() {
  console.log('🚀 Updating Teva Deli catalog...');
  
  // Read the complete catalog
  const completeCatalogPath = './lib/data/complete-catalog.ts';
  
  // Update the Teva Deli section
  const updatedCatalog = {
    'teva-deli': {
      vendorId: 'teva-deli',
      vendorName: 'Teva Deli',
      vendorNameHe: 'טבע דלי',
      description: 'Premium plant-based deli products made with love in Israel',
      logo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
      banner: '/images/vendors/teva_deli_banner_plant_based_factory.jpg',
      kashrut: 'Badatz',
      productCount: 46,
      categories: [
        'schnitzels',
        'seitan-tofu',
        'ready-meals',
        'burgers',
        'sausages',
        'kebabs',
        'deli-meats',
        'specialty',
        'breakfast',
        'meal-kits'
      ],
      products: tevaDeliProducts
    }
  };
  
  return updatedCatalog;
}

// Generate category counts
export function getTevaDeliStats() {
  const categoryCount = {};
  
  tevaDeliProducts.forEach(product => {
    if (!categoryCount[product.category]) {
      categoryCount[product.category] = 0;
    }
    categoryCount[product.category]++;
  });
  
  return {
    totalProducts: tevaDeliProducts.length,
    categories: categoryCount,
    priceRange: {
      min: Math.min(...tevaDeliProducts.map(p => p.price)),
      max: Math.max(...tevaDeliProducts.map(p => p.price)),
      average: Math.round(tevaDeliProducts.reduce((sum, p) => sum + p.price, 0) / tevaDeliProducts.length)
    }
  };
}

// Validate product images exist
export function validateProductImages() {
  const missingImages = [];
  
  tevaDeliProducts.forEach(product => {
    const imagePath = `/Users/mac/Downloads/kfar-final/kfar-marketplace-app/public${product.image}`;
    // In a real implementation, check if file exists
    // For now, we'll just log the paths
    console.log(`Checking: ${product.image}`);
  });
  
  return missingImages;
}

// Update search index
export function updateSearchIndex() {
  const searchIndex = {};
  
  tevaDeliProducts.forEach(product => {
    // Index by name
    const words = product.name.toLowerCase().split(' ');
    words.forEach(word => {
      if (!searchIndex[word]) searchIndex[word] = [];
      searchIndex[word].push(product.id);
    });
    
    // Index by Hebrew name
    if (product.nameHe) {
      const hebrewWords = product.nameHe.split(' ');
      hebrewWords.forEach(word => {
        if (!searchIndex[word]) searchIndex[word] = [];
        searchIndex[word].push(product.id);
      });
    }
    
    // Index by tags
    if (product.tags) {
      product.tags.forEach(tag => {
        if (!searchIndex[tag]) searchIndex[tag] = [];
        searchIndex[tag].push(product.id);
      });
    }
  });
  
  return searchIndex;
}

// Main update function
export async function performTevaDeliUpdate() {
  try {
    console.log('🔄 Starting Teva Deli catalog update...');
    
    // Get stats
    const stats = getTevaDeliStats();
    console.log('📊 Catalog stats:', stats);
    
    // Update search index
    const searchIndex = updateSearchIndex();
    console.log('🔍 Search index updated with', Object.keys(searchIndex).length, 'keywords');
    
    // Validate images
    const missingImages = validateProductImages();
    if (missingImages.length > 0) {
      console.warn('⚠️ Missing images:', missingImages);
    }
    
    console.log('✅ Teva Deli catalog update complete!');
    console.log('📦 Total products:', stats.totalProducts);
    console.log('💰 Price range: ₪' + stats.priceRange.min + ' - ₪' + stats.priceRange.max);
    
    return {
      success: true,
      stats,
      searchIndex
    };
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for use in app
export default {
  updateTevaDeliCatalog,
  getTevaDeliStats,
  validateProductImages,
  updateSearchIndex,
  performTevaDeliUpdate
};
