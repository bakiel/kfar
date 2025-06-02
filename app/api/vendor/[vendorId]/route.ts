import { NextRequest, NextResponse } from 'next/server';
import { completeProductCatalog } from '@/lib/data/complete-catalog';

// This is the route the vendor store page is actually calling
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  const { vendorId } = await params;
  
  // Check localStorage simulation for onboarded vendors
  // In a real app, this would check a database
  
  // Get vendor data from catalog
  const vendorData = completeProductCatalog[vendorId as keyof typeof completeProductCatalog];
  
  if (!vendorData) {
    return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
  }
  
  // Create full vendor store data
  const storeData = {
    id: vendorId,
    storeName: vendorData.vendorName,
    storeNameHe: getHebrewName(vendorId),
    category: getVendorCategory(vendorId),
    description: getVendorDescription(vendorId),
    descriptionHe: '',
    logo: getVendorLogo(vendorId),
    banner: `/images/banners/${getBannerNumber(vendorId)}.jpg`,
    phone: '+972-50-123-4567',
    email: `${vendorId}@kfarmarketplace.com`,
    address: 'Village of Peace, Dimona, Israel',
    deliveryOptions: ['pickup', 'local-delivery'],
    businessHours: {
      sunday: { open: '09:00', close: '18:00', closed: false },
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '14:00', closed: false },
      saturday: { open: '20:00', close: '23:00', closed: false },
    },
    products: vendorData.products,
    policies: {
      returnPolicy: '30-day return policy for all items in original condition',
      shippingPolicy: 'Free local delivery on orders over ₪100',
      privacyPolicy: 'We respect your privacy and protect your personal data'
    }
  };
  
  return NextResponse.json(storeData);
}

function getHebrewName(vendorId: string): string {
  const names: { [key: string]: string } = {
    'teva-deli': 'טבע דלי',
    'queens-cuisine': 'מטבח המלכה',
    'gahn-delight': 'גן עונג',
    'atur-avior': 'גן האור',
    'people-store': 'חנות העם',
    'vop-shop': 'חנות כפר השלום'
  };
  return names[vendorId] || '';
}

function getVendorCategory(vendorId: string): string {
  const categories: { [key: string]: string } = {
    'teva-deli': 'food',
    'queens-cuisine': 'food',
    'gahn-delight': 'desserts',
    'atur-avior': 'wellness',
    'people-store': 'grocery',
    'vop-shop': 'lifestyle'
  };
  return categories[vendorId] || 'food';
}

function getVendorDescription(vendorId: string): string {
  const descriptions: { [key: string]: string } = {
    'teva-deli': 'Premium Israeli vegan deli since 1983, creating innovative plant-based alternatives',
    'queens-cuisine': 'Artisan plant-based meat alternatives with authentic Middle Eastern flavors',
    'gahn-delight': 'Handcrafted vegan ice cream & desserts made with love and natural ingredients',
    'atur-avior': 'Organic superfood blends & wellness products for a healthy lifestyle',
    'people-store': 'Community marketplace for daily essentials and specialty ingredients',
    'vop-shop': 'Village of Peace heritage & wellness products celebrating 50 years'
  };
  return descriptions[vendorId] || '';
}

function getVendorLogo(vendorId: string): string {
  const logos: { [key: string]: string } = {
    'teva-deli': '/images/vendors/teva_deli_official_logo_master_brand_israeli_vegan_food_company.jpg',
    'queens-cuisine': '/images/vendors/queens_cuisine_official_logo_master_brand_plant_based_catering.jpg',
    'gahn-delight': '/images/vendors/gahn_delight_official_logo_master_brand_ice_cream.jpg',
    'atur-avior': '/images/vendors/Garden of Light Logo.jpg',
    'people-store': '/images/vendors/people_store_logo_community_retail.jpg',
    'vop-shop': '/images/vendors/vop_shop_official_logo_master_brand_village_of_peace.jpg'
  };
  return logos[vendorId] || '';
}

function getBannerNumber(vendorId: string): number {
  const banners: { [key: string]: number } = {
    'teva-deli': 1,
    'queens-cuisine': 2,
    'gahn-delight': 3,
    'atur-avior': 4,
    'people-store': 5,
    'vop-shop': 6
  };
  return banners[vendorId] || 1;
}