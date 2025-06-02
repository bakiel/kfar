#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class ComprehensiveAltFixer {
  constructor() {
    this.fixes = [];
    this.filesChecked = 0;
    this.issuesFound = 0;
    this.issuesFixed = 0;
  }

  async scanAndFix() {
    console.log('🔍 Scanning for Image components without alt attributes...\n');
    
    const dirs = [
      path.join(__dirname, '../app'),
      path.join(__dirname, '../components')
    ];
    
    for (const dir of dirs) {
      await this.scanDirectory(dir);
    }
    
    console.log('\n📊 Summary:');
    console.log(`Files checked: ${this.filesChecked}`);
    console.log(`Issues found: ${this.issuesFound}`);
    console.log(`Issues fixed: ${this.issuesFixed}`);
    
    if (this.fixes.length > 0) {
      console.log('\n📝 Fixes applied:');
      this.fixes.forEach(fix => {
        console.log(`  - ${fix.file}:${fix.line} - Added alt="${fix.alt}"`);
      });
    }
  }

  async scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await this.scanDirectory(fullPath);
        } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
          await this.checkFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error.message);
    }
  }

  async checkFile(filePath) {
    try {
      this.filesChecked++;
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if no Image imports
      if (!content.includes('Image') || !content.includes('next/image')) {
        return;
      }
      
      const lines = content.split('\n');
      const issues = this.findMissingAlts(lines);
      
      if (issues.length > 0) {
        console.log(`\n📄 ${path.relative(process.cwd(), filePath)}:`);
        issues.forEach(issue => {
          console.log(`  Line ${issue.line}: Image without alt attribute`);
          this.issuesFound++;
        });
        
        // Fix the issues
        const fixed = this.fixMissingAlts(lines, issues, filePath);
        if (fixed) {
          fs.writeFileSync(filePath, lines.join('\n'));
          this.issuesFixed += issues.length;
        }
      }
    } catch (error) {
      console.error(`Error checking ${filePath}:`, error.message);
    }
  }

  findMissingAlts(lines) {
    const issues = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<Image')) {
        // Find the complete Image tag
        let tagContent = '';
        let startLine = i;
        let j = i;
        
        while (j < lines.length) {
          tagContent += lines[j];
          if (lines[j].includes('/>') || lines[j].includes('</Image>')) {
            break;
          }
          j++;
        }
        
        // Check if alt is present
        if (!tagContent.includes('alt=')) {
          issues.push({
            line: startLine + 1,
            startIndex: i,
            endIndex: j,
            content: tagContent
          });
        }
      }
    }
    
    return issues;
  }

  fixMissingAlts(lines, issues, filePath) {
    let fixed = false;
    
    // Fix in reverse order to not mess up line numbers
    for (let i = issues.length - 1; i >= 0; i--) {
      const issue = issues[i];
      const alt = this.generateAlt(issue.content, filePath, lines[issue.startIndex]);
      
      // Add alt after <Image
      lines[issue.startIndex] = lines[issue.startIndex].replace(
        '<Image',
        `<Image alt="${alt}"`
      );
      
      this.fixes.push({
        file: path.basename(filePath),
        line: issue.line,
        alt: alt
      });
      
      fixed = true;
    }
    
    return fixed;
  }

  generateAlt(content, filePath, line) {
    // Try to extract meaningful context
    const srcMatch = content.match(/src=["'{]([^"'}]+)["'}]/);
    const src = srcMatch ? srcMatch[1] : '';
    
    // Extract filename
    const filename = path.basename(src).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    
    // Context-based alt text
    if (content.includes('logo') || src.includes('logo')) {
      return `${filename} logo`;
    } else if (content.includes('banner') || src.includes('banner')) {
      return `${filename} banner`;
    } else if (content.includes('avatar') || src.includes('avatar')) {
      return `${filename} avatar`;
    } else if (content.includes('icon') || src.includes('icon')) {
      return `${filename} icon`;
    } else if (filePath.includes('product')) {
      return `Product image`;
    } else if (filePath.includes('vendor')) {
      return `Vendor image`;
    } else if (src.includes('placeholder')) {
      return '';  // Empty alt for placeholder images
    }
    
    // Default: cleaned filename
    return filename.trim() || 'Image';
  }
}

// Run the fixer
const fixer = new ComprehensiveAltFixer();
fixer.scanAndFix().catch(console.error);
