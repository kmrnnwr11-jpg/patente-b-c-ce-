
import json
import re

file_path = 'assets/data/theory-pdf-lessons.json'

def clean_content(text):
    # Remove footer text like "Valerio Platia e Roberto Mastri \n26" or "Manuale di teoria per le patenti A1 A e B \n25"
    text = re.sub(r'Valerio Platia e Roberto Mastri\s*\n\s*\d+', '', text)
    text = re.sub(r'Manuale di teoria per le patenti A1 A e B\s*\n\s*\d+', '', text)
    return text.strip()

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Find Lesson 5
    lesson5 = next((l for l in data['chapters'] if l['id'] == 'lesson-5'), None)

    if lesson5:
        print(f"Found Lesson 5: {lesson5['title']}")
        
        # 1. Clean up existing sections
        for section in lesson5['sections']:
            original_content = section['content']
            cleaned = clean_content(original_content)
            if original_content != cleaned:
                print(f"Cleaned section {section['id']}")
                section['content'] = cleaned

        # 2. Add Introduction if missing
        if not any(s['id'] == 'sec-5-0' for s in lesson5['sections']):
            input_section = {
                "id": "sec-5-0",
                "title": "INTRODUZIONE: SEGNALI DI OBBLIGO",
                "content": "I segnali di obbligo sono dei segnali di prescrizione che impongono un determinato comportamento. Sono di forma circolare con sfondo blu e simbolo bianco (tranne i segnali di 'Alt-Dogana', 'Alt-Polizia' e 'Alt-Stazione'). Obbligano gli utenti della strada a rispettare una specifica prescrizione.",
                "image": "assets/images/theory/lesson5/intro_obbligo.png" 
            }
             # Note: Image might not exist yet, but we'll set the path.
            lesson5['sections'].insert(0, input_section)
            print("Added Introduction section")

        # Save changes
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Successfully updated Lesson 5")
    else:
        print("Lesson 5 not found!")

except Exception as e:
    print(f"Error: {e}")
