#!/usr/bin/env python3
"""Check available models on SiliconFlow"""

import requests
import json

def check_models():
    """Check what models are available"""
    
    print("🔍 Checking SiliconFlow models and API...\n")
    
    # Latest API key
    api_key = "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"
    
    # Test different model names
    models_to_test = [
        # Gemini variants
        "google/gemini-2.0-flash-exp",
        "google/gemini-2.5-flash",
        "gemini-2.5-flash",
        "gemini-flash",
        
        # Qwen variants
        "Qwen/Qwen2.5-VL-72B-Instruct",
        "Qwen/Qwen2-VL-7B-Instruct",
        "Qwen2-VL-72B",
        "qwen-vl",
        
        # Other vision models
        "llava-v1.6-34b",
        "cogvlm-v1",
        "internvl-chat-v1.5",
        
        # Text models (to test if API works at all)
        "deepseek-ai/DeepSeek-V2.5",
        "Qwen/Qwen2.5-72B-Instruct",
        "meta-llama/Llama-3.1-8B-Instruct"
    ]
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    working_models = []
    
    for model in models_to_test:
        print(f"Testing model: {model}")
        
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": "Hi"}],
            "max_tokens": 10,
            "temperature": 0.1
        }
        
        try:
            response = requests.post(
                "https://api.siliconflow.cn/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"  ✅ Works!")
                working_models.append(model)
            elif response.status_code == 401:
                print(f"  ❌ Invalid API key")
                break  # No point testing more if key is bad
            elif response.status_code == 404:
                print(f"  ❌ Model not found")
            else:
                error_msg = response.json().get('error', {}).get('message', response.text)
                print(f"  ❌ Error: {error_msg[:100]}")
                
        except Exception as e:
            print(f"  ❌ Exception: {str(e)[:100]}")
    
    print(f"\n📊 Summary:")
    print(f"Working models: {len(working_models)}")
    if working_models:
        print("Available models:")
        for model in working_models:
            print(f"  - {model}")
    else:
        print("No working models found (likely invalid API key)")
    
    # Try to get model list
    print("\n📋 Trying to get model list...")
    try:
        response = requests.get(
            "https://api.siliconflow.cn/v1/models",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10
        )
        
        if response.status_code == 200:
            models = response.json()
            print("Available models from API:")
            for model in models.get('data', [])[:10]:
                print(f"  - {model.get('id')}")
        else:
            print(f"Cannot get model list: {response.status_code}")
    except Exception as e:
        print(f"Error getting model list: {e}")

if __name__ == "__main__":
    check_models()