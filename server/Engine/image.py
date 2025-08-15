import requests
import sys
import json
import os
import dotenv
import base64

# Load environment variables
dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"

# Get API key from environment variable
api_key = os.getenv('HUGGINGFACE_API_KEY')
if not api_key:
    print(json.dumps({"success": False, "error": "HUGGINGFACE_API_KEY not found in environment variables"}))
    exit(1)

headers = {"Authorization": f"Bearer {api_key}"}

# Get prompt from command line argument or stdin
if len(sys.argv) > 1:
    user_prompt = " ".join(sys.argv[1:])
else:
    user_prompt = input("What type of image would you like to generate? \n")
payload = {
    "inputs": user_prompt,
}

response = requests.post(API_URL, headers=headers, json=payload)

if response.status_code == 200:
    try:
        # Convert image directly to base64 without saving to file
        image_data = base64.b64encode(response.content).decode('utf-8')
        
        result = {
            "success": True,
            "image_data": f"data:image/png;base64,{image_data}",
            "prompt": user_prompt
        }
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Error processing image: {str(e)}"
        }
        print(json.dumps(error_result))
elif response.status_code == 503:
    error_result = {
        "success": False,
        "error": "Model is loading, please try again in a few minutes"
    }
    print(json.dumps(error_result))
else:
    error_result = {
        "success": False,
        "error": f"API Error {response.status_code}: {response.text}"
    }
    print(json.dumps(error_result))
