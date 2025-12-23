import json
import os

json_path = 'assets/data/theory-pdf-lessons.json'
base_dir = '.' # Running from project root

try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"Error: JSON file not found at {json_path}")
    exit(1)

missing_count = 0
total_checked = 0

print("Verifying image links...")

for chapter in data.get('chapters', []):
    for section in chapter.get('sections', []):
        image_path = section.get('image')
        if image_path:
            total_checked += 1
            # image_path is like 'assets/images/segnali/foo.png'
            # We need to verify if this file exists relative to project root
            
            full_path = os.path.join(base_dir, image_path)
            if not os.path.exists(full_path):
                print(f"❌ MISSING: {image_path} (Section: {section.get('title')})")
                missing_count += 1
            # else:
            #    print(f"✅ OK: {image_path}")

print(f"\nVerification complete: {missing_count} missing files out of {total_checked} checked.")
