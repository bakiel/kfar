'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      setIsScrolled(scrollPosition > 50);
      setShowFloatingNav(scrollPosition > 300);
      
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrollPercentage, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && showFloatingNav) {
      // Check if user has seen the summary before
      const hasSeenSummary = localStorage.getItem('kfar-floaty-summary-seen');
      if (!hasSeenSummary) {
        setShowSummary(true);
        // Auto hide after 5 seconds
        const timer = setTimeout(() => {
          setShowSummary(false);
          localStorage.setItem('kfar-floaty-summary-seen', 'true');
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [showFloatingNav]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white shadow-2xl border-b-2 border-sun-gold/20' 
          : 'bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-md'
      }`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-sun-gold/5 rounded-full animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-leaf-green/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo with Animation */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className={`transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                <Image 
                  src="/images/logos/kfar_logo_primary_horizontal.png" 
                  alt="KFAR Marketplace" 
                  width={120}
                  height={36}
                  className="transition-all duration-300 group-hover:scale-105 w-24 sm:w-32 h-auto"
                />
              </div>
              <div className={`hidden sm:block transition-all duration-500 ${isScrolled ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'}`}>
                <p className="text-xs text-soil-brown font-medium">Village of Peace</p>
                <p className="text-xs text-sun-gold font-bold">Est. 1967</p>
              </div>
            </Link>

            {/* Desktop Navigation with Hover Effects */}
            <nav className="hidden lg:flex items-center gap-10">
              <Link href="/categories" className="relative group py-2">
                <span className="relative">
                  <span className="text-soil-brown font-medium transition-all duration-500 inline-block group-hover:text-leaf-green transform group-hover:-translate-y-1 group-hover:scale-105">
                    Categories
                  </span>
                  <i className="fas fa-th-large text-xs ml-1.5 inline-block opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0" style={{ color: '#478c0b' }}></i>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-leaf-green to-sun-gold transition-all duration-500 group-hover:w-full" />
                {/* Floating dot */}
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ backgroundColor: '#478c0b' }}></span>
              </Link>
              <Link href="/services" className="relative group py-2">
                <span className="relative">
                  <span className="text-soil-brown font-medium transition-all duration-500 inline-block group-hover:text-leaf-green transform group-hover:-translate-y-1 group-hover:scale-105">
                    Services
                  </span>
                  <i className="fas fa-concierge-bell text-xs ml-1.5 inline-block opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0" style={{ color: '#478c0b' }}></i>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-leaf-green to-sun-gold transition-all duration-500 group-hover:w-full" />
                {/* Floating dot */}
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ backgroundColor: '#478c0b' }}></span>
              </Link>
              <Link href="/store" className="relative group py-2">
                <span className="relative">
                  <span className="text-soil-brown font-medium transition-all duration-500 inline-block group-hover:text-leaf-green transform group-hover:-translate-y-1 group-hover:scale-105">
                    Store
                  </span>
                  <i className="fas fa-shopping-bag text-xs ml-1.5 inline-block opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0" style={{ color: '#478c0b' }}></i>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-leaf-green to-sun-gold transition-all duration-500 group-hover:w-full" />
                {/* Floating dot */}
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ backgroundColor: '#478c0b' }}></span>
              </Link>
              <Link href="/about" className="relative group py-2">
                <span className="relative">
                  <span className="text-soil-brown font-medium transition-all duration-500 inline-block group-hover:text-leaf-green transform group-hover:-translate-y-1 group-hover:scale-105">
                    About
                  </span>
                  <i className="fas fa-info-circle text-xs ml-1.5 inline-block opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0" style={{ color: '#478c0b' }}></i>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-leaf-green to-sun-gold transition-all duration-500 group-hover:w-full" />
                {/* Floating dot */}
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ backgroundColor: '#478c0b' }}></span>
              </Link>
              
              {/* Marketplace Button - Refined */}
              <Link href="/directory" className="relative group ml-2">
                <button className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-1.5" style={{ backgroundColor: '#f6af0d' }}>
                  <i className="fas fa-store text-sm"></i>
                  <span>Marketplace</span>
                  <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all duration-300"></i>
                </button>
                {/* Subtle pulse */}
                <div className="absolute inset-0 rounded-lg animate-pulse" style={{ backgroundColor: '#f6af0d', opacity: 0.2, animationDuration: '3s' }}></div>
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Language Toggle */}
              <button className="text-sm font-medium text-soil-brown hover:text-leaf-green transition-all duration-300 px-3 py-2 rounded-lg hover:bg-herbal-mint/20 transform hover:scale-105">
                <span className="inline-block transition-transform duration-300 hover:rotate-180">עב</span>
                <span className="mx-1">|</span>
                <span>EN</span>
              </button>

              {/* Currency Selector - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-leaf-green/10 to-sun-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <select className="relative text-sm border-2 border-gray-200 rounded-lg pl-4 pr-10 py-2.5 bg-white hover:border-sun-gold focus:outline-none focus:border-leaf-green transition-all duration-300 cursor-pointer appearance-none hover:shadow-lg font-medium" style={{ minWidth: '110px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
                  <option value="ILS" className="font-medium py-2">₪ ILS</option>
                  <option value="USD" className="font-medium py-2">$ USD</option>
                  <option value="EUR" className="font-medium py-2">€ EUR</option>
                  <option value="GBP" className="font-medium py-2">£ GBP</option>
                </select>
                <div className="absolute right-0 top-0 h-full px-3 flex items-center pointer-events-none border-l border-gray-200">
                  <i className="fas fa-chevron-down text-xs transition-all duration-300 group-hover:text-sun-gold transform group-hover:rotate-180" style={{ color: '#6b7280' }}></i>
                </div>
                {/* Currency icon preview */}
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <i className="fas fa-coins text-sm" style={{ color: '#f6af0d' }}></i>
                </div>
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative p-3 rounded-lg hover:bg-herbal-mint/20 transition-all duration-300 transform hover:scale-105 group block">
                <i className="fas fa-shopping-cart text-xl text-soil-brown group-hover:text-leaf-green transition-all duration-300"></i>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: '#c23c09' }}>
                    {getCartCount()}
                  </span>
                )}
                {/* Cart tooltip */}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap" style={{ backgroundColor: '#3a3a1d' }}>
                  Cart
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 rounded-lg hover:bg-herbal-mint/20 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-soil-brown transition-all duration-300`}></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
        mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setMobileMenuOpen(false)} />

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Image 
              src="/images/logos/kfar_logo_africa_heritage.png" 
              alt="KFAR Marketplace" 
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all min-w-[44px] min-h-[44px]"
              aria-label="Close menu"
            >
              <i className="fas fa-times text-xl text-gray-600"></i>
            </button>
          </div>

          {/* Mobile Menu Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <Link 
              href="/categories" 
              className="flex items-center gap-4 px-6 py-4 hover:bg-herbal-mint/10 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-th-large text-lg" style={{ color: '#478c0b', width: '24px' }}></i>
              <span className="text-lg font-medium" style={{ color: '#3a3a1d' }}>Categories</span>
            </Link>
            <Link 
              href="/services" 
              className="flex items-center gap-4 px-6 py-4 hover:bg-herbal-mint/10 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-concierge-bell text-lg" style={{ color: '#478c0b', width: '24px' }}></i>
              <span className="text-lg font-medium" style={{ color: '#3a3a1d' }}>Services</span>
            </Link>
            <Link 
              href="/store" 
              className="flex items-center gap-4 px-6 py-4 hover:bg-herbal-mint/10 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-shopping-bag text-lg" style={{ color: '#478c0b', width: '24px' }}></i>
              <span className="text-lg font-medium" style={{ color: '#3a3a1d' }}>Store</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center gap-4 px-6 py-4 hover:bg-herbal-mint/10 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-info-circle text-lg" style={{ color: '#478c0b', width: '24px' }}></i>
              <span className="text-lg font-medium" style={{ color: '#3a3a1d' }}>About</span>
            </Link>
            <Link 
              href="/directory" 
              className="flex items-center gap-4 px-6 py-4 hover:bg-herbal-mint/10 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-store text-lg" style={{ color: '#f6af0d', width: '24px' }}></i>
              <span className="text-lg font-medium" style={{ color: '#3a3a1d' }}>Marketplace</span>
            </Link>
            
            <div className="border-t my-4"></div>
            
            {/* Mobile Language & Currency */}
            <div className="px-6 py-4">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Language</label>
              <div className="flex gap-2">
                <button className="flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all" style={{ borderColor: '#478c0b', color: '#478c0b' }}>
                  English
                </button>
                <button className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-200 font-medium transition-all hover:border-gray-300">
                  עברית
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Currency</label>
              <select className="w-full text-base border-2 border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-leaf-green transition-all">
                <option value="ILS">₪ ILS - Israeli Shekel</option>
                <option value="USD">$ USD - US Dollar</option>
                <option value="EUR">€ EUR - Euro</option>
                <option value="GBP">£ GBP - British Pound</option>
              </select>
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t">
            <button 
              className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg flex items-center justify-center gap-3"
              style={{ backgroundColor: '#478c0b' }}
            >
              <i className="fas fa-shopping-cart"></i>
              View Cart (0)
            </button>
          </div>
        </div>
      </div>

      {/* Floating Navigator with Summary */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl transition-all duration-300 z-50 group ${
        showFloatingNav ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}>
        {/* Summary Window - Shows Only Once */}
        {showSummary && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-all duration-500 origin-bottom">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border-2" style={{ borderColor: '#478c0b' }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#3a3a1d' }}>KFAR Marketplace</h3>
              <p className="text-sm mb-3" style={{ color: '#3a3a1d' }}>
                The digital home of the <span className="font-semibold" style={{ color: '#478c0b' }}>Village of Peace</span>
              </p>
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: '#4b5563' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#f6af0d' }}></i>
                Kfar Hashalom, Dimona, Israel
              </div>
              <div className="text-xs font-bold" style={{ color: '#f6af0d' }}>
                "The Whole Village, In Your Hand"
              </div>
            </div>
          </div>
        )}

        {/* Collapsed State - Single Button with Logo */}
        <div className="flex items-center justify-center">
          {/* Progress Ring */}
          <div className="absolute inset-0 rounded-full">
            <svg className="w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="#478c0b"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${188.5 * scrollProgress / 100} 188.5`}
                className="transition-all duration-300"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
          </div>
          
          {/* Center Button with Logo - Hidden on Hover */}
          <button className="w-16 h-16 rounded-full flex items-center justify-center bg-white relative z-10 transition-all duration-300 border-2 group-hover:opacity-0 group-hover:scale-0" style={{ borderColor: '#f6af0d' }}>
            <Image 
              src="/images/logos/kfar_logo_africa_heritage.png" 
              alt="KFAR Navigation" 
              width={40} 
              height={40}
              className="object-contain p-1"
            />
          </button>
        </div>

        {/* Expanded State - Navigation Items */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-2xl opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-bottom">
          <Link href="/" className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all relative group/item" style={{ backgroundColor: '#478c0b' }}>
            <i className="fas fa-home text-lg"></i>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none" style={{ backgroundColor: '#3a3a1d' }}>
              Home
            </span>
          </Link>

          <Link href="/directory" className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all relative group/item animate-pulse" style={{ backgroundColor: '#f6af0d', animationDuration: '2s' }}>
            <i className="fas fa-store text-lg"></i>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none" style={{ backgroundColor: '#3a3a1d' }}>
              Marketplace
            </span>
            {/* Special glow effect for marketplace */}
            <div className="absolute inset-0 rounded-xl animate-ping" style={{ backgroundColor: '#f6af0d', animationDuration: '3s' }}></div>
          </Link>

          <Link href="/categories" className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all relative group/item" style={{ backgroundColor: '#f6af0d' }}>
            <i className="fas fa-th-large text-lg"></i>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none" style={{ backgroundColor: '#3a3a1d' }}>
              Categories
            </span>
          </Link>

          <Link href="/services" className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all relative group/item" style={{ backgroundColor: '#c23c09' }}>
            <i className="fas fa-concierge-bell text-lg"></i>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none" style={{ backgroundColor: '#3a3a1d' }}>
              Services
            </span>
          </Link>

          <Link href="/about" className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all relative group/item" style={{ backgroundColor: '#cfe7c1' }}>
            <i className="fas fa-info-circle text-lg" style={{ color: '#3a3a1d' }}></i>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none" style={{ backgroundColor: '#3a3a1d' }}>
              About
            </span>
          </Link>

          <button className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all relative group/item" style={{ backgroundColor: '#478c0b' }}>
            <i className="fas fa-shopping-cart text-lg"></i>
            <span className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#c23c09' }}>
              0
            </span>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none" style={{ backgroundColor: '#3a3a1d' }}>
              Cart
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;