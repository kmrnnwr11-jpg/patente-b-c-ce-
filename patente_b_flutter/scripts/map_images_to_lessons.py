#!/usr/bin/env python3
"""
Script per creare un nuovo file JSON della teoria con le immagini mappate alle lezioni.
Mappa le immagini dal pattern manuale_p{pagina}_img{numero}.png alle lezioni corrispondenti.
"""

import json
import os
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
ASSETS_DIR = SCRIPT_DIR.parent / "assets"
IMAGES_DIR = ASSETS_DIR / "images" / "theory-pdf"
DATA_DIR = ASSETS_DIR / "data"

# Mapping: pagine del manuale -> numero della lezione
# Basato sulla struttura del "Manuale di teoria per le patenti A1 A e B"
PAGE_TO_LESSON = {
    # Lezione 1: Definizioni Stradali (pagine 1-2)
    1: 1, 2: 1,
    # Lezione 2: Segnali di Pericolo (pagine 3-9)
    3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2,
    # Lezione 3: Segnali di Precedenza (pagine 11-14)
    10: 3, 11: 3, 12: 3, 13: 3, 14: 3,
    # Lezione 4: Segnali di Divieto (pagine 15-21)
    15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4, 21: 4,
    # Lezione 5: Segnali di Obbligo (pagine 23-27)
    22: 5, 23: 5, 24: 5, 25: 5, 26: 5, 27: 5,
    # Lezione 6: Segnali di Indicazione (pagine 29-39)
    28: 6, 29: 6, 30: 6, 31: 6, 32: 6, 33: 6, 34: 6, 35: 6, 36: 6, 37: 6, 38: 6, 39: 6,
    # Lezione 7: Segnali Temporanei (pagine 41-42)
    40: 7, 41: 7, 42: 7,
    # Lezione 8: Segnali Complementari (pagine 43-44)
    43: 8, 44: 8,
    # Lezione 9: Pannelli Integrativi (pagine 45-49)
    45: 9, 46: 9, 47: 9, 48: 9, 49: 9,
    # Lezione 10: Semafori (pagine 51-55)
    50: 10, 51: 10, 52: 10, 53: 10, 54: 10, 55: 10,
    # Lezione 11: Segnaletica Orizzontale (pagine 57-62)
    56: 11, 57: 11, 58: 11, 59: 11, 60: 11, 61: 11, 62: 11, 63: 11,
    # Resto delle lezioni...
    64: 12, 65: 12, 66: 12, 67: 12, 68: 12,
    69: 13, 70: 13, 71: 13, 72: 13, 73: 13, 74: 13, 75: 13, 76: 13, 77: 13, 78: 13, 79: 13,
    80: 14, 81: 14, 82: 14, 83: 14, 84: 14, 85: 14,
    86: 15, 87: 15, 88: 15, 89: 15, 90: 15, 91: 15, 92: 15,
    93: 16, 94: 16, 95: 16, 96: 16, 97: 16,
    98: 17, 99: 17, 100: 17, 101: 17, 102: 17,
}

# Titoli delle lezioni
LESSON_TITLES = {
    1: "Definizioni Stradali e di Traffico",
    2: "Segnali di Pericolo",
    3: "Segnali di Precedenza",
    4: "Segnali di Divieto",
    5: "Segnali di Obbligo",
    6: "Segnali di Indicazione",
    7: "Segnali Temporanei e di Cantiere",
    8: "Segnali Complementari",
    9: "Pannelli Integrativi dei Segnali",
    10: "Semafori e Segnali degli Agenti",
    11: "Segnaletica Orizzontale",
    12: "Velocità e Distanza di Sicurezza",
    13: "Posizione, Manovre e Incroci",
    14: "Norme sulla Precedenza",
    15: "Sorpasso",
    16: "Fermata, Sosta e Arresto",
    17: "Ingombro Carreggiata",
}


def get_images_for_lesson(lesson_num):
    """Trova tutte le immagini per una lezione."""
    images = []
    
    if not IMAGES_DIR.exists():
        print(f"Warning: Images directory not found: {IMAGES_DIR}")
        return images
    
    # Trova le pagine per questa lezione
    pages = [p for p, l in PAGE_TO_LESSON.items() if l == lesson_num]
    
    for page in sorted(pages):
        # Cerca immagini del manuale per questa pagina
        for img_file in sorted(IMAGES_DIR.glob(f"manuale_p{page}_img*.png")):
            images.append(f"assets/images/theory-pdf/{img_file.name}")
    
    return images


def get_grafiche_images():
    """Trova tutte le immagini delle 'Rappresentazioni Grafiche'."""
    images_by_page = {}
    
    if not IMAGES_DIR.exists():
        return images_by_page
    
    for img_file in sorted(IMAGES_DIR.glob("grafiche_p*_img*.png")):
        # Estrai numero pagina
        name = img_file.stem
        parts = name.split("_")
        if len(parts) >= 2:
            page = int(parts[1][1:])  # p10 -> 10
            if page not in images_by_page:
                images_by_page[page] = []
            images_by_page[page].append(f"assets/images/theory-pdf/{img_file.name}")
    
    return images_by_page


def create_lessons_with_images():
    """Crea la struttura JSON con le lezioni e le immagini."""
    
    # Carica il contenuto esistente
    content_file = DATA_DIR / "theory-pdf-content.json"
    lessons_file = DATA_DIR / "theory-pdf-lessons.json"
    
    existing_content = {}
    if content_file.exists():
        with open(content_file, 'r', encoding='utf-8') as f:
            existing_content = json.load(f)
    
    existing_lessons = {}
    if lessons_file.exists():
        with open(lessons_file, 'r', encoding='utf-8') as f:
            existing_lessons = json.load(f)
    
    # Crea le nuove lezioni
    chapters = []
    
    for lesson_num in sorted(LESSON_TITLES.keys()):
        title = LESSON_TITLES[lesson_num]
        images = get_images_for_lesson(lesson_num)
        
        # Trova sezioni corrispondenti nel file esistente
        sections = []
        
        # Cerca nel file lessons già esistente
        if existing_lessons and 'chapters' in existing_lessons:
            for ch in existing_lessons['chapters']:
                if title.lower() in ch.get('title', '').lower() or \
                   f"lezione {lesson_num}" in ch.get('title', '').lower():
                    for s in ch.get('sections', []):
                        sections.append({
                            "id": s.get('id', f'section-{lesson_num}-{len(sections)}'),
                            "title": s.get('title', 'Contenuto'),
                            "content": s.get('content', ''),
                            "images": images[:3] if images else []  # Max 3 immagini per sezione
                        })
                    images = images[3:]  # Usa le immagini rimanenti per altre sezioni
        
        # Se non ci sono sezioni, creane una di default
        if not sections:
            sections.append({
                "id": f"section-{lesson_num}-main",
                "title": "Contenuto",
                "content": f"Contenuto della lezione {lesson_num}",
                "images": images
            })
        
        chapters.append({
            "id": f"lezione-{lesson_num}",
            "title": f"Lezione {lesson_num}: {title}",
            "order": lesson_num,
            "icon": get_icon_for_lesson(lesson_num),
            "sections": sections
        })
    
    # Aggiungi rappresentazioni grafiche come capitolo speciale
    grafiche = get_grafiche_images()
    if grafiche:
        grafiche_sections = []
        for page, imgs in sorted(grafiche.items()):
            grafiche_sections.append({
                "id": f"grafiche-p{page}",
                "title": f"Pagina {page}",
                "content": "Rappresentazioni grafiche dei segnali",
                "images": imgs
            })
        
        chapters.append({
            "id": "grafiche",
            "title": "Rappresentazioni Grafiche",
            "order": 100,
            "icon": "Gallery",
            "sections": grafiche_sections
        })
    
    return {"chapters": chapters}


def get_icon_for_lesson(lesson_num):
    """Ritorna l'icona appropriata per la lezione."""
    icons = {
        1: "Map",
        2: "AlertTriangle",
        3: "AlertCircle",
        4: "Ban",
        5: "Shield",
        6: "Eye",
        7: "TrafficCone",
        8: "Info",
        9: "Info",
        10: "Timer",
        11: "Road",
        12: "Gauge",
        13: "ArrowRightLeft",
        14: "Users",
        15: "Target",
        16: "Clock",
        17: "AlertCircle",
    }
    return icons.get(lesson_num, "Book")


def main():
    output = create_lessons_with_images()
    
    output_file = DATA_DIR / "theory-lessons-complete.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"Created: {output_file}")
    print(f"Total chapters: {len(output['chapters'])}")
    
    total_images = 0
    for ch in output['chapters']:
        for s in ch.get('sections', []):
            total_images += len(s.get('images', []))
    print(f"Total images mapped: {total_images}")


if __name__ == "__main__":
    main()
