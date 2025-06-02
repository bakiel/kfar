# KFAR Marketplace Alt Text Reference

## Product Images
```tsx
<Image 
  src={product.image} 
  alt={product.name}
  // or more descriptive:
  alt={`${product.name} - ${product.nameHe}`}
/>
```

## Vendor Images
```tsx
// Logo
<Image 
  src={vendor.logo} 
  alt={`${vendor.businessName} logo`}
/>

// Banner
<Image 
  src={vendor.bannerImage} 
  alt={`${vendor.businessName} banner`}
/>
```

## Static Images
```tsx
// Hero
<Image 
  src="/images/hero-banner.jpg" 
  alt="KFAR Marketplace - Vegan products from the Negev"
/>

// Icons
<Image 
  src="/images/icons/cart.svg" 
  alt="Shopping cart icon"
/>
```

## Best Practices
1. Be descriptive but concise
2. Include Hebrew names for local context
3. Don't use "image of" or "picture of"
4. Focus on what's important in the image
5. Consider the context where it appears
