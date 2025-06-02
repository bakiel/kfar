'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { vendorStores } from '@/lib/data/wordpress-style-data-layer';
import { Package, Store, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const totalProducts = Object.values(vendorStores)
    .reduce((sum, vendor) => sum + vendor.products.length, 0);
  
  const activeVendors = Object.keys(vendorStores).length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">KFAR Marketplace Admin</h1>
        <p className="text-gray-600 mt-2">Manage vendors, products, and marketplace operations</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active in marketplace</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVendors}</div>
            <p className="text-xs text-muted-foreground">Verified vendors</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪0</div>
            <p className="text-xs text-muted-foreground">Ready for orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting launch</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Vendor Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>Manage vendor accounts and their products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(vendorStores).map(([vendorId, vendor]) => (
              <div key={vendorId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.products.length} products</p>
                  </div>
                  <img 
                    src={vendor.logo} 
                    alt={vendor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 mb-3">{vendor.description}</p>
                <Link href={`/admin/vendor/${vendorId}`}>
                  <Button size="sm" className="w-full">
                    Manage Vendor
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/vendors">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">All Vendors</CardTitle>
              <CardDescription>View and manage all vendors</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/admin/revenue-feed">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Analytics</CardTitle>
              <CardDescription>Track sales and performance</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/admin/templates">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Store Templates</CardTitle>
              <CardDescription>Manage vendor page templates</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
