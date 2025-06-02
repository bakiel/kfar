#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TSX files
const files = glob.sync('**/*.tsx', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
});

let totalFixed = 0;
const fixes = [];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    let fileFixed = 0;

    // Fix potentially undefined alt attributes by adding fallbacks
    const patterns = [
      // Pattern 1: alt={variable}
      {
        regex: /alt=\{([^}]+)\}/g,
        fix: (match, expr) => {
          // Skip if already has fallback
          if (expr.includes('||') || expr.includes('?') || expr.includes(':')) {
            return match;
          }
          // Skip template literals
          if (expr.includes('`')) {
            return match;
          }
          fileFixed++;
          return `alt={${expr} || "Image"}`;
        }
      },
      // Pattern 2: Template literals without fallback
      {
        regex: /alt=\{`([^`]+)`\}/g,
        fix: (match, template) => {
          // Check if template contains variables that might be undefined
          if (template.includes('${') && !match.includes('||')) {
            // Extract the main variable from template
            const varMatch = template.match(/\$\{([^}]+)\}/);
            if (varMatch) {
              const varName = varMatch[1];
              fileFixed++;
              // Wrap the whole template with a check
              return `alt={${varName} ? \`${template}\` : "Image"}`;
            }
          }
          return match;
        }
      }
    ];

    // Apply fixes
    patterns.forEach(pattern => {
      content = content.replace(pattern.regex, pattern.fix);
    });

    // Special handling for specific components
    if (file.includes('FloatingCartPopup')) {
      content = content.replace(/alt=\{item\.name\}/g, 'alt={item.name || "Product image"}');
    }
    
    if (file.includes('ProductImage')) {
      // ProductImage component should handle undefined alt internally
      content = content.replace(/alt=\{alt\}/g, 'alt={alt || "Image"}');
    }

    if (file.includes('ImageGallery')) {
      content = content.replace(/alt=\{productName\}/g, 'alt={productName || "Product image"}');
      content = content.replace(/alt=\{`\$\{productName\}[^`]*`\}/g, (match) => {
        if (!match.includes('?')) {
          return match.replace('alt={`', 'alt={productName ? `').replace('`}', '` : "Product image"}');
        }
        return match;
      });
    }

    // Fix vendor-related components
    if (file.includes('vendor') || file.includes('Vendor')) {
      content = content.replace(/alt=\{vendor\.name\}/g, 'alt={vendor.name || "Vendor"}');
      content = content.replace(/alt=\{vendorData\.businessName\}/g, 'alt={vendorData.businessName || "Vendor business"}');
      content = content.replace(/alt=\{`\$\{vendor\.name\}[^`]*`\}/g, (match) => {
        if (!match.includes('?')) {
          return match.replace('alt={`', 'alt={vendor.name ? `').replace('`}', '` : "Vendor"}');
        }
        return match;
      });
    }

    // Fix product-related components
    content = content.replace(/alt=\{product\.name\}/g, 'alt={product.name || "Product"}');
    content = content.replace(/alt=\{item\.name\}/g, 'alt={item.name || "Item"}');
    
    // Fix review-related components
    content = content.replace(/alt=\{review\.name\}/g, 'alt={review.name || "Review"}');
    content = content.replace(/alt=\{review\.author\.name\}/g, 'alt={review.author?.name || "Reviewer"}');
    content = content.replace(/alt=\{review\.vendor\}/g, 'alt={review.vendor || "Vendor"}');
    content = content.replace(/alt=\{review\.product\}/g, 'alt={review.product || "Product"}');

    // Fix other common patterns
    content = content.replace(/alt=\{owner\.name\}/g, 'alt={owner.name || "Owner"}');
    content = content.replace(/alt=\{store\.name\}/g, 'alt={store.name || "Store"}');
    content = content.replace(/alt=\{tour\.title\}/g, 'alt={tour.title || "Tour"}');
    content = content.replace(/alt=\{option\.type\}/g, 'alt={option.type || "Option"}');
    content = content.replace(/alt=\{option\.name\}/g, 'alt={option.name || "Option"}');
    content = content.replace(/alt=\{enterprise\.name\}/g, 'alt={enterprise.name || "Enterprise"}');
    content = content.replace(/alt=\{currentEnterprise\.name\}/g, 'alt={currentEnterprise.name || "Enterprise"}');
    content = content.replace(/alt=\{feature\.caption\}/g, 'alt={feature.caption || "Feature"}');
    content = content.replace(/alt=\{suggestion\.name\}/g, 'alt={suggestion.name || "Suggestion"}');
    content = content.replace(/alt=\{headerConfig\.vendorInfo\.name\}/g, 'alt={headerConfig.vendorInfo?.name || "Vendor"}');
    content = content.replace(/alt=\{item\.title\}/g, 'alt={item.title || "Item"}');
    content = content.replace(/alt=\{item\.storeName\}/g, 'alt={item.storeName || "Store"}');
    content = content.replace(/alt=\{slide\.title\}/g, 'alt={slide.title || "Slide"}');
    content = content.replace(/alt=\{relProduct\.name\}/g, 'alt={relProduct.name || "Related product"}');
    content = content.replace(/alt=\{recentProduct\.name\}/g, 'alt={recentProduct.name || "Recent product"}');
    content = content.replace(/alt=\{relatedProduct\.name\}/g, 'alt={relatedProduct.name || "Related product"}');

    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      totalFixed += fileFixed;
      fixes.push({
        file,
        count: fileFixed
      });
      console.log(`Fixed ${fileFixed} issues in ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal fixes applied: ${totalFixed}`);
if (fixes.length > 0) {
  console.log('\nFiles modified:');
  fixes.forEach(fix => {
    console.log(`  - ${fix.file}: ${fix.count} fixes`);
  });
} else {
  console.log('\n✅ No undefined alt attributes found!');
}