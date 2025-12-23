#!/usr/bin/env python3
"""
Script to extract text and images from PDF files for theory content.
Creates JSON structure and saves images to assets folder.
"""

import fitz  # PyMuPDF
import json
import os
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
PDF_MANUALE = BASE_DIR / "Manuale di teoria.pdf"
PDF_GRAFICHE = BASE_DIR / "Rappresentazioni grafiche.pdf"
OUTPUT_JSON = BASE_DIR / "patente_b_flutter" / "assets" / "data" / "theory-pdf-content.json"
OUTPUT_IMAGES = BASE_DIR / "patente_b_flutter" / "assets" / "images" / "theory-pdf"

def extract_text_from_pdf(pdf_path: Path) -> list:
    """Extract text from PDF, page by page."""
    doc = fitz.open(pdf_path)
    pages = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        pages.append({
            "page": page_num + 1,
            "text": text.strip()
        })
    
    doc.close()
    return pages

def extract_images_from_pdf(pdf_path: Path, output_dir: Path, prefix: str) -> list:
    """Extract all images from PDF and save them."""
    output_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    images = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            try:
                pix = fitz.Pixmap(doc, xref)
                
                # Convert CMYK to RGB if needed
                if pix.n - pix.alpha > 3:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                
                image_name = f"{prefix}_p{page_num + 1}_img{img_index + 1}.png"
                image_path = output_dir / image_name
                pix.save(str(image_path))
                
                images.append({
                    "page": page_num + 1,
                    "image_index": img_index + 1,
                    "filename": image_name,
                    "path": f"assets/images/theory-pdf/{image_name}"
                })
                
                print(f"  Saved: {image_name}")
                pix = None
            except Exception as e:
                print(f"  Error extracting image {img_index} from page {page_num + 1}: {e}")
    
    doc.close()
    return images

def parse_chapters_from_text(pages: list) -> list:
    """Parse extracted text into chapters and sections."""
    chapters = []
    current_chapter = None
    current_section = None
    
    # Common chapter patterns in Italian theory manuals
    chapter_pattern = re.compile(r'^(CAPITOLO|CAP\.|Capitolo)\s*(\d+)', re.IGNORECASE)
    section_pattern = re.compile(r'^(\d+\.\d+|\d+\.)\s+([A-Z])', re.MULTILINE)
    
    full_text = "\n\n".join([p["text"] for p in pages])
    
    # Split by potential chapter markers
    lines = full_text.split('\n')
    
    chapter_id = 0
    section_id = 0
    content_buffer = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for chapter headers
        chapter_match = chapter_pattern.match(line)
        if chapter_match:
            # Save previous chapter
            if current_chapter and content_buffer:
                if current_section:
                    current_section["content"] = "\n".join(content_buffer)
                    current_chapter["sections"].append(current_section)
                chapters.append(current_chapter)
            
            chapter_id += 1
            section_id = 0
            current_chapter = {
                "id": f"chapter-{chapter_id}",
                "title": line,
                "order": chapter_id,
                "sections": []
            }
            current_section = None
            content_buffer = []
            continue
        
        # Check for section headers (numbered sections)
        section_match = section_pattern.match(line)
        if section_match and current_chapter:
            # Save previous section
            if current_section and content_buffer:
                current_section["content"] = "\n".join(content_buffer)
                current_chapter["sections"].append(current_section)
            
            section_id += 1
            current_section = {
                "id": f"section-{chapter_id}-{section_id}",
                "title": line,
                "content": ""
            }
            content_buffer = []
            continue
        
        # Regular content
        content_buffer.append(line)
    
    # Save last chapter/section
    if current_chapter:
        if current_section and content_buffer:
            current_section["content"] = "\n".join(content_buffer)
            current_chapter["sections"].append(current_section)
        elif content_buffer:
            current_chapter["sections"].append({
                "id": f"section-{chapter_id}-1",
                "title": "Contenuto",
                "content": "\n".join(content_buffer)
            })
        chapters.append(current_chapter)
    
    return chapters

def create_simple_structure(pages: list, title: str) -> dict:
    """Create a simple chapter structure from pages."""
    # Group pages into logical chapters (every 20 pages or so)
    chapters = []
    pages_per_chapter = 15
    
    for i in range(0, len(pages), pages_per_chapter):
        chunk_pages = pages[i:i + pages_per_chapter]
        chapter_num = (i // pages_per_chapter) + 1
        
        # Get first meaningful line as title
        first_text = chunk_pages[0]["text"] if chunk_pages else ""
        first_line = first_text.split('\n')[0][:80] if first_text else f"Capitolo {chapter_num}"
        
        combined_content = "\n\n---\n\n".join([p["text"] for p in chunk_pages])
        
        chapters.append({
            "id": f"pdf-chapter-{chapter_num}",
            "title": f"Parte {chapter_num}: {first_line}",
            "order": chapter_num,
            "start_page": i + 1,
            "end_page": min(i + pages_per_chapter, len(pages)),
            "sections": [{
                "id": f"section-{chapter_num}-main",
                "title": "Contenuto",
                "content": combined_content
            }]
        })
    
    return {
        "source": title,
        "total_pages": len(pages),
        "chapters": chapters
    }

def main():
    print("=" * 60)
    print("ESTRAZIONE CONTENUTI PDF - TEORIA PATENTE")
    print("=" * 60)
    
    results = {
        "manuale": None,
        "grafiche": None,
        "images": []
    }
    
    # Extract from Manuale di teoria
    if PDF_MANUALE.exists():
        print(f"\n📖 Elaborazione: {PDF_MANUALE.name}")
        print("-" * 40)
        
        print("  Estrazione testo...")
        pages = extract_text_from_pdf(PDF_MANUALE)
        print(f"  ✓ Estratte {len(pages)} pagine")
        
        print("  Estrazione immagini...")
        images = extract_images_from_pdf(PDF_MANUALE, OUTPUT_IMAGES, "manuale")
        print(f"  ✓ Estratte {len(images)} immagini")
        
        print("  Parsing struttura...")
        results["manuale"] = create_simple_structure(pages, "Manuale di teoria")
        results["images"].extend(images)
        print(f"  ✓ Creati {len(results['manuale']['chapters'])} capitoli")
    else:
        print(f"❌ File non trovato: {PDF_MANUALE}")
    
    # Extract from Rappresentazioni grafiche
    if PDF_GRAFICHE.exists():
        print(f"\n🖼️  Elaborazione: {PDF_GRAFICHE.name}")
        print("-" * 40)
        
        print("  Estrazione testo...")
        pages = extract_text_from_pdf(PDF_GRAFICHE)
        print(f"  ✓ Estratte {len(pages)} pagine")
        
        print("  Estrazione immagini...")
        images = extract_images_from_pdf(PDF_GRAFICHE, OUTPUT_IMAGES, "grafiche")
        print(f"  ✓ Estratte {len(images)} immagini")
        
        print("  Parsing struttura...")
        results["grafiche"] = create_simple_structure(pages, "Rappresentazioni grafiche")
        results["images"].extend(images)
        print(f"  ✓ Creati {len(results['grafiche']['chapters'])} capitoli")
    else:
        print(f"❌ File non trovato: {PDF_GRAFICHE}")
    
    # Save JSON
    print(f"\n💾 Salvataggio JSON...")
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"  ✓ Salvato: {OUTPUT_JSON}")
    
    # Summary
    print("\n" + "=" * 60)
    print("RIEPILOGO")
    print("=" * 60)
    if results["manuale"]:
        print(f"  Manuale: {results['manuale']['total_pages']} pagine, {len(results['manuale']['chapters'])} capitoli")
    if results["grafiche"]:
        print(f"  Grafiche: {results['grafiche']['total_pages']} pagine, {len(results['grafiche']['chapters'])} capitoli")
    print(f"  Immagini estratte: {len(results['images'])}")
    print(f"  Output JSON: {OUTPUT_JSON}")
    print(f"  Output immagini: {OUTPUT_IMAGES}")
    print("=" * 60)

if __name__ == "__main__":
    main()
