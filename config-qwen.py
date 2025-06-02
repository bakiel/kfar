#!/usr/bin/env python3
"""
Configuration updater for Qwen API key
Makes it easy to update the API key in all scripts
"""

import sys
import re
from pathlib import Path

def update_api_key(new_key):
    """Update API key in all relevant files"""
    
    files_to_update = [
        'qwen-image-analyzer.py',
        'test-qwen-api.py'
    ]
    
    # Pattern to match API keys
    pattern = r'api_key\s*=\s*"sk-or-v1-[a-f0-9]+"'
    replacement = f'api_key = "{new_key}"'
    
    updated_count = 0
    
    for filename in files_to_update:
        filepath = Path(filename)
        if filepath.exists():
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Check if pattern exists
            if re.search(pattern, content):
                # Replace the API key
                new_content = re.sub(pattern, replacement, content)
                
                with open(filepath, 'w') as f:
                    f.write(new_content)
                
                print(f"✅ Updated {filename}")
                updated_count += 1
            else:
                print(f"⚠️  No API key found in {filename}")
    
    print(f"\n📊 Updated {updated_count} files")
    
    # Test the new key
    print("\n🧪 Testing new API key...")
    import subprocess
    result = subprocess.run([sys.executable, "test-qwen-api.py"], 
                          capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr)

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 config-qwen.py <your-api-key>")
        print("\nExample:")
        print("  python3 config-qwen.py sk-or-v1-abc123...")
        sys.exit(1)
    
    new_key = sys.argv[1]
    
    # Validate key format
    if not new_key.startswith("sk-or-v1-"):
        print("❌ Invalid key format. Should start with 'sk-or-v1-'")
        sys.exit(1)
    
    print(f"🔑 Updating API key to: {new_key[:20]}...")
    update_api_key(new_key)

if __name__ == "__main__":
    main()