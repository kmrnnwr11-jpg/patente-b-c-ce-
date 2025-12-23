import json
import os

# Path to JSON
json_path = 'assets/data/theory-segnali-completo.json'
# Path to images directory
images_dir = 'assets/images/segnali'

# Read JSON
try:
    with open(json_path, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"Error: JSON file not found at {json_path}")
    exit(1)

missing_images = []
found_images = 0
total_signals = 0

print(f"Checking images in {images_dir}...\n")

for chapter in data.get('chapters', []):
    chapter_title = chapter.get('title', 'Unknown Chapter')
    signals = chapter.get('signals', [])
    total_signals += len(signals)
    
    for signal in signals:
        image_path = signal.get('image', '')
        if not image_path:
            continue
            
        # Extract filename (remove /images/segnali/ prefix)
        filename = os.path.basename(image_path)
        
        # Check if file exists
        full_path = os.path.join(images_dir, filename)
        if not os.path.exists(full_path):
            missing_images.append({
                'chapter': chapter_title,
                'name': signal.get('nome', 'Unknown'),
                'filename': filename,
                'path': full_path
            })
        else:
            found_images += 1

print(f"Total signals: {total_signals}")
print(f"Found images: {found_images}")
print(f"Missing images: {len(missing_images)}\n")

if missing_images:
    print("MISSING IMAGES TO GENERATE:")
    for img in missing_images:
        print(f"- [{img['chapter']}] {img['name']} ({img['filename']})")
else:
    print("✅ All images are present!")
