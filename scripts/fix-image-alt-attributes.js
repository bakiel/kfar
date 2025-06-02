#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix missing alt attributes in Next.js Image components
 * This script searches for and fixes Image components without alt attributes
 */

class ImageAltFixer {
  constructor() {
    this.fixCount = 0;
    this.files = [];
    this.patterns = [
      // Pattern 1: Image on its own line without alt
      /<Image\s*$/gm,
      // Pattern 2: Image with src but no alt
      /<Image\s+src=[^>]+(?!alt=)[^>]*>/g,
      // Pattern 3: Image multi-line without alt
      /<Image\s+[^>]*src=[^>]+(?!alt=)[^>]*\n[^>]*>/g
    ];
  }

  async fixAllFiles() {
    console.log('🔍 Searching for Image components without alt attributes...\n');

    // Get all TypeScript/JavaScript files
    const appDir = path.join(__dirname, '../app');
    const componentsDir = path.join(__dirname, '../components');
    
    this.findFiles(appDir);
    this.findFiles(componentsDir);

    console.log(`Found ${this.files.length} files to check\n`);

    // Process each file
    for (const file of this.files) {
      await this.processFile(file);
    }

    console.log(`\n✅ Fixed ${this.fixCount} missing alt attributes!`);
  }

  findFiles(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          this.findFiles(fullPath);
        } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
          this.files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error.message);
    }
  }

  async processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      let localFixes = 0;

      // Check if file has Image imports
      if (!content.includes('Image') || !content.includes('next/image')) {
        return;
      }

      // Split content into lines for better processing
      const lines = content.split('\n');
      const newLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Check if this line contains an Image component
        if (line.includes('<Image')) {
          // Look ahead to find the complete Image tag
          let imageTag = line;
          let j = i;
          
          // If tag doesn't close on this line, keep looking
          while (!imageTag.includes('>') && j < lines.length - 1) {
            j++;
            imageTag += '\n' + lines[j];
          }
          
          // Check if this Image tag has an alt attribute
          if (!imageTag.includes('alt=')) {
            // Extract src to generate meaningful alt text
            const srcMatch = imageTag.match(/src=["'{]([^"'}]+)["'}]/);
            const srcPath = srcMatch ? srcMatch[1] : '';
            
            // Generate alt text based on context
            const altText = this.generateAltText(srcPath, filePath, line);
            
            // Add alt attribute
            if (imageTag.includes('/>')) {
              // Self-closing tag
              line = line.replace('<Image', `<Image alt="${altText}"`);
            } else if (line.includes('<Image') && line.includes('src=')) {
              // Image tag with src on same line
              line = line.replace(/src=/, `alt="${altText}" src=`);
            } else {
              // Multi-line Image tag
              line = line.replace('<Image', `<Image alt="${altText}"`);
            }
            
            modified = true;
            localFixes++;
            
            console.log(`  ✓ Fixed in ${path.basename(filePath)}: Added alt="${altText}"`);
          }
        }
        
        newLines.push(line);
      }
      
      if (modified) {
        fs.writeFileSync(filePath, newLines.join('\n'));
        this.fixCount += localFixes;
      }
      
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  generateAltText(srcPath, filePath, context) {
    // Extract filename from path
    const filename = path.basename(srcPath).replace(/\.[^.]+$/, '');
    
    // Check context for better alt text
    if (context.includes('logo')) {
      return `${filename} logo`;
    } else if (context.includes('banner')) {
      return `${filename} banner`;
    } else if (context.includes('product')) {
      return `${filename} product image`;
    } else if (context.includes('vendor')) {
      return `${filename} vendor image`;
    } else if (context.includes('icon')) {
      return `${filename} icon`;
    } else if (filePath.includes('vendors')) {
      return `Vendor ${filename}`;
    } else if (filePath.includes('product')) {
      return `Product ${filename}`;
    }
    
    // Default: clean up filename and use as alt text
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new ImageAltFixer();
  fixer.fixAllFiles().catch(console.error);
}

module.exports = ImageAltFixer;
