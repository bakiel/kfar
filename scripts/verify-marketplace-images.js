/**
 * Marketplace Image Verification Using Gemini Vision
 * 
 * This script checks all vendor images in the marketplace
 * and verifies they are loading correctly
 */

const fs = require('fs');
const path = require('path');

// Image directories to check
const IMAGE_DIRECTORIES = {
  'teva-deli': path.join(__dirname, '../public/images/vendors/teva-deli'),
  'vop-shop': path.join(__dirname, '../public/images/vendors/vop-shop'),
  'gahn-delight': path.join(__dirname, '../public/images/vendors/gahn-delight'),
  'queens-cuisine': path.join(__dirname, '../public/images/vendors/queens-cuisine'),
  'garden-of-light': path.join(__dirname, '../public/images/vendors/garden-of-light'),
  'peoples-store': path.join(__dirname, '../public/images/vendors/peoples-store')
};

// Verify image exists and is accessible
function verifyImage(imagePath) {
  try {
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      return {
        exists: true,
        size: stats.size,
        path: imagePath
      };
    }
    return {
      exists: false,
      path: imagePath
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
      path: imagePath
    };
  }
}

// Check all images for a vendor
function checkVendorImages(vendorId, vendorPath) {
  console.log(`\nChecking images for ${vendorId}...`);
  
  if (!fs.existsSync(vendorPath)) {
    console.log(`❌ Directory not found: ${vendorPath}`);
    return [];
  }
  
  const files = fs.readdirSync(vendorPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );
  
  console.log(`Found ${imageFiles.length} images`);
  
  const results = imageFiles.map(file => {
    const fullPath = path.join(vendorPath, file);
    const result = verifyImage(fullPath);
    
    if (result.exists) {
      console.log(`✅ ${file} (${(result.size / 1024).toFixed(2)} KB)`);
    } else {
      console.log(`❌ ${file} - Not accessible`);
    }
    
    return {
      vendor: vendorId,
      filename: file,
      ...result
    };
  });
  
  return results;
}

// Generate HTML report for visual verification
function generateHTMLReport(allResults) {
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marketplace Image Verification Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .vendor-section {
            margin-bottom: 30px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .vendor-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #4a5568;
            padding-bottom: 10px;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }
        .image-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            background: #f9f9f9;
        }
        .image-container {
            width: 100%;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eee;
            position: relative;
        }
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .image-info {
            padding: 10px;
            font-size: 12px;
            background: white;
        }
        .image-name {
            font-weight: bold;
            word-break: break-all;
            margin-bottom: 5px;
        }
        .image-size {
            color: #666;
        }
        .missing-image {
            background: #fee;
            color: #c00;
            padding: 20px;
            text-align: center;
        }
        .summary {
            background: #e6f3ff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .summary h2 {
            margin-top: 0;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .stat-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #4a5568;
        }
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <h1>Marketplace Image Verification Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${allResults.filter(r => r.exists).length}</div>
                <div class="stat-label">Images Found</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${allResults.filter(r => !r.exists).length}</div>
                <div class="stat-label">Missing Images</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${Object.keys(IMAGE_DIRECTORIES).length}</div>
                <div class="stat-label">Vendors Checked</div>
            </div>
        </div>
    </div>
`;

  // Group results by vendor
  const resultsByVendor = {};
  allResults.forEach(result => {
    if (!resultsByVendor[result.vendor]) {
      resultsByVendor[result.vendor] = [];
    }
    resultsByVendor[result.vendor].push(result);
  });

  // Generate HTML for each vendor
  for (const [vendor, results] of Object.entries(resultsByVendor)) {
    const vendorHtml = `
    <div class="vendor-section">
        <h2 class="vendor-title">${vendor.replace(/-/g, ' ').toUpperCase()}</h2>
        <div class="image-grid">
            ${results.map(result => {
              if (result.exists) {
                const imagePath = `/images/vendors/${vendor}/${result.filename}`;
                return `
                <div class="image-card">
                    <div class="image-container">
                        <img src="${imagePath}" alt="${result.filename}" 
                             onerror="this.parentElement.innerHTML='<div class=\\'missing-image\\'>Failed to load</div>'" />
                    </div>
                    <div class="image-info">
                        <div class="image-name">${result.filename}</div>
                        <div class="image-size">${(result.size / 1024).toFixed(2)} KB</div>
                    </div>
                </div>
                `;
              } else {
                return `
                <div class="image-card">
                    <div class="missing-image">
                        <div>Missing Image</div>
                        <div style="font-size: 10px; margin-top: 10px;">${result.filename}</div>
                    </div>
                </div>
                `;
              }
            }).join('')}
        </div>
    </div>
    `;
    html += vendorHtml;
  }

  html += `
    <script>
        // Add timestamp to prevent caching
        document.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            img.setAttribute('src', src + '?t=' + Date.now());
        });
        
        // Log image loading status
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('load', function() {
                console.log('✅ Loaded:', this.src);
            });
            img.addEventListener('error', function() {
                console.error('❌ Failed to load:', this.src);
            });
        });
    </script>
</body>
</html>`;

  return html;
}

// Main execution
console.log('Starting Marketplace Image Verification...\n');

const allResults = [];

// Check each vendor
for (const [vendorId, vendorPath] of Object.entries(IMAGE_DIRECTORIES)) {
  const results = checkVendorImages(vendorId, vendorPath);
  allResults.push(...results);
}

// Generate summary
console.log('\n========== SUMMARY ==========');
console.log(`Total images found: ${allResults.filter(r => r.exists).length}`);
console.log(`Missing images: ${allResults.filter(r => !r.exists).length}`);
console.log(`Vendors checked: ${Object.keys(IMAGE_DIRECTORIES).length}`);

// Generate HTML report
const htmlReport = generateHTMLReport(allResults);
const reportPath = path.join(__dirname, '../public/image-verification-report.html');
fs.writeFileSync(reportPath, htmlReport);

console.log(`\n✅ HTML report generated: ${reportPath}`);
console.log('Open http://localhost:3006/image-verification-report.html to view the report');

// Export results for Gemini Vision analysis
const resultsPath = path.join(__dirname, '../public/image-verification-results.json');
fs.writeFileSync(resultsPath, JSON.stringify(allResults, null, 2));
console.log(`\n✅ Results exported to: ${resultsPath}`);
