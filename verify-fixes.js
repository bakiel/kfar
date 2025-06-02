#!/usr/bin/env node
// Verify image fixes

const fs = require('fs');
const path = require('path');

const catalog = fs.readFileSync(path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts'), 'utf-8');

// Check specific products
const checks = [
  { id: 'td-009', name: 'Schnitzel Strips', shouldNotContain: ['shawarma', 'kebab', '32'] },
  { id: 'td-021', name: 'Okara Patties', shouldContain: ['21', 'burger_schnitzel'] },
  { id: 'td-022', name: 'Okara Broccoli', shouldContain: ['22', 'burger_schnitzel'] },
  { id: 'td-023', name: 'Ground Meat', shouldContain: ['23', 'burger_schnitzel'] },
  { id: 'td-003', name: 'Crispy Tofu', shouldContain: ['03'], shouldNotContain: ['10'] },
  { id: 'td-005', name: 'Tofu Strips', shouldContain: ['05'], shouldNotContain: ['10'] }
];

console.log('🔍 Verifying image fixes...\n');

let allGood = true;

checks.forEach(check => {
  const regex = new RegExp(`id: '${check.id}'[^}]*?image: '([^']+)'`, 's');
  const match = catalog.match(regex);
  
  if (match) {
    const imagePath = match[1];
    let status = '✅';
    let issues = [];
    
    if (check.shouldContain) {
      check.shouldContain.forEach(term => {
        if (!imagePath.includes(term)) {
          status = '❌';
          issues.push(`Missing: ${term}`);
          allGood = false;
        }
      });
    }
    
    if (check.shouldNotContain) {
      check.shouldNotContain.forEach(term => {
        if (imagePath.includes(term)) {
          status = '❌';
          issues.push(`Should not have: ${term}`);
          allGood = false;
        }
      });
    }
    
    console.log(`${status} ${check.id}: ${check.name}`);
    console.log(`   Image: ${imagePath.split('/').pop()}`);
    if (issues.length > 0) {
      console.log(`   Issues: ${issues.join(', ')}`);
    }
    console.log();
  }
});

if (allGood) {
  console.log('✅ All image fixes verified successfully!');
} else {
  console.log('❌ Some issues remain - please check above');
}
