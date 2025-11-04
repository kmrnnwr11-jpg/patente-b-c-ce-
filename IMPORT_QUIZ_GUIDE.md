# 📥 GUIDA IMPORTAZIONE QUIZ PATENTE B

## 🎯 Obiettivo

Importare il dataset completo di 7139 domande ministeriali + 3983 immagini da GitHub nel progetto.

---

## ⚡ METODO 1: Automatico (CONSIGLIATO)

### Step 1: Esegui Script Import

Nel terminale, dalla root del progetto:

```bash
npm run import-quiz
```

### Cosa Fa lo Script

1. ✅ Scarica `quizPatenteB2023.json` da GitHub
2. ✅ Processa e normalizza i dati
3. ✅ Salva `src/data/quiz.json` (versione processata)
4. ✅ Salva `src/data/quiz-raw.json` (backup originale)
5. ⚠️ **Mostra istruzioni per scaricare immagini** (vedi Step 2)

### Step 2: Scarica Immagini Manualmente

Le immagini vanno scaricate manualmente da GitHub:

**Opzione A - Download ZIP**:
1. Vai su: https://github.com/Ed0ardo/QuizPatenteB
2. Clicca bottone verde "Code" → "Download ZIP"
3. Estrai il file ZIP
4. Copia **tutta** la cartella `img_sign/` in `public/images/quiz/`

**Opzione B - Git Clone**:
```bash
# Clone temporaneo
git clone https://github.com/Ed0ardo/QuizPatenteB.git temp_quiz

# Copia immagini
cp -r temp_quiz/img_sign/* public/images/quiz/

# Rimuovi temp
rm -rf temp_quiz
```

### Step 3: Verifica Installazione

```bash
# Verifica JSON
ls -lh src/data/quiz.json
# Dovrebbe mostrare ~2.5MB

# Conta immagini
ls public/images/quiz/ | wc -l
# Dovrebbe mostrare ~3983

# Avvia server
npm run dev

# Vai su http://localhost:5173/test-quiz
```

---

## 🛠️ METODO 2: Manuale Completo

Se lo script automatico non funziona:

### Step 1: Scarica Repository

```bash
# Download ZIP
curl -L https://github.com/Ed0ardo/QuizPatenteB/archive/refs/heads/main.zip -o quiz.zip

# Estrai
unzip quiz.zip
```

### Step 2: Copia File

```bash
# Crea cartelle
mkdir -p src/data
mkdir -p public/images/quiz

# Copia JSON
cp QuizPatenteB-main/quizPatenteB2023.json src/data/quiz.json

# Copia immagini
cp QuizPatenteB-main/img_sign/* public/images/quiz/

# Cleanup
rm -rf QuizPatenteB-main quiz.zip
```

### Step 3: Verifica Formato JSON

Il file `quiz.json` deve avere questa struttura:

```json
[
  {
    "id": 1,
    "domanda": "Il segnale raffigurato...",
    "risposta": true,
    "immagine": "/images/quiz/P1.png",
    "argomento": "Segnali di pericolo",
    "difficulty": "medium"
  }
]
```

Se il formato è diverso, esegui lo script di normalizzazione:

```bash
npm run import-quiz
```

---

## 🧪 Testing

### Test Componente QuizTest

1. Avvia server: `npm run dev`
2. Vai su: **http://localhost:5173/test-quiz**
3. Verifica:
   - ✅ Statistiche mostrano 7139 domande
   - ✅ Immagini si caricano correttamente
   - ✅ Navigazione funziona
   - ✅ Risposta corretta viene mostrata

### Test da Console

```bash
# Test caricamento
node -e "const q = require('./src/data/quiz.json'); console.log('Domande:', q.length);"

# Test primo elemento
node -e "const q = require('./src/data/quiz.json'); console.log(JSON.stringify(q[0], null, 2));"
```

### Test in Browser Console

Apri DevTools (`F12`) e esegui:

```javascript
// Test import
import('./src/lib/quizLoader.js').then(async (module) => {
  const stats = await module.getQuizStats();
  console.table(stats);
  
  const quiz = await module.generateExamQuiz();
  console.log('Quiz generato:', quiz.length, 'domande');
});
```

---

## 📊 Struttura Dati Attesa

### quiz.json
- **Dimensione**: ~2.5 MB
- **Domande**: 7139
- **Formato**: Array di oggetti QuizQuestion

### Immagini
- **Cartella**: `public/images/quiz/`
- **Totale**: ~3983 file PNG
- **Dimensione**: ~150 MB totali
- **Naming**: P1.png, P2.png, ... (segnali), I1.png, I2.png, ... (altro)

---

## ❓ Troubleshooting

### Problema: Script npm run import-quiz fallisce

**Causa**: Connessione GitHub o Node.js non installato

**Soluzione**:
```bash
# Verifica Node.js
node --version
npm --version

# Prova download manuale (METODO 2)
```

### Problema: Immagini non si caricano in /test-quiz

**Causa**: Immagini non copiate o path errato

**Soluzione**:
```bash
# Verifica cartella esiste
ls public/images/quiz/

# Se vuota, scarica da GitHub manualmente
# Vedi METODO 1 - Step 2
```

### Problema: JSON non carica in app

**Causa**: Formato non valido o file mancante

**Soluzione**:
```bash
# Verifica file esiste
cat src/data/quiz.json | head -n 20

# Valida JSON
node -e "JSON.parse(require('fs').readFileSync('src/data/quiz.json'))"

# Se errore, esegui script normalizzazione
npm run import-quiz
```

### Problema: "Quiz data non è un array"

**Causa**: JSON non processato correttamente

**Soluzione**:
```bash
# Re-esegui import
npm run import-quiz

# Oppure controlla src/lib/quizLoader.ts
# Verifica che il fallback import funzioni
```

---

## 📈 Statistiche Attese

Dopo l'importazione corretta:

```
✓ Totale domande:        7139
✓ Domande con immagine:  3983
✓ Domande solo testo:    3156
✓ Argomenti unici:       25
✓ Difficoltà easy:       ~2000
✓ Difficoltà medium:     ~4000
✓ Difficoltà hard:       ~1000
```

Argomenti (25):
1. Definizioni stradali e di traffico
2. Segnali di pericolo
3. Segnali di divieto
4. Segnali di obbligo
5. Segnali di precedenza
... (altri 20)

---

## ✅ Checklist Completamento

Prima di procedere con lo sviluppo, verifica:

- [ ] File `src/data/quiz.json` esiste (~2.5MB)
- [ ] File `src/data/quiz-raw.json` esiste (backup)
- [ ] Cartella `public/images/quiz/` contiene ~3983 immagini
- [ ] `npm run dev` avvia senza errori
- [ ] http://localhost:5173/test-quiz funziona
- [ ] Immagini si caricano correttamente
- [ ] Console browser senza errori
- [ ] Statistiche mostrano 7139 domande

---

## 🚀 Prossimi Step

Dopo importazione completata:

1. ✅ Rimuovi componente `QuizTest` (era solo per testing)
2. 🔜 Implementa `QuizContainer.tsx` per quiz vero (FASE 4)
3. 🔜 Integra con Firebase per salvare attempts
4. 🔜 Aggiungi Service Worker cache per immagini

---

## 📞 Supporto

Se hai problemi:
1. Verifica Node.js installato: `node --version`
2. Leggi errori in console browser (DevTools → Console)
3. Controlla file esistono: `ls src/data/` e `ls public/images/quiz/`
4. Re-scarica repository GitHub manualmente

---

**Una volta completata l'importazione, sei pronto per FASE 4: Quiz System! 🎉**

