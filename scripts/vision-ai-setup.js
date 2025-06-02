const fs = require('fs').promises;
const path = require('path');

// Vision AI Integration Setup Script

async function setupVisionAI() {
  console.log('🤖 Setting up Vision AI Integration...\n');
  
  // Create environment template
  const envTemplate = `# KFAR Marketplace Vision AI Configuration
# Add these to your .env.local file

# Google Gemini Vision API
GEMINI_API_KEY=your-gemini-api-key-here

# Claude API (when available)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Database Configuration for DigitalOcean
DATABASE_URL=mysql://user:password@host:port/database
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@host:port/database

# DigitalOcean Spaces (S3-compatible storage)
DO_SPACES_KEY=your-spaces-access-key
DO_SPACES_SECRET=your-spaces-secret-key
DO_SPACES_ENDPOINT=https://your-region.digitaloceanspaces.com
DO_SPACES_BUCKET=your-bucket-name

# Application URL
NEXT_PUBLIC_APP_URL=https://kfar.market
`;

  await fs.writeFile(
    path.join(__dirname, '../.env.template'),
    envTemplate
  );
  
  console.log('✅ Created .env.template');
  
  // Create Vision AI service
  const visionService = `import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '@/lib/types/product';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface VisionAnalysis {
  productName: string;
  category: string;
  description: string;
  features: string[];
  tags: string[];
  confidence: number;
  allergens?: string[];
  certifications?: string[];
}

export class VisionAIService {
  private static model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  static async analyzeProductImage(imagePath: string): Promise<VisionAnalysis | null> {
    try {
      const imageData = await fetch(imagePath).then(res => res.blob());
      const base64 = await this.blobToBase64(imageData);
      
      const prompt = \`Analyze this product image and provide:
1. Product name (be specific and accurate)
2. Product category
3. Detailed description (2-3 sentences, focus on ingredients and features visible)
4. Key features or benefits (as array)
5. Relevant tags for search (as array)
6. Any visible allergen information
7. Visible certifications (Kosher, Vegan, Organic, etc.)

Format as JSON:
{
  "productName": "...",
  "category": "...",
  "description": "...",
  "features": ["..."],
  "tags": ["..."],
  "confidence": 0-100,
  "allergens": ["..."],
  "certifications": ["..."]
}\`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64.split(',')[1]
          }
        }
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse vision response:', e);
      }
      
      return null;
    } catch (error) {
      console.error('Vision analysis failed:', error);
      return null;
    }
  }
  
  static async enhanceProductDescription(product: Product): Promise<Product> {
    const analysis = await this.analyzeProductImage(product.image);
    
    if (analysis && analysis.confidence > 70) {
      return {
        ...product,
        description: analysis.description || product.description,
        tags: [...(product.tags || []), ...analysis.tags],
        features: analysis.features,
        allergens: analysis.allergens,
        certifications: analysis.certifications,
        visionEnhanced: true,
        visionConfidence: analysis.confidence
      };
    }
    
    return product;
  }
  
  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export async function enhanceAllProducts(products: Product[]): Promise<Product[]> {
  console.log(\`Enhancing \${products.length} products with Vision AI...\`);
  
  const enhanced = [];
  for (const product of products) {
    console.log(\`Analyzing \${product.id}: \${product.name}\`);
    const enhancedProduct = await VisionAIService.enhanceProductDescription(product);
    enhanced.push(enhancedProduct);
    
    // Add delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return enhanced;
}
`;

  await fs.writeFile(
    path.join(__dirname, '../lib/services/vision-ai-service.ts'),
    visionService
  );
  
  console.log('✅ Created Vision AI Service');
  
  // Create database migration for DigitalOcean
  const migration = `-- KFAR Marketplace Production Database Migration
-- For DigitalOcean Managed Database

-- Enable UUID extension if using PostgreSQL
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create main tables
CREATE TABLE IF NOT EXISTS vendors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_path VARCHAR(500),
  banner_path VARCHAR(500),
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  vendor_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_he VARCHAR(255),
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  description_he TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'ILS',
  
  -- Image fields
  image_path VARCHAR(500),
  image_verified BOOLEAN DEFAULT FALSE,
  vision_enhanced BOOLEAN DEFAULT FALSE,
  vision_confidence DECIMAL(5, 2),
  
  -- Product attributes
  in_stock BOOLEAN DEFAULT TRUE,
  is_vegan BOOLEAN DEFAULT TRUE,
  is_kosher BOOLEAN DEFAULT FALSE,
  is_organic BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  
  -- Enhanced data
  features JSON,
  allergens JSON,
  certifications JSON,
  tags JSON,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  INDEX idx_vendor (vendor_id),
  INDEX idx_category (category),
  INDEX idx_verified (image_verified)
);

-- Insert vendors
INSERT INTO vendors (id, name, slug, description, category) VALUES
('teva-deli', 'Teva Deli', 'teva-deli', 'Premium vegan deli specializing in plant-based meats', 'Food Manufacturing'),
('people-store', 'People Store', 'people-store', 'Community grocery with bulk foods and local products', 'Retail'),
('garden-of-light', 'Garden of Light', 'garden-of-light', 'Organic vegan products and spiritual foods', 'Organic Foods'),
('queens-cuisine', 'Queen''s Cuisine', 'queens-cuisine', 'Gourmet vegan catering and prepared meals', 'Catering'),
('gahn-delight', 'Gahn Delight', 'gahn-delight', 'Artisanal vegan ice cream and frozen desserts', 'Desserts'),
('vop-shop', 'VOP Shop', 'vop-shop', 'Village of Peace merchandise and community products', 'Merchandise')
ON CONFLICT (id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_search ON products(name, description);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(in_stock, vendor_id);

-- Create view for easy querying
CREATE OR REPLACE VIEW products_with_vendors AS
SELECT 
  p.*,
  v.name as vendor_name,
  v.logo_path as vendor_logo,
  v.category as vendor_category
FROM products p
JOIN vendors v ON p.vendor_id = v.id
WHERE p.in_stock = TRUE AND v.is_active = TRUE;
`;

  await fs.writeFile(
    path.join(__dirname, '../database/digitalocean-migration.sql'),
    migration
  );
  
  console.log('✅ Created DigitalOcean database migration');
  
  // Create deployment guide
  const deploymentGuide = `# KFAR Marketplace - DigitalOcean Deployment Guide

## Prerequisites
- DigitalOcean account
- Domain name (kfar.market)
- SSL certificate (Let's Encrypt)

## 1. Database Setup (Managed Database)

1. Create a new MySQL/PostgreSQL database cluster
2. Note the connection details
3. Run the migration script:
   \`\`\`bash
   mysql -h your-db-host -u your-user -p your-database < database/digitalocean-migration.sql
   \`\`\`

## 2. App Platform Setup

1. Create new App in DigitalOcean App Platform
2. Connect GitHub repository
3. Configure environment variables:
   - DATABASE_URL
   - GEMINI_API_KEY
   - DO_SPACES_KEY
   - DO_SPACES_SECRET
   - NEXT_PUBLIC_APP_URL

## 3. Spaces Setup (Image Storage)

1. Create a new Space for images
2. Configure CORS for your domain
3. Upload product images to Space
4. Update image paths in database

## 4. Build Configuration

\`\`\`yaml
name: kfar-marketplace
services:
- build_command: npm run build
  environment_slug: node-js
  github:
    branch: main
    deploy_on_push: true
    repo: your-repo/kfar-marketplace
  http_port: 3000
  instance_count: 2
  instance_size_slug: basic-xs
  name: kfar-marketplace
  run_command: npm start
  source_dir: /kfar-marketplace-app
\`\`\`

## 5. Domain Configuration

1. Add custom domain in App Platform
2. Configure DNS records:
   - A record pointing to App Platform
   - CNAME for www subdomain

## 6. SSL Configuration

Let's Encrypt SSL is automatically configured by App Platform

## 7. Monitoring

1. Enable monitoring in App Platform
2. Set up alerts for:
   - High CPU usage
   - Memory usage
   - Error rates
   - Response times

## 8. Backup Strategy

1. Enable automated database backups
2. Schedule daily backups of Spaces
3. Keep 7-day retention minimum

## Post-Deployment

1. Run product image verification
2. Test checkout flow
3. Verify QR codes work
4. Check mobile responsiveness
5. Monitor performance metrics
`;

  await fs.writeFile(
    path.join(__dirname, '../DIGITALOCEAN_DEPLOYMENT.md'),
    deploymentGuide
  );
  
  console.log('✅ Created DigitalOcean deployment guide');
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✨ Vision AI Setup Complete!\n');
  console.log('📋 Created files:');
  console.log('  - .env.template (add your API keys)');
  console.log('  - lib/services/vision-ai-service.ts');
  console.log('  - database/digitalocean-migration.sql');
  console.log('  - DIGITALOCEAN_DEPLOYMENT.md');
  console.log('\n🚀 Next steps:');
  console.log('1. Get API keys:');
  console.log('   - Gemini: https://makersuite.google.com/app/apikey');
  console.log('   - Claude: https://console.anthropic.com/');
  console.log('2. Set up DigitalOcean account');
  console.log('3. Configure environment variables');
  console.log('4. Deploy to production!');
}

if (require.main === module) {
  setupVisionAI().catch(console.error);
}

module.exports = { setupVisionAI };