'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

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
      vendorLogo: '/images/vendors/Garden of Light Logo.jpg',
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
    },
    {
      id: 11,
      name: 'Berry Hibiscus Popsicle',
      vendor: 'Gahn Delight',
      vendorLogo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      price: '₪28',
      image: '/images/vendors/gahn_delight_popsicle_berry_hibiscus_frozen_bar_wooden_stick.jpeg',
      category: 'desserts',
      badge: 'Summer Special',
      description: 'Refreshing frozen treat with real berries',
      rating: 5
    },
    {
      id: 12,
      name: 'Lime Coconut Sorbet',
      vendor: 'Gahn Delight',
      vendorLogo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      price: '₪36',
      image: '/images/vendors/gahn_delight_sorbet_lime_coconut_fresh_garnish_bowl.jpg',
      category: 'desserts',
      description: 'Tropical sorbet with fresh lime zest',
      rating: 5
    },
    {
      id: 13,
      name: 'Chocolate Almond Parfait',
      vendor: 'Gahn Delight',
      vendorLogo: '/images/vendors/gahn_delight_logo_handcrafted_foods.jpg',
      price: '₪44',
      originalPrice: '₪52',
      image: '/images/vendors/gahn_delight_parfait_chocolate_almond_caramel_layered_glass.jpg',
      category: 'desserts',
      badge: 'Limited Edition',
      description: 'Layered chocolate caramel indulgence',
      rating: 5
    },
    {
      id: 14,
      name: 'Seitan Steaks',
      vendor: "Queen's Cuisine",
      vendorLogo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      price: '₪68',
      image: '/images/vendors/queens_cuisine_vegan_meat_grilled_seitan_steaks_plant_based_protein_alternative.jpg',
      category: 'meat-alternatives',
      badge: 'Premium',
      description: 'Grilled plant-based protein steaks',
      rating: 5
    },
    {
      id: 15,
      name: 'Kebab Skewers',
      vendor: "Queen's Cuisine",
      vendorLogo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      price: '₪58',
      image: '/images/vendors/queens_cuisine_vegan_meat_kabab_skewer_dish_plant_based_middle_eastern_cuisine.jpg',
      category: 'meat-alternatives',
      description: 'Middle Eastern style plant-based kebabs',
      rating: 4
    },
    {
      id: 16,
      name: 'Crispy Seitan Cutlets',
      vendor: "Queen's Cuisine",
      vendorLogo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      price: '₪49',
      image: '/images/vendors/queens_cuisine_vegan_seitan_cutlets_breaded_crispy_herb_dip_arugula_salad_cherry_tomatoes.jpg',
      category: 'meat-alternatives',
      description: 'Breaded cutlets with herb dip',
      rating: 5
    },
    {
      id: 17,
      name: 'Teriyaki Seitan Strips',
      vendor: "Queen's Cuisine",
      vendorLogo: '/images/vendors/queens_cuisine_logo_vegan_food_art.jpg',
      price: '₪46',
      image: '/images/vendors/queens_cuisine_vegan_seitan_strips_teriyaki_sauce_sesame_seeds_scallions_asian_style.jpg',
      category: 'meat-alternatives',
      badge: 'Asian Fusion',
      description: 'Sweet and savory Asian-style strips',
      rating: 5
    },
    {
      id: 18,
      name: 'Roasted Vegetable Mix',
      vendor: 'Garden of Light',
      vendorLogo: '/images/vendors/Garden of Light Logo.jpg',
      price: '₪32',
      image: '/images/vendors/stock_image_food_roasted_vegetables_healthy_cooking_lifestyle.jpg',
      category: 'prepared-foods',
      description: 'Seasonal vegetables perfectly roasted',
      rating: 4
    },
    {
      id: 19,
      name: 'Hearty Vegetable Stew',
      vendor: 'Garden of Light',
      vendorLogo: '/images/vendors/Garden of Light Logo.jpg',
      price: '₪38',
      image: '/images/vendors/stock_image_food_soup_stew_healthy_meal_lifestyle.jpg',
      category: 'prepared-foods',
      badge: 'Comfort Food',
      description: 'Traditional stew with modern twist',
      rating: 5
    },
    {
      id: 20,
      name: 'Asian Stir Fry',
      vendor: 'Garden of Light',
      vendorLogo: '/images/vendors/Garden of Light Logo.jpg',
      price: '₪42',
      image: '/images/vendors/stock_image_food_stir_fry_healthy_cooking_lifestyle.jpg',
      category: 'prepared-foods',
      description: 'Wok-fresh vegetables and tofu',
      rating: 4
    },
    {
      id: 21,
      name: 'Gourmet Sandwich Wrap',
      vendor: 'Garden of Light',
      vendorLogo: '/images/vendors/Garden of Light Logo.jpg',
      price: '₪35',
      image: '/images/vendors/stock_image_food_sandwich_wrap_healthy_meal_lifestyle.jpg',
      category: 'prepared-foods',
      description: 'Fresh wrap with signature sauce',
      rating: 5
    },
    {
      id: 22,
      name: 'Superfood Mix',
      vendor: 'Garden of Light',
      vendorLogo: '/images/vendors/Garden of Light Logo.jpg',
      price: '₪78',
      originalPrice: '₪95',
      image: '/images/vendors/stock_image_food_superfood_mix_healthy_ingredients_lifestyle.jpg',
      category: 'breakfast',
      badge: 'Bestseller',
      description: 'Premium blend of superfoods',
      rating: 5
    },
    {
      id: 23,
      name: 'Heritage T-Shirt',
      vendor: 'VOP Shop',
      vendorLogo: '/images/vendors/vop_shop_logo_village_marketplace.jpg',
      price: '₪85',
      image: '/images/vendors/vop_shop_community_apparel_product_02_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
      category: 'apparel',
      description: '50 Year celebration edition',
      rating: 5
    },
    {
      id: 24,
      name: 'Community Hoodie',
      vendor: 'VOP Shop',
      vendorLogo: '/images/vendors/vop_shop_logo_village_marketplace.jpg',
      price: '₪125',
      image: '/images/vendors/vop_shop_community_apparel_product_03_wellness_lifestyle_village_of_peace_heritage_clothing.jpg',
      category: 'apparel',
      badge: 'Premium',
      description: 'Comfortable heritage wear',
      rating: 5
    },
    {
      id: 25,
      name: 'Cultural Art Print',
      vendor: 'VOP Shop',
      vendorLogo: '/images/vendors/vop_shop_logo_village_marketplace.jpg',
      price: '₪68',
      image: '/images/vendors/vop_shop_heritage_home_decor_product_06_50_year_celebration_cultural_art_community_pride.jpg',
      category: 'home-decor',
      description: 'Limited edition community art',
      rating: 5
    },
    {
      id: 26,
      name: 'Wellness Book Collection',
      vendor: 'VOP Shop',
      vendorLogo: '/images/vendors/vop_shop_logo_village_marketplace.jpg',
      price: '₪95',
      image: '/images/vendors/vop_shop_wellness_education_product_11_healing_books_holistic_health_community_wisdom.jpg',
      category: 'books',
      badge: 'Educational',
      description: 'Community wisdom and healing',
      rating: 5
    },
    {
      id: 27,
      name: 'Vegan Burger Patties (6pk)',
      vendor: 'Teva Deli',
      vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
      price: '₪52',
      image: '/images/vendors/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
      category: 'meat-alternatives',
      description: 'Family pack of burger patties',
      rating: 5
    },
    {
      id: 28,
      name: 'Shawarma Style Seitan',
      vendor: 'Teva Deli',
      vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
      price: '₪48',
      originalPrice: '₪58',
      image: '/images/vendors/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg',
      category: 'meat-alternatives',
      badge: 'Popular',
      description: 'Authentic shawarma experience',
      rating: 5
    },
    {
      id: 29,
      name: 'Mixed Protein Pack',
      vendor: 'Teva Deli',
      vendorLogo: '/images/vendors/teva_deli_logo_vegan_factory.jpg',
      price: '₪89',
      image: '/images/vendors/teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg',
      category: 'meat-alternatives',
      description: 'Variety pack of plant proteins',
      rating: 4
    },
    {
      id: 30,
      name: 'Recipe Showcase Box',
      vendor: 'Garden of Light',
      vendorLogo: '/images/vendors/Garden of Light Logo.jpg',
      price: '₪125',
      image: '/images/vendors/stock_image_food_recipe_showcase_healthy_cooking_lifestyle.jpg',
      category: 'gift-sets',
      badge: 'Gift Idea',
      description: 'Complete meal kit with recipes',
      rating: 5
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: 'fa-th', count: products.length },
    { id: 'meat-alternatives', name: 'Meat Alternatives', icon: 'fa-drumstick-bite', count: products.filter(p => p.category === 'meat-alternatives').length },
    { id: 'desserts', name: 'Frozen Desserts', icon: 'fa-ice-cream', count: products.filter(p => p.category === 'desserts').length },
    { id: 'breakfast', name: 'Breakfast', icon: 'fa-sun', count: products.filter(p => p.category === 'breakfast').length },
    { id: 'prepared-foods', name: 'Prepared Foods', icon: 'fa-utensils', count: products.filter(p => p.category === 'prepared-foods').length },
    { id: 'apparel', name: 'Apparel', icon: 'fa-tshirt', count: products.filter(p => p.category === 'apparel').length },
    { id: 'home-decor', name: 'Home & Gifts', icon: 'fa-gift', count: products.filter(p => p.category === 'home-decor' || p.category === 'gift-sets').length },
    { id: 'books', name: 'Books & Media', icon: 'fa-book', count: products.filter(p => p.category === 'books').length }
  ];

  // Advanced filtering logic
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search filter (searches in name, description, vendor, and category)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.vendor.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    filtered = filtered.filter(p => {
      const price = parseFloat(p.price.replace('₪', ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Vendor filter
    if (selectedVendors.length > 0) {
      filtered = filtered.filter(p => selectedVendors.includes(p.vendor));
    }

    // Dietary filter (mock implementation - in real app, products would have dietary tags)
    if (selectedDietary.length > 0) {
      // For demo, all products are vegan
      if (selectedDietary.includes('100% Vegan')) {
        // All products pass
      }
      if (selectedDietary.includes('Organic')) {
        filtered = filtered.filter(p => p.badge === 'Organic' || p.vendor === 'Garden of Light');
      }
    }

    return filtered;
  }, [activeCategory, searchQuery, priceRange, selectedVendors, selectedDietary, products]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch(sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.price.replace('₪', '')) - parseFloat(b.price.replace('₪', '')));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.price.replace('₪', '')) - parseFloat(a.price.replace('₪', '')));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, priceRange, selectedVendors, selectedDietary]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section 
          className="relative py-20 md:py-24"
          style={{
            background: 'linear-gradient(135deg, rgba(71, 140, 11, 0.9), rgba(246, 175, 13, 0.8)), url("/images/hero/13.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">KFAR Marketplace</h1>
                <p className="text-xl md:text-2xl text-white/90 mb-3">The Whole Village, In Your Hand</p>
                <p className="text-lg text-white/80 mb-8">Discover authentic community products from 6 founding businesses and growing</p>
            
                {/* Enhanced Search Bar */}
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products, vendors, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 pr-14 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-800 placeholder-gray-500"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-leaf-green text-white rounded-full hover:bg-green-700 transition-colors flex items-center justify-center">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                  
                  {/* Quick Search Suggestions */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <span className="text-white/80 text-sm">Popular:</span>
                    {['Schnitzel', 'Ice Cream', 'Organic', 'Teva Deli', 'Vegan Burger'].map(term => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full hover:bg-white/30 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#3a3a1d' }}>
                  <i className="fas fa-filter mr-2" style={{ color: '#478c0b' }}></i>
                  Filter Products
                </h3>

                {/* Categories */}
                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-semibold mb-3 text-gray-700">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between ${
                          activeCategory === category.id
                            ? 'bg-leaf-green text-white shadow-md'
                            : 'hover:bg-herbal-mint hover:bg-opacity-20'
                        }`}
                        style={activeCategory === category.id ? { backgroundColor: '#478c0b' } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <i className={`fas ${category.icon} text-sm`}></i>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs font-semibold">{category.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Price Range Slider */}
                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-semibold mb-4 text-gray-700">Price Range</h4>
                  <div className="px-3">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium" style={{ color: '#478c0b' }}>₪{priceRange[0]}</span>
                      <span className="text-sm font-medium" style={{ color: '#478c0b' }}>₪{priceRange[1]}</span>
                    </div>
                    
                    {/* Dual Range Slider */}
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div 
                        className="absolute h-2 rounded-full"
                        style={{
                          backgroundColor: '#478c0b',
                          left: `${(priceRange[0] / 200) * 100}%`,
                          right: `${100 - (priceRange[1] / 200) * 100}%`
                        }}
                      />
                      
                      {/* Min Price Slider */}
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value < priceRange[1]) {
                            setPriceRange([value, priceRange[1]]);
                          }
                        }}
                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      />
                      
                      {/* Max Price Slider */}
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > priceRange[0]) {
                            setPriceRange([priceRange[0], value]);
                          }
                        }}
                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                      />
                      
                      {/* Slider Thumbs */}
                      <div
                        className="absolute w-5 h-5 bg-white border-2 rounded-full shadow-md transform -translate-y-1/2 cursor-pointer"
                        style={{
                          borderColor: '#478c0b',
                          left: `${(priceRange[0] / 200) * 100}%`,
                          top: '50%'
                        }}
                      />
                      <div
                        className="absolute w-5 h-5 bg-white border-2 rounded-full shadow-md transform -translate-y-1/2 cursor-pointer"
                        style={{
                          borderColor: '#478c0b',
                          left: `${(priceRange[1] / 200) * 100}%`,
                          top: '50%'
                        }}
                      />
                    </div>
                    
                    {/* Quick Price Ranges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setPriceRange([0, 50])}
                        className="px-3 py-1 text-xs border rounded-full hover:bg-herbal-mint hover:bg-opacity-20 transition-colors"
                        style={{ borderColor: '#478c0b', color: '#478c0b' }}
                      >
                        Budget
                      </button>
                      <button
                        onClick={() => setPriceRange([50, 100])}
                        className="px-3 py-1 text-xs border rounded-full hover:bg-herbal-mint hover:bg-opacity-20 transition-colors"
                        style={{ borderColor: '#478c0b', color: '#478c0b' }}
                      >
                        Mid-range
                      </button>
                      <button
                        onClick={() => setPriceRange([100, 200])}
                        className="px-3 py-1 text-xs border rounded-full hover:bg-herbal-mint hover:bg-opacity-20 transition-colors"
                        style={{ borderColor: '#478c0b', color: '#478c0b' }}
                      >
                        Premium
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vendors */}
                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-semibold mb-3 text-gray-700">Vendors</h4>
                  <div className="space-y-2">
                    {['Teva Deli', "Queen's Cuisine", 'Garden of Light', 'Gahn Delight', 'VOP Shop', 'People Store'].map(vendor => (
                      <label key={vendor} className="flex items-center cursor-pointer hover:text-leaf-green transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-leaf-green border-2 border-gray-300 rounded focus:ring-leaf-green"
                          checked={selectedVendors.includes(vendor)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVendors([...selectedVendors, vendor]);
                            } else {
                              setSelectedVendors(selectedVendors.filter(v => v !== vendor));
                            }
                          }}
                        />
                        <span className="ml-3 text-sm">{vendor}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-700">Dietary</h4>
                  <div className="space-y-2">
                    {['100% Vegan', 'Organic', 'Gluten-Free', 'Sugar-Free'].map(diet => (
                      <label key={diet} className="flex items-center cursor-pointer hover:text-leaf-green transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-leaf-green border-2 border-gray-300 rounded focus:ring-leaf-green"
                          checked={selectedDietary.includes(diet)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDietary([...selectedDietary, diet]);
                            } else {
                              setSelectedDietary(selectedDietary.filter(d => d !== diet));
                            }
                          }}
                        />
                        <span className="ml-3 text-sm">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button 
                  className="w-full py-2 rounded-lg font-semibold transition-all hover:shadow-md"
                  style={{ backgroundColor: '#f6af0d', color: '#3a3a1d' }}
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setPriceRange([0, 200]);
                    setSelectedVendors([]);
                    setSelectedDietary([]);
                  }}
                >
                  Clear All Filters
                </button>

                {/* Active Filters Count */}
                {(activeCategory !== 'all' || searchQuery || priceRange[0] > 0 || priceRange[1] < 200 || selectedVendors.length > 0 || selectedDietary.length > 0) && (
                  <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                      Active filters: <span className="font-semibold" style={{ color: '#478c0b' }}>
                        {[
                          activeCategory !== 'all' ? 1 : 0,
                          searchQuery ? 1 : 0,
                          priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0,
                          selectedVendors.length,
                          selectedDietary.length
                        ].reduce((a, b) => a + b, 0)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort and View Options */}
              <div className="mb-6">
                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Showing <span className="font-semibold" style={{ color: '#478c0b' }}>{sortedProducts.length}</span> products
                      {searchQuery && (
                        <span className="ml-2">
                          for "<span className="font-semibold">{searchQuery}</span>"
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 mr-4">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'grid' ? 'bg-leaf-green text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        style={viewMode === 'grid' ? { backgroundColor: '#478c0b' } : {}}
                      >
                        <i className="fas fa-th"></i>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'list' ? 'bg-leaf-green text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        style={viewMode === 'list' ? { backgroundColor: '#478c0b' } : {}}
                      >
                        <i className="fas fa-list"></i>
                      </button>
                    </div>

                    <span className="text-gray-600 text-sm">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border-2 rounded-lg font-medium transition-all focus:outline-none"
                      style={{ borderColor: '#478c0b', color: '#3a3a1d' }}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products */}
              {sortedProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#3a3a1d' }}>No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                      setPriceRange([0, 200]);
                      setSelectedVendors([]);
                      setSelectedDietary([]);
                    }}
                    className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: '#478c0b' }}
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
                    style={{ border: '2px solid transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#478c0b'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    {/* Wishlist Button */}
                    <button 
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center z-10 hover:bg-red-50 transition-colors group/wishlist"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="far fa-heart text-gray-600 group-hover/wishlist:text-red-500"></i>
                    </button>

                    {/* Vendor Badge */}
                    <div 
                      className="absolute top-3 left-3 px-3 py-1 text-white text-xs font-semibold rounded-full z-10"
                      style={{ backgroundColor: '#478c0b' }}
                    >
                      {product.vendor}
                    </div>

                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {product.badge && (
                          <span 
                            className="absolute bottom-3 left-3 px-3 py-1 text-white text-xs font-bold rounded-full"
                            style={{ backgroundColor: product.badge === 'Best Seller' ? '#c23c09' : product.badge === 'New' ? '#478c0b' : '#f6af0d' }}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-green-700 transition-colors" style={{ color: '#3a3a1d' }}>
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star text-xs ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                            ))}
                            <span className="text-xs text-gray-600 ml-1">({product.rating}.0)</span>
                          </div>
                          <div>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through mr-2">{product.originalPrice}</span>
                            )}
                            <span 
                              className="text-xl font-bold px-3 py-1 rounded-full"
                              style={{ backgroundColor: '#f6af0d', color: '#3a3a1d' }}
                            >
                              {product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Add to Cart Hover Effect */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button 
                        className="w-full py-3 rounded-xl text-white font-semibold shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
                        style={{ backgroundColor: 'rgba(71, 140, 11, 0.95)' }}
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic
                        }}
                      >
                        <i className="fas fa-shopping-cart mr-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {paginatedProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4"
                      style={{ border: '2px solid transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#478c0b'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Product Image */}
                        <Link href={`/product/${product.id}`} className="block md:w-48 h-48 flex-shrink-0">
                          <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {product.badge && (
                              <span 
                                className="absolute top-2 left-2 px-3 py-1 text-white text-xs font-bold rounded-full"
                                style={{ backgroundColor: product.badge === 'Best Seller' ? '#c23c09' : product.badge === 'New' ? '#478c0b' : '#f6af0d' }}
                              >
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between gap-4">
                            <div className="flex-1">
                              {/* Vendor */}
                              <div className="flex items-center gap-2 mb-2">
                                <Image
                                  src={product.vendorLogo}
                                  alt={product.vendor}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                                <span className="text-sm font-medium" style={{ color: '#478c0b' }}>{product.vendor}</span>
                              </div>

                              {/* Product Name */}
                              <Link href={`/product/${product.id}`}>
                                <h3 className="text-xl font-bold mb-2 hover:text-green-700 transition-colors" style={{ color: '#3a3a1d' }}>
                                  {product.name}
                                </h3>
                              </Link>

                              {/* Description */}
                              <p className="text-gray-600 mb-3">{product.description}</p>

                              {/* Rating */}
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`fas fa-star text-sm ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                ))}
                                <span className="text-sm text-gray-600 ml-1">({product.rating}.0)</span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="md:text-right">
                              <div className="mb-3">
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through mr-2">{product.originalPrice}</span>
                                )}
                                <span 
                                  className="text-2xl font-bold px-4 py-2 rounded-full inline-block"
                                  style={{ backgroundColor: '#f6af0d', color: '#3a3a1d' }}
                                >
                                  {product.price}
                                </span>
                              </div>
                              
                              <div className="flex gap-2 md:justify-end">
                                <button 
                                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="far fa-heart text-gray-600"></i>
                                </button>
                                <button 
                                  className="px-6 py-2 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
                                  style={{ backgroundColor: '#478c0b' }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // Add to cart logic
                                  }}
                                >
                                  <i className="fas fa-shopping-cart mr-2"></i>
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        currentPage === 1 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-2 border-gray-300 hover:border-leaf-green text-gray-700'
                      }`}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      // Show first page, last page, current page, and pages adjacent to current
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition-all font-medium ${
                              currentPage === page
                                ? 'bg-leaf-green text-white shadow-md'
                                : 'bg-white border-2 border-gray-300 hover:border-leaf-green text-gray-700'
                            }`}
                            style={currentPage === page ? { backgroundColor: '#478c0b' } : {}}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 || 
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg transition-all ${
                        currentPage === totalPages 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-2 border-gray-300 hover:border-leaf-green text-gray-700'
                      }`}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}