# 🧪 Test Immagini - Guida Rapida

## 🚀 Come Testare il Fix

### 1. **Avviare l'App**
```bash
npm run dev
```
Apri: `http://localhost:5174/`

### 2. **Selezionare la Versione Corretta**
- Vai su **Dashboard**
- Seleziona **"Quiz Ministeriali 2025"** (badge Beta)
- Questo dataset contiene le immagini fissate

### 3. **Avviare un Quiz Rapido**
- Clicca su **"Quiz Rapido"**
- Verifica che le domande 11-20 mostrino l'immagine di un segnale rosso
- L'immagine dovrebbe apparire sotto la domanda

### 4. **Controllare i Dettagli**
- **Prima del Fix**: Immagine non visualizzata (placeholder con "?")
- **Dopo il Fix**: Immagine chiaramente visibile (segnale rosso)

---

## ✅ Checklist Verifica

| Test | Status | Note |
|------|--------|------|
| Immagine si carica | ✅ | Dovrebbe vedersi il segnale dopo 1-2 sec |
| Dark mode | ✅ | Sfondo grigio scuro quando dark mode attivo |
| Mobile responsive | ✅ | Immagine si ridimensiona correttamente |
| Errore fallback | ✅ | Se immagine non carica, appare msg rosso con percorso |
| Lazy loading | ✅ | Immagine carica solo quando visibile |

---

## 🔍 Debug Console

Aprire DevTools (F12) e cercare questi messaggi:

### ✅ Successo
```
(Nessun messaggio di errore in console)
Image loaded successfully
```

### ❌ Errore (se percorso è sbagliato)
```
Errore caricamento immagine: /images/quiz/704.png
```

---

## 📊 Confronto Versioni

### **Quiz Ministeriali 2023** (Classico)
- ✅ 3983 immagini su 7139 domande
- ✅ Dataset completo e stabile
- 🎯 Consigliato per uso principale

### **Quiz Ministeriali 2025** (Beta)
- ✅ 10 immagini su 20 domande (test)
- ⚠️ Dataset in preparazione
- 🔧 Percorsi immagini corretti (FIX APPLICATO)

---

## 🛠️ Troubleshooting

### Immagine non appare
1. **Controlla Console**: F12 → Console (cerca errori)
2. **Verifica percorso**: Dovrebbe essere `/images/quiz/704.png`
3. **Clearing cache**: Svuota cache (Ctrl+Shift+Del)
4. **Reload**: Ricarica pagina (Ctrl+R)

### Schermo bianco
1. Apri console per errori
2. Controlla che dev server sia in esecuzione
3. Prova `npm run dev` di nuovo

---

## 📝 Dettagli Tecnici

**File Modificati**:
- ✅ `src/data/quiz-2025.json` - Percorsi immagini corretti
- ✅ `src/components/quiz/QuestionCard.tsx` - UI fallback migliorata

**Immagini nel Dataset**:
- Tutte le 10 immagini puntano a: `/images/quiz/704.png`
- File esiste in: `/public/images/quiz/704.png` (2.5KB)
- Tipo: PNG (segnale rosso - Spia del liquido di raffreddamento)

---

**Ultima modifica**: 2025-01-08 ✅

