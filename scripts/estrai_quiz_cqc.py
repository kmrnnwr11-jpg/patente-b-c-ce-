#!/usr/bin/env python3
"""
Script per estrarre quiz CQC dal PDF ministeriale NECA
Fonte: https://www.neca.it/assets/pdf/ListatoCQC.pdf

Struttura CQC:
- Capitoli 1-10: Parte Comune (per tutti)
- Capitoli 11-13: Parte Specifica Merci
- Capitoli 14-16: Parte Specifica Persone
"""

import pdfplumber
import json
import re
import os
from datetime import datetime
from typing import List, Dict, Optional

# Configurazione capitoli CQC
CAPITOLI_CQC = {
    # PARTE COMUNE (Capitoli 1-10)
    1: {"nome": "Norme sulla circolazione dei veicoli", "parte": "comune"},
    2: {"nome": "Elementi del veicolo rilevanti per la sicurezza", "parte": "comune"},
    3: {"nome": "Manutenzione e diagnosi guasti", "parte": "comune"},
    4: {"nome": "Responsabilità del conducente", "parte": "comune"},
    5: {"nome": "Prevenzione e gestione emergenze", "parte": "comune"},
    6: {"nome": "Incidenti stradali e primo soccorso", "parte": "comune"},
    7: {"nome": "Ergonomia e rischi professionali", "parte": "comune"},
    8: {"nome": "Condizioni psicofisiche del conducente", "parte": "comune"},
    9: {"nome": "Criminalità e traffico clandestini", "parte": "comune"},
    10: {"nome": "Tutela ambientale e inquinamento", "parte": "comune"},
    
    # PARTE SPECIFICA MERCI (Capitoli 11-13)
    11: {"nome": "Tecniche di carico e sicurezza del carico", "parte": "specifica_merci"},
    12: {"nome": "Contratto trasporto merci e documenti", "parte": "specifica_merci"},
    13: {"nome": "Contesto economico autotrasporto merci", "parte": "specifica_merci"},
    
    # PARTE SPECIFICA PERSONE (Capitoli 14-16)
    14: {"nome": "Interazione passeggeri e disabili", "parte": "specifica_persone"},
    15: {"nome": "Sicurezza veicoli trasporto persone", "parte": "specifica_persone"},
    16: {"nome": "Contesto economico trasporto persone", "parte": "specifica_persone"},
}

# Keywords per identificare capitoli dal testo
KEYWORDS_CAPITOLI = {
    1: ["circolazione", "codice strada", "segnaletica", "precedenza"],
    2: ["freni", "pneumatici", "sterzo", "luci", "sicurezza attiva", "sicurezza passiva"],
    3: ["manutenzione", "guasti", "diagnosi", "riparazione", "controlli"],
    4: ["responsabilità", "conducente", "sanzioni", "obblighi", "patente"],
    5: ["emergenze", "prevenzione", "incendio", "estintore"],
    6: ["incidenti", "primo soccorso", "ferito", "emorragia", "massaggio cardiaco"],
    7: ["ergonomia", "postura", "sedile", "rischi professionali", "vibrazioni"],
    8: ["alcol", "droga", "stanchezza", "stress", "alimentazione", "sonno"],
    9: ["clandestini", "immigrazione", "criminalità", "controlli frontiera"],
    10: ["ambiente", "inquinamento", "emissioni", "rumore", "consumo carburante"],
    11: ["carico", "scarico", "ancoraggio", "peso", "baricentro", "ribaltamento"],
    12: ["contratto", "trasporto merci", "CMR", "lettera vettura", "documenti"],
    13: ["autotrasporto", "mercato", "tariffe", "impresa trasporto"],
    14: ["passeggeri", "disabili", "accessibilità", "rampe", "cinture"],
    15: ["autobus", "sicurezza persone", "uscite emergenza", "estintori bus"],
    16: ["trasporto persone", "linee", "noleggio", "turismo"],
}


def identifica_capitolo(testo: str) -> Optional[int]:
    """Identifica il capitolo basandosi sul contenuto del testo"""
    testo_lower = testo.lower()
    
    # Prima cerca pattern esplicito "Capitolo X"
    match = re.search(r'capitolo\s+(\d+)', testo_lower)
    if match:
        return int(match.group(1))
    
    # Altrimenti usa keywords
    max_score = 0
    capitolo_identificato = None
    
    for cap, keywords in KEYWORDS_CAPITOLI.items():
        score = sum(1 for kw in keywords if kw in testo_lower)
        if score > max_score:
            max_score = score
            capitolo_identificato = cap
    
    return capitolo_identificato if max_score >= 2 else None


def pulisci_domanda(testo: str) -> str:
    """Pulisce e normalizza il testo della domanda"""
    # Rimuovi numeri iniziali e punti
    testo = re.sub(r'^\d+[\.\)\s]+', '', testo.strip())
    # Rimuovi V/F finale
    testo = re.sub(r'\s*[VF]\s*$', '', testo)
    # Normalizza spazi
    testo = ' '.join(testo.split())
    return testo


def estrai_quiz_cqc(pdf_path: str) -> List[Dict]:
    """
    Estrae tutti i quiz CQC dal PDF
    
    Args:
        pdf_path: Percorso al file PDF (ListatoCQC.pdf)
    
    Returns:
        Lista di dizionari con i quiz
    """
    quiz_list = []
    current_chapter = None
    quiz_counter = {i: 0 for i in range(1, 17)}
    
    print(f"📖 Apertura PDF: {pdf_path}")
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f"📄 Totale pagine: {total_pages}")
            
            for page_num, page in enumerate(pdf.pages, 1):
                if page_num % 50 == 0:
                    print(f"  Elaborazione pagina {page_num}/{total_pages}...")
                
                text = page.extract_text()
                if not text:
                    continue
                
                # Cerca indicatore capitolo nella pagina
                cap_match = re.search(r'[Cc]apitolo\s+(\d+)', text)
                if cap_match:
                    current_chapter = int(cap_match.group(1))
                
                # Pattern per quiz Vero/Falso
                # Formato tipico: "1. Domanda qui V" o "1) Domanda qui F"
                patterns = [
                    r'(\d+)\s*[\.\)]\s*(.+?)\s+([VF])\s*(?=\d+[\.\)]|$)',  # Standard
                    r'(\d+)\s*[\.\)]\s*(.+?)\s+([VF])\s*\n',  # Con newline
                    r'^(\d+)\s*[\.\)]\s*(.+?)\s+([VF])\s*$',  # Linea singola
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, text, re.MULTILINE | re.DOTALL)
                    
                    for match in matches:
                        num_domanda = match[0]
                        domanda = pulisci_domanda(match[1])
                        risposta = match[2].upper() == 'V'
                        
                        # Salta domande troppo corte o invalide
                        if len(domanda) < 10:
                            continue
                        
                        # Identifica capitolo se non già noto
                        if current_chapter is None:
                            current_chapter = identifica_capitolo(domanda)
                        
                        if current_chapter is None:
                            current_chapter = 1  # Default
                        
                        quiz_counter[current_chapter] += 1
                        
                        # Determina la parte
                        info_cap = CAPITOLI_CQC.get(current_chapter, {"nome": "Sconosciuto", "parte": "comune"})
                        
                        quiz = {
                            "id": f"CQC_{info_cap['parte'][0].upper()}{current_chapter:02d}_{quiz_counter[current_chapter]:04d}",
                            "domanda": domanda,
                            "risposta": risposta,
                            "capitolo": current_chapter,
                            "nome_capitolo": info_cap["nome"],
                            "parte": info_cap["parte"],
                            "is_parte_comune": info_cap["parte"] == "comune"
                        }
                        
                        # Evita duplicati
                        if not any(q["domanda"] == domanda for q in quiz_list):
                            quiz_list.append(quiz)
    
    except Exception as e:
        print(f"❌ Errore durante l'estrazione: {e}")
        raise
    
    print(f"\n✅ Estratti {len(quiz_list)} quiz totali")
    return quiz_list


def dividi_per_parte(quiz_list: List[Dict]) -> Dict[str, List[Dict]]:
    """Divide i quiz per parte (comune, merci, persone)"""
    
    parti = {
        "comune": [],
        "specifica_merci": [],
        "specifica_persone": []
    }
    
    for quiz in quiz_list:
        parte = quiz.get("parte", "comune")
        if parte in parti:
            parti[parte].append(quiz)
    
    return parti


def genera_statistiche(quiz_list: List[Dict]) -> Dict:
    """Genera statistiche sui quiz estratti"""
    
    stats = {
        "totale": len(quiz_list),
        "per_capitolo": {},
        "per_parte": {
            "comune": 0,
            "specifica_merci": 0,
            "specifica_persone": 0
        },
        "risposte": {
            "vero": 0,
            "falso": 0
        }
    }
    
    for quiz in quiz_list:
        cap = quiz["capitolo"]
        parte = quiz["parte"]
        
        if cap not in stats["per_capitolo"]:
            stats["per_capitolo"][cap] = {
                "nome": CAPITOLI_CQC.get(cap, {}).get("nome", "Sconosciuto"),
                "parte": parte,
                "count": 0
            }
        
        stats["per_capitolo"][cap]["count"] += 1
        stats["per_parte"][parte] += 1
        
        if quiz["risposta"]:
            stats["risposte"]["vero"] += 1
        else:
            stats["risposte"]["falso"] += 1
    
    return stats


def salva_json(data: any, filepath: str):
    """Salva dati in formato JSON"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 Salvato: {filepath}")


def main():
    """Funzione principale"""
    
    print("=" * 60)
    print("🎓 ESTRATTORE QUIZ CQC")
    print("=" * 60)
    
    # Percorso PDF
    pdf_path = "ListatoCQC.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"\n⚠️  File non trovato: {pdf_path}")
        print("\n📥 Scarica il PDF da:")
        print("   https://www.neca.it/assets/pdf/ListatoCQC.pdf")
        print("\n   Comando: curl -O https://www.neca.it/assets/pdf/ListatoCQC.pdf")
        return
    
    # Estrai quiz
    print("\n📖 Estrazione quiz in corso...")
    quiz_list = estrai_quiz_cqc(pdf_path)
    
    if not quiz_list:
        print("❌ Nessun quiz estratto!")
        return
    
    # Dividi per parte
    parti = dividi_per_parte(quiz_list)
    
    # Genera statistiche
    stats = genera_statistiche(quiz_list)
    
    # Crea directory output
    output_dir = "quiz_cqc_estratti"
    os.makedirs(output_dir, exist_ok=True)
    
    # Prepara metadati
    meta = {
        "versione": "1.0",
        "data_estrazione": datetime.now().isoformat(),
        "fonte": "NECA - Ministero Infrastrutture e Trasporti",
        "url_fonte": "https://www.neca.it/assets/pdf/ListatoCQC.pdf"
    }
    
    # Salva file separati
    
    # 1. Parte Comune
    comune_data = {
        "meta": {**meta, "tipo": "cqc_comune"},
        "esame": {
            "domande_totali": 40,
            "domande_per_capitolo": 4,
            "capitoli": list(range(1, 11))
        },
        "capitoli": [
            {"numero": i, **CAPITOLI_CQC[i]} 
            for i in range(1, 11)
        ],
        "quiz": parti["comune"]
    }
    salva_json(comune_data, f"{output_dir}/cqc_comune.json")
    
    # 2. Parte Specifica Merci
    merci_data = {
        "meta": {**meta, "tipo": "cqc_merci"},
        "esame": {
            "domande_totali": 30,
            "domande_per_capitolo": 10,
            "capitoli": [11, 12, 13]
        },
        "capitoli": [
            {"numero": i, **CAPITOLI_CQC[i]} 
            for i in [11, 12, 13]
        ],
        "quiz": parti["specifica_merci"]
    }
    salva_json(merci_data, f"{output_dir}/cqc_merci.json")
    
    # 3. Parte Specifica Persone
    persone_data = {
        "meta": {**meta, "tipo": "cqc_persone"},
        "esame": {
            "domande_totali": 30,
            "domande_per_capitolo": 10,
            "capitoli": [14, 15, 16]
        },
        "capitoli": [
            {"numero": i, **CAPITOLI_CQC[i]} 
            for i in [14, 15, 16]
        ],
        "quiz": parti["specifica_persone"]
    }
    salva_json(persone_data, f"{output_dir}/cqc_persone.json")
    
    # 4. File completo (tutti i quiz)
    completo_data = {
        "meta": {**meta, "tipo": "cqc_completo"},
        "esame_completo": {
            "domande": 70,
            "tempo_minuti": 90,
            "errori_max": 7,
            "distribuzione": {
                "comune": 40,
                "specifica": 30
            }
        },
        "esame_estensione": {
            "domande": 30,
            "tempo_minuti": 40,
            "errori_max": 3
        },
        "capitoli": [
            {"numero": i, **CAPITOLI_CQC[i]} 
            for i in range(1, 17)
        ],
        "quiz": quiz_list
    }
    salva_json(completo_data, f"{output_dir}/cqc_completo.json")
    
    # 5. Statistiche
    salva_json(stats, f"{output_dir}/statistiche.json")
    
    # Stampa riepilogo
    print("\n" + "=" * 60)
    print("📊 RIEPILOGO ESTRAZIONE")
    print("=" * 60)
    print(f"\n✅ Quiz totali estratti: {stats['totale']}")
    print(f"\n📗 PARTE COMUNE: {stats['per_parte']['comune']} quiz")
    for cap in range(1, 11):
        if cap in stats["per_capitolo"]:
            info = stats["per_capitolo"][cap]
            print(f"   Cap. {cap}: {info['nome'][:40]}... ({info['count']})")
    
    print(f"\n📦 PARTE MERCI: {stats['per_parte']['specifica_merci']} quiz")
    for cap in [11, 12, 13]:
        if cap in stats["per_capitolo"]:
            info = stats["per_capitolo"][cap]
            print(f"   Cap. {cap}: {info['nome'][:40]}... ({info['count']})")
    
    print(f"\n🚌 PARTE PERSONE: {stats['per_parte']['specifica_persone']} quiz")
    for cap in [14, 15, 16]:
        if cap in stats["per_capitolo"]:
            info = stats["per_capitolo"][cap]
            print(f"   Cap. {cap}: {info['nome'][:40]}... ({info['count']})")
    
    print(f"\n📁 File salvati in: {output_dir}/")
    print("   - cqc_comune.json")
    print("   - cqc_merci.json")
    print("   - cqc_persone.json")
    print("   - cqc_completo.json")
    print("   - statistiche.json")
    
    print("\n✨ Estrazione completata!")


if __name__ == "__main__":
    main()
