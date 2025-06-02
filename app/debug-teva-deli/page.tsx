// Debug page to check Teva Deli products
'use client';

import { useState, useEffect } from 'react';
import { completeProductCatalog } from '@/lib/data/complete-catalog';

export default function TevaDeliDebugPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    try {
      const tevaDeli = completeProductCatalog['teva-deli'];
      if (tevaDeli && tevaDeli.products) {
        setProducts(tevaDeli.products);
      } else {
        setError('Teva Deli not found in catalog');
      }
    } catch (e) {
      setError(e.message);
    }
  }, []);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Teva Deli Products Debug</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <p>Total products: {products.length}</p>
      
      <h2>Products List:</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {products.map((product, index) => (
          <div key={product.id} style={{ 
            border: '1px solid #ccc', 
            padding: '10px',
            backgroundColor: index % 2 ? '#f5f5f5' : 'white'
          }}>
            <strong>{index + 1}. {product.name}</strong> ({product.nameHe})
            <br />
            ID: {product.id} | Price: ₪{product.price} | Category: {product.category}
            <br />
            <small>Image: {product.image}</small>
            {product.image && !product.image.startsWith('/') && (
              <span style={{ color: 'red' }}> ⚠️ Invalid image path</span>
            )}
          </div>
        ))}
      </div>
      
      <h2>Categories:</h2>
      <ul>
        {[...new Set(products.map(p => p.category))].map(cat => (
          <li key={cat}>{cat}: {products.filter(p => p.category === cat).length} products</li>
        ))}
      </ul>
    </div>
  );
}
