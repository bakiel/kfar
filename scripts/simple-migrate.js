const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// Basic vendor and product data
const vendorData = {
  'teva-deli': {
    name: 'Teva Deli',
    description: 'Authentic Israeli vegan deli specializing in plant-based meat alternatives',
    logo: '/images/vendors/teva-deli-logo.jpg',
    banner: '/images/vendors/banners/teva-deli-banner.jpg',
    products: 46
  },
  'people-store': {
    name: 'People Store',
    description: 'Community bulk store offering organic grains, spices, and pantry essentials',
    logo: '/images/vendors/people-store-logo.jpg',
    banner: '/images/vendors/banners/people-store-banner.jpg',
    products: 25
  },
  'gahn-delight': {
    name: 'Gahn Delight',
    description: 'Artisanal vegan ice cream and frozen desserts',
    logo: '/images/vendors/gahn-delight-logo.jpg',
    banner: '/images/vendors/banners/gahn-delight-banner.jpg',
    products: 8
  },
  'vop-shop': {
    name: 'VOP Shop',
    description: 'Village of Peace community store - apparel, books, and wellness products',
    logo: '/images/vendors/vop-shop-logo.jpg',
    banner: '/images/vendors/banners/vop-shop-banner.jpg',
    products: 15
  },
  'queens-cuisine': {
    name: "Queen's Cuisine",
    description: 'Plant-based meat alternatives and prepared vegan foods',
    logo: '/images/vendors/queens-cuisine-logo.jpg',
    banner: '/images/vendors/banners/queens-cuisine-banner.jpg',
    products: 17
  },
  'garden-of-light': {
    name: 'Garden of Light',
    description: 'Premium vegan deli specialties and gourmet plant-based products',
    logo: '/images/vendors/garden-of-light-logo.jpg',
    banner: '/images/vendors/banners/garden-of-light-banner.jpg',
    products: 20
  }
};

async function runMigration() {
  console.log('🚀 Starting PostgreSQL migration...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://mac:@localhost:5432/kfar_marketplace'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Create schema
    console.log('📋 Creating database schema...');
    const schemaPath = path.join(__dirname, '../lib/db/schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.error('Schema error:', err.message);
          }
        }
      }
    }
    console.log('✅ Database schema ready');

    // Migrate vendors
    console.log('🏪 Migrating vendors...');
    const defaultPassword = await bcrypt.hash('kfar2024', 10);
    
    for (const [vendorId, vendor] of Object.entries(vendorData)) {
      const slug = vendor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      await client.query(`
        INSERT INTO vendors (
          id, name, slug, email, password_hash, description, 
          logo_url, banner_url, status, total_products
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          logo_url = EXCLUDED.logo_url,
          banner_url = EXCLUDED.banner_url,
          total_products = EXCLUDED.total_products,
          updated_at = NOW()
      `, [
        vendorId,
        vendor.name,
        slug,
        `${vendorId}@kfar.com`,
        defaultPassword,
        vendor.description,
        vendor.logo,
        vendor.banner,
        'active',
        vendor.products
      ]);
      console.log(`  ✓ Migrated vendor: ${vendor.name} (${vendor.products} products)`);
    }

    // Add sample products for each vendor
    console.log('📦 Creating sample products...');
    const sampleProducts = [
      { vendorId: 'teva-deli', id: 'td-001', name: 'Organic Tofu Block', price: 15.90, category: 'proteins' },
      { vendorId: 'people-store', id: 'ps-001', name: 'Organic Brown Rice', price: 22.50, category: 'grains' },
      { vendorId: 'gahn-delight', id: 'gd-001', name: 'Chocolate Tahini Ice Cream', price: 24.90, category: 'desserts' },
      { vendorId: 'vop-shop', id: 'vop-001', name: 'Community T-Shirt', price: 89.00, category: 'apparel' },
      { vendorId: 'queens-cuisine', id: 'qc-001', name: 'Vegan Shawarma', price: 42.00, category: 'prepared' },
      { vendorId: 'garden-of-light', id: 'gol-001', name: 'Artisan Hummus', price: 18.50, category: 'deli' }
    ];

    for (const product of sampleProducts) {
      const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      await client.query(`
        INSERT INTO products (
          id, vendor_id, name, slug, description, 
          price, category, primary_image, stock_quantity, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          updated_at = NOW()
      `, [
        product.id,
        product.vendorId,
        product.name,
        slug,
        `Premium ${product.name} from ${vendorData[product.vendorId].name}`,
        product.price,
        product.category,
        `/images/products/${product.id}.jpg`,
        100,
        'published'
      ]);
    }
    console.log('✅ Sample products created');

    // Initialize analytics
    console.log('📊 Initializing analytics...');
    for (const vendorId of Object.keys(vendorData)) {
      await client.query(`
        INSERT INTO vendor_analytics (
          vendor_id, date, views, revenue
        ) VALUES ($1, CURRENT_DATE, 0, 0)
        ON CONFLICT (vendor_id, date) DO NOTHING
      `, [vendorId]);
    }
    console.log('✅ Analytics initialized');

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Vendor Login Credentials:');
    console.log('─'.repeat(50));
    for (const [vendorId, vendor] of Object.entries(vendorData)) {
      console.log(`${vendor.name}:`);
      console.log(`  Email: ${vendorId}@kfar.com`);
      console.log(`  Password: kfar2024`);
      console.log(`  Dashboard: http://localhost:3000/admin/vendor/${vendorId}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration
runMigration().catch(console.error);