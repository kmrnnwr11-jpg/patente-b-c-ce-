import json
import re

# Load complete theory
with open('../../../assets/data/theory_complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Function to split content into sections based on ALL CAPS titles
def parse_sections(content):
    # Pattern to match section titles (ALL CAPS followed by newline)
    section_pattern = r'\n([A-ZÀÈÉÌÒÙ\s,\'\-]+)\s*\n'
    
    sections = []
    matches = list(re.finditer(section_pattern, content))
    
    for i, match in enumerate(matches):
        title = match.group(1).strip()
        
        # Skip if title is too short or too long (likely false positive)
        if len(title) < 3 or len(title) > 100:
            continue
        
        # Extract content until next section
        start_pos = match.end()
        if i < len(matches) - 1:
            end_pos = matches[i + 1].start()
        else:
            end_pos = len(content)
        
        section_content = content[start_pos:end_pos].strip()
        
        # Only add if has meaningful content
        if len(section_content) > 50:
            sections.append({
                'title': title,
                'content': section_content
            })
    
    return sections

# Process each lesson
structured_lessons = []

for lesson in data['lessons']:
    sections = parse_sections(lesson['content'])
    
    structured_lessons.append({
        'number': lesson['number'],
        'title': lesson['title'],
        'sections': sections,
        'total_sections': len(sections)
    })

# Save structured data
output = {
    'lessons': structured_lessons,
    'total_lessons': len(structured_lessons)
}

with open('../../../assets/data/theory_structured.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ Structured {len(structured_lessons)} lessons")

# Show Lezione 2 (Segnali di Pericolo) structure
for lesson in structured_lessons:
    if lesson['number'] == 2:
        print(f"\n📚 Lezione {lesson['number']}: {lesson['title']}")
        print(f"   Sezioni totali: {lesson['total_sections']}\n")
        for i, section in enumerate(lesson['sections'][:10], 1):  # First 10 sections
            print(f"   {i}. {section['title']}")
            print(f"      Lunghezza: {len(section['content'])} caratteri")
        if lesson['total_sections'] > 10:
            print(f"   ... e altre {lesson['total_sections'] - 10} sezioni")
        break

print(f"\n✅ Salvato in assets/data/theory_structured.json")
