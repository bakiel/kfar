'use client';

import { SmartQRGenerator } from '@/components/qr/SmartQRGenerator';

export default function TestQRPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: '#3a3a1d' }}>
          QR Code Test Page
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Product QR */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Product QR Code</h2>
            <SmartQRGenerator
              type="product"
              data={{
                id: 'test-product-1',
                name: 'Test Product',
                price: 29.99,
                vendor: 'Test Vendor'
              }}
              size={200}
              color={{ dark: '#478c0b', light: '#FFFFFF' }}
            />
          </div>
          
          {/* Order QR */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Order QR Code</h2>
            <SmartQRGenerator
              type="order"
              data={{
                id: 'test-order-1',
                amount: 99.99,
                currency: 'ILS',
                timestamp: Date.now()
              }}
              size={200}
              color={{ dark: '#c23c09', light: '#FFFFFF' }}
            />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            This page tests QR code generation stability and error handling.
          </p>
          <p className="text-gray-600">
            QR codes should appear without jumping or layout shifts.
          </p>
        </div>
      </div>
    </div>
  );
}