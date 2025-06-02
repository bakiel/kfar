import { notFound } from 'next/navigation';
import { completeProductCatalog } from '@/lib/data/complete-catalog';
import VendorStorePage from '@/components/vendor/VendorStorePage';
import Layout from '@/components/layout/Layout';
import { Product } from '@/lib/data/products';

interface PageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

// Vendor theme mappings based on their brand identity
const vendorThemes = {
  'teva-deli': 'modern',
  'queens-cuisine': 'artisanal', 
  'gahn-delight': 'fresh',
  'atur-avior': 'premium',
  'people-store': 'community',
  'vop-shop': 'heritage'
} as const;

// Extended vendor data configurations
const vendorConfigs = {
  'teva-deli': {
    bannerImage: '/images/vendors/people_store_banner_community.jpg',
    estimatedDeliveryTime: '1-2 days',
    minimumOrder: 150,
    certifications: ['Badatz', 'Vegan Certified'],
    features: ['Plant-Based', 'Kosher Certified', 'Made in Israel', 'No Preservatives', 'High Protein'],
    operatingHours: [
      { day: 'Sunday', open: '08:00', close: '18:00' },
      { day: 'Monday', open: '08:00', close: '18:00' },
      { day: 'Tuesday', open: '08:00', close: '18:00' },
      { day: 'Wednesday', open: '08:00', close: '18:00' },
      { day: 'Thursday', open: '08:00', close: '18:00' },
      { day: 'Friday', open: '08:00', close: '14:00' },
      { day: 'Saturday', closed: true }
    ],
    contactInfo: {
      phone: '03-123-4567',
      email: 'info@tevadeli.co.il',
      address: 'Industrial Zone, Kiryat Malachi, Israel'
    }
  },
  'queens-cuisine': {
    bannerImage: '/images/vendors/queens_cuisine_product_banner_vegan_meat_alternatives_plant_based_cuisine_display_01.jpg',
    estimatedDeliveryTime: '2-3 days',
    minimumOrder: 200,
    certifications: ['Organic', 'Vegan Society'],
    features: ['Artisanal', 'Small Batch', 'Traditional Methods', 'Zero Waste', 'Local Ingredients'],
    operatingHours: [
      { day: 'Sunday', open: '09:00', close: '17:00' },
      { day: 'Monday', open: '09:00', close: '17:00' },
      { day: 'Tuesday', open: '09:00', close: '17:00' },
      { day: 'Wednesday', open: '09:00', close: '17:00' },
      { day: 'Thursday', open: '09:00', close: '17:00' },
      { day: 'Friday', open: '09:00', close: '13:00' },
      { day: 'Saturday', closed: true }
    ],
    contactInfo: {
      phone: '08-655-8900',
      email: 'orders@queenscuisine.co.il',
      address: 'Village of Peace, Dimona'
    }
  },
  'gahn-delight': {
    bannerImage: '/images/vendors/teva_deli_banner_plant_based_factory.jpg',
    estimatedDeliveryTime: 'Same day',
    minimumOrder: 80,
    certifications: ['Kosher Dairy', 'Natural'],
    features: ['Handcrafted', 'Natural Ingredients', 'No Artificial Colors', 'Small Batch', 'Seasonal Flavors'],
    operatingHours: [
      { day: 'Sunday', open: '10:00', close: '22:00' },
      { day: 'Monday', open: '10:00', close: '22:00' },
      { day: 'Tuesday', open: '10:00', close: '22:00' },
      { day: 'Wednesday', open: '10:00', close: '22:00' },
      { day: 'Thursday', open: '10:00', close: '22:00' },
      { day: 'Friday', open: '10:00', close: '15:00' },
      { day: 'Saturday', open: '20:00', close: '23:00' }
    ],
    contactInfo: {
      phone: '08-655-3333',
      email: 'sweet@gahndelight.com',
      address: 'Main Street, Village of Peace'
    }
  },
  'atur-avior': {
    bannerImage: '/images/vendors/queens_cuisine_banner_artisanal.jpg',
    estimatedDeliveryTime: '1-2 days',
    minimumOrder: 250,
    certifications: ['USDA Organic', 'Demeter Biodynamic'],
    features: ['Premium Quality', 'Biodynamic', 'Raw Foods', 'Superfood Blends', 'Eco-Packaging'],
    operatingHours: [
      { day: 'Sunday', open: '08:00', close: '16:00' },
      { day: 'Monday', open: '08:00', close: '16:00' },
      { day: 'Tuesday', open: '08:00', close: '16:00' },
      { day: 'Wednesday', open: '08:00', close: '16:00' },
      { day: 'Thursday', open: '08:00', close: '16:00' },
      { day: 'Friday', open: '08:00', close: '13:00' },
      { day: 'Saturday', closed: true }
    ],
    contactInfo: {
      phone: '08-655-7777',
      email: 'wellness@gardenoflight.co.il',
      address: 'Wellness Center, Village of Peace'
    }
  },
  'people-store': {
    bannerImage: '/images/vendors/garden_of_light_banner_premium.jpg',
    estimatedDeliveryTime: 'Pickup available',
    minimumOrder: 50,
    certifications: ['Community Certified', 'Fair Trade'],
    features: ['Community Owned', 'Bulk Options', 'Local Suppliers', 'Zero Plastic', 'Member Discounts'],
    operatingHours: [
      { day: 'Sunday', open: '07:00', close: '20:00' },
      { day: 'Monday', open: '07:00', close: '20:00' },
      { day: 'Tuesday', open: '07:00', close: '20:00' },
      { day: 'Wednesday', open: '07:00', close: '20:00' },
      { day: 'Thursday', open: '07:00', close: '20:00' },
      { day: 'Friday', open: '07:00', close: '15:00' },
      { day: 'Saturday', closed: true }
    ],
    contactInfo: {
      phone: '08-655-1234',
      email: 'info@peoplestore.coop',
      address: 'Community Center, Village of Peace'
    }
  },
  'vop-shop': {
    bannerImage: '/images/vendors/gahn_delight_banner_ice_cream.jpg',
    estimatedDeliveryTime: '3-5 days',
    minimumOrder: 100,
    certifications: ['Heritage Crafts', 'Authentic'],
    features: ['50+ Year Heritage', 'Handmade Items', 'Cultural Artifacts', 'Educational Resources', 'Community Support'],
    operatingHours: [
      { day: 'Sunday', open: '09:00', close: '17:00' },
      { day: 'Monday', open: '09:00', close: '17:00' },
      { day: 'Tuesday', open: '09:00', close: '17:00' },
      { day: 'Wednesday', open: '09:00', close: '17:00' },
      { day: 'Thursday', open: '09:00', close: '17:00' },
      { day: 'Friday', open: '09:00', close: '14:00' },
      { day: 'Saturday', closed: true }
    ],
    contactInfo: {
      phone: '08-655-5000',
      email: 'heritage@vopshop.org',
      address: 'Heritage Center, Village of Peace'
    }
  }
};

export default async function StorePage({ params }: PageProps) {
  const { vendorId } = await params;
  const vendorCatalog = completeProductCatalog[vendorId];
  
  if (!vendorCatalog) {
    notFound();
  }

  // Convert vendor catalog to vendor object for compatibility
  const vendor = {
    id: vendorCatalog.vendorId,
    name: vendorCatalog.vendorName,
    nameHe: vendorCatalog.vendorName, // Can be enhanced later
    products: vendorCatalog.products
  };

  // Transform vendor products to match Product interface
  const products: Product[] = vendor.products.map(p => ({
    id: p.id,
    name: p.name,
    nameHe: p.nameHe || p.name,
    description: p.description,
    descriptionHe: p.descriptionHe || p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    category: p.category || 'general',
    vendor: vendor.name,
    vendorId: vendor.id,
    inStock: p.inStock !== false,
    isNew: p.isNew || false,
    isFeatured: p.isFeatured || false,
    tags: p.tags || [],
    kashrut: p.kashrut || 'badatz',
    organic: p.organic || false,
    vegan: true,
    glutenFree: p.glutenFree || false,
    sugarFree: p.sugarFree || false
  }));

  // Map vendor logos to correct paths
  const getVendorLogo = (vendorId: string) => {
    const logoMap: { [key: string]: string } = {
      'teva-deli': '/images/vendors/teva_deli_logo_vegan_factory.jpg',
      'queens-cuisine': '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      'gahn-delight': '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      'atur-avior': '/images/vendors/Garden of Light Logo.jpg',
      'people-store': '/images/vendors/people_store_logo_community_retail.jpg',
      'vop-shop': '/images/vendors/vop_shop_logo_village_marketplace.jpg'
    };
    return logoMap[vendorId] || `/images/vendors/${vendorId}_logo.jpg`;
  };

  // Merge vendor data with extended configurations
  const vendorData = {
    ...vendor,
    businessName: vendor.name,
    businessNameHe: vendor.nameHe || vendor.name,
    productCount: vendor.products.length,
    logo: getVendorLogo(vendor.id),
    description: `Premium ${vendor.name} products - ${vendor.products.length} items available`,
    rating: 4.8,
    reviewCount: 156,
    deliveryOptions: ['pickup', 'delivery'],
    paymentMethods: ['cash', 'card', 'bit'],
    deliveryFee: 20,
    socialMedia: {
      facebook: `https://facebook.com/${vendor.id}`,
      instagram: `https://instagram.com/${vendor.id}`
    },
    ...(vendorConfigs[vendor.id as keyof typeof vendorConfigs] || {})
  };

  const theme = vendorThemes[vendor.id as keyof typeof vendorThemes] || 'modern';

  // Temporarily disable template system to avoid cart context issues
  const useTemplateSystem = false;

  // Fallback to original component with Layout wrapper
  return (
    <Layout>
      <VendorStorePage 
        vendorId={vendor.id}
        vendorData={vendorData}
        products={products}
        theme={theme}
      />
    </Layout>
  );
}