# Community Images & Review System Guide

## Overview
The KFAR Marketplace uses authentic community member images for reviews, vendor profiles, and testimonials. These images represent:
- Village of Peace community members
- Local Israeli residents
- African diaspora visitors
- International visitors

## Image Location
All community images are stored in: `/public/images/community/`

## Naming Convention
Images follow the pattern:
`village_of_peace_community_authentic_dimona_israel_[NUMBER].jpg`

## Review System Implementation

### 1. Review Authors
Located in `/lib/data/review-mock-data.ts`

Each author has:
- **name**: Hebrew-influenced names for community members, common names for others
- **image**: Path to community member photo
- **location**: Authentic locations (Village of Peace, Dimona, etc.)
- **memberType**: 'community' | 'local' | 'visitor' | 'diaspora'
- **verified**: Boolean for verified purchaser status

### 2. Community Member Names
Following authentic naming patterns:
- Hebrew-influenced first names (Yahlital, Toveet, Elishai, Ahmeeteeyah)
- Ben (son of) or Baht (daughter of) constructions
- Some use "Israel" as surname
- Others retain conventional surnames (Young, Rivers, Moore)

**Examples:**
- Yahlital Ben-Israel
- Toveet Baht-Shalom
- Elishai Young
- Ahmeeteeyah Cohen
- Gadiel Ben-Yehuda
- Koliyah Baht-Israel

### 3. Usage in Components

#### Product Reviews Component
```tsx
import { ProductReviews } from '@/components/product/ProductReviews';

// On product page
<ProductReviews productId={product.id} />
```

#### Review Summary Component
```tsx
import { ReviewSummary } from '@/components/ui/ReviewSummary';

// Show star rating with count
<ReviewSummary productId={product.id} size="small" />
```

#### Vendor Profile Component
```tsx
import { VendorProfile } from '@/components/vendor/VendorProfile';

// Show vendor with owner photo
<VendorProfile 
  vendorId="teva-deli"
  vendorName="Teva Deli"
  established="2010"
  certifications={['Kosher', 'Organic']}
/>
```

## Image Assignments

### Vendor Owners (using community images)
- **Teva Deli**: Immanuel Rivers (image 07)
- **Queens Cuisine**: Koliyah Baht-Israel (image 06)
- **Gahn Delight**: Ahmeeteeyah Cohen (image 04)
- **People Store**: Nathaniel Ben-Israel (image 10)
- **Garden of Light**: Elishai Young (image 03)

### Review Authors by Type

#### Community Members (images 01-10)
- Authentic Village of Peace residents
- Use Hebrew-influenced names
- Location: "Village of Peace, Dimona" or "Kfar Hashalom"
- Always verified purchasers

#### Local Israelis (images 11-15)
- Israeli residents from various cities
- Use common Israeli names (Sarah, David, Rachel, Yossi, Miriam)
- Locations: Tel Aviv, Jerusalem, Beer Sheva, Eilat, Dimona

#### African Diaspora Visitors (images 16-20)
- Visitors from US, UK, France, Nigeria
- Names reflect African diaspora (Kwame, Aisha, Marcus, Fatima, Emmanuel)
- Often mention visiting the community

#### International Visitors (images 21-25)
- Global visitors interested in vegan lifestyle
- Various international names
- Locations worldwide

## Best Practices

1. **Authentic Reviews**: Write reviews that reflect real experiences
2. **Community Voice**: Community members often mention:
   - Years of vegan living
   - Family preferences
   - Shabbat meals
   - Community values

3. **Visitor Perspectives**: Visitors often mention:
   - Learning about the lifestyle
   - Comparing to their home countries
   - Taking ideas back to their communities

4. **Vendor Responses**: Add vendor responses to show engagement

## Adding New Reviews

```typescript
const newReview: ProductReview = {
  id: 'rev-xxx',
  productId: 'product-id',
  author: reviewAuthors[0], // Select appropriate author
  rating: 5,
  date: '2025-01-28',
  title: 'Authentic review title',
  comment: 'Detailed review reflecting author background',
  helpful: 0,
  vendorResponse: {
    date: '2025-01-29',
    message: 'Thank you for your feedback!'
  }
};
```

## Implementation Status
✅ Review mock data created with 25 authentic profiles
✅ ProductReviews component with full functionality
✅ ReviewSummary component for product cards
✅ VendorProfile component with owner photos
✅ 66 community images available for use
✅ Authentic naming conventions implemented

---

Last Updated: January 2025
Status: Ready for Implementation