# 🧪 TEST POPUP SELEZIONE LINGUE

## ✅ Modifiche Applicate

1. **Aggiornato `ClickableText.tsx`** con 4 lingue:
   - 🇬🇧 English
   - 🇮🇳 हिन्दी (Hindi)
   - 🇵🇰 اردو (Urdu)
   - 🇮🇳 ਪੰਜਾਬੀ (Punjabi)

2. **Aggiornato `SignalsTheoryPage.tsx`**:
   - Rimosso vecchio componente locale
   - Integrato nuovo ClickableText con popup
   - Rimosso vecchio WordTranslationModal

## 🎯 Come Testare

### Step 1: Avvia il dev server
```bash
npm run dev
```

### Step 2: Naviga alla pagina Segnali
1. Apri browser: `http://localhost:5173`
2. Vai a: **Teoria → Segnali Stradali**
3. Clicca su un capitolo (es. "Segnali di Pericolo")

### Step 3: Testa il popup
1. **Clicca su una parola** nel testo (es. "stop", "pericolo", "strada")
2. Dovresti vedere un **popup con 4 bandiere**:
   ```
   ┌─────────────────────────┐
   │  🇬🇧  🇮🇳  🇵🇰  🇮🇳     │
   │  EN   HI   UR   PA      │
   └─────────────────────────┘
   ```
3. **Clicca su una bandiera** (es. 🇬🇧 English)
4. Dovrebbe apparire un **secondo popup** con la traduzione (se disponibile)

### Step 4: Verifica Console
Apri DevTools (F12) → Console, dovresti vedere:
```
🌐 Mostrando selezione lingua per: "parola"
✅ Traduzione trovata in memoria: "parola" (en) → "word"
```
Oppure:
```
ℹ️ Traduzione non trovata per "parola" in en
```

## 🎨 Come Appare il Popup

### Popup 1: Selezione Lingua
```
┌──────────────────────────────────────┐
│  Seleziona Lingua                    │
│                                      │
│  🇬🇧 English                         │
│  🇮🇳 हिन्दी                          │
│  🇵🇰 اردو                            │
│  🇮🇳 ਪੰਜਾਬੀ                          │
└──────────────────────────────────────┘
```

### Popup 2: Traduzione
```
┌──────────────────────────────────────┐
│  EN                                  │
│  Translation text here...            │
│                                      │
│  ✨ In memoria                       │
└──────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Problema: Popup non appare
**Causa**: ClickableText non renderizza correttamente

**Fix**:
1. Verifica import: `import { ClickableText } from '@/components/translation/ClickableText';`
2. Riavvia dev server: `npm run dev`
3. Controlla console per errori

### Problema: Popup appare ma nessuna traduzione
**Causa**: Traduzioni non caricate in memoria

**Fix**:
1. Verifica console all'avvio: "✅ Traduzioni caricate in memoria"
2. Se non vedi il log, controlla `useLoadTranslationsFromFirebase` in App.tsx
3. Le traduzioni sono in `quizTranslations.ts` (solo ~50 domande)

### Problema: Popup in posizione sbagliata
**Causa**: CSS positioning issue

**Fix**: Il popup usa `position: fixed`, dovrebbe funzionare. Se problemi, controlla z-index.

### Problema: Click non funziona
**Causa**: Event handler non attivo

**Fix**:
1. Verifica che le parole siano sottolineate con puntini (hover)
2. Controlla console per log `🌐 Mostrando selezione lingua`
3. Se niente, controlla che `handleWordClick` sia chiamato

## 📊 Expected Behavior

| Azione | Risultato Atteso |
|--------|------------------|
| Hover su parola | Parola diventa blu, sottolineatura solida |
| Click su parola | Popup con 4 bandiere appare |
| Click su bandiera | Popup scompare, secondo popup con traduzione appare |
| Dopo 3s | Popup traduzione scompare automaticamente |
| Click fuori popup | Popup rimane (per ora, può essere migliorato) |

## ✅ Checklist Test

- [ ] Dev server avviato (`npm run dev`)
- [ ] Navigato a pagina Segnali
- [ ] Hover su parola mostra effetto (blu + sottolineatura)
- [ ] Click su parola mostra popup con 4 bandiere
- [ ] Bandiere corrette: 🇬🇧 🇮🇳 🇵🇰 🇮🇳
- [ ] Nomi lingue corretti: English, हिन्दी, اردو, ਪੰਜਾਬੀ
- [ ] Click su bandiera mostra traduzione (se disponibile)
- [ ] Console mostra log corretti
- [ ] Popup scompare dopo 3s
- [ ] Funziona su mobile (tap invece di click)

## 🎯 Prossimi Step

Se il test funziona:
1. ✅ Popup selezione lingua OK
2. ⏳ Aggiungere traduzioni in memoria per Hindi, Urdu, Punjabi
3. ⏳ Integrare in altri componenti (QuizCard, TheoryPage, etc.)
4. ⏳ Migliorare UI del popup (animazioni, chiusura click fuori)

Se il test NON funziona:
1. Controlla console per errori
2. Verifica che ClickableText sia importato correttamente
3. Controlla che useLoadTranslationsFromFirebase carichi dati
4. Leggi troubleshooting sopra

## 📝 Note Importanti

⚠️ **Traduzioni Disponibili**: Al momento solo ~50 traduzioni in inglese sono pre-caricate da `quizTranslations.ts`. Per Hindi, Urdu, Punjabi dovrai:
- Aggiungere traduzioni manualmente in `quizTranslations.ts`
- Oppure caricarle in Firebase collection `translations`
- Oppure usare API di traduzione on-demand

⚠️ **Performance**: Il popup è istantaneo (0-5ms) solo se la traduzione è in memoria. Altrimenti mostra "Traduzione non disponibile".

⚠️ **Mobile**: Il popup funziona anche su mobile con tap. Testa su dispositivo reale o emulatore.

---

**Data test**: 12 Novembre 2025
**Status**: ✅ Pronto per test
**Componente**: SignalsTheoryPage.tsx
**Popup**: 4 lingue (EN, HI, UR, PA)

