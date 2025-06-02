#!/usr/bin/env node

/**
 * Update Complete Catalog Script
 * Consolidates all vendor products into the main complete-catalog.ts
 */

const fs = require('fs');
const path = require('path');

// Read all vendor catalogs
const dataDir = path.join(__dirname, '..', 'lib', 'data');

// Read vendor catalog files
const tevaDeliCatalog = fs.readFileSync(path.join(dataDir, 'teva-deli-complete-catalog.ts'), 'utf8');
const queensCuisine = JSON.parse(fs.readFileSync(path.join(dataDir, 'queens-cuisine-complete-catalog.json'), 'utf8'));
const gahnDelight = JSON.parse(fs.readFileSync(path.join(dataDir, 'gahn-delight-complete-catalog.json'), 'utf8'));
const vopShop = JSON.parse(fs.readFileSync(path.join(dataDir, 'vop-shop-complete-catalog.json'), 'utf8'));
const peopleStore = JSON.parse(fs.readFileSync(path.join(dataDir, 'people-store-complete-catalog.json'), 'utf8'));
const gardenOfLight = JSON.parse(fs.readFileSync(path.join(dataDir, 'garden-of-light-complete-catalog.json'), 'utf8'));

// Extract Teva Deli products count from the TypeScript file
const tevaMatch = tevaDeliCatalog.match(/export const tevaDeliCompleteProducts[^=]*=\s*\[([\s\S]*?)\];/);
const tevaProducts = tevaMatch ? tevaMatch[1].split('},').filter(p => p.includes('id:')).length : 46;

// Create the updated complete catalog
const completeCatalogContent = `import { Product } from '@/lib/types/product';
import { tevaDeliCompleteProducts } from './teva-deli-complete-catalog';

// Import all vendor catalogs
import queensCuisineData from './queens-cuisine-complete-catalog.json';
import gahnDelightData from './gahn-delight-complete-catalog.json';
import vopShopData from './vop-shop-complete-catalog.json';
import peopleStoreData from './people-store-complete-catalog.json';
import gardenOfLightData from './garden-of-light-complete-catalog.json';

// Type the imported data
const queensCuisineProducts = queensCuisineData.products as Product[];
const gahnDelightProducts = gahnDelightData.products as Product[];
const vopShopProducts = vopShopData.products as Product[];
const peopleStoreProducts = peopleStoreData.products as Product[];
const gardenOfLightProducts = gardenOfLightData.products as Product[];

// Combine all products with vendor information
export const completeProductCatalog: Product[] = [
  // Teva Deli - ${tevaProducts} products
  ...tevaDeliCompleteProducts,
  
  // Queens Cuisine - ${queensCuisine.products.length} products
  ...queensCuisineProducts.map(p => ({
    ...p,
    vendorId: 'queens-cuisine',
    vendorName: "Queen's Cuisine"
  })),
  
  // Gahn Delight - ${gahnDelight.products.length} products
  ...gahnDelightProducts.map(p => ({
    ...p,
    vendorId: 'gahn-delight',
    vendorName: 'Gahn Delight'
  })),
  
  // VOP Shop - ${vopShop.products.length} products
  ...vopShopProducts.map(p => ({
    ...p,
    vendorId: 'vop-shop',
    vendorName: 'VOP Shop'
  })),
  
  // People Store - ${peopleStore.products.length} products
  ...peopleStoreProducts.map(p => ({
    ...p,
    vendorId: 'people-store',
    vendorName: 'People Store'
  })),
  
  // Garden of Light - ${gardenOfLight.products.length} products
  ...gardenOfLightProducts.map(p => ({
    ...p,
    vendorId: 'garden-of-light',
    vendorName: 'Garden of Light'
  }))
];

// Export vendor information
export const vendorInfo = {
  'teva-deli': {
    id: 'teva-deli',
    name: 'Teva Deli',
    logo: '/images/vendors/teva-deli/logo/teva_deli_logo_vegan_factory.jpg',
    productCount: ${tevaProducts},
    tags: ['founding-vendor', 'certified', 'vegan', 'kosher', 'meat-alternatives']
  },
  'queens-cuisine': {
    id: 'queens-cuisine',
    name: "Queen's Cuisine",
    logo: '/images/vendors/queens-cuisine/logo/${queensCuisine.logo}',
    productCount: ${queensCuisine.products.length},
    tags: ${JSON.stringify(queensCuisine.vendorTags)}
  },
  'gahn-delight': {
    id: 'gahn-delight',
    name: 'Gahn Delight',
    logo: '/images/vendors/gahn-delight/logo/${gahnDelight.logo}',
    productCount: ${gahnDelight.products.length},
    tags: ${JSON.stringify(gahnDelight.vendorTags)}
  },
  'vop-shop': {
    id: 'vop-shop',
    name: 'VOP Shop',
    logo: '/images/vendors/vop-shop/logo/${vopShop.logo}',
    productCount: ${vopShop.products.length},
    tags: ${JSON.stringify(vopShop.vendorTags)}
  },
  'people-store': {
    id: 'people-store',
    name: 'People Store',
    logo: '/images/vendors/people-store/logo/${peopleStore.logo}',
    productCount: ${peopleStore.products.length},
    tags: ${JSON.stringify(peopleStore.vendorTags)}
  },
  'garden-of-light': {
    id: 'garden-of-light',
    name: 'Garden of Light',
    logo: '/images/vendors/garden-of-light/logo/${gardenOfLight.logo}',
    productCount: ${gardenOfLight.products.length},
    tags: ${JSON.stringify(gardenOfLight.vendorTags)}
  }
};

// Total product count
export const totalProductCount = completeProductCatalog.length;

console.log(\`Complete catalog updated with \${totalProductCount} products across 6 vendors\`);
`;

// Write the updated complete catalog
fs.writeFileSync(path.join(dataDir, 'complete-catalog.ts'), completeCatalogContent);

// Calculate totals
const totalProducts = tevaProducts + queensCuisine.products.length + gahnDelight.products.length + 
                     vopShop.products.length + peopleStore.products.length + gardenOfLight.products.length;

console.log('✓ Updated complete-catalog.ts');
console.log(`\nTotal products: ${totalProducts}`);
console.log('- Teva Deli: ' + tevaProducts);
console.log('- Queens Cuisine: ' + queensCuisine.products.length);
console.log('- Gahn Delight: ' + gahnDelight.products.length);
console.log('- VOP Shop: ' + vopShop.products.length);
console.log('- People Store: ' + peopleStore.products.length);
console.log('- Garden of Light: ' + gardenOfLight.products.length);