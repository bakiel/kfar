import { NextResponse } from 'next/server';

// Mock vendor data
const vendors = [
  {
    id: 'teva-deli',
    name: 'Teva Deli',
    description: 'Premium Israeli vegan deli since 1983',
    logo: '/images/vendors/teva_deli_official_logo_master_brand_israeli_vegan_food_company.jpg',
    rating: 4.8,
    products: []
  },
  {
    id: 'queens-cuisine',
    name: "Queen's Cuisine",
    description: 'Artisan plant-based meat alternatives',
    logo: '/images/vendors/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
    rating: 4.9,
    products: []
  },
  {
    id: 'gahn-delight',
    name: 'Gahn Delight',
    description: 'Handcrafted vegan ice cream & desserts',
    logo: '/images/vendors/gahn_delight_official_logo_master_brand_ice_cream.jpg',
    rating: 4.7,
    products: []
  },
  {
    id: 'atur-avior',
    name: 'Garden of Light',
    description: 'Organic superfood blends & wellness',
    logo: '/images/vendors/Garden of Light Logo.jpg',
    rating: 4.9,
    products: []
  },
  {
    id: 'people-store',
    name: 'People Store',
    description: 'Community marketplace for daily essentials',
    logo: '/images/vendors/people_store_logo_community_retail.jpg',
    rating: 4.6,
    products: []
  },
  {
    id: 'vop-shop',
    name: 'VOP Shop',
    description: 'Village of Peace heritage & wellness products',
    logo: '/images/vendors/vop_shop_official_logo_master_brand_village_of_peace.jpg',
    rating: 4.8,
    products: []
  }
];

export async function GET() {
  return NextResponse.json({
    vendors: vendors,
    pagination: {
      total: vendors.length,
      page: 1,
      limit: 10
    }
  });
}