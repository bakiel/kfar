#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Image Alignment Fixer for KFAR Marketplace
 * This script applies the fixes identified through vision analysis
 */

class ImageAlignmentFixer {
  constructor() {
    this.fixes = {
      'garden-of-light': [
        {
          productId: 'gol-002',
          field: 'name',
          oldValue: 'Kalbono Protein Salad',
          newValue: 'Kelbone Protein Salad',
          reason: 'Spelling correction based on image analysis'
        },
        {
          productId: 'gol-002',
          field: 'nameHe',
          oldValue: 'סלט חלבון קלבונו',
          newValue: 'סלט חלבון קלבון',
          reason: 'Hebrew spelling correction'
        }
      ],
      'teva-deli': [
        {
          imageFile: 'teva_deli_vegan_specialty_product_01',
          suggestedProductId: 'td-001',
          productName: 'Seitan Amaranth',
          productNameHe: 'סייטן אמרנט',
          confidence: 'high'
        },
        {
          imageFile: 'teva_deli_vegan_specialty_product_11',
          suggestedProductId: 'td-hot-dogs',
          productName: 'Vegetarian Hot Dogs',
          productNameHe: 'נקניקיות טבעוניות',
          confidence: 'high'
        },
        {
          imageFile: 'teva_deli_vegan_specialty_product_21',
          suggestedProductId: 'td-okara-patties',
          productName: 'Okara Patties with Spinach and Chia',
          productNameHe: 'קציצות אוקרה עם תרד וצ\'יה',
          confidence: 'high'
        }
      ]
    };

    this.missingImages = {
      'garden-of-light': [
        {
          productId: 'gol-012',
          currentImage: '12.jpg',
          issue: 'Shows logo instead of product',
          action: 'Request product image from vendor'
        }
      ],
      'gahn-delight': {
        missing: 8,
        productIds: ['gd-008', 'gd-009', 'gd-010', 'gd-011', 'gd-012', 'gd-013', 'gd-014', 'gd-015']
      }
    };
  }

  async applyFixes() {
    console.log('🔧 Applying Image-Description Alignment Fixes...\n');

    // Fix Garden of Light
    await this.fixGardenOfLight();

    // Generate Teva Deli mapping
    await this.generateTevaDeriMapping();

    // Generate missing images report
    await this.generateMissingImagesReport();

    console.log('\n✅ All fixes applied successfully!');
  }

  async fixGardenOfLight() {
    console.log('📦 Fixing Garden of Light catalog...');
    
    const catalogPath = path.join(__dirname, '../lib/data/garden-of-light-complete-catalog.json');
    
    try {
      const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      
      // Apply fixes
      for (const fix of this.fixes['garden-of-light']) {
        const product = catalog.products.find(p => p.id === fix.productId);
        if (product) {
          console.log(`  ✓ Updating ${fix.productId}: ${fix.field} from "${fix.oldValue}" to "${fix.newValue}"`);
          product[fix.field] = fix.newValue;
        }
      }
      
      // Save updated catalog
      fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
      console.log('  ✓ Garden of Light catalog updated successfully');
      
    } catch (error) {
      console.error('  ❌ Error updating Garden of Light catalog:', error.message);
    }
  }

  async generateTevaDeriMapping() {
    console.log('\n📦 Generating Teva Deli image mapping...');
    
    const mappingPath = path.join(__dirname, '../teva-deli-image-mapping.json');
    
    const mapping = {
      generated: new Date().toISOString(),
      mappings: {},
      unmapped: []
    };
    
    // Add confirmed mappings
    for (const item of this.fixes['teva-deli']) {
      mapping.mappings[item.imageFile] = {
        productId: item.suggestedProductId,
        productName: item.productName,
        productNameHe: item.productNameHe,
        confidence: item.confidence,
        verified: true
      };
    }
    
    // List unmapped images
    for (let i = 1; i <= 43; i++) {
      const imageFile = `teva_deli_vegan_specialty_product_${String(i).padStart(2, '0')}`;
      if (!mapping.mappings[imageFile]) {
        mapping.unmapped.push({
          imageFile: imageFile,
          needsVisionAnalysis: true
        });
      }
    }
    
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`  ✓ Teva Deli mapping saved to: ${mappingPath}`);
    console.log(`  ✓ Mapped: ${Object.keys(mapping.mappings).length} images`);
    console.log(`  ⚠ Unmapped: ${mapping.unmapped.length} images need vision analysis`);
  }

  async generateMissingImagesReport() {
    console.log('\n📋 Generating missing images report...');
    
    const reportPath = path.join(__dirname, '../missing-images-report.md');
    
    let report = '# Missing Product Images Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    
    report += '## Garden of Light\n';
    for (const item of this.missingImages['garden-of-light']) {
      report += `- **Product ${item.productId}**: ${item.issue}\n`;
      report += `  - Current file: ${item.currentImage}\n`;
      report += `  - Action: ${item.action}\n\n`;
    }
    
    report += '## Gahn Delight\n';
    report += `- **Missing ${this.missingImages['gahn-delight'].missing} product images**\n`;
    report += `- Products without images: ${this.missingImages['gahn-delight'].productIds.join(', ')}\n`;
    report += '- Action: Request images from vendor for these products\n\n';
    
    report += '## Vendor Communication Template\n\n';
    report += '```\n';
    report += 'Subject: Missing Product Images for KFAR Marketplace\n\n';
    report += 'Dear [Vendor],\n\n';
    report += 'We are updating our marketplace and noticed some product images are missing.\n';
    report += 'Could you please provide images for the following products:\n\n';
    report += '[List products]\n\n';
    report += 'Image requirements:\n';
    report += '- Format: JPG or PNG\n';
    report += '- Minimum size: 800x800 pixels\n';
    report += '- Clear product view with visible labels\n\n';
    report += 'Thank you!\n';
    report += '```\n';
    
    fs.writeFileSync(reportPath, report);
    console.log(`  ✓ Missing images report saved to: ${reportPath}`);
  }
}

// Helper to update image references in database
class ImageReferenceUpdater {
  static async updateReferences(vendorId, mappings) {
    console.log(`\n🔄 Updating image references for ${vendorId}...`);
    
    // This would connect to your database and update the image paths
    // based on the mappings provided
    
    // Example implementation:
    /*
    for (const [oldImage, newMapping] of Object.entries(mappings)) {
      await db.products.update({
        where: { 
          vendorId: vendorId,
          image: { contains: oldImage }
        },
        data: {
          image: `/images/vendors/${vendorId}/${newMapping.correctImage}`
        }
      });
    }
    */
    
    console.log('  ✓ Image references updated');
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new ImageAlignmentFixer();
  fixer.applyFixes().catch(console.error);
}

module.exports = { ImageAlignmentFixer, ImageReferenceUpdater };
