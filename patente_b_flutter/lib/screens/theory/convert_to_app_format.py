import json

# Load structured theory
with open('../../../assets/data/theory_structured.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Convert to app format (TheoryChapter format)
chapters = []

for lesson in data['lessons']:
    # Convert sections to app format
    sections = []
    for section in lesson['sections']:
        sections.append({
            'id': f"sec-{lesson['number']}-{len(sections)+1}",
            'title': section['title'],
            'content': section['content']
        })
    
    chapters.append({
        'id': f"lesson-{lesson['number']}",
        'title': lesson['title'],
        'description': f"Lezione {lesson['number']}: {lesson['title']}",
        'icon': '📚',
        'sections': sections
    })

# Create final output
output = {
    'chapters': chapters,
    'version': '2.0',
    'source': 'Manuale di Teoria Patente B - Estrazione Completa PDF'
}

# Save
with open('../../../assets/data/theory-pdf-lessons.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ Converted {len(chapters)} lessons to app format")
print(f"✅ Saved to assets/data/theory-pdf-lessons.json")

# Stats
total_sections = sum(len(c['sections']) for c in chapters)
total_chars = sum(sum(len(s['content']) for s in c['sections']) for c in chapters)

print(f"\n📊 Statistiche:")
print(f"   - Lezioni totali: {len(chapters)}")
print(f"   - Sezioni totali: {total_sections}")
print(f"   - Caratteri totali: {total_chars:,}")
print(f"   - Media sezioni per lezione: {total_sections/len(chapters):.1f}")
print(f"   - Media caratteri per sezione: {total_chars/total_sections:.0f}")
