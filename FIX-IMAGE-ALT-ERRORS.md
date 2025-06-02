# Fixing Next.js Image Alt Attribute Errors

## Issue
Next.js requires all `<Image>` components to have an `alt` attribute for accessibility. The error you're seeing indicates there are Image components without alt attributes.

## Quick Fix Applied

I've already fixed several Image components that were missing alt attributes:

1. **Marketplace Page** - Added alt="KFAR Marketplace Banner"
2. **Product Page** - Added alt attributes with product names
3. **Vendor Onboarding** - Added empty alt attributes (will need proper text)

## Comprehensive Fix Script

Run this to find and fix all remaining issues:

```bash
cd /Users/mac/Downloads/kfar-final/kfar-marketplace-app
node scripts/fix-image-alt-attributes.js
```

## Manual Review Needed

Some Image components may need more meaningful alt text based on context:

1. **Vendor Logos** - Should be: `alt="${vendorName} logo"`
2. **Product Images** - Should be: `alt="${productName}"`
3. **Decorative Images** - Can use: `alt=""`
4. **Banner Images** - Should describe the content

## Best Practices

1. **Always add alt attributes** when creating new Image components
2. **Make alt text descriptive** - describe what's in the image
3. **Keep it concise** - aim for 125 characters or less
4. **Don't start with "Image of"** - screen readers already announce it's an image
5. **Empty alt for decorative images** - use `alt=""` for purely decorative images

## Example Fixes

```jsx
// Bad - No alt attribute
<Image src="/logo.png" width={100} height={50} />

// Good - Descriptive alt text
<Image src="/logo.png" alt="KFAR Marketplace" width={100} height={50} />

// Good - Empty alt for decorative image
<Image src="/decorative-border.png" alt="" width={100} height={50} />

// Good - Product image with context
<Image src={product.image} alt={`${product.name} - ${product.vendor}`} fill />
```

## Next Steps

1. Restart your development server to clear the error
2. Review the alt texts added and make them more descriptive where needed
3. Add ESLint rule to catch missing alts in the future:

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-img-element": "error",
    "jsx-a11y/alt-text": ["error", {
      "elements": ["img", "Image"],
      "img": ["Image"]
    }]
  }
}
```
