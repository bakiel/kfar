'use client';

import { useEffect, useState } from 'react';
import { tevaDeliCompleteProducts } from '@/lib/data/teva-deli-complete-catalog';

export default function TevaDeliDebugPage() {
  const [imageStatuses, setImageStatuses] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  useEffect(() => {
    // Check each image
    tevaDeliCompleteProducts.forEach(product => {
      const img = new window.Image();
      img.onload = () => {
        setImageStatuses(prev => ({ ...prev, [product.id]: 'success' }));
      };
      img.onerror = () => {
        setImageStatuses(prev => ({ ...prev, [product.id]: 'error' }));
      };
      setImageStatuses(prev => ({ ...prev, [product.id]: 'loading' }));
      img.src = product.image;
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Teva Deli Image Debug</h1>
      
      <div className="grid gap-4">
        {tevaDeliCompleteProducts.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 relative border rounded overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name || "Image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Failed to load: ${product.id}`, product.image);
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold">{product.id}: {product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.nameHe}</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">{product.image}</p>
                
                <div className="mt-2">
                  Status: 
                  <span className={`ml-2 font-bold ${
                    imageStatuses[product.id] === 'success' ? 'text-green-600' : 
                    imageStatuses[product.id] === 'error' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {imageStatuses[product.id] || 'checking...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Summary:</h2>
        <p>Total products: {tevaDeliCompleteProducts.length}</p>
        <p>Images loaded: {Object.values(imageStatuses).filter(s => s === 'success').length}</p>
        <p>Images failed: {Object.values(imageStatuses).filter(s => s === 'error').length}</p>
      </div>
    </div>
  );
}
