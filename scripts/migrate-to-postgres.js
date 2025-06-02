const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

// Import data from JSON files - use dynamic import for TypeScript files
async function loadCatalogData() {
  try {
    // Try to load from JavaScript first
    const catalogPath = path.join(__dirname, '../lib/data/complete-catalog.js');
    if (require('fs').existsSync(catalogPath)) {
      return require(catalogPath).completeProductCatalog;
    }
  } catch (e) {
    // Ignore error and continue
  }
  
  // Load TypeScript data directly
  const tevaDeli = require('../lib/data/teva-deli-complete-catalog');
  const peopleStore = require('../lib/data/people-store-catalog');
  
  // Construct the catalog manually
  return {
    'teva-deli': tevaDeli.tevaDeliStore,
    'people-store': peopleStore.peopleStoreVendor,
    'gahn-delight': {
      id: 'gahn-delight',
      name: 'Gahn Delight',
      category: 'food',
      description: 'Artisanal vegan ice cream and frozen desserts',
      logo: '/images/vendors/gahn-delight-logo.jpg',
      banner: '/images/vendors/banners/gahn-delight-banner.jpg',
      products: []
    },
    'vop-shop': {
      id: 'vop-shop',
      name: 'VOP Shop',
      category: 'lifestyle',
      description: 'Village of Peace community store',
      logo: '/images/vendors/vop-shop-logo.jpg',
      banner: '/images/vendors/banners/vop-shop-banner.jpg',
      products: []
    },
    'queens-cuisine': {
      id: 'queens-cuisine',
      name: "Queen's Cuisine",
      category: 'food',
      description: 'Plant-based meat alternatives and prepared foods',
      logo: '/images/vendors/queens-cuisine-logo.jpg',
      banner: '/images/vendors/banners/queens-cuisine-banner.jpg',
      products: []
    },
    'garden-of-light': {
      id: 'garden-of-light',
      name: 'Garden of Light',
      category: 'food',
      description: 'Premium vegan deli specialties',
      logo: '/images/vendors/garden-of-light-logo.jpg',
      banner: '/images/vendors/banners/garden-of-light-banner.jpg',
      products: []
    }
  };
}

async function runMigration() {
  console.log('🚀 Starting PostgreSQL migration...');
  
  // Load catalog data
  const completeProductCatalog = await loadCatalogData();
  
  // Database connection
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://mac:@localhost:5432/kfar_marketplace'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Create tables
    console.log('📋 Creating database schema...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../lib/db/schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    // Split schema into individual statements and execute
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement);
      }
    }
    console.log('✅ Database schema created');

    // Migrate vendors
    console.log('🏪 Migrating vendors...');
    const defaultPassword = await bcrypt.hash('kfar2024', 10);
    
    for (const [vendorId, store] of Object.entries(completeProductCatalog)) {
      // Generate slug from vendor name
      const slug = store.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      await client.query(`
        INSERT INTO vendors (
          id, name, slug, email, password_hash, description, 
          logo_url, banner_url, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          description = EXCLUDED.description,
          logo_url = EXCLUDED.logo_url,
          banner_url = EXCLUDED.banner_url,
          updated_at = NOW()
      `, [
        vendorId,
        store.name,
        slug,
        `${vendorId}@kfar.com`,
        defaultPassword,
        store.description || '',
        store.logo || '',
        store.banner || '',
        'active'
      ]);
      console.log(`  ✓ Migrated vendor: ${store.name}`);
    }

    // Migrate products
    console.log('📦 Migrating products...');
    let productCount = 0;
    
    for (const [vendorId, store] of Object.entries(completeProductCatalog)) {
      for (const product of store.products) {
        // Generate slug from product name
        const slug = product.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        await client.query(`
          INSERT INTO products (
            id, vendor_id, name, slug, description, 
            price, category, subcategory, primary_image, 
            stock_quantity, tags, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            category = EXCLUDED.category,
            subcategory = EXCLUDED.subcategory,
            primary_image = EXCLUDED.primary_image,
            stock_quantity = EXCLUDED.stock_quantity,
            tags = EXCLUDED.tags,
            updated_at = NOW()
        `, [
          product.id,
          vendorId,
          product.name,
          slug,
          product.description || '',
          product.price,
          product.category || 'general',
          product.subCategory || null,
          product.image || '',
          product.inventory || 0,
          product.tags || [],
          'published'
        ]);
        productCount++;
      }
    }
    console.log(`✅ Migrated ${productCount} products`);

    // Create sample reviews
    console.log('⭐ Creating sample reviews...');
    const sampleReviews = [
      { productId: 'td-001', rating: 5, comment: 'Excellent quality tofu!' },
      { productId: 'ps-001', rating: 5, comment: 'Fresh and organic, love it!' },
      { productId: 'gd-001', rating: 4, comment: 'Delicious ice cream!' }
    ];

    for (const review of sampleReviews) {
      await client.query(`
        INSERT INTO product_reviews (
          product_id, customer_name, 
          rating, comment, is_verified_purchase, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [
        review.productId,
        'Sample Customer',
        review.rating,
        review.comment,
        true
      ]);
    }
    console.log('✅ Created sample reviews');

    // Initialize analytics
    console.log('📊 Initializing analytics...');
    for (const [vendorId] of Object.entries(completeProductCatalog)) {
      await client.query(`
        INSERT INTO vendor_analytics (
          vendor_id, date, views, unique_visitors, 
          products_viewed, add_to_cart_count, 
          checkout_count, revenue
        ) VALUES ($1, CURRENT_DATE, 0, 0, 0, 0, 0, 0)
        ON CONFLICT (vendor_id, date) DO NOTHING
      `, [vendorId]);
    }
    console.log('✅ Analytics initialized');

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Vendor Login Credentials:');
    console.log('─'.repeat(40));
    for (const [vendorId, store] of Object.entries(completeProductCatalog)) {
      console.log(`${store.name}:`);
      console.log(`  Email: ${vendorId}@kfar.com`);
      console.log(`  Password: kfar2024`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration
runMigration().catch(console.error);