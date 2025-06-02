'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Star, Clock, MapPin, Phone, Mail, Facebook, Instagram, ShoppingCart, Info, Truck, CreditCard, Award } from 'lucide-react';
import { Product } from '@/lib/data/products';
import { useCart } from '@/lib/context/CartContext';
import ProductImage from '@/components/ui/ProductImage';
import { SmartQRCompactFixed } from '@/components/qr/SmartQRCompactFixed';

interface VendorStorePageProps {
  vendorId: string;
  vendorData: any;
  products: Product[];
  theme?: 'modern' | 'artisanal' | 'premium' | 'community' | 'fresh' | 'heritage';
}

export default function VendorStorePage({ vendorId, vendorData, products, theme = 'modern' }: VendorStorePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, isInCart, getQuantity, updateQuantity } = useCart();

  // Theme configurations
  const themeConfig = {
    modern: {
      primary: '#478c0b',
      secondary: '#f6af0d',
      accent: '#c23c09',
      hero: 'gradient-to-br from-leaf-green/90 to-sun-gold/90',
      card: 'bg-white/95 backdrop-blur',
      text: 'text-gray-800'
    },
    artisanal: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#FFD700',
      hero: 'gradient-to-br from-amber-700/90 to-yellow-600/90',
      card: 'bg-amber-50/95 backdrop-blur',
      text: 'text-amber-900'
    },
    premium: {
      primary: '#1a1a1a',
      secondary: '#f6af0d',
      accent: '#ffffff',
      hero: 'gradient-to-br from-gray-900/95 to-gray-700/90',
      card: 'bg-gray-50/95 backdrop-blur',
      text: 'text-gray-900'
    },
    community: {
      primary: '#478c0b',
      secondary: '#8B4513',
      accent: '#f6af0d',
      hero: 'gradient-to-br from-leaf-green/90 to-earth-brown/90',
      card: 'bg-green-50/95 backdrop-blur',
      text: 'text-green-900'
    },
    fresh: {
      primary: '#2ECC71',
      secondary: '#3498DB',
      accent: '#E74C3C',
      hero: 'gradient-to-br from-green-500/90 to-blue-500/90',
      card: 'bg-blue-50/95 backdrop-blur',
      text: 'text-blue-900'
    },
    heritage: {
      primary: '#8B0000',
      secondary: '#FFD700',
      accent: '#000000',
      hero: 'gradient-to-br from-red-900/90 to-yellow-600/90',
      card: 'bg-red-50/95 backdrop-blur',
      text: 'text-red-900'
    }
  };

  const currentTheme = themeConfig[theme];

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity === 0) {
      updateQuantity(productId, 0);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] md:h-[70vh] overflow-hidden"
        style={{
          background: currentTheme.primary === '#478c0b' 
            ? 'linear-gradient(to bottom right, rgba(71, 140, 11, 0.9), rgba(246, 175, 13, 0.9))'
            : `linear-gradient(to bottom right, ${currentTheme.primary}CC, ${currentTheme.secondary}CC)`
        }}
      >
        <div className="absolute inset-0">
          <Image
            src={vendorData.bannerImage || vendorData.logo}
            alt={vendorData.businessName || "Image"}
            fill
            className="object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-4xl">
            {/* Vendor Logo */}
            <div className="mb-6 flex items-center gap-4">
              <div className="w-20 h-20 md:w-28 md:h-28 relative bg-white rounded-2xl shadow-xl p-2">
                <Image
                  src={vendorData.logo}
                  alt={vendorData.businessName || "Image"}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                  {vendorData.businessName}
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{vendorData.rating}</span>
                  <span>({vendorData.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {vendorData.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <ShoppingCart className="w-6 h-6 text-white mb-2" />
                <p className="text-white font-semibold">{vendorData.productCount}+ Products</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <Truck className="w-6 h-6 text-white mb-2" />
                <p className="text-white font-semibold">{vendorData.estimatedDeliveryTime}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <CreditCard className="w-6 h-6 text-white mb-2" />
                <p className="text-white font-semibold">Min ₪{vendorData.minimumOrder}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <Award className="w-6 h-6 text-white mb-2" />
                <p className="text-white font-semibold">{vendorData.certifications?.[0] || 'Certified'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="sticky top-0 z-30 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-green"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-leaf-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Our Products</h2>
          <p className="text-gray-600">{filteredProducts.length} items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inCart = isInCart(product.id);
            const quantity = getQuantity(product.id);

            return (
              <div key={product.id} className={`${currentTheme.card} rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="relative h-48">
                  <ProductImage
                    src={product.image}
                    alt={product.name || "Image"}
                    className="w-full h-full object-cover"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 right-2 bg-sun-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                      New
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className={`font-semibold text-lg mb-2 ${currentTheme.text}`}>{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold" style={{ color: currentTheme.primary }}>
                      ₪{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₪{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {!inCart ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      style={{ 
                        backgroundColor: currentTheme.primary, 
                        color: 'white' 
                      }}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleQuantityChange(product.id, quantity - 1)}
                        className="px-4 py-2 rounded-lg border-2 font-semibold transition-all"
                        style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, quantity + 1)}
                        className="px-4 py-2 rounded-lg font-semibold transition-all"
                        style={{ backgroundColor: currentTheme.primary, color: 'white' }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Store Info Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className={`${currentTheme.card} rounded-2xl p-6`}>
              <h3 className="text-xl font-bold mb-4" style={{ color: currentTheme.primary }}>Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" style={{ color: currentTheme.secondary }} />
                  <span>{vendorData.contactInfo?.phone || 'Contact via app'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: currentTheme.secondary }} />
                  <span>{vendorData.contactInfo?.email || 'info@kfar.com'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" style={{ color: currentTheme.secondary }} />
                  <span>{vendorData.contactInfo?.address || 'Village of Peace, Dimona'}</span>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className={`${currentTheme.card} rounded-2xl p-6`}>
              <h3 className="text-xl font-bold mb-4" style={{ color: currentTheme.primary }}>Operating Hours</h3>
              <div className="space-y-2">
                {vendorData.operatingHours?.slice(0, 5).map((schedule: any) => (
                  <div key={schedule.day} className="flex justify-between">
                    <span className="font-medium">{schedule.day}</span>
                    <span>{schedule.open} - {schedule.close}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className={`${currentTheme.card} rounded-2xl p-6`}>
              <h3 className="text-xl font-bold mb-4" style={{ color: currentTheme.primary }}>Why Choose Us</h3>
              <div className="flex flex-wrap gap-2">
                {vendorData.features?.map((feature: string) => (
                  <span 
                    key={feature} 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: `${currentTheme.secondary}20`,
                      color: currentTheme.primary 
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* QR Code Section */}
            <div className={`${currentTheme.card} rounded-2xl p-6`}>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: currentTheme.primary }}>Quick Store Access</h3>
              <div className="flex justify-center mb-4">
                <SmartQRCompactFixed
                  type="vendor"
                  data={{
                    id: vendorId,
                    name: vendorData.name,
                    logo: vendorData.logo,
                    description: vendorData.description,
                    categories: vendorData.tags,
                    productCount: products.length
                  }}
                  size={200}
                  hideActions={false}
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                Scan to save our store
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}