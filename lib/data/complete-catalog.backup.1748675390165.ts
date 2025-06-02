import { Product } from '@/lib/types/product';
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
  // Teva Deli - 45 products
  ...tevaDeliCompleteProducts,
  
  // Queens Cuisine - 26 products
  ...queensCuisineProducts.map(p => ({
    ...p,
    vendorId: 'queens-cuisine',
    vendorName: "Queen's Cuisine"
  })),
  
  // Gahn Delight - 7 products
  ...gahnDelightProducts.map(p => ({
    ...p,
    vendorId: 'gahn-delight',
    vendorName: 'Gahn Delight'
  })),
  
  // VOP Shop - 15 products
  ...vopShopProducts.map(p => ({
    ...p,
    vendorId: 'vop-shop',
    vendorName: 'VOP Shop'
  })),
  
  // People Store - 25 products
  ...peopleStoreProducts.map(p => ({
    ...p,
    vendorId: 'people-store',
    vendorName: 'People Store'
  })),
  
  // Garden of Light - 12 products
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
    productCount: 45,
    tags: ['founding-vendor', 'certified', 'vegan', 'kosher', 'meat-alternatives']
  },
  'queens-cuisine': {
    id: 'queens-cuisine',
    name: "Queen's Cuisine",
    logo: '/images/vendors/queens-cuisine/logo/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
    productCount: 26,
    tags: ["founding-vendor","certified","vegan","kosher","meat-alternatives","gourmet","catering"]
  },
  'gahn-delight': {
    id: 'gahn-delight',
    name: 'Gahn Delight',
    logo: '/images/vendors/gahn-delight/logo/gahn_delight_official_logo_master_brand_ice_cream.jpg',
    productCount: 7,
    tags: ["founding-vendor","certified","vegan","kosher","desserts","ice-cream","artisan"]
  },
  'vop-shop': {
    id: 'vop-shop',
    name: 'VOP Shop',
    logo: '/images/vendors/vop-shop/logo/vop_shop_official_logo_master_brand_village_of_peace.jpg',
    productCount: 15,
    tags: ["community-brand","heritage","apparel","wellness","education","anniversary"]
  },
  'people-store': {
    id: 'people-store',
    name: 'People Store',
    logo: '/images/vendors/people-store/logo/people_store_logo_community_retail.jpg',
    productCount: 25,
    tags: ["founding-vendor","community-store","bulk-foods","organic","fermented","beverages"]
  },
  'garden-of-light': {
    id: 'garden-of-light',
    name: 'Garden of Light',
    logo: '/images/vendors/garden-of-light/logo/Garden of Light Logo.jpg',
    productCount: 12,
    tags: ["vegan","organic","kosher","deli","spreads","salads","natural"]
  }
};

// Total product count
export const totalProductCount = completeProductCatalog.length;

console.log(`Complete catalog updated with ${totalProductCount} products across 6 vendors`);
