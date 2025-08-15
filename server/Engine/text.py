import os
import requests
import dotenv
import sys
import json

# Load environment variables
dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

API_URL = "https://router.huggingface.co/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {os.environ['HUGGINGFACE_API_KEY']}",
}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

# Get prompt from command line argument or stdin
if len(sys.argv) > 1:
    user_input = " ".join(sys.argv[1:])
else:
    user_input = input("What would you like to ask the AI? \n")

# Create a prompt template that encourages paragraph responses
prompt_template = f"""You are a text generator agent, Please provide a clear, well-structured paragraph response to the following question. Focus on giving a comprehensive answer in flowing paragraph format without bullet points or lists:

{user_input}"""

response = query({
    "messages": [
        {
            "role": "user",
            "content": prompt_template
        }
    ],
    "model": "openai/gpt-oss-20b:fireworks-ai"
    
})

# Extract only the content from the response
try:
    content = response["choices"][0]["message"]["content"]
    
    # Return JSON response for Node.js integration
    result = {
        "success": True,
        "content": content,
        "prompt": user_input
    }
    print(json.dumps(result))
    
except KeyError as e:
    error_result = {
        "success": False,
        "error": f"Error extracting response: {e}",
        "response": response
    }
    print(json.dumps(error_result))
