'use client';

import Layout from '@/components/layout/Layout';

export default function TestCSS() {
  return (
    <Layout>
      <div className="min-h-screen bg-cream-base p-8">
        <h1 className="text-4xl font-bold text-leaf-green mb-4">CSS Test Page</h1>
        <p className="text-xl text-soil-brown mb-8">Testing if Tailwind CSS is working properly</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-leaf-green">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#478c0b' }}>Leaf Green</h2>
            <p className="text-gray-600">Using inline style</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-sun-gold">
            <h2 className="text-2xl font-semibold mb-2 text-sun-gold">Sun Gold</h2>
            <p className="text-gray-600">Using Tailwind class</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-earth-flame">
            <h2 className="text-2xl font-semibold mb-2 text-earth-flame">Earth Flame</h2>
            <p className="text-gray-600">Using Tailwind class</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-leaf-green to-sun-gold p-8 rounded-xl text-white">
          <h3 className="text-3xl font-bold mb-2">Gradient Test</h3>
          <p>This should have a green to gold gradient background</p>
        </div>
      </div>
    </Layout>
  );
}