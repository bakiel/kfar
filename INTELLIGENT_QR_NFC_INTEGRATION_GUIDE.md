# Intelligent QR & NFC System Integration Guide

## Overview
This guide provides step-by-step instructions for integrating the intelligent QR & NFC system into the Kfar Marketplace application.

## Quick Start

### 1. Environment Setup

First, add your API keys to `.env.local`:

```bash
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-c1c819391f674040967955a41b469f89
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyA7dxzalb_kWQFludH0XMIAA9U1H_OROGs
```

### 2. Install Required Dependencies

```bash
npm install qrcode @zxing/browser @google/generative-ai
```

### 3. Basic Integration Example

```typescript
import { AI } from '@/lib/services/ai';
import { SmartQRGenerator } from '@/components/qr/SmartQRGenerator';
import { NFCReader } from '@/components/nfc/NFCReader';

// Generate a smart QR code
const MyProductQR = ({ product }) => (
  <SmartQRGenerator
    type="product"
    data={product}
    onGenerated={(qr) => console.log('QR generated:', qr)}
  />
);

// Read NFC tags
const MyNFCReader = () => (
  <NFCReader
    onRead={(data) => console.log('NFC data:', data)}
    acceptedTypes={['product', 'payment']}
  />
);
```

## Feature Integration

### 1. Product QR Codes

Add QR codes to product pages:

```typescript
// app/product/[id]/page.tsx
import { SmartQRGenerator } from '@/components/qr/SmartQRGenerator';

export default function ProductPage({ product }) {
  return (
    <div>
      {/* Product details */}
      
      {/* QR Code Section */}
      <div className="mt-8">
        <h3>Quick Access QR</h3>
        <SmartQRGenerator
          type="product"
          data={{
            id: product.id,
            name: product.name,
            price: product.price,
            vendorId: product.vendorId
          }}
          size={200}
        />
      </div>
    </div>
  );
}
```

### 2. Smart Search with AI

Implement intelligent product search:

```typescript
// components/SmartSearch.tsx
import { useState } from 'react';
import { AI } from '@/lib/services/ai';

export function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await AI.search({
      text: query,
      context: {
        userId: 'current-user',
        preferences: ['vegan', 'organic']
      }
    });
    
    if (response.success) {
      setResults(response.data.suggestions);
    }
  };

  const handleImageSearch = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      const response = await AI.analyzeProduct(imageData);
      
      if (response.success) {
        setQuery(response.data.visual.suggestedName);
        handleSearch();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    // Search UI implementation
  );
}
```

### 3. Collection Point Integration

Add collection point selection to checkout:

```typescript
// app/checkout/page.tsx
import { CollectionPointPicker } from '@/components/collection/CollectionPointPicker';
import { CollectionPoints } from '@/lib/services/collection-point-service';

export default function CheckoutPage() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleCollectionSelect = async (point, slot) => {
    setSelectedPoint(point);
    setSelectedSlot(slot);
    
    // Book the collection
    const booking = await CollectionPoints.bookCollection(
      orderId,
      point.id,
      slot
    );
  };

  return (
    <div>
      {/* Other checkout steps */}
      
      <CollectionPointPicker
        onSelect={handleCollectionSelect}
        orderType="standard"
        showSlots={true}
      />
    </div>
  );
}
```

### 4. P2P Order Tracking

Enable peer-to-peer exchanges:

```typescript
// app/orders/[id]/p2p-tracking/page.tsx
import { P2POrderTracker } from '@/components/p2p/P2POrderTracker';

export default function P2PTrackingPage({ params }) {
  return (
    <P2POrderTracker
      orderId={params.id}
      userRole="buyer" // or 'seller' based on auth
      onComplete={() => router.push('/orders')}
    />
  );
}
```

### 5. NFC Payment Integration

Add NFC payment option:

```typescript
// components/checkout/NFCPayment.tsx
import { NFC } from '@/lib/services/nfc-service';

export function NFCPayment({ amount, onSuccess }) {
  const handleNFCPayment = async () => {
    // Write payment request to NFC tag
    const result = await NFC.write('payment', {
      amount,
      currency: 'ILS',
      orderId: 'order-123'
    });
    
    if (result.success) {
      onSuccess(result.tagId);
    }
  };

  return (
    <button onClick={handleNFCPayment}>
      Pay with NFC
    </button>
  );
}
```

## API Integration

### Backend Endpoints

Create these API endpoints to support the system:

```typescript
// app/api/qr/verify/route.ts
export async function POST(request: Request) {
  const { signature, type } = await request.json();
  
  // Verify QR signature in database
  const qrData = await db.qrCodes.findOne({ signature });
  
  if (!qrData || qrData.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid QR' }, { status: 400 });
  }
  
  return NextResponse.json(qrData);
}

// app/api/nfc/register/route.ts
export async function POST(request: Request) {
  const nfcPayload = await request.json();
  
  // Store NFC tag data
  await db.nfcTags.create({
    data: nfcPayload
  });
  
  return NextResponse.json({ success: true });
}

// app/api/collection-points/book/route.ts
export async function POST(request: Request) {
  const { orderId, pointId, slotId } = await request.json();
  
  // Create collection booking
  const booking = await db.collectionBookings.create({
    data: {
      orderId,
      collectionPointId: pointId,
      slotId,
      qrCode: generateQRCode(),
      status: 'pending'
    }
  });
  
  return NextResponse.json(booking);
}
```

## Advanced Features

### 1. Multi-Language Support

```typescript
// Translate product descriptions
const translatedProduct = await AI.translate(product, 'he');
```

### 2. Visual Product Search

```typescript
// Allow users to search by taking a photo
const handleCameraSearch = async (imageFile: File) => {
  const results = await AI.analyzeProduct(imageFile);
  // Show similar products
};
```

### 3. Vendor Insights

```typescript
// Generate AI-powered insights for vendors
const insights = await AI.vendorInsights(vendorId, {
  sales: salesData,
  products: productList,
  feedback: customerReviews
});
```

### 4. Quality Verification

```typescript
// Verify product quality from images
const qualityCheck = await AI.verifyQuality(
  productImage,
  'produce'
);
```

## Security Considerations

1. **QR Code Security**
   - All QR codes are digitally signed
   - Time-based expiration for sensitive codes
   - One-time use codes for payments

2. **NFC Security**
   - Use secure element when available
   - Implement write protection
   - Verify tag authenticity

3. **API Security**
   - Validate all QR/NFC data server-side
   - Rate limit scanning endpoints
   - Log all verifications

## Testing

### QR Code Testing
```typescript
// Test QR generation
const testQR = await AI.generateQR('test', { data: 'test' });
console.log('QR generated:', testQR);

// Test QR scanning (mock)
const mockScan = { type: 'product', id: '123' };
handleQRScan(mockScan);
```

### NFC Testing
```typescript
// Test NFC support
const support = NFC.isSupported();
console.log('NFC supported:', support);

// Test with emulation
await NFC.emulate({
  tagId: 'test-123',
  type: 'product',
  data: { primary: { id: '123' }, fallback: 'https://kfar.market' }
});
```

## Performance Optimization

1. **Lazy Load Components**
```typescript
const SmartQRGenerator = dynamic(
  () => import('@/components/qr/SmartQRGenerator'),
  { ssr: false }
);
```

2. **Cache AI Responses**
```typescript
// AI service includes built-in caching
// Responses are cached for 5 minutes by default
```

3. **Optimize Images**
```typescript
// Use Next.js Image optimization
import Image from 'next/image';
```

## Troubleshooting

### Common Issues

1. **QR Scanner Not Working**
   - Check camera permissions
   - Ensure HTTPS connection
   - Try upload fallback

2. **NFC Not Supported**
   - NFC requires Chrome on Android
   - Provide QR fallback
   - Check device capabilities

3. **AI Service Errors**
   - Verify API keys are set
   - Check rate limits
   - Review error logs

### Debug Mode

Enable debug logging:
```typescript
// lib/services/ai/index.ts
const DEBUG = process.env.NODE_ENV === 'development';
```

## Deployment

### Environment Variables
```bash
# Production
NEXT_PUBLIC_DEEPSEEK_API_KEY=your-production-key
NEXT_PUBLIC_GEMINI_API_KEY=your-production-key
NEXT_PUBLIC_APP_URL=https://kfar.market
```

### Database Schema
```sql
-- Add QR/NFC tables
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY,
  type VARCHAR(50),
  signature VARCHAR(255) UNIQUE,
  payload JSONB,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE nfc_tags (
  id UUID PRIMARY KEY,
  tag_id VARCHAR(255) UNIQUE,
  type VARCHAR(50),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE collection_bookings (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  collection_point_id VARCHAR(50),
  slot_id VARCHAR(100),
  qr_code VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Next Steps

1. **Implement Backend APIs**: Create the necessary API endpoints
2. **Add Payment Gateway**: Integrate with Israeli payment providers
3. **Deploy Hardware**: Install NFC readers at collection points
4. **Train Staff**: Prepare collection point staff for the new system
5. **User Education**: Create tutorials for QR/NFC features

## Support

For issues or questions:
- Technical Documentation: `/docs/qr-nfc-system`
- API Reference: `/api-docs`
- Support Email: tech@kfar.market