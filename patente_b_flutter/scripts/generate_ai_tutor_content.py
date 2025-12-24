import os
import json
import requests
from pathlib import Path

# --- CONFIGURATION ---
# PLEASE ENTER YOUR API KEYS HERE OR SET THEM AS ENVIRONMENT VARIABLES
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "YOUR_ELEVENLABS_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "YOUR_OPENAI_KEY")

# Voices IDs (You can change these to your preferred voices in ElevenLabs)
VOICES = {
    "it": "21m00Tcm4TlvDq8ikWAM",  # Rachel (example) or use a specific Italian voice
    "urd": "TX3LPaxmHKxFdv7VOQHJ", # Example ID, replace with a Multilingual v2 voice
    "pun": "TX3LPaxmHKxFdv7VOQHJ", 
    "ben": "TX3LPaxmHKxFdv7VOQHJ", 
}

# Model to use for ElevenLabs
ELEVENLABS_MODEL = "eleven_multilingual_v2"

# Paths
BASE_DIR = Path("..") # Assuming script is in /scripts
JSON_PATH = BASE_DIR / "assets/data/theory-pdf-lessons.json"
OUTPUT_VIDEO_DIR = BASE_DIR / "assets/videos/lessons"


def generate_simplified_text(original_text, language_code):
    """
    Uses an LLM (mocked here, replace with OpenAI call) to simplify and translate text.
    """
    print(f"Generating text for {language_code}...")
    
    # In a real scenario, you would call OpenAI API here:
    # prompt = f"Explain this driving concept simply in {language_code} for a video script: {original_text}"
    # response = openai.ChatCompletion.create(...)
    
    # MOCK RESPONSE for demonstration
    if language_code == "it":
        return f"Ecco una spiegazione semplice: {original_text[:50]}..."
    elif language_code == "urd":
        return f"Roman Urdu explanation: {original_text[:20]}..."
    else:
        return f"Explanation in {language_code}..."

def generate_audio(text, voice_id, output_path):
    """
    Calls ElevenLabs to generate audio from text.
    """
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    data = {
        "text": text,
        "model_id": ELEVENLABS_MODEL,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"Audio saved to {output_path}")
            return True
        else:
            print(f"Error generating audio: {response.text}")
            return False
    except Exception as e:
        print(f"Exception calling ElevenLabs: {e}")
        return False

def create_video_from_audio_and_image(audio_path, image_path, output_path):
    """
    Uses moviepy to create a static video from an image and audio file.
    Requires: pip install moviepy
    """
    try:
        from moviepy.editor import AudioFileClip, ImageClip
        
        # Load audio
        audio = AudioFileClip(str(audio_path))
        
        # Load image (if exists, else create black frame)
        if image_path and os.path.exists(image_path):
            clip = ImageClip(str(image_path))
        else:
            from moviepy.editor import ColorClip
            clip = ColorClip(size=(1280, 720), color=(0,0,0))
            
        # Set duration to audio length
        clip = clip.set_duration(audio.duration)
        clip = clip.set_audio(audio)
        clip = clip.set_fps(24)
        
        # Write file
        clip.write_videofile(str(output_path), codec='libx264', audio_codec='aac')
        return True
    except ImportError:
        print("MoviePy not installed. Cannot generate video.")
        print("Run: pip install moviepy")
        return False
    except Exception as e:
        print(f"Error creating video: {e}")
        return False

def main():
    print("Starting AI Content Generation...")
    
    # Create directories
    os.makedirs(OUTPUT_VIDEO_DIR, exist_ok=True)
    
    # Load JSON
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Iterate through a few sections (limit for demo)
    count = 0
    max_count = 1 # Only do 1 for test
    
    for chapter in data['chapters']:
        for section in chapter['sections']:
            if count >= max_count: break
            
            section_id = section['id']
            original_content = section.get('content', '')
            image_rel_path = section.get('image', '')
            
            # Setup AI Explanation structure if missing
            if 'ai_explanation' not in section:
                section['ai_explanation'] = {
                    'original_text': '',
                    'video_files': {},
                    'translations': {}
                }
            
            # Generate for selected languages
            for lang_code in ['it', 'urd']: # Add 'pun' etc.
                
                # 1. Text
                simplified_text = generate_simplified_text(original_content, lang_code)
                section['ai_explanation']['translations'][lang_code] = simplified_text
                
                # 2. Audio (Temp file)
                audio_filename = f"{section_id}_{lang_code}.mp3"
                audio_path = OUTPUT_VIDEO_DIR / audio_filename
                
                # Only generate if API key is present
                if ELEVENLABS_API_KEY != "YOUR_ELEVENLABS_KEY":
                   success = generate_audio(simplified_text, VOICES.get(lang_code, VOICES['it']), audio_path)
                   
                   # 3. Video
                   if success:
                       video_filename = f"{section_id}_{lang_code}.mp4"
                       video_path = OUTPUT_VIDEO_DIR / video_filename
                       image_full_path = BASE_DIR / image_rel_path
                       
                       # Try to create video
                       vid_success = create_video_from_audio_and_image(audio_path, image_full_path, video_path)
                       
                       if vid_success:
                           # Update JSON
                           # Store relative path for Flutter
                           rel_path = f"assets/videos/lessons/{video_filename}"
                           section['ai_explanation']['video_files'][lang_code] = rel_path
            
            count += 1
    
    # Save JSON back
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("Process Complete. JSON updated.")

if __name__ == "__main__":
    main()
