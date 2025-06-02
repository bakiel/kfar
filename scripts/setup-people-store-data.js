// Script to set up People Store data in localStorage
const peopleStoreData = {
  storeName: 'People Store',
  storeNameHe: 'חנות העם',
  category: 'Community Commerce',
  description: 'Your neighborhood marketplace for kosher certified, everyday essentials with Hebrew heritage names',
  descriptionHe: 'השוק השכונתי שלך למוצרים כשרים יומיומיים עם שמות מורשת עבריים',
  logo: '/images/vendors/people_store_logo_community_retail.jpg',
  banner: '/images/banners/5.jpg',
  phone: '+972-52-555-0105',
  email: 'hello@people-store.kfar',
  address: '5 Community Plaza, Village of Peace, Dimona',
  deliveryOptions: ['pickup', 'local-delivery'],
  businessHours: {
    sunday: { open: '7:00 AM', close: '9:00 PM', closed: false },
    monday: { open: '7:00 AM', close: '9:00 PM', closed: false },
    tuesday: { open: '7:00 AM', close: '9:00 PM', closed: false },
    wednesday: { open: '7:00 AM', close: '9:00 PM', closed: false },
    thursday: { open: '7:00 AM', close: '9:00 PM', closed: false },
    friday: { open: '7:00 AM', close: '3:00 PM', closed: false },
    saturday: { open: '8:00 PM', close: '11:00 PM', closed: false }
  },
  products: [
    {
      id: 'ps-001',
      name: 'Challah Bread',
      nameHe: 'לחם חלה',
      description: 'Traditional braided challah, golden and fluffy. Perfect for Shabbat and holidays.',
      price: 18,
      category: 'Bakery',
      image: '/images/vendors/people_store_challah_bread_traditional_braided_golden.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-002',
      name: 'Whole Wheat Sourdough',
      nameHe: 'לחם חיטה מלאה',
      description: 'Artisanal sourdough made with organic whole wheat flour. Naturally fermented.',
      price: 22,
      category: 'Bakery',
      image: '/images/vendors/people_store_whole_wheat_sourdough_artisanal.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-003',
      name: 'Tahini Premium',
      nameHe: 'טחינה פרימיום',
      description: 'Smooth, creamy tahini paste made from 100% roasted sesame seeds.',
      price: 28,
      category: 'Pantry',
      image: '/images/vendors/people_store_tahini_premium_sesame_paste.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-004',
      name: 'Date Honey',
      nameHe: 'דבש תמרים',
      description: 'Natural sweetener made from pure dates. No added sugars.',
      price: 35,
      category: 'Pantry',
      image: '/images/vendors/people_store_date_honey_natural_sweetener.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true
    },
    {
      id: 'ps-005',
      name: 'Olive Oil Extra Virgin',
      nameHe: 'שמן זית כתית מעולה',
      description: 'Cold-pressed extra virgin olive oil from local Israeli groves.',
      price: 45,
      category: 'Pantry',
      image: '/images/vendors/people_store_olive_oil_extra_virgin_israeli.jpg',
      isVegan: true,
      isKosher: true,
      inStock: true
    }
  ],
  policies: {
    returnPolicy: 'Returns accepted within 7 days for non-perishable items with receipt.',
    shippingPolicy: 'Free local delivery for orders over ₪100. Same-day pickup available.',
    privacyPolicy: 'We respect your privacy and protect your personal information.'
  }
};

// If running in browser
if (typeof window !== 'undefined') {
  localStorage.setItem('vendor_people-store', JSON.stringify(peopleStoreData));
  console.log('People Store data saved to localStorage');
}

// If running in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = peopleStoreData;
}