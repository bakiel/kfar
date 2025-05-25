# KFAR Marketplace Development Guide

## Project Overview
KFAR Marketplace - Digital marketplace for the Village of Peace (Kfar Hashalom) community in Dimona, Israel. A platform connecting authentic vegan businesses with customers seeking quality services and products.

## Key Design Rules & Patterns

### 1. Color Usage
**ALWAYS use inline styles for colors to ensure visibility:**
```tsx
// ✅ CORRECT - Always works
style={{ color: '#478c0b' }}
style={{ backgroundColor: '#c23c09' }}

// ❌ AVOID - May not render
className="text-leaf-green bg-earth-flame"
```

**Brand Colors (use exact hex codes):**
- Leaf Green: `#478c0b` (primary green)
- Sun Gold: `#f6af0d` (primary gold) 
- Earth Flame: `#c23c09` (primary red)
- Soil Brown: `#3a3a1d` (primary text)
- Herbal Mint: `#cfe7c1` (light accent)
- Cream Base: `#fef9ef` (background)

### 2. Component Structure Patterns

**Floaty Panel Design:**
```tsx
<div className="group relative transform transition-all duration-500 hover:scale-102">
  {/* Card Glow Effect */}
  <div className="absolute -inset-1 bg-gradient-to-r from-sun-gold via-leaf-green to-earth-flame rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />
  
  <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 group-hover:border-transparent transition-all duration-500">
    {/* Content */}
  </div>
</div>
```

**Stats Section Pattern:**
```tsx
<div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto border-2" style={{ borderColor: '#f6af0d' }}>
  <div className="grid grid-cols-3 gap-8">
    <div className="text-center group hover:scale-105 transition-transform duration-300">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg" style={{ backgroundColor: '#478c0b' }}>
        <i className="fas fa-check-circle text-3xl text-white"></i>
      </div>
      <div className="text-5xl font-bold mb-2" style={{ color: '#478c0b' }}>6</div>
      <div className="text-sm font-bold mb-1" style={{ color: '#3a3a1d' }}>Label</div>
    </div>
  </div>
</div>
```

### 3. Button Patterns

**Primary Action Button:**
```tsx
<button 
  className="w-full py-4 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3" 
  style={{ backgroundColor: '#c23c09' }}
>
  <i className="fas fa-store text-xl"></i>
  Join as Vendor
  <i className="fas fa-arrow-right"></i>
</button>
```

**Secondary Action Button:**
```tsx
<button 
  className="w-full py-4 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3" 
  style={{ backgroundColor: '#f6af0d' }}
>
  <i className="fas fa-info-circle text-xl"></i>
  Learn More
</button>
```

### 4. Background Integration

**Background with Overlay System:**
```tsx
<section className="py-24 relative overflow-hidden">
  <div className="absolute inset-0 pointer-events-none">
    {/* Main Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/images/backgrounds/1.jpg')`,
        backgroundAttachment: 'fixed'
      }}
    />
    
    {/* Multi-layer Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-cream-base/90 to-white/95" />
    <div className="absolute inset-0 bg-gradient-to-r from-leaf-green/5 via-transparent to-sun-gold/5" />
  </div>
  
  <div className="container mx-auto px-4 relative z-10">
    {/* Content */}
  </div>
</section>
```

### 5. Typography Rules

**Headers with Icons:**
```tsx
<h3 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3" style={{ color: '#3a3a1d' }}>
  <i className="fas fa-store text-2xl" style={{ color: '#478c0b' }}></i>
  Join Our Marketplace
</h3>
```

**Body Text:**
- Use `style={{ color: '#3a3a1d' }}` for main text (soil-brown)
- Use `text-gray-600` or `text-gray-700` for secondary text
- Always ensure good contrast

### 6. Icon Usage

**Always use reliable FontAwesome icons:**
- `fa-store` - marketplace/vendor
- `fa-check-circle` - active/success
- `fa-clock` - coming soon/time
- `fa-th-large` - total/grid
- `fa-handshake` - partnership
- `fa-users` - community

**Icon with Color:**
```tsx
<i className="fas fa-store text-2xl" style={{ color: '#478c0b' }}></i>
```

### 7. Contrast & Visibility Rules

1. **Always test button visibility** - Use standard colors if custom ones fail
2. **Use white text on colored backgrounds** - Ensures readability
3. **Apply backdrop-blur for glass effects** - `bg-white/95 backdrop-blur-sm`
4. **Use shadows for depth** - `shadow-2xl` for important elements

### 8. Animation Patterns

**Hover Effects:**
```tsx
className="group hover:scale-105 transition-transform duration-300"
className="group-hover:shadow-xl transition-shadow"
```

**Pulse Animations:**
```tsx
style={{ 
  animationDuration: '8s',
  animationDelay: '2s' 
}}
```

### 9. Layout Guidelines

- **Max Width**: Use `max-w-3xl` or `max-w-6xl` for content containers
- **Spacing**: Use `py-24` for section padding, `mb-16` for major spacing
- **Grid**: `grid md:grid-cols-2 gap-6` for service categories
- **Responsive**: Always include `sm:` and `md:` breakpoints

### 10. Asset Management

**Background Images:**
- **Location**: `/public/images/backgrounds/`
- **Available Files**:
  - `1.jpg` - Currently used in Community Services section
  - `2.jpg` - Available for use
  - `3.jpg` - Available for use  
  - `4.jpg` - Available for use
- **Source**: From `/Users/mac/Downloads/Kfar Backgrounds` folder
- **Usage Pattern**:
  ```tsx
  backgroundImage: `url('/images/backgrounds/2.jpg')`,
  backgroundAttachment: 'fixed'
  ```
- Always include overlay for readability

**Vendor Images:**
- Store in `/public/images/vendors/`
- Use 1:1 aspect ratio for logos
- Apply `rounded-full` with colored borders

## Community Services Hub Specific

This component serves as the main service directory and vendor recruitment hub.

**Current Business Count:**
- **6 Active Businesses** (Food & Dining category)
- **18 Coming Soon** (across all categories)
- **24 Total Services** (6 active + 18 coming soon)

**Key Features:**
1. Animated stats section with brand colors showing real business counts
2. Expandable service categories (Food & Dining starts expanded)
3. CTA panel with clear vendor recruitment
4. Background integration with overlay system
5. Floaty design matching other panels

**Brand Messaging:**
- "Village of Peace" = Kfar Hashalom, Dimona, Israel
- Focus on US service providers and new businesses
- Emphasize vegan, authentic, quality services
- Community-first approach

**Updated Business Names:**
- Garden of Light Vegan Deli (formerly "Atur and Aturah")
- Uses premium vegan deli specialties description
- Sun icon (fa-sun) for brand alignment

## Welcome Popup Component

**Purpose:** One-time welcome message introducing KFAR Marketplace to new visitors.

**Features:**
1. **One-time display** - Uses localStorage to track if user has seen it
2. **KFAR Africa Heritage logo** prominently displayed
3. **Community introduction** with location and mission
4. **Brand color compliance** with proper contrast
5. **Auto-appears** after 1.5 seconds on first visit
6. **Dismissible** with close button or backdrop click

**Design Elements:**
- Green gradient header with white logo circle
- Three info sections with colored icons
- Tagline: "The Whole Village, In Your Hand"
- Primary action button to explore marketplace
- Proper overlay and backdrop blur

**Removed Components:**
- Side floating navigation (FloatingNavigation.tsx) - removed from Layout.tsx
- Center floating navigation - replaced with WelcomePopup
- This prevents dual floating elements and focuses user attention

## Testing Checklist

Before deployment, verify:
- [ ] All buttons are visible and clickable
- [ ] Icons display properly (no placeholder squares)
- [ ] Colors render correctly across different browsers
- [ ] Text has sufficient contrast
- [ ] Hover effects work smoothly
- [ ] Background images load and overlay properly
- [ ] Responsive design works on mobile
- [ ] Brand colors are consistent throughout

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run with Turbopack (faster)
npm run dev --turbopack
```

Server typically runs on http://localhost:3001

---

**Last Updated:** May 25, 2024  
**Component:** Community Services Hub  
**Status:** Production Ready