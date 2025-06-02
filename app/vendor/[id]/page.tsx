'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { productService, vendorService } from '@/lib/services/api-products';
import { useCart } from '@/lib/context/CartContext';
import type { Product, Vendor } from '@/lib/data/products';
import '@/styles/kfar-style-system.css';

export default function VendorStorePage() {
  const params = useParams();
  const vendorId = params.id as string;
  const { addToCart } = useCart();
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showQuickView, setShowQuickView] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<string[]>([]);

  useEffect(() => {
    fetchVendorData();
  }, [vendorId, selectedCategory, sortBy]);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      
      // Fetch vendor details
      const vendorData = await vendorService.getVendor(vendorId);
      if (!vendorData) return;
      setVendor(vendorData);
      
      // Fetch vendor products
      const { products: vendorProducts } = await vendorService.getVendorProducts(
        vendorId,
        {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sort: sortBy,
        }
      );
      setProducts(vendorProducts);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      vendorId: product.vendorId,
      vendorName: vendor?.name || '',
    });
    
    setAddedToCart([...addedToCart, product.id]);
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin kfar-border-leaf-green"></div>
              <div className="absolute inset-2 border-4 border-b-transparent rounded-full animate-spin kfar-border-sun-gold" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="text-body kfar-text-gray-600">Loading store...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!vendor) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-store-slash text-6xl mb-4 kfar-text-earth-flame"></i>
            <p className="text-body-lg kfar-text-gray-600 mb-4">Store not found</p>
            <Link href="/shop">
              <button className="btn btn-primary flex items-center gap-2 mx-auto">
                <i className="fas fa-arrow-left"></i>
                Back to Shop
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Get unique categories from products
  const categories = Array.from(new Set(products.flatMap(p => p.categories || [])));

  return (
    <Layout>
      <div className="min-h-screen kfar-bg-cream">
        {/* Enhanced Vendor Banner */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          {vendor.banner ? (
            <Image
              src={vendor.banner}
              alt={vendor.name || "Image"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 kfar-gradient-primary">
              <div className="absolute inset-0 cultural-pattern"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Vendor Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {vendor.logo && (
                  <div className="relative group">
                    <div className="absolute -inset-1 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition-opacity kfar-gradient-primary"></div>
                    <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white rounded-full p-3 shadow-2xl">
                      <Image
                        src={vendor.logo}
                        alt={vendor.name || "Image"}
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-h1">{vendor.name}</h1>
                    {vendor.verified && (
                      <span className="badge badge-success text-white flex items-center gap-1">
                        <i className="fas fa-check-circle"></i>
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-body-lg md:text-h5 opacity-90 mb-4 max-w-2xl">{vendor.description}</p>
                  <div className="flex flex-wrap items-center gap-6 text-body-sm md:text-body">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <i className="fas fa-star kfar-text-sun-gold"></i>
                      <span className="text-body font-bold">{vendor.rating.toFixed(1)}</span>
                      <span className="opacity-90">({vendor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <i className="fas fa-truck"></i>
                      <span>{vendor.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <i className="fas fa-shopping-basket"></i>
                      <span>Min. ₪{vendor.minimumOrder}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Navigation Bar */}
        <div className="bg-white kfar-shadow-md sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`btn ${
                    selectedCategory === 'all'
                      ? 'btn-primary'
                      : 'kfar-bg-gray-100 kfar-text-gray-700 hover:kfar-bg-gray-200'
                  } whitespace-nowrap`}
                >
                  All Products ({products.length})
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`btn ${
                      selectedCategory === category
                        ? 'btn-primary'
                        : 'kfar-bg-gray-100 kfar-text-gray-700 hover:kfar-bg-gray-200'
                    } whitespace-nowrap`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input text-body"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                  <option value="newest">Newest First</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 kfar-bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'grid' ? 'bg-white kfar-shadow-sm kfar-text-leaf-green' : 'kfar-text-gray-500'
                    }`}
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'list' ? 'bg-white kfar-shadow-sm kfar-text-leaf-green' : 'kfar-text-gray-500'
                    }`}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          {/* Promotional Banner */}
          {vendor.promotions && vendor.promotions.length > 0 && (
            <div className="mb-8 p-6 rounded-2xl text-white relative overflow-hidden kfar-bg-earth-flame kfar-shadow-lg">
              <div className="absolute inset-0 opacity-10 cultural-pattern"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-h2 mb-2">🎉 {vendor.promotions[0].title}</h3>
                  <p className="text-body-lg opacity-90">{vendor.promotions[0].description}</p>
                </div>
                <i className="fas fa-gift text-4xl opacity-50"></i>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          {products.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-box-open text-6xl mb-4 kfar-text-gray-400"></i>
              <p className="text-h5 kfar-text-gray-600">No products found in this category</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {products.map((product) => (
                <div key={product.id} className={viewMode === 'grid' ? '' : 'card'}>
                  {viewMode === 'grid' ? (
                    // Grid View Card
                    <div className="card group relative overflow-hidden hover:kfar-shadow-xl p-0">
                      {/* Quick View Button */}
                      <button
                        onClick={() => setShowQuickView(product.id)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity kfar-shadow-md hover:kfar-shadow-lg kfar-text-leaf-green"
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      {/* Product Image */}
                      <Link href={`/product/${product.id}`}>
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name || "Image"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {product.badge && (
                            <span className="absolute top-3 left-3 badge badge-error text-white">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="text-h5 mb-1 line-clamp-2 kfar-text-soil">
                          {product.name}
                        </h3>
                        <p className="text-body-sm kfar-text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star text-sm ${i < Math.floor(product.rating) ? 'kfar-text-sun-gold' : 'kfar-text-gray-300'}`}></i>
                            ))}
                            <span className="text-caption kfar-text-gray-600 ml-1">({product.reviewCount})</span>
                          </div>
                          {product.isVegan && (
                            <span className="badge badge-success">
                              <i className="fas fa-leaf mr-1"></i>Vegan
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-h4 kfar-text-earth-flame">
                              ₪{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-body-sm kfar-text-gray-500 line-through ml-2">
                                ₪{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`p-3 rounded-full text-white transition-all transform hover:scale-110 kfar-shadow-md hover:kfar-shadow-lg ${
                              addedToCart.includes(product.id) ? 'kfar-bg-leaf-green-dark' : 'kfar-bg-leaf-green'
                            }`}
                          >
                            <i className={`fas ${addedToCart.includes(product.id) ? 'fa-check' : 'fa-cart-plus'}`}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View Card
                    <div className="flex gap-6">
                      <Link href={`/product/${product.id}`}>
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name || "Image"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/product/${product.id}`}>
                              <h3 className="text-h4 mb-2 hover:kfar-text-leaf-green transition-colors kfar-text-soil">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-body kfar-text-gray-600 mb-3">{product.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? 'kfar-text-sun-gold' : 'kfar-text-gray-300'}`}></i>
                                ))}
                                <span className="text-body-sm kfar-text-gray-600 ml-1">({product.reviewCount})</span>
                              </div>
                              {product.isVegan && (
                                <span className="badge badge-success">
                                  <i className="fas fa-leaf mr-1"></i>Vegan
                                </span>
                              )}
                              {product.isKosher && (
                                <span className="badge kfar-bg-cream kfar-text-soil">
                                  <i className="fas fa-certificate mr-1"></i>Kosher
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mb-3">
                              <span className="text-h3 kfar-text-earth-flame">
                                ₪{product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-body-lg kfar-text-gray-500 line-through ml-2">
                                  ₪{product.originalPrice}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className={`btn btn-primary flex items-center gap-2 ${
                                addedToCart.includes(product.id) ? 'kfar-bg-leaf-green-dark' : ''
                              }`}
                            >
                              <i className={`fas ${addedToCart.includes(product.id) ? 'fa-check' : 'fa-cart-plus'}`}></i>
                              {addedToCart.includes(product.id) ? 'Added!' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendor Info Section */}
        <div className="bg-white mt-16 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* About Vendor */}
              <div>
                <h3 className="text-h2 mb-4 kfar-text-soil">
                  About {vendor.name}
                </h3>
                <p className="text-body kfar-text-gray-600 mb-6">{vendor.longDescription || vendor.description}</p>
                
                {/* Vendor Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg kfar-bg-cream">
                    <div className="text-h3 mb-1 kfar-text-leaf-green">
                      {vendor.yearsInBusiness || '5+'}
                    </div>
                    <div className="text-body-sm kfar-text-gray-600">Years in Business</div>
                  </div>
                  <div className="text-center p-4 rounded-lg kfar-bg-cream">
                    <div className="text-h3 mb-1 kfar-text-sun-gold">
                      {vendor.totalProducts || products.length}
                    </div>
                    <div className="text-body-sm kfar-text-gray-600">Products</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  {vendor.phone && (
                    <div className="flex items-center gap-3">
                      <i className="fas fa-phone w-5 kfar-text-leaf-green"></i>
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-3">
                      <i className="fas fa-envelope w-5 kfar-text-leaf-green"></i>
                      <span>{vendor.email}</span>
                    </div>
                  )}
                  {vendor.address && (
                    <div className="flex items-center gap-3">
                      <i className="fas fa-map-marker-alt w-5 kfar-text-leaf-green"></i>
                      <span>{vendor.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Policies & Hours */}
              <div>
                <h3 className="text-h2 mb-4 kfar-text-soil">
                  Store Policies
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 kfar-bg-cream kfar-border-leaf-green">
                    <h4 className="text-h6 mb-2">Delivery Policy</h4>
                    <p className="text-body-sm kfar-text-gray-600">
                      {vendor.deliveryPolicy || 'Free delivery on orders above ₪150. Standard delivery fees apply for smaller orders.'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border-l-4 kfar-bg-cream kfar-border-sun-gold">
                    <h4 className="text-h6 mb-2">Return Policy</h4>
                    <p className="text-body-sm kfar-text-gray-600">
                      {vendor.returnPolicy || '30-day satisfaction guarantee. Full refund for unopened items.'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border-l-4 kfar-bg-cream kfar-border-earth-flame">
                    <h4 className="text-h6 mb-2">Business Hours</h4>
                    <p className="text-body-sm kfar-text-gray-600">
                      {vendor.businessHours || 'Sunday-Thursday: 9:00 AM - 6:00 PM\nFriday: 9:00 AM - 2:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQuickView(null)}>
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto kfar-shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Quick view content would go here */}
            <div className="p-6">
              <button 
                onClick={() => setShowQuickView(null)}
                className="float-right kfar-text-gray-500 hover:kfar-text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
              <p className="text-center text-body kfar-text-gray-600 py-12">Quick view coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}