import React from 'react';
import Layout from '@/components/layout/Layout';
import ImageGallery from '@/components/product/ImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import Image from 'next/image';
import Link from 'next/link';

// This would typically come from a database/API
const getProductData = (id: string) => {
  return {
    id: id,
    name: 'Teva Deli Vegan Seitan Kubeh',
    description: 'Traditional Middle Eastern kubeh made with premium plant-based seitan',
    price: 24.90,
    vendorId: 'teva-deli',
    vendorName: 'Teva Deli',
    vendorLogo: '/images/vendors/teva_deli_official_logo_master_brand_israeli_vegan_food_company.jpg',
    vendorDescription: "Israel's pioneering vegan food manufacturer, Teva Deli has been creating exceptional plant-based products since 1983.",
    vendorRating: 4.9,
    vendorYears: '40+',
    category: 'Protein Products',
    features: ['Vegan', 'Kosher', 'Organic'],
    inStock: true,
    rating: 5,
    reviewCount: 127,
    images: [
      '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
      '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
      '/images/vendors/teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
      '/images/vendors/teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg'
    ],
    ingredients: [
      'Organic wheat gluten (seitan base)',
      'Bulgur wheat',
      'Onions, garlic',
      'Traditional Middle Eastern spices',
      'Vegetable broth',
      'Extra virgin olive oil'
    ],
    nutrition: {
      'calories': '180',
      'protein': '22g',
      'carbohydrates': '15g',
      'fat': '4g',
      'fiber': '3g',
      'sodium': '380mg'
    },
    culturalInfo: `Kubeh holds special significance in Middle Eastern cuisine and in our Village of Peace community. This traditional dish represents the coming together of families and the celebration of heritage. Our vegan interpretation honors these traditions while aligning with our community's values of compassionate living and environmental stewardship.

Made using recipes developed over 40+ years by Teva Deli, Israel's pioneering vegan food manufacturer, this kubeh represents the successful fusion of ancient culinary wisdom with modern plant-based innovation.`,
    preparation: [
      'Steam for 15-20 minutes',
      'Pan-fry with olive oil for crispy exterior',
      'Add to soups and stews',
      'Serve with tahini or yogurt sauce'
    ],
    storage: [
      'Refrigerate: Up to 5 days',
      'Freeze: Up to 3 months',
      'Keep in original packaging',
      'Consume within 2 days of opening'
    ]
  };
};

const relatedProducts = [
  {
    id: '2',
    name: 'Vegan Seitan Schnitzel',
    price: 28.90,
    image: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
    rating: 5
  },
  {
    id: '3',
    name: 'Plant Protein Mix',
    price: 22.50,
    image: '/images/vendors/teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg',
    rating: 4
  },
  {
    id: '4',
    name: 'Traditional Seitan',
    price: 26.00,
    image: '/images/vendors/teva_deli_vegan_specialty_product_02_plant_based_meat_alternative_israeli_cuisine.jpg',
    rating: 5
  }
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductData(params.id);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-leaf-green transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-leaf-green transition-colors">Food & Beverages</Link>
          <span className="mx-2">/</span>
          <Link href="/categories/protein" className="hover:text-leaf-green transition-colors">Protein Products</Link>
          <span className="mx-2">/</span>
          <span style={{ color: '#3a3a1d' }} className="font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <ImageGallery images={product.images} productName={product.name} />

            {/* Product Tabs */}
            <ProductTabs
              ingredients={product.ingredients}
              nutrition={product.nutrition}
              culturalInfo={product.culturalInfo}
              preparation={product.preparation}
              storage={product.storage}
            />

            {/* Vendor Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={product.vendorLogo}
                  alt={product.vendorName}
                  width={64}
                  height={64}
                  className="rounded-full border-2"
                  style={{ borderColor: '#478c0b' }}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold" style={{ color: '#3a3a1d' }}>
                    {product.vendorName}
                  </h3>
                  <p className="text-gray-600">Established 1983 • {product.vendorYears} Years of Excellence</p>
                  <div className="flex items-center gap-1 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-sun-gold"></i>
                    ))}
                    <span className="ml-1 text-gray-600">({product.vendorRating} avg)</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{product.vendorDescription}</p>
              <div className="flex gap-3">
                <Link
                  href={`/vendor/${product.vendorId}`}
                  className="px-4 py-2 rounded-lg font-medium text-sm border-2 transition-all hover:shadow-md flex items-center gap-2"
                  style={{ borderColor: '#478c0b', color: '#478c0b' }}
                >
                  <i className="fas fa-store"></i>
                  Visit Store
                </Link>
                <button className="px-4 py-2 rounded-lg font-medium text-sm border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-2">
                  <i className="fas fa-phone"></i>
                  Contact
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Product Info & Purchase */}
              <ProductInfo product={product} />

              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-semibold mb-4" style={{ color: '#3a3a1d' }}>
                  Shipping Options:
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-store text-leaf-green"></i>
                      Local Pickup (VOP)
                    </span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-truck text-sun-gold"></i>
                      Dimona Delivery
                    </span>
                    <span>₪5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-mail-bulk text-earth-flame"></i>
                      Israel Post
                    </span>
                    <span>₪15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-globe text-gray-600"></i>
                      International
                    </span>
                    <span>₪45</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-shield-alt text-2xl text-leaf-green"></i>
                    <span className="text-xs font-medium">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-undo text-2xl text-leaf-green"></i>
                    <span className="text-xs font-medium">Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-leaf text-2xl text-leaf-green"></i>
                    <span className="text-xs font-medium">100% Vegan</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <i className="fas fa-certificate text-2xl text-leaf-green"></i>
                    <span className="text-xs font-medium">Kosher Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3a3a1d' }}>
            You Might Also Like
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/product/${relatedProduct.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h5 className="font-semibold text-sm mb-2" style={{ color: '#3a3a1d' }}>
                    {relatedProduct.name}
                  </h5>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: '#478c0b' }}>
                      ₪{relatedProduct.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star text-xs ${i < relatedProduct.rating ? 'text-sun-gold' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}