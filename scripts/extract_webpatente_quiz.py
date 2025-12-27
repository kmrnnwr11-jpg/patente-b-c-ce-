#!/usr/bin/env python3
"""
Script per estrarre i quiz da WEBpatente APK
Estrae tutte le licenze: A, B, C, CE, D, DE, AM
"""

import os
import re
import json
from pathlib import Path

# Directory base
BASE_DIR = Path("/Users/kmrnnwr/PATENTE-B-2.0-2/webpatente_extracted/assets/mobi")
OUTPUT_DIR = Path("/Users/kmrnnwr/PATENTE-B-2.0-2/patente_b_flutter/assets/data")

# Mapping delle cartelle alle licenze
LICENSE_FOLDERS = {
    "quiz-ab": ["A", "B"],
    "quiz-abrev": ["A", "B"],  # Revisione
    "quiz-am": ["AM"],
    "quiz-c1c1e": ["C1", "C1E"],
    "quiz-c1c1enp": ["C1", "C1E"],  # Non professionisti
    "quiz-cce": ["C", "CE"],
    "quiz-cceest": ["C", "CE"],  # Estensione
    "quiz-d1d1e": ["D1", "D1E"],
    "quiz-dde": ["D", "DE"],
    "quiz-ddeest": ["D", "DE"],  # Estensione
}


def parse_quiz_file(filepath):
    """Parsa un singolo file quiz qit*.js"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Estrai domanda
        domanda_match = re.search(r'domanda\s*=\s*"([^"]+)"', content)
        domanda = domanda_match.group(1) if domanda_match else ""
        
        # Estrai risposte (array)
        risposte_match = re.search(r'risposte\s*=\s*\[([^\]]+)\]', content, re.DOTALL)
        risposte = []
        if risposte_match:
            risposte_str = risposte_match.group(1)
            # Match stringhe tra virgolette
            risposte = re.findall(r'"([^"]*)"', risposte_str)
        
        # Estrai soluzioni (es: "VVVVVFFFFF")
        soluzioni_match = re.search(r'soluzioni\s*=\s*"([VF]+)"', content)
        soluzioni = soluzioni_match.group(1) if soluzioni_match else ""
        
        # Estrai sugg (suggerimento/lezione)
        sugg_match = re.search(r'sugg\s*=\s*(\d+)', content)
        sugg = int(sugg_match.group(1)) if sugg_match else 0
        
        # Estrai quizass (quiz associato/figura)
        quizass_match = re.search(r'quizass\s*=\s*(\d+)', content)
        quizass = int(quizass_match.group(1)) if quizass_match else 0
        
        # Costruisci lista quiz (ogni risposta diventa un quiz vero/falso)
        quizzes = []
        for i, (risposta, soluzione) in enumerate(zip(risposte, soluzioni)):
            if risposta and risposta.strip():
                quizzes.append({
                    "testo": risposta.strip(),
                    "risposta": soluzione == "V",
                    "gruppo": domanda,
                    "lezione": sugg,
                    "figura": quizass if quizass > 0 else None,
                    "indice_risposta": i
                })
        
        return quizzes
        
    except Exception as e:
        print(f"Errore parsing {filepath}: {e}")
        return []


def extract_license_quizzes(folder_name):
    """Estrae tutti i quiz da una cartella licenza"""
    quiz_dir = BASE_DIR / folder_name / "quiz" / "it"
    
    if not quiz_dir.exists():
        print(f"⚠️ Cartella non trovata: {quiz_dir}")
        return []
    
    all_quizzes = []
    
    # Trova tutti i file qit*.js
    quiz_files = sorted(quiz_dir.glob("qit*.js"))
    
    for qfile in quiz_files:
        # Estrai numero gruppo dal nome file
        group_num_match = re.search(r'qit(\d+)\.js', qfile.name)
        group_num = int(group_num_match.group(1)) if group_num_match else 0
        
        quizzes = parse_quiz_file(qfile)
        
        for q in quizzes:
            q["gruppo_numero"] = group_num
            q["file_origine"] = qfile.name
        
        all_quizzes.extend(quizzes)
    
    return all_quizzes


def extract_argomento(folder_name):
    """Estrae gli argomenti (indice lezioni) da argomento.js"""
    arg_file = BASE_DIR / folder_name / "argomento.js"
    
    if not arg_file.exists():
        return []
    
    try:
        with open(arg_file, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Estrai array argomenti
        argomenti = []
        # Pattern: {c:1,t:"Titolo",g:[...],n:[...],l:123}
        pattern = r'\{c:(\d+),t:"([^"]+)",g:\[([^\]]+)\],n:\[([^\]]+)\],l:(\d+)\}'
        
        for match in re.finditer(pattern, content):
            argomenti.append({
                "capitolo": int(match.group(1)),
                "titolo": match.group(2),
                "gruppi": [int(x) for x in match.group(3).split(',')],
                "n_quiz": [int(x) for x in match.group(4).split(',')],
                "totale_quiz": int(match.group(5))
            })
        
        return argomenti
    except Exception as e:
        print(f"Errore parsing argomento.js: {e}")
        return []


def main():
    """Estrae tutti i quiz e li salva in JSON"""
    
    # Crea directory output se non esiste
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    all_data = {
        "versione": "1.0",
        "fonte": "WEBpatente 4.4 - Prof. Roberto Mastri (rmastri.it)",
        "note_licenza": "Dati estratti per uso personale. Per uso commerciale contattare l'autore su rmastri.it",
        "data_estrazione": "2024-12-26",
        "licenze": {}
    }
    
    total_quizzes = 0
    
    for folder_name, licenses in LICENSE_FOLDERS.items():
        print(f"\n📁 Processando: {folder_name} ({', '.join(licenses)})")
        
        # Estrai quiz
        quizzes = extract_license_quizzes(folder_name)
        
        # Estrai argomenti
        argomenti = extract_argomento(folder_name)
        
        if quizzes:
            license_key = "_".join(licenses)
            
            all_data["licenze"][license_key] = {
                "cartella_origine": folder_name,
                "licenze": licenses,
                "totale_quiz": len(quizzes),
                "argomenti": argomenti,
                "quiz": quizzes
            }
            
            total_quizzes += len(quizzes)
            print(f"  ✅ Estratti {len(quizzes)} quiz, {len(argomenti)} argomenti")
    
    # Salva file completo
    output_file = OUTPUT_DIR / "quiz_webpatente_completo.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ TOTALE: {total_quizzes} quiz estratti!")
    print(f"📄 Salvato in: {output_file}")
    
    # Salva anche versione solo quiz (più leggera)
    quiz_only = []
    quiz_id = 1
    
    for license_key, license_data in all_data["licenze"].items():
        for q in license_data["quiz"]:
            quiz_only.append({
                "id": quiz_id,
                "domanda": q["testo"],
                "risposta": q["risposta"],
                "risposta_testo": "Vero" if q["risposta"] else "Falso",
                "argomento": q["gruppo"],
                "capitolo": q.get("lezione", 0),
                "figura": q.get("figura"),
                "licenze": license_data["licenze"]
            })
            quiz_id += 1
    
    output_simple = OUTPUT_DIR / "quiz_webpatente_semplice.json"
    with open(output_simple, 'w', encoding='utf-8') as f:
        json.dump({
            "versione": "1.0",
            "fonte": "WEBpatente 4.4",
            "totale": len(quiz_only),
            "quiz": quiz_only
        }, f, ensure_ascii=False, indent=2)
    
    print(f"📄 Versione semplice: {output_simple}")
    
    # Statistiche per licenza
    print("\n📊 Statistiche per licenza:")
    for license_key, license_data in all_data["licenze"].items():
        print(f"  - {license_key}: {license_data['totale_quiz']} quiz")


if __name__ == "__main__":
    main()
