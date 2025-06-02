const fs = require('fs');
const path = require('path');

// Files to check for QR-related imports
const filesToCheck = [
  'app/checkout/page.tsx',
  'app/cart/page.tsx',
  'components/checkout/QRCodePayment.tsx',
  'components/qr/ClientOnlyQR.tsx',
  'components/qr/SmartQRGeneratorCompact.tsx',
  'components/qr/SmartQRGenerator.tsx'
];

console.log('🔍 Checking for QR-related issues...\n');

// Check each file
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for problematic imports
  if (content.includes('ClientOnlyQR') && !file.includes('ClientOnlyQR')) {
    issues.push('Still using ClientOnlyQR (should use SafeQR)');
  }
  
  if (content.includes('@/lib/services/qr-tracking') && !content.includes('qr-tracking-mock')) {
    issues.push('Using original qr-tracking (should use qr-tracking-mock)');
  }
  
  if (content.includes('supabase')) {
    issues.push('References to Supabase found');
  }
  
  if (content.includes('color:') && content.includes('SafeQR')) {
    issues.push('SafeQR with color prop (not supported)');
  }
  
  // Report findings
  if (issues.length > 0) {
    console.log(`⚠️  ${file}:`);
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('');
  } else {
    console.log(`✅ ${file} - No issues found`);
  }
});

// Check for any remaining ClientOnlyQR usage
console.log('\n🔍 Searching for any remaining ClientOnlyQR usage...\n');
const searchDir = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.startsWith('.')) {
        searchDir(filePath);
      }
    } else if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && !file.includes('ClientOnlyQR')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('ClientOnlyQR')) {
        console.log(`Found in: ${filePath.replace(path.join(__dirname, '..') + '/', '')}`);
      }
    }
  });
};

searchDir(path.join(__dirname, '..', 'app'));
searchDir(path.join(__dirname, '..', 'components'));

console.log('\n✨ QR error check complete!');