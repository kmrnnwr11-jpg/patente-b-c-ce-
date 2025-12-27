# 🚀 Guida Completa: Adattamento App per Patente B, C, CE

Documento dettagliato per trasformare l'app Patente B esistente in una piattaforma multi-licenza con supporto per B, C, CE inclusi quiz e teoria.

---

## 📱 ANALISI APP ATTUALE

### Struttura Directory

```
lib/
├── main.dart                    # Entry point, Provider setup
├── theme/
│   └── app_theme.dart           # Dark theme Duolingo-style
├── models/                      # 11 modelli dati
│   ├── quiz_question.dart       # Domanda quiz
│   ├── theory_chapter.dart      # Capitolo teoria
│   ├── signal.dart              # Segnale stradale
│   ├── user_model.dart          # Utente + premium
│   ├── subscription_model.dart  # Abbonamento Stripe
│   ├── creator_model.dart       # Creator/referral
│   └── ...
├── services/                    # Business logic
│   ├── quiz_service.dart        # Caricamento/gestione quiz
│   ├── theory_service.dart      # Gestione lezioni teoria
│   ├── auth_service.dart        # Firebase Auth
│   ├── subscription_service.dart
│   ├── creator_service.dart
│   └── translation_service.dart # Multi-lingua
├── providers/
│   ├── auth_provider.dart       # Stato autenticazione
│   └── subscription_provider.dart
├── screens/
│   ├── auth/                    # Login, Register, Reset pwd
│   ├── quiz/                    # Quiz engine
│   │   ├── quiz_screen.dart     # 46KB - Main quiz
│   │   ├── topic_selection_screen.dart
│   │   └── results_screen.dart
│   ├── theory/                  # Lezioni teoria
│   │   ├── theory_screen.dart   # 27KB - Lista lezioni
│   │   ├── theory_detail_screen.dart  # 36KB - Dettaglio
│   │   ├── signals_screen.dart
│   │   └── signals_detail_screen.dart
│   ├── subscription/            # Premium/pagamenti
│   ├── creator/                 # Referral creator
│   ├── stats/                   # Statistiche
│   └── settings/
└── widgets/                     # Widget riutilizzabili
```

---

### Schermate Principali

| Schermata | File | Funzione |
|-----------|------|----------|
| **Splash** | `auth/splash_screen.dart` | Auto-login, animazione |
| **Login** | `auth/login_screen.dart` | Email + Google |
| **Dashboard** | `dashboard_screen.dart` | Home principale |
| **Quiz** | `quiz/quiz_screen.dart` | Engine quiz Vero/Falso |
| **Topic Select** | `quiz/topic_selection_screen.dart` | Scelta argomento |
| **Risultati** | `quiz/results_screen.dart` | Score + review |
| **Teoria** | `theory/theory_screen.dart` | Lista 30+ lezioni |
| **Dettaglio Teoria** | `theory/theory_detail_screen.dart` | Contenuto + traduzioni |
| **Segnali** | `theory/signals_screen.dart` | Griglia segnali |
| **Abbonamento** | `subscription/subscription_plans_screen.dart` | Checkout Stripe |
| **Creator** | `creator/creator_dashboard_screen.dart` | Referral stats |

---

### Dati Attuali

| File | Contenuto |
|------|-----------|
| `quiz.json` | Quiz patente B (~7000 domande) |
| `theory-pdf-lessons.json` | 30 lezioni teoria B |
| `quiz_webpatente_semplice.json` | 14.577 quiz estratti (A,B,C,CE,D,DE,AM) |

---

## 🎯 OBIETTIVO TRASFORMAZIONE

Trasformare l'app da "Patente B" a "Patente Multi-Licenza" con:

1. **Selezione licenza** all'avvio (B, C, CE)
2. **Quiz specifici** per ogni licenza
3. **Teoria separata** per ogni licenza
4. **Progressi distinti** per licenza
5. **Abbonamento unico** che sblocca tutto

---

## 📋 PROMPT COMPLETO PER CURSOR/CLAUDE

Copia questo prompt per eseguire la trasformazione:

```markdown
# TASK: Trasformare App Patente B in App Multi-Licenza

## CONTESTO
Ho un'app Flutter esistente per la patente B. Voglio adattarla per supportare:
- Patente B (auto)
- Patente C (camion)  
- Patente CE (camion + rimorchio)

L'app ha già:
- Sistema quiz Vero/Falso funzionante
- 30 lezioni di teoria
- Autenticazione Firebase
- Abbonamento Stripe (€20/mese)
- Sistema referral creator (30% commissione)
- Traduzioni multi-lingua (IT, EN, Urdu, Punjabi)

## DATI DISPONIBILI
I quiz sono già estratti in: `assets/data/quiz_webpatente_semplice.json`
Formato:
```json
{
  "id": 1,
  "domanda": "Il segnale raffigurato...",
  "risposta": true,
  "argomento": "Segnali di pericolo",
  "capitolo": 22,
  "figura": 104,
  "licenze": ["A", "B"]  // o ["C", "CE"]
}
```

## MODIFICHE RICHIESTE

### 1. SELEZIONE LICENZA (Nuova Schermata)

Crea `screens/license_selection_screen.dart`:
- 3 card per scegliere: B, C, CE
- Icone appropriate (auto, camion, camion+rimorchio)  
- Salva scelta in SharedPreferences
- Mostra al primo avvio o in Settings

Design:
- Stile Duolingo con card colorate
- Animazioni hero transition
- Gradiente viola/blu come tema esistente

### 2. MODIFICA COURSE SERVICE

Aggiorna `services/course_service.dart`:
- Aggiungi enum `LicenseType { b, c, ce }`
- Nuovo getter `currentLicense`
- Metodo `selectLicense(LicenseType)`
- Carica quiz/teoria in base alla licenza

### 3. FILTRAGGIO QUIZ

Modifica `services/quiz_service.dart`:
- Carica `quiz_webpatente_semplice.json`
- Filtra per `licenze.contains(currentLicense)`
- Mantieni logica argomenti esistente

Esempio filtro:
```dart
List<QuizQuestion> getQuizForLicense(String license) {
  return allQuiz.where((q) => 
    q.licenze.contains(license.toUpperCase())
  ).toList();
}
```

### 4. TEORIA PER LICENZA

La teoria patente C/CE ha argomenti aggiuntivi:
- Tachigrafo
- Tempi di guida e riposo
- Trasporto merci pericolose (ADR)
- Caratteristiche tecniche veicoli pesanti
- Normativa trasporto merci

Crea `assets/data/theory_c_ce.json` con questi argomenti.
Modifica `services/theory_service.dart` per caricare in base a licenza.

### 5. MODIFICA DASHBOARD

In `dashboard_screen.dart`:
- Mostra badge licenza selezionata (es. "PATENTE C")
- Mostra statistiche separate per licenza
- Aggiungi pulsante per cambiare licenza

### 6. MODIFICA MODELLI

Aggiorna `models/quiz_question.dart`:
```dart
class QuizQuestion {
  final int id;
  final String domanda;
  final bool risposta;
  final String argomento;
  final int? capitolo;
  final int? figura;
  final List<String> licenze; // NUOVO
  
  // ...
}
```

### 7. STATISTICHE PER LICENZA

Modifica `services/stats_service.dart`:
- Salva statistiche separate: `stats_b`, `stats_c`, `stats_ce`
- Mostra progressi per licenza corrente
- Grafico comparativo in Stats screen

### 8. UI CHANGES

#### topic_selection_screen.dart
- Mostra solo argomenti della licenza selezionata
- Badge colorato licenza in header

#### quiz_screen.dart  
- Nessuna modifica logica (quiz già funziona)
- Aggiorna titolo: "Quiz Patente [X]"

#### results_screen.dart
- Mostra quale licenza è stata esaminata
- Suggerimento argomenti da ripassare

### 9. ABBONAMENTO

L'abbonamento Premium sblocca TUTTE le licenze.
In `subscription_plans_screen.dart`:
- Testo: "Sblocca Quiz illimitati per TUTTE le patenti"
- Lista: "✓ Patente B, ✓ Patente C, ✓ Patente CE"

### 10. NAVIGAZIONE

Flusso app aggiornato:
1. SplashScreen → auto-login check
2. Se non loggato → LoginScreen
3. Se loggato ma nessuna licenza → LicenseSelectionScreen
4. Se licenza scelta → MainNavigationScreen (Dashboard)

## STILE UI

Mantieni lo stile esistente:
- Dark theme con gradiente viola/blu
- Font: Google Fonts (Inter/Poppins)
- Card con border-radius 16px
- Animazioni fluide
- Accessibilità: touch target min 48dp

## PRIORITÀ IMPLEMENTAZIONE

1. ⚡ LicenseSelectionScreen
2. ⚡ CourseService con LicenseType
3. ⚡ QuizService filtrato per licenza
4. 📚 Teoria C/CE (può essere placeholder iniziale)
5. 📊 Stats per licenza
6. 🎨 UI polish

## FILE DA MODIFICARE

1. `lib/main.dart` - Aggiungi LicenseSelectionScreen al flusso
2. `lib/services/course_service.dart` - Aggiungi gestione licenza
3. `lib/services/quiz_service.dart` - Filtra quiz per licenza
4. `lib/services/theory_service.dart` - Carica teoria per licenza
5. `lib/services/stats_service.dart` - Stats separate
6. `lib/models/quiz_question.dart` - Aggiungi campo licenze
7. `lib/screens/dashboard_screen.dart` - Mostra licenza corrente
8. `lib/screens/quiz/topic_selection_screen.dart` - Filtra argomenti

## FILE DA CREARE

1. `lib/screens/license_selection_screen.dart`
2. `assets/data/theory_c.json`
3. `assets/data/theory_ce.json`

## TEST

Dopo le modifiche:
1. Avvia app → deve mostrare selezione licenza
2. Seleziona "C" → dashboard mostra "Patente C"
3. Vai in Quiz → mostra solo argomenti C
4. Rispondi → statistiche salvate per C
5. Cambia a "B" → quiz/stats diverse
6. Abbonati → tutte le licenze sbloccate
```

---

## 🎨 DESIGN REFERENCE

### License Selection Screen

```
┌─────────────────────────────────┐
│                                 │
│     🚗 Scegli la tua Patente    │
│                                 │
│  ┌─────────────────────────┐    │
│  │     🚙                  │    │
│  │     PATENTE B           │    │
│  │     Auto fino a 3.5t    │    │
│  │     ✓ 7.194 quiz        │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │     🚛                  │    │
│  │     PATENTE C           │    │
│  │     Camion              │    │
│  │     ✓ 3.493 quiz        │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │     🚚                  │    │
│  │     PATENTE CE          │    │
│  │     Camion + Rimorchio  │    │
│  │     (richiede C)        │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### Dashboard con Badge Licenza

```
┌─────────────────────────────────┐
│  PATENTE C  📊 45%              │
│  ───────────────────────        │
│                                 │
│  ┌─────────┐  ┌─────────┐       │
│  │  QUIZ   │  │ TEORIA  │       │
│  │  287/   │  │  15/30  │       │
│  │  3493   │  │ lezioni │       │
│  └─────────┘  └─────────┘       │
│                                 │
│  [ Cambia Licenza ]             │
│                                 │
└─────────────────────────────────┘
```

---

## 📊 STATISTICHE QUIZ DISPONIBILI

| Licenza | Quiz Totali | Argomenti |
|---------|-------------|-----------|
| A, B | 7.194 | 61 |
| A, B (rev) | 1.828 | 30 |
| AM | 2.062 | - |
| C1, C1E | 3.493 | 10 |
| **Totale** | **14.577** | |

---

## ⚠️ NOTE IMPORTANTI

1. **Licenza WEBpatente**: I quiz sono per uso personale. Per app commerciale contattare rmastri.it

2. **Teoria C/CE**: I contenuti teoria per patenti superiori NON sono inclusi nel PDF estratto. Dovrai:
   - Creare contenuti originali
   - Acquistare licenza da editore
   - Usare contenuti liberi dal Codice della Strada

3. **Immagini**: Le 620 immagini in `webpatente_extracted/assets/mobi/immagini/` sono segnali stradali, molti sono comuni a tutte le patenti.

---

## 🚀 COMANDI PER INIZIARE

```bash
# 1. Apri progetto
cd /Users/kmrnnwr/PATENTE-B-2.0-2/patente_b_flutter

# 2. Assicurati dipendenze
flutter pub get

# 3. Avvia in debug
flutter run -d chrome

# 4. Usa il prompt sopra in Cursor/Claude per implementare
```

---

Documento creato: 2024-12-26
Versione: 1.0
