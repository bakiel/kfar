import { Product } from '@/lib/types/product';
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
    logo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    productCount: tevaDeliCompleteProducts.length,
    products: tevaDeliCompleteProducts,
    tags: ['founding-vendor', 'certified', 'vegan', 'kosher', 'meat-alternatives']
  },
  'queens-cuisine': {
    id: 'queens-cuisine', 
    name: "Queen's Cuisine",
    vendorName: "Queen's Cuisine",
    logo: '/images/vendors/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
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
    logo: '/images/vendors/gahn_delight_official_logo_master_brand_ice_cream.jpg',
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
    logo: '/images/vendors/vop_shop_official_logo_master_brand_village_of_peace.jpg',
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
    logo: '/images/vendors/people_store_logo_community_retail.jpg',
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
    logo: '/images/vendors/Garden of Light Logo.jpg',
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
  console.log(`Complete catalog migrated to WordPress-style data layer with ${totalProductCount} products`);
}
