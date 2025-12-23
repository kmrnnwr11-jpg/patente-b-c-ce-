import json

# Load both files
with open('../../../assets/data/theory-segnali-completo.json', 'r', encoding='utf-8') as f:
    signals_data = json.load(f)

with open('../../../assets/data/theory-pdf-lessons.json', 'r', encoding='utf-8') as f:
    lessons_data = json.load(f)

# Create a merged version
# Start with lessons (they have full content)
merged_chapters = lessons_data['chapters'].copy()

# For each signal chapter, find matching lesson and add images
for signal_ch in signals_data['chapters']:
    signal_title = signal_ch['title']
    
    # Find matching lesson chapter
    lesson_match = None
    for i, lesson_ch in enumerate(merged_chapters):
        if signal_title.lower() in lesson_ch['title'].lower() or lesson_ch['title'].lower() in signal_title.lower():
            lesson_match = i
            break
    
    if lesson_match is not None:
        print(f"✅ Merging '{signal_title}' into lesson chapter")
        
        # Add signal images to corresponding sections
        for signal in signal_ch.get('signals', []):
            signal_nome = signal.get('nome', '')
            
            # Find matching section in lesson
            for section in merged_chapters[lesson_match]['sections']:
                # Match by title similarity
                if signal_nome.upper() in section['title'].upper():
                    # Add image if not present
                    if 'image' not in section or not section['image']:
                        image_path = signal.get('image', '')
                        if image_path:
                            # Remove leading slash
                            section['image'] = image_path.lstrip('/')
                    print(f"   - Added image to: {section['title']}")
                    break
    else:
        # No matching lesson, add signal chapter as-is
        print(f"➕ Adding signal chapter: {signal_title}")
        # Convert signals to sections with images
        sections = []
        
        # Add general description
        if signal_ch.get('description'):
            sections.append({
                'id': f'desc-{signal_ch["id"]}',
                'title': 'Caratteristiche',
                'content': signal_ch['description']
            })
        
        # Add each signal
        for signal in signal_ch.get('signals', []):
            image_path = signal.get('image', '')
            if image_path:
                image_path = image_path.lstrip('/')
            
            sections.append({
                'id': signal.get('id', ''),
                'title': signal.get('nome', ''),
                'content': f"{signal.get('descrizione', '')}\n\n📌 Comportamento:\n{signal.get('comportamento', '')}",
                'image': image_path if image_path else None
            })
        
        merged_chapters.append({
            'id': signal_ch['id'],
            'title': signal_ch['title'],
            'description': signal_ch.get('description', ''),
            'icon': signal_ch.get('icon', '🚦'),
            'sections': sections
        })

# Save merged version
output = {
    'chapters': merged_chapters,
    'version': '2.1',
    'source': 'Merged: Full PDF lessons + Signal images'
}

with open('../../../assets/data/theory-pdf-lessons.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\n✅ Saved {len(merged_chapters)} merged chapters")
print(f"✅ File: assets/data/theory-pdf-lessons.json")
