import fitz  # PyMuPDF
import json
import re

pdf_path = '/Users/kmrnnwr/Downloads/patente-b-2-o-90dd4c9a2c9c/Manuale di teoria.pdf'

# Open PDF
doc = fitz.open(pdf_path)

# Extract all text
full_text = ""
for page in doc:
    full_text += page.get_text()

doc.close()

# Parse lessons using regex
lesson_pattern = r'Lezione\s+(\d+)\.\s+([^\n]+)'
lessons = []

# Find all lesson headers
matches = list(re.finditer(lesson_pattern, full_text))

for i, match in enumerate(matches):
    lesson_num = match.group(1)
    lesson_title = match.group(2).strip()
    
    # Extract content until next lesson or end
    start_pos = match.end()
    if i < len(matches) - 1:
        end_pos = matches[i + 1].start()
    else:
        end_pos = len(full_text)
    
    content = full_text[start_pos:end_pos].strip()
    
    # Clean up content (remove excessive whitespace)
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    content = re.sub(r'[ \t]+', ' ', content)
    
    lessons.append({
        'number': int(lesson_num),
        'title': lesson_title,
        'content': content[:1000]  # First 1000 chars for preview
    })

print(f"Found {len(lessons)} lessons:\n")
for lesson in lessons:
    print(f"Lezione {lesson['number']}: {lesson['title']}")
    print(f"  Preview: {lesson['content'][:150]}...")
    print()

# Save to JSON
output = {
    'lessons': lessons,
    'total_lessons': len(lessons)
}

with open('theory_lessons_preview.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\nSaved to theory_lessons_preview.json")
