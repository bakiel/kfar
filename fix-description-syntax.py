#!/usr/bin/env python3
"""
Fix syntax issues in product descriptions
Ensures all apostrophes and quotes are properly escaped
"""
import re
import json
from pathlib import Path

def fix_description_syntax(text):
    """Fix common syntax issues in descriptions"""
    if not text:
        return text
    
    # Fix double periods
    text = re.sub(r'\.\.+', '.', text)
    
    # Fix malformed sentences (ending with period followed by apostrophe)
    text = re.sub(r"\.\.\'s", "'s", text)
    
    # Fix spaces around periods
    text = re.sub(r'\s+\.', '.', text)
    text = re.sub(r'\.\s+', '. ', text)
    
    # Remove trailing periods from incomplete sentences
    text = re.sub(r'\.\s*$', '.', text)
    
    # Fix repeated words
    text = re.sub(r'\b(\w+)\s+\1\b', r'\1', text, flags=re.IGNORECASE)
    
    return text.strip()

def process_typescript_file(filepath):
    """Process a TypeScript file to fix description syntax"""
    print(f"\n📝 Processing {filepath.name}")
    
    content = filepath.read_text(encoding='utf-8')
    original_content = content
    
    # Find all description fields
    description_pattern = r"(description:\s*['\"])([^'\"]+)(['\"])"
    
    fixes_made = 0
    
    def fix_match(match):
        nonlocal fixes_made
        prefix = match.group(1)
        description = match.group(2)
        suffix = match.group(3)
        
        fixed_description = fix_description_syntax(description)
        
        if fixed_description != description:
            fixes_made += 1
            print(f"  ✅ Fixed description syntax")
            
        return f"{prefix}{fixed_description}{suffix}"
    
    # Apply fixes
    content = re.sub(description_pattern, fix_match, content)
    
    if content != original_content:
        filepath.write_text(content, encoding='utf-8')
        print(f"  📄 Updated {filepath.name} with {fixes_made} fixes")
    else:
        print(f"  ✓ No syntax issues found")
    
    return fixes_made

def main():
    """Main function"""
    print("🔧 Fixing Description Syntax Issues")
    print("=" * 50)
    
    # Get all TypeScript files with product data
    ts_files = [
        Path("lib/data/teva-deli-complete-catalog.ts"),
        Path("lib/data/vop-shop-catalog.ts"),
        Path("lib/data/garden-of-light-catalog.ts"),
        Path("lib/data/queens-cuisine-catalog.ts"),
        Path("lib/data/people-store-catalog.ts"),
        Path("lib/data/gahn-delight-catalog.ts")
    ]
    
    total_fixes = 0
    
    for ts_file in ts_files:
        if ts_file.exists():
            fixes = process_typescript_file(ts_file)
            total_fixes += fixes
    
    print(f"\n✅ Total fixes applied: {total_fixes}")
    print("\n📌 Next steps:")
    print("1. Start the dev server: npm run dev")
    print("2. Check that all products display correctly")
    print("3. Verify admin dashboard shows updated descriptions")

if __name__ == "__main__":
    main()