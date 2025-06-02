const fs = require('fs').promises;
const path = require('path');

async function fixPeopleStoreDuplicates() {
  console.log('🔧 Fixing People\'s Store Duplicate Products\n');
  
  const filePath = path.join(__dirname, '../lib/data/people-store-complete-catalog.json');
  const content = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  console.log(`Current product count: ${data.products.length}\n`);
  
  // Identify duplicates to remove
  const duplicatesToRemove = [
    'ps-003', // FOCO Coconut Water - 6 Pack (duplicate of ps-015)
    'ps-007', // Great Northern Organic Maple Syrup (duplicate of ps-013)
    'ps-012', // Pure Sesame Oil Taiwan - 370ml (duplicate of ps-014)
    'ps-011', // Pure Sesame Oil Taiwan - 2L (duplicate of ps-014b)
    'ps-010', // Natural Love Herb Seasoning Mix (duplicate of ps-022)
    'ps-008', // Laverland Crunch Sea Salt Seaweed - 9 Pack (duplicate of ps-016)
    'ps-009'  // Laverland Crunch Wasabi Seaweed - 9 Pack (duplicate of ps-017)
  ];
  
  console.log('Removing duplicate products:');
  duplicatesToRemove.forEach(id => {
    const product = data.products.find(p => p.id === id);
    if (product) {
      console.log(`- ${id}: ${product.name}`);
    }
  });
  
  // Filter out duplicates
  data.products = data.products.filter(p => !duplicatesToRemove.includes(p.id));
  
  console.log(`\nNew product count: ${data.products.length}`);
  console.log(`Removed: ${duplicatesToRemove.length} duplicates`);
  
  // Save the cleaned data
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log('\n✅ People\'s Store duplicates removed!');
}

fixPeopleStoreDuplicates().catch(console.error);