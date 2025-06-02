# KFAR Header & Navigation System

## Overview
A comprehensive, context-aware header system that adapts to different pages and provides optimal navigation experience for both mobile and desktop users.

## Architecture

### 1. Core Components

#### **HeaderSystem** (`/components/layout/HeaderSystem.tsx`)
- Desktop-optimized header with full navigation
- Search with auto-suggestions
- Context-aware back buttons
- Vendor info display on store pages

#### **MobileOptimizedHeader** (`/components/layout/MobileOptimizedHeader.tsx`)
- Mobile-first design with minimal UI
- Full-screen search overlay
- Smart navigation based on page context
- Vendor-specific headers

#### **MobileBottomNav** (`/components/mobile/MobileBottomNav.tsx`)
- Fixed bottom navigation for mobile
- Smart active state detection
- Cart badge with item count
- Hidden on admin/vendor pages

### 2. Configuration System

#### **useHeaderConfig** Hook (`/hooks/useHeaderConfig.ts`)
Automatically determines header configuration based on current route:

```typescript
interface HeaderConfig {
  variant: 'default' | 'vendor' | 'checkout' | 'minimal' | 'product' | 'admin';
  showSearch: boolean;
  showCart: boolean;
  showBackButton: boolean;
  backButtonText?: string;
  backButtonLink?: string;
  vendorInfo?: any;
  transparent?: boolean;
}
```

## Page-Specific Headers

### 1. **Homepage** (`/`)
- Transparent header that becomes solid on scroll
- Full search functionality
- Location picker (Dimona)
- Cart icon with count

### 2. **Vendor Store Pages** (`/store/[vendorId]`)
- "Back to Marketplace" button
- Vendor info bar with logo, name, rating
- Search within vendor products
- Favorite button
- Cart access

### 3. **Product Pages** (`/product/[id]`)
- Context-aware back button:
  - "Back to Store" if from vendor page
  - "Continue Shopping" if from general browsing
- Search functionality
- Cart icon

### 4. **Cart & Checkout** (`/cart`, `/checkout`)
- Minimal header
- Progress indicator
- "Back to Shopping" option
- No search (focused flow)

### 5. **Marketplace** (`/marketplace`)
- Category filters
- Location picker
- Full search with vendor/product suggestions
- "Shop" changed to "Marketplace" throughout

## Mobile Features

### 1. **Search Experience**
- Full-screen overlay on mobile
- Recent searches saved locally
- Auto-suggestions for:
  - Products (with images, prices)
  - Vendors (with logos, product count)
  - Categories
- Voice search ready

### 2. **Navigation Logic**
```javascript
// Smart active state detection
const navItems = [
  { 
    href: '/marketplace', 
    activeOn: ['/marketplace', '/store/'] // Active on vendor pages too
  },
  { 
    href: '/shop', 
    activeOn: ['/shop', '/product/'] // Active on product pages
  }
];
```

### 3. **Bottom Navigation**
- 5 main sections: Home, Marketplace, Shop, Cart, Account
- Active indicators (top line + bottom dot)
- Cart badge shows item count (9+ for overflow)
- Hidden on admin/vendor management pages

## Search System

### 1. **Auto-Suggestions Include:**
- **Products**: Name, vendor, price, image
- **Vendors**: Name, product count, logo
- **Categories**: Quick filters for common searches

### 2. **Search Algorithm**
```javascript
// Searches across:
- Product names
- Product descriptions
- Product tags
- Vendor names
- Vendor descriptions
- Category names
```

### 3. **Recent Searches**
- Stored in localStorage
- Quick access on mobile
- Clear all option
- Limited to 5 most recent

## Desktop Features

### 1. **Main Navigation**
- Icon + text navigation items
- Active state indicators
- Hover effects
- User account dropdown

### 2. **Search Bar**
- Always visible on desktop
- Inline suggestions dropdown
- Category filters
- Advanced search link

## Implementation Details

### 1. **Responsive Breakpoints**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 2. **Performance**
- Headers loaded dynamically to prevent SSR issues
- Search debounced to reduce API calls
- Lazy loading for vendor images

### 3. **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Focus management in search
- Screen reader announcements

## Best Practices

### 1. **Navigation Clarity**
- Always show where user can go back to
- Use "Marketplace" not "Shop" for vendor browsing
- Context-aware back button text

### 2. **Mobile UX**
- Minimize taps to reach content
- Full-screen search for better typing
- Large touch targets (44px minimum)

### 3. **Search Optimization**
- Show most relevant results first
- Include visual elements (images/icons)
- Quick category shortcuts

## Future Enhancements

1. **Voice Search**
   - Integration with device microphone
   - Voice-to-text search input

2. **Personalized Suggestions**
   - Based on browsing history
   - Favorite vendors priority

3. **Advanced Filters**
   - In-header filter options
   - Save filter preferences

4. **Multi-language Support**
   - Hebrew/English toggle in header
   - RTL layout support

## Testing Checklist

- [ ] Mobile search overlay opens/closes properly
- [ ] Back buttons navigate to correct pages
- [ ] Cart count updates in real-time
- [ ] Active states show correctly in bottom nav
- [ ] Vendor info displays on store pages
- [ ] Search suggestions appear and are clickable
- [ ] Recent searches save and load
- [ ] Header transparency works on homepage
- [ ] All navigation links work
- [ ] Responsive behavior at all breakpoints