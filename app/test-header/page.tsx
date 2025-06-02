import Layout from '@/components/layout/Layout';

export default function TestHeaderPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold mb-8">Header Test Page</h1>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Header Features</h2>
              <ul className="space-y-2">
                <li>✅ Logo should be visible</li>
                <li>✅ Navigation should work</li>
                <li>✅ Search functionality</li>
                <li>✅ Cart icon with count</li>
                <li>✅ Mobile responsive</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Test Content</h2>
              <p className="text-gray-600">
                This is a simple test page to verify the header is working correctly.
                The header should be visible above this content.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Navigation Links</h2>
              <div className="space-y-2">
                <a href="/" className="text-blue-600 hover:underline block">Home (transparent header)</a>
                <a href="/marketplace" className="text-blue-600 hover:underline block">Marketplace</a>
                <a href="/shop" className="text-blue-600 hover:underline block">Shop</a>
                <a href="/store/teva-deli" className="text-blue-600 hover:underline block">Vendor Store (special header)</a>
                <a href="/cart" className="text-blue-600 hover:underline block">Cart (minimal header)</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}