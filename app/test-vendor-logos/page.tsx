'use client';

import React from 'react';
import { vendorStores } from '@/lib/data/wordpress-style-data-layer';
import Layout from '@/components/layout/Layout';

export default function TestVendorLogos() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Logos Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(vendorStores).map(([vendorId, vendor]) => (
            <div key={vendorId} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{vendor.name}</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Logo Path:</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                    {vendor.branding.logo}
                  </code>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Logo Preview:</p>
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img 
                      src={vendor.branding.logo} 
                      alt={vendor.name ? `${vendor.name} Logo` : "Image"}
                      className="w-full h-32 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'text-red-500 text-center py-8';
                        errorDiv.textContent = 'Logo not found!';
                        target.parentElement?.appendChild(errorDiv);
                      }}
                    />
                  </div>
                </div>
                
                {vendor.branding.banner && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Banner Path:</p>
                    <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                      {vendor.branding.banner}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Actual Logo Files in /public/images/vendors/:</h3>
          <ul className="text-sm space-y-1">
            <li>• teva_deli_logo_vegan_factory.jpg</li>
            <li>• queens_cuisine_official_logo_master_brand_plant_based_catering.jpg</li>
            <li>• gahn_delight_official_logo_master_brand_ice_cream.jpg</li>
            <li>• vop_shop_official_logo_master_brand_village_of_peace.jpg</li>
            <li>• people_store_logo_community_retail.jpg</li>
            <li>• Garden of Light Logo.jpg</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}