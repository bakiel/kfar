'use client';

import { SmartQRCompactFixed } from '@/components/qr/SmartQRCompactFixed';

export default function TestQRLayout() {
  const testData = {
    order: {
      id: 'test-order-123',
      amount: 100,
      currency: 'ILS',
      merchant: 'KFAR Marketplace',
      timestamp: Date.now()
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">QR Layout Test</h1>
        
        {/* Test different QR configurations */}
        <div className="space-y-8">
          {/* Single QR in payment container */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment QR (Compact)</h2>
            <div className="flex justify-center">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <SmartQRCompactFixed
                  type="order"
                  data={testData.order}
                  size={250}
                  hideActions={false}
                />
              </div>
            </div>
          </div>

          {/* Two QRs side by side */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Two QRs Side by Side</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <SmartQRCompactFixed
                    type="order"
                    data={{ ...testData.order, id: 'qr-1' }}
                    size={200}
                    hideActions={false}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <SmartQRCompactFixed
                    type="order"
                    data={{ ...testData.order, id: 'qr-2' }}
                    size={200}
                    hideActions={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* QR with timer badge (like in payment) */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">QR with Timer Badge</h2>
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <SmartQRCompactFixed
                    type="order"
                    data={testData.order}
                    size={250}
                    hideActions={true}
                  />
                </div>
                {/* Timer Badge */}
                <div className="absolute -top-3 -right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <i className="fas fa-clock text-xs"></i>
                  4:33
                </div>
              </div>
            </div>
          </div>

          {/* Expanded QR */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Expanded QR</h2>
            <div className="flex justify-center">
              <SmartQRCompactFixed
                type="order"
                data={testData.order}
                size={300}
                hideActions={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}