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

# Parse lessons
lesson_pattern = r'Lezione\s+(\d+)\.\s+([^\n]+)'
lessons = []

matches = list(re.finditer(lesson_pattern, full_text))

for i, match in enumerate(matches):
    lesson_num = match.group(1)
    lesson_title = match.group(2).strip()
    
    # Extract FULL content until next lesson
    start_pos = match.end()
    if i < len(matches) - 1:
        end_pos = matches[i + 1].start()
    else:
        end_pos = len(full_text)
    
    content = full_text[start_pos:end_pos].strip()
    
    # Clean up excessive whitespace but keep paragraphs
    content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)
    content = re.sub(r'[ \t]+', ' ', content)
    
    lessons.append({
        'number': int(lesson_num),
        'title': lesson_title,
        'content': content  # FULL content, no truncation!
    })

# Save complete data
output = {
    'lessons': lessons,
    'total_lessons': len(lessons),
    'extraction_note': 'Complete content extracted from PDF'
}

with open('../../../assets/data/theory_complete.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ Extracted {len(lessons)} complete lessons")
print(f"✅ Saved to assets/data/theory_complete.json")

# Print first lesson as sample
print(f"\n📄 Sample - Lezione {lessons[1]['number']}: {lessons[1]['title']}")
print(f"Content length: {len(lessons[1]['content'])} characters")
print(f"\nFirst 500 chars:\n{lessons[1]['content'][:500]}...")
