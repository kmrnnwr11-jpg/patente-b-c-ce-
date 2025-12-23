import json
import os
import re

# Paths
json_path = 'assets/data/theory-pdf-lessons.json'
images_dir = 'assets/images/segnali'

# Read JSON
try:
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"Error: JSON file not found at {json_path}")
    exit(1)

# List available images
try:
    available_images = os.listdir(images_dir)
    print(f"Found {len(available_images)} images in {images_dir}")
except FileNotFoundError:
    print(f"Error: Images directory not found at {images_dir}")
    exit(1)

# Helper to normalize title to filename
def normalize_title(title):
    # Lowercase, replace spaces with hyphens, remove special chars
    s = title.lower()
    s = s.replace("'", "-")
    s = s.replace(" ", "-")
    s = s.replace(",", "")
    s = s.replace(".", "")
    s = re.sub(r'-+', '-', s) # collapse multiple hyphens
    s = s.strip('-')
    return s

def find_best_match(title):
    normalized = normalize_title(title)
    
    # exact match .png
    candidate = f"{normalized}.png"
    if candidate in available_images:
        return candidate
        
    # specific mappings for known tricky ones
    mappings = {
        'doppia-curva-la-prima-a-destra': 'doppia-curva-destra.png',
        'doppia-curva-la-prima-a-sinistra': 'doppia-curva-sinistra.png',
        'passaggio-a-livello-con-barriere-o-semibarriere': 'passaggio-livello-con-barriere.png',
        'passaggio-a-livello-senza-barriere': 'passaggio-livello-senza-barriere.png',
        'attenzione-ai-bambini': 'bambini.png',
        'attenzione-agli-animali-domestici-vaganti-liberi': 'animali-domestici.png',
        'attenzione-agli-animali-selvatici-vaganti-liberi': 'animali-selvatici.png',
        'preavviso-di-semaforo-verticale': 'semaforo.png',
        'preavviso-di-semaforo-orizzontale': 'semaforo.png', # same image usually
        'sbocco-su-molo-o-su-argine': 'sbocco-molo.png',
        'circolazione-rotatoria': 'rotatoria.png',
        'preavviso-di-circolazione-rotatoria': 'preavviso-rotatoria.png', # check if exists
        
        # New mappings
        'curva-a-destra': 'curva-destra.png',
        'curva-a-sinistra': 'curva-sinistra.png',
        'strettoia-simmetrica': 'strettoia-simmetrica.png',
        'strettoia-asimmetrica-a-sinistra': 'strettoia-sinistra.png',
        'strettoia-asimmetrica-a-destra': 'strettoia-destra.png',
        'caduta-massi-da-sinistra': 'caduta-massi-sinistra.png',
        'caduta-massi-da-destra': 'caduta-massi-destra.png',
        'attenzione-ai-bambini': 'bambini.png',
        'forte-vento-laterale': 'forte-vento.png',
        'pericolo-di-incendio': 'pericolo-incendio.png',
        'preavviso-di-semaforo-verticale': 'semaforo-verticale.png',
        'preavviso-di-semaforo-orizzontale': 'semaforo-orizzontale.png',
        'pannelli-distanziometrici': 'pannello-distanza.png',
        'doppio-senso-di-circolazione': 'doppio-senso-circolazione.png',
        'preavviso-di-circolazione-rotatoria': 'rotatoria-preavviso.png', 
        'aeromobili-a-bassa-quota': 'aeromobili.png',
    }
    
    if normalized in mappings:
         if mappings[normalized] in available_images:
             return mappings[normalized]
             
    # fuzzy check?
    return None

updated_count = 0

print("\nScanning JSON for missing images...")

for chapter in data.get('chapters', []):
    for section in chapter.get('sections', []):
        current_image = section.get('image')
        
        # Always check specific mappings first, because we might want to override a generic image
        # with a more specific one (e.g. semaforo.png -> semaforo-verticale.png)
        title = section.get('title', '')
        normalized_title_key = normalize_title(title)
        
        # We need to temporarily expose mappings from find_best_match or move them out
        # For simplicity, let's just use find_best_match and see if it returns something DIFFERENT
        # than valid current path.
        
        target_image = None
        if title:
             match = find_best_match(title)
             if match:
                 target_image = f"assets/images/segnali/{match}"
        
        # Logic:
        # 1. If we have a target_image from mappings/match, and it is different from current, USE IT.
        # 2. Else, if current image exists (with fixed path), keep it.
        # 3. Else, try to match (already done in step 1).
        
        if target_image and target_image != current_image:
             # Check if this target actually exists before switching? 
             # find_best_match only returns if it exists (or is in mappings which we assume exist - wait mappings in find_best_match don't check existence of value? verify this)
             # Looking at find_best_match implementation:
             # if normalized in mappings: if mappings[normalized] in available_images: return ...
             # So yes, find_best_match guarantees existence.
             
             section['image'] = target_image
             print(f"✅ Updated/Forced: {title} -> {os.path.basename(target_image)} (was {current_image})")
             updated_count += 1
             continue # Done with this section
             
        # Condition 1: Image missing entirely
        if not current_image:
             # Already tried matching above
             if target_image:
                 section['image'] = target_image
                 print(f"✅ Linked (Was Missing): {title} -> {os.path.basename(target_image)}")
                 updated_count += 1
                     
        # Condition 2: Image present but path needs check/fix
        else:
            # Normalize path to check existence
            # Handle both 'images/...' and 'assets/images/...'
            # We want final to be 'assets/images/segnali/filename.png'
            
            basename = os.path.basename(current_image)
            # Check if this basename exists in our available_images
            
            if basename in available_images:
                # File exists! Ensure path is full assets path
                new_path = f"assets/images/segnali/{basename}"
                if current_image != new_path:
                    section['image'] = new_path
                    print(f"✅ Fixed Path: {basename} (was {current_image})")
                    updated_count += 1
            else:
                # File does NOT exist with this name. Try to rematch by title.
                title = section['title']
                print(f"⚠️  File not found: {basename}. Rematching title: {title}")
                match = find_best_match(title)
                if match:
                    section['image'] = f"assets/images/segnali/{match}"
                    print(f"✅ Rematched: {title} -> {match}")
                    updated_count += 1
                else:
                    print(f"❌ Failed to rematch: {title}")

if updated_count > 0:
    print(f"\nWriting {updated_count} updates to {json_path}...")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Done!")
else:
    print("\nNo updates found.")
