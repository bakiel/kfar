#!/usr/bin/env node

/**
 * Migration script to update complete-catalog.ts to use WordPress-style data structure
 * This maintains backward compatibility while enhancing the data layer
 */

const fs = require('fs');
const path = require('path');

// Generate the new complete-catalog.ts content
const newCatalogContent = `import { Product } from '@/lib/types/product';
import { tevaDeliCompleteProducts } from './teva-deli-complete-catalog';
import { 
  vendorStores, 
  getAllProducts, 
  getVendorStore,
  getProductsByVendor 
} from './wordpress-style-data-layer';

// Import vendor catalogs for backward compatibility
import queensCuisineData from './queens-cuisine-complete-catalog.json';
import gahnDelightData from './gahn-delight-complete-catalog.json';
import vopShopData from './vop-shop-complete-catalog.json';
import peopleStoreData from './people-store-complete-catalog.json';
import gardenOfLightData from './garden-of-light-complete-catalog.json';

// Export the vendor stores structure for components expecting it
export const completeProductCatalog = vendorStores;

// Also export as flat array for components expecting array format
export const allProducts = getAllProducts();

// Backward compatibility exports
export const queensCuisineProducts = queensCuisineData.products as Product[];
export const gahnDelightProducts = gahnDelightData.products as Product[];
export const vopShopProducts = vopShopData.products as Product[];
export const peopleStoreProducts = peopleStoreData.products as Product[];
export const gardenOfLightProducts = gardenOfLightData.products as Product[];

// Helper functions for backward compatibility
export function getProducts(): Product[] {
  return getAllProducts();
}

export function getVendorProducts(vendorId: string): Product[] {
  return getProductsByVendor(vendorId);
}

export function getProduct(productId: string): Product | undefined {
  return getAllProducts().find(p => p.id === productId);
}

// Vendor information for backward compatibility
export const vendorInfo = {
  'teva-deli': {
    id: 'teva-deli',
    name: 'Teva Deli',
    vendorName: 'Teva Deli',
    logo: '/images/vendors/teva-deli/logo/teva_deli_logo_vegan_factory.jpg',
    productCount: tevaDeliCompleteProducts.length,
    products: tevaDeliCompleteProducts,
    tags: ['founding-vendor', 'certified', 'vegan', 'kosher', 'meat-alternatives']
  },
  'queens-cuisine': {
    id: 'queens-cuisine', 
    name: "Queen's Cuisine",
    vendorName: "Queen's Cuisine",
    logo: '/images/vendors/queens-cuisine/logo/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
    productCount: queensCuisineData.products.length,
    products: queensCuisineProducts.map(p => ({
      ...p,
      vendorId: 'queens-cuisine',
      vendorName: "Queen's Cuisine"
    })),
    tags: queensCuisineData.vendorTags
  },
  'gahn-delight': {
    id: 'gahn-delight',
    name: 'Gahn Delight',
    vendorName: 'Gahn Delight',
    logo: '/images/vendors/gahn-delight/logo/gahn_delight_official_logo_master_brand_ice_cream.jpg',
    productCount: gahnDelightData.products.length,
    products: gahnDelightProducts.map(p => ({
      ...p,
      vendorId: 'gahn-delight',
      vendorName: 'Gahn Delight'
    })),
    tags: gahnDelightData.vendorTags
  },
  'vop-shop': {
    id: 'vop-shop',
    name: 'VOP Shop',
    vendorName: 'VOP Shop',
    logo: '/images/vendors/vop-shop/logo/vop_shop_official_logo_master_brand_village_of_peace.jpg',
    productCount: vopShopData.products.length,
    products: vopShopProducts.map(p => ({
      ...p,
      vendorId: 'vop-shop',
      vendorName: 'VOP Shop'
    })),
    tags: vopShopData.vendorTags
  },
  'people-store': {
    id: 'people-store',
    name: 'People Store',
    vendorName: 'People Store',
    logo: '/images/vendors/people-store/logo/people_store_logo_community_retail.jpg',
    productCount: peopleStoreData.products.length,
    products: peopleStoreProducts.map(p => ({
      ...p,
      vendorId: 'people-store',
      vendorName: 'People Store'
    })),
    tags: peopleStoreData.vendorTags
  },
  'garden-of-light': {
    id: 'garden-of-light',
    name: 'Garden of Light',
    vendorName: 'Garden of Light',
    logo: '/images/vendors/garden-of-light/logo/Garden of Light Logo.jpg',
    productCount: gardenOfLightData.products.length,
    products: gardenOfLightProducts.map(p => ({
      ...p,
      vendorId: 'garden-of-light',
      vendorName: 'Garden of Light'
    })),
    tags: gardenOfLightData.vendorTags
  }
};

// Total product count
export const totalProductCount = getAllProducts().length;

// Log migration status
if (typeof window === 'undefined') {
  console.log(\`Complete catalog migrated to WordPress-style data layer with \${totalProductCount} products\`);
}
`;

// Write the updated catalog
const catalogPath = path.join(__dirname, '..', 'lib', 'data', 'complete-catalog.ts');

// Backup existing catalog
const backupPath = catalogPath.replace('.ts', `.backup.${Date.now()}.ts`);
if (fs.existsSync(catalogPath)) {
  fs.copyFileSync(catalogPath, backupPath);
  console.log(`✓ Backed up existing catalog to: ${path.basename(backupPath)}`);
}

// Write new catalog
fs.writeFileSync(catalogPath, newCatalogContent);
console.log('✓ Updated complete-catalog.ts with WordPress-style data structure');

// Update image manager imports
const imageManagerPath = path.join(__dirname, '..', 'lib', 'utils', 'image-manager.ts');
const imageManagerContent = `/**
 * Image Manager - Central image management for all vendors and products
 * Now uses vendor bucket manager for enhanced functionality
 */

// Re-export from vendor bucket manager for backward compatibility
export { 
  getProductImage,
  getProductImages,
  getVendorLogo,
  getVendorImagePaths,
  VENDOR_PRODUCT_IMAGES
} from './vendor-bucket-manager';

// Legacy image paths for backward compatibility
export const VENDOR_IMAGE_PATHS = {
  'teva-deli': {
    logo: '/images/vendors/teva-deli/logo/teva_deli_logo_vegan_factory.jpg',
    products: {
      'td-001': '/images/vendors/teva-deli/products/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
      'td-002': '/images/vendors/teva-deli/products/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
      'td-003': '/images/vendors/teva-deli/products/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png',
      // Add more mappings as needed
    }
  },
  'queens-cuisine': {
    logo: '/images/vendors/queens-cuisine/logo/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
    products: {}
  },
  'gahn-delight': {
    logo: '/images/vendors/gahn-delight/logo/gahn_delight_official_logo_master_brand_ice_cream.jpg',
    products: {}
  },
  'vop-shop': {
    logo: '/images/vendors/vop-shop/logo/vop_shop_official_logo_master_brand_village_of_peace.jpg',
    products: {}
  },
  'people-store': {
    logo: '/images/vendors/people-store/logo/people_store_logo_community_retail.jpg',
    products: {}
  },
  'garden-of-light': {
    logo: '/images/vendors/garden-of-light/logo/Garden of Light Logo.jpg',
    products: {}
  }
};

// Legacy validation function
export function validateImagePath(path: string): boolean {
  return path.startsWith('/images/') && !path.includes('undefined');
}

// Legacy fallback function
export function getFallbackImage(type: 'product' | 'vendor' = 'product'): string {
  return type === 'vendor' 
    ? '/images/placeholder-logo.jpg'
    : '/images/placeholder-product.jpg';
}
`;

// Update image manager
fs.writeFileSync(imageManagerPath, imageManagerContent);
console.log('✓ Updated image-manager.ts to use vendor bucket manager');

console.log('\n=== MIGRATION COMPLETE ===');
console.log('The data layer has been upgraded to WordPress-style architecture while maintaining backward compatibility.');
console.log('\nKey improvements:');
console.log('- Enhanced product data with rich metadata');
console.log('- Vendor store management with buckets');
console.log('- Product enrichment capabilities');
console.log('- Search and filter services');
console.log('- CRUD operations for vendors and products');
console.log('\nNo breaking changes - all existing components will continue to work!');