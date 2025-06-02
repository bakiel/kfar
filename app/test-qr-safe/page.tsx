'use client';

import { SmartQRCompactFixed } from '@/components/qr/SmartQRCompactFixed';

export default function TestQRSafe() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Safe QR Code Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Compact QR */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Compact QR (Cart Style)</h2>
            <div className="flex justify-center">
              <SmartQRCompactFixed
                type="order"
                data={{
                  id: 'test-order-123',
                  total: 100,
                  currency: 'ILS',
                  items: 3,
                  timestamp: Date.now()
                }}
                size={200}
                hideActions={true}
              />
            </div>
          </div>

          {/* Full QR */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Full QR (Payment Style)</h2>
            <div className="flex justify-center">
              <SmartQRCompactFixed
                type="order"
                data={{
                  id: 'payment-456',
                  amount: 250.50,
                  currency: 'ILS',
                  merchant: 'KFAR Marketplace',
                  timestamp: Date.now()
                }}
                size={280}
                hideActions={false}
              />
            </div>
          </div>

          {/* Product QR */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Product QR</h2>
            <div className="flex justify-center">
              <SmartQRCompactFixed
                type="product"
                data={{
                  id: 'product-789',
                  name: 'Test Product',
                  price: 50,
                  vendor: 'Test Vendor'
                }}
                size={200}
                hideActions={true}
              />
            </div>
          </div>

          {/* Vendor QR */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Vendor QR</h2>
            <div className="flex justify-center">
              <SmartQRCompactFixed
                type="vendor"
                data={{
                  id: 'vendor-abc',
                  name: 'Test Vendor Store',
                  category: 'Food'
                }}
                size={200}
                hideActions={true}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">✅ Smart QR Implementation Restored</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Full AI-powered features</li>
            <li>Download QR functionality</li>
            <li>Copy link feature</li>
            <li>Share functionality</li>
            <li>Compact/expanded views</li>
            <li>AI-enhanced content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}