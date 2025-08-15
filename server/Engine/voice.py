import sys
import json
import os
import dotenv
import base64

# Load environment variables
dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Get text from command line argument or stdin
if len(sys.argv) > 1:
    user_text = " ".join(sys.argv[1:])
else:
    user_text = input("What text would you like to convert to speech? \n")

try:
    # Try Hugging Face InferenceClient first
    from huggingface_hub import InferenceClient
    
    hf_token = os.getenv('HUGGINGFACE_API_KEY')
    if hf_token:
        client = InferenceClient(api_key=hf_token)
        
        # Use Hugging Face InferenceClient with Kokoro-82M model
        audio_bytes = client.text_to_speech(
            user_text,
            model="hexgrad/Kokoro-82M",
        )
        
        # Convert audio directly to base64 for web playback
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        result = {
            "success": True,
            "audio_data": f"data:audio/wav;base64,{audio_base64}",
            "text": user_text,
            "note": "Audio generated using Kokoro-82M TTS model"
        }
        print(json.dumps(result))
    else:
        raise Exception("HUGGINGFACE_API_KEY not found")
        
except Exception as hf_error:
    # Fallback to gTTS if Hugging Face fails
    try:
        from gtts import gTTS
        import io
        
        # Use Google Text-to-Speech as fallback
        tts = gTTS(text=user_text, lang='en', slow=False)
        
        # Save audio to a BytesIO buffer instead of a file
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        # Convert audio to base64 for web playback
        audio_base64 = base64.b64encode(audio_buffer.getvalue()).decode('utf-8')
        
        result = {
            "success": True,
            "audio_data": f"data:audio/mpeg;base64,{audio_base64}",
            "text": user_text,
            "note": f"Audio generated using Google TTS (HF fallback: {str(hf_error)[:100]})"
        }
        print(json.dumps(result))
        
    except Exception as gtts_error:
        # If both fail, return error
        error_result = {
            "success": False,
            "error": f"Both HF and gTTS failed. HF: {str(hf_error)[:50]}, gTTS: {str(gtts_error)[:50]}"
        }
        print(json.dumps(error_result))
