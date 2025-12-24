import json
import re

def parse_lesson7_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    sections = []
    current_title = None
    current_content = []

    def is_header_footer(line):
        line = line.strip()
        if "Manuale di teoria" in line: return True
        if "Valerio Platia" in line: return True
        if re.match(r'^\d+$', line): return True
        return False

    def is_title(line):
        line = line.strip()
        if not line: return False
        # Remove common punctuation for checking uppercase
        clean_line = re.sub(r'[()\d\s]', '', line)
        return len(line) > 3 and clean_line.isupper() and "LEZIONE" not in line

    for line in lines:
        if is_header_footer(line):
            continue
        
        strip_line = line.strip()
        if not strip_line:
            continue

        if "Lezione 7." in strip_line:
            continue
            
        # Hardcoded fix for Lesson 7 titles that might be tricky or multi-line? 
        # Actually they seem single line in the raw text.
        
        if is_title(strip_line):
            if current_title:
                sections.append({
                    "title": current_title,
                    "content": " ".join(current_content).replace("- ", "") # Fix hyphenations if any
                })
            current_title = strip_line
            current_content = []
        else:
            if current_title:
                current_content.append(strip_line)

    # Add last section
    if current_title:
        sections.append({
            "title": current_title,
            "content": " ".join(current_content).replace("- ", "")
        })

    return sections

def update_json(json_path, new_sections):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    lesson7_index = -1
    for i, lesson in enumerate(data['chapters']):
        if lesson['id'] == 'lesson-7':
            lesson7_index = i
            break
    
    if lesson7_index == -1:
        print("Lesson 7 not found in JSON")
        return

    # Create new section objects
    json_sections = []
    for i, sec in enumerate(new_sections):
        sec_id = f"sec-7-{i+1}"
        
        # Check if we can preserve existing image
        # (Very simple check matching distinct titles)
        existing_image = ""
        # We could try to match against previous sections data if meaningful, but user said "inserisci completamente nuova teoria"
        # However, we just added 'sec-7-3' image manually (Direzione Consigliata Camion). We should try to keep it.
        
        # Let's verify against the OLD sections in the 'data' we just loaded
        old_sections = data['chapters'][lesson7_index].get('sections', [])
        for old_sec in old_sections:
            if old_sec.get('title') == sec['title']:
                if old_sec.get('image'):
                    existing_image = old_sec['image']
        
        new_sec_obj = {
            "id": sec_id,
            "title": sec['title'],
            "content": sec['content'],
            "image": existing_image
        }
        json_sections.append(new_sec_obj)

    data['chapters'][lesson7_index]['sections'] = json_sections

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Updated Lesson 7 with {len(json_sections)} sections.")

if __name__ == "__main__":
    raw_sections = parse_lesson7_text("lesson7_raw.txt")
    update_json("assets/data/theory-pdf-lessons.json", raw_sections)
