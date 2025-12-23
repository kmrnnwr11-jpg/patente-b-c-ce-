import json
import os

# Path to JSON
json_path = 'assets/data/theory-pdf-lessons.json'

# Read JSON
try:
    with open(json_path, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"Error: JSON file not found at {json_path}")
    exit(1)

missing_images = []
image_count = 0

print("Checking sections missing images in theory-pdf-lessons.json...\n")

for chapter in data.get('chapters', []):
    chapter_title = chapter.get('title', '')
    
    # We are mainly interested in chapters that contain signals/definitions which usually have images
    # Lesson 1 (Definitions), Lesson 2-6 (Signals), Lesson 15-20 (Norms might not have signal images)
    
    for section in chapter.get('sections', []):
        title = section.get('title', '')
        image = section.get('image', '')
        
        if image:
            image_count += 1
        elif title.isupper() and len(title) > 3: 
            # Heuristic: Uppercase titles are likely signals/definitions that should have images
            missing_images.append({
                'chapter': chapter_title,
                'title': title
            })

print(f"Found {image_count} sections WITH images.")
print(f"Found {len(missing_images)} POTENTIAL signals/definitions WITHOUT images.\n")

print("--- EXAMPLES OF MISSING ---")
for i, item in enumerate(missing_images[:20]):
    print(f"{i+1}. [{item['chapter']}] {item['title']}")
print("...")
