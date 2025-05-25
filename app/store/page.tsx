'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  vendor: string;
  vendorLogo: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  badge?: string;
  description: string;
  rating: number;
}

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const products: Product[] = [
    {
      id: 1,
      name: 'Classic Seitan Schnitzel',
      vendor: 'Teva Deli',
      vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
      price: '₪45',
      originalPrice: '₪55',
      image: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg',
      category: 'meat-alternatives',
      badge: 'Best Seller',
      description: 'Golden breaded cutlet, Israeli comfort food',
      rating: 5
    },
    {
      id: 2,
      name: 'Chocolate Tahini Swirl',
      vendor: 'Gahn Delight',
      vendorLogo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      price: '₪35',
      image: '/images/vendors/gahn_delight_ice_cream_chocolate_tahini_swirl_cup_with_cacao_nibs.jpeg',
      category: 'desserts',
      badge: 'New',
      description: 'Premium ice cream with cacao nibs',
      rating: 5
    },
    {
      id: 3,
      name: 'Passion Mango Delight',
      vendor: 'Gahn Delight',
      vendorLogo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      price: '₪32',
      image: '/images/vendors/gahn_delight_ice_cream_passion_mango_double_scoop_cup.jpg',
      category: 'desserts',
      description: 'Tropical paradise in every scoop',
      rating: 4
    },
    {
      id: 4,
      name: 'Gourmet Vegan Burger',
      vendor: "Queen's Cuisine",
      vendorLogo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      price: '₪52',
      originalPrice: '₪65',
      image: '/images/vendors/queens_cuisine_vegan_burger_seitan_patty_sesame_bun_tomato_lettuce_plant_based_sandwich.jpg',
      category: 'meat-alternatives',
      badge: 'Chef Special',
      description: 'Artisan seitan patty on sesame bun',
      rating: 5
    },
    {
      id: 5,
      name: 'Smoothie Bowl Mix',
      vendor: 'Garden of Light',
      vendorLogo: '/images/vendors/atur_aturah_logo_edenic_traditions.jpg',
      price: '₪89',
      image: '/images/vendors/stock_image_food_smoothie_bowl_healthy_breakfast_lifestyle.jpg',
      category: 'breakfast',
      badge: 'Organic',
      description: 'Superfood breakfast blend',
      rating: 5
    },
    {
      id: 6,
      name: 'Middle Eastern Shawarma',
      vendor: "Queen's Cuisine",
      vendorLogo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      price: '₪48',
      image: '/images/vendors/queens_cuisine_middle_eastern_shawarma_pita_wrap_plant_based_meat_alternative.jpg',
      category: 'meat-alternatives',
      description: 'Authentic spiced seitan in pita',
      rating: 5
    },
    {
      id: 7,
      name: 'Pistachio Rose Dream',
      vendor: 'Gahn Delight',
      vendorLogo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      price: '₪38',
      image: '/images/vendors/gahn_delight_ice_cream_pistachio_rose_triple_scoop_ceramic_bowl.jpeg',
      category: 'desserts',
      badge: 'Premium',
      description: 'Luxurious Middle Eastern flavors',
      rating: 5
    },
    {
      id: 8,
      name: 'Traditional Kubeh',
      vendor: 'Teva Deli',
      vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
      price: '₪42',
      image: '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg',
      category: 'meat-alternatives',
      description: 'Handcrafted dumplings in broth',
      rating: 4
    },
    {
      id: 9,
      name: 'Date Caramel Sundae',
      vendor: 'Gahn Delight',
      vendorLogo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      price: '₪42',
      image: '/images/vendors/gahn_delight_sundae_date_caramel_vanilla_walnut_toppings_glass.jpeg',
      category: 'desserts',
      description: 'Rich date caramel with walnuts',
      rating: 5
    },
    {
      id: 10,
      name: 'Vegan Meatballs',
      vendor: "Queen's Cuisine",
      vendorLogo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      price: '₪39',
      image: '/images/vendors/queens_cuisine_vegan_meatballs_pasta_dish_plant_based_italian_cuisine_tomato_sauce.jpg',
      category: 'meat-alternatives',
      description: 'Italian-style plant-based meatballs',
      rating: 4
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: 'fa-th', count: products.length },
    { id: 'meat-alternatives', name: 'Meat Alternatives', icon: 'fa-drumstick-bite', count: products.filter(p => p.category === 'meat-alternatives').length },
    { id: 'desserts', name: 'Frozen Desserts', icon: 'fa-ice-cream', count: products.filter(p => p.category === 'desserts').length },
    { id: 'breakfast', name: 'Breakfast', icon: 'fa-sun', count: products.filter(p => p.category === 'breakfast').length }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price.replace('₪', '')) - parseFloat(b.price.replace('₪', ''));
    if (sortBy === 'price-high') return parseFloat(b.price.replace('₪', '')) - parseFloat(a.price.replace('₪', ''));
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-leaf-green to-sun-gold py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">KFAR Store</h1>
            <p className="text-xl text-white/90 mb-8">Discover authentic vegan products from the Village of Peace</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-6 py-4 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-leaf-green text-white rounded-lg hover:bg-green-700 transition-colors">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#3a3a1d' }}>Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                        activeCategory === category.id
                          ? 'bg-leaf-green text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <i className={`fas ${category.icon}`}></i>
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm">({category.count})</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#3a3a1d' }}>Price Range</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>Under ₪30</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>₪30 - ₪50</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>₪50 - ₪100</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>Over ₪100</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort and View Options */}
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{sortedProducts.length}</span> products
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-leaf-green"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={product.vendorLogo}
                          alt={product.vendor}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-sm text-gray-600">{product.vendor}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: '#3a3a1d' }}>{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold" style={{ color: '#c23c09' }}>{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star text-xs ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}