/**
 * WordPress-Style Data Management Layer for KFAR Marketplace
 * PERFECTED VERSION - All vendors properly integrated
 */

import { Product } from '@/lib/types/product';
import { tevaDeliCompleteProducts } from './teva-deli-complete-catalog';
import queensCuisineData from './queens-cuisine-complete-catalog.json';
import gahnDelightData from './gahn-delight-complete-catalog.json';
import vopShopData from './vop-shop-complete-catalog.json';
import peopleStoreData from './people-store-complete-catalog.json';
import gardenOfLightData from './garden-of-light-complete-catalog.json';

// Enhanced vendor store structure
export interface VendorStore {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner?: string;
  products: Product[];
  categories: string[];
  featured: boolean;
  metadata: {
    established?: string;
    location?: string;
    specialty?: string;
    certifications?: string[];
  };
}

// Complete vendor stores with all products properly threaded
export const vendorStores: Record<string, VendorStore> = {
  'teva-deli': {
    id: 'teva-deli',
    name: 'Teva Deli',
    slug: 'teva-deli',
    description: 'Premium vegan deli products made with traditional Israeli recipes and modern plant-based techniques.',
    logo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
    banner: '/images/vendors/teva-deli/banner.jpg',
    products: tevaDeliCompleteProducts as Product[],
    categories: ['schnitzels', 'burgers', 'shawarma', 'kebabs', 'tofu', 'seitan'],
    featured: true,
    metadata: {
      established: '2015',
      location: 'Village of Peace, Dimona',
      specialty: 'Plant-based meat alternatives',
      certifications: ['Kosher Parve', 'Vegan Certified']
    }
  },
  
  'garden-of-light': {
    id: 'garden-of-light',
    name: 'Garden of Light',
    slug: 'garden-of-light',
    description: 'Artisanal vegan spreads, cheeses, and gourmet products crafted with love and fresh ingredients.',
    logo: '/images/vendors/Garden of Light Logo.jpg',
    banner: '/images/vendors/garden-of-light/banner.jpg',
    products: gardenOfLightData.products as Product[],
    categories: ['spreads', 'cheeses', 'salads', 'chocolates'],
    featured: true,
    metadata: {
      established: '2018',
      location: 'Village of Peace, Dimona',
      specialty: 'Vegan spreads and cheeses',
      certifications: ['Kosher Parve', 'Organic']
    }
  },
  
  'queens-cuisine': {
    id: 'queens-cuisine',
    name: "Queen's Cuisine",
    slug: 'queens-cuisine',
    description: 'Gourmet plant-based meat alternatives and ready-to-eat meals for the conscious food lover.',
    logo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
    banner: '/images/vendors/queens-cuisine/banner.jpg',
    products: queensCuisineData.products as Product[],
    categories: ['burgers', 'kebabs', 'meatballs', 'seitan', 'ready-meals'],
    featured: true,
    metadata: {
      established: '2019',
      location: 'Village of Peace, Dimona',
      specialty: 'Gourmet vegan meat alternatives',
      certifications: ['Kosher Parve']
    }
  },
  
  'gahn-delight': {
    id: 'gahn-delight',
    name: 'Gahn Delight',
    slug: 'gahn-delight',
    description: 'Handcrafted vegan ice creams and frozen desserts made with natural ingredients and creative flavors.',
    logo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
    banner: '/images/vendors/gahn-delight/banner.jpg',
    products: gahnDelightData.products as Product[],
    categories: ['ice-cream', 'sorbet', 'parfait', 'popsicles'],
    featured: true,
    metadata: {
      established: '2020',
      location: 'Village of Peace, Dimona',
      specialty: 'Vegan frozen desserts',
      certifications: ['Kosher Parve', 'Natural Ingredients']
    }
  },
  
  'vop-shop': {
    id: 'vop-shop',
    name: 'Village of Peace Shop',
    slug: 'vop-shop',
    description: 'Community store offering heritage apparel, wellness products, and educational materials.',
    logo: '/images/vendors/vop_shop_logo_village_marketplace.jpg',
    banner: '/images/vendors/vop-shop/banner.jpg',
    products: vopShopData.products as Product[],
    categories: ['apparel', 'books', 'art', 'wellness'],
    featured: true,
    metadata: {
      established: '2021',
      location: 'Village of Peace, Dimona',
      specialty: 'Community heritage products',
      certifications: ['Fair Trade', 'Community Made']
    }
  },
  
  'people-store': {
    id: 'people-store',
    name: "People's Store",
    slug: 'people-store',
    description: 'Community grocery offering bulk foods, pantry essentials, and specialty vegan products.',
    logo: '/images/vendors/people_store_logo_community_retail.jpg',
    banner: '/images/vendors/people-store/banner.jpg',
    products: peopleStoreData.products as Product[],
    categories: ['bulk-foods', 'pantry', 'snacks', 'beverages'],
    featured: true,
    metadata: {
      established: '2017',
      location: 'Village of Peace, Dimona',
      specialty: 'Bulk foods and pantry essentials',
      certifications: ['Kosher', 'Organic Options']
    }
  }
};

// Helper functions for data access
export function getAllProducts(): Product[] {
  return Object.values(vendorStores).flatMap(vendor => vendor.products);
}

export function getProductsByVendor(vendorId: string): Product[] {
  return vendorStores[vendorId]?.products || [];
}

export function getVendorStore(vendorId: string): VendorStore | undefined {
  return vendorStores[vendorId];
}

export function getProductById(productId: string): Product | undefined {
  return getAllProducts().find(p => p.id === productId);
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter(p => p.category === category);
}

export function getFeaturedProducts(limit: number = 12): Product[] {
  return getAllProducts()
    .filter(p => p.featured || p.badge)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase();
  return getAllProducts().filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.description?.toLowerCase().includes(searchTerm) ||
    p.category?.toLowerCase().includes(searchTerm)
  );
}

// Export vendor count for stats
export const VENDOR_COUNT = Object.keys(vendorStores).length;
export const TOTAL_PRODUCTS = getAllProducts().length;
