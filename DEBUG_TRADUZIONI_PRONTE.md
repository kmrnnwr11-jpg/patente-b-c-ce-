# 🔧 DEBUG - SISTEMA TRADUZIONI GIÀ PRONTE

## ✅ PROBLEMA RISOLTO

**Problema originale**: Il sistema chiamava API per tradurre ogni parola, anche se le domande erano **GIÀ TRADOTTE** in `questions-en.json`.

## 🎯 SOLUZIONE IMPLEMENTATA

### 1. **Sistema di Mappatura Parola-per-Parola**

Creato `/src/lib/wordMapping.ts` che:
- Carica domande italiane da `quiz.json`
- Carica domande inglesi da `questions-en.json`
- Crea mappatura automatica parola IT → parola EN
- Cache intelligente per performance

**Esempio**:
```typescript
// Domanda IT: "In una carreggiata a doppio senso..."
// Domanda EN: "In a two-way roadway..."

// Mappatura automatica:
"carreggiata" → "roadway"
"doppio" → "two-way"
"senso" → (allineamento automatico)
```

### 2. **Priorità Traduzione Aggiornata**

`quickTranslate()` ora usa 5 livelli (dal più veloce):

1. **⚡⚡⚡ Mappatura da domanda tradotta** (0ms) - **NUOVO!**
   - Se `questionId` disponibile
   - Usa traduzioni già pronte
   - **Nessuna chiamata API**

2. **⚡⚡ Dizionario istantaneo** (0ms)
   - 70+ parole comuni
   - EN, UR, HI, PA

3. **⚡ Cache memoria** (<1ms)
   - Traduzioni recenti

4. **📦 Cache localStorage** (<10ms)
   - Valide 7 giorni

5. **🌐 API** (1-8s) - **ULTIMO RESORT**
   - Solo per parole rare
   - DeepL + LibreTranslate fallback

### 3. **Propagazione questionId**

Modificato chain completo:
```
QuizPage (ha questionId)
  ↓
ClickableText (passa questionId)
  ↓
WordTranslationModal (passa questionId)
  ↓
quickTranslate(word, lang, questionId) ← USA TRADUZIONI PRONTE!
```

## 🧪 COME TESTARE

### 1. Apri Console Browser (F12)

### 2. Vai a una pagina Quiz

Qualsiasi quiz page:
- Quiz 20
- Quiz 30
- Quiz 40
- Quiz Argomento

### 3. Clicca su una parola

Esempio parole da testare:
- **"carreggiata"** (nella domanda 1)
- **"strada"** (comune)
- **"conducente"** (comune)

### 4. Controlla Console

**✅ SE FUNZIONA** vedi:
```
🔍 === INIZIO quickTranslate ===
   Input: "carreggiata" → en (domanda #1)
   Normalizzata: "carreggiata"
   🎯 Cerco nella domanda tradotta #1...
   ⚡⚡⚡ MAPPATURA DA DOMANDA TRADOTTA: "carreggiata" → "roadway"
🏁 === FINE quickTranslate: QUESTION MAPPING ===
```

**❌ SE NON FUNZIONA** vedi:
```
🔍 === INIZIO quickTranslate ===
   Input: "carreggiata" → en
   Normalizzata: "carreggiata"
   Dizionario entry: TROVATA
   ⚡⚡ DIZIONARIO ISTANTANEO [en]: "carreggiata" → "roadway"
```
(Manca `questionId` - va bene lo stesso, ma usa dizionario invece di traduzione completa)

**⚠️ SE CHIAMA API** vedi:
```
   🌐 CHIAMATA API necessaria per: "carreggiata" → en
```
(PROBLEMA: non sta usando né mappatura né dizionario!)

## 📊 PERFORMANCE ATTESA

### Prima (con API):
- **10-30 secondi** per tradurre 4 lingue
- Costo API elevato
- Quota limitata

### Dopo (con mappatura):
- **0-500ms** per 4 lingue ⚡
- **Nessun costo API**
- **Nessuna quota**
- Instant per parole comuni

## 🔧 TROUBLESHOOTING

### Problema: "Mappatura non trovata"

**Console mostra**:
```
   ⚠️ Mappatura non trovata in domanda 1
```

**Causa**: 
- File `questions-en.json` non trovato
- ID domanda non corrisponde
- Allineamento parole fallito

**Fix**:
1. Verifica che `questions-en.json` esista in `src/data/`
2. Verifica che domanda esista in entrambi i file
3. Controlla console per dettagli

### Problema: "questionId undefined"

**Console mostra**:
```
   Input: "parola" → en
```
(Manca `(domanda #123)`)

**Causa**: `questionId` non passato dalla pagina quiz

**Fix**:
1. Verifica che pagina quiz usi `ClickableText`
2. Verifica che passi prop `questionId={currentQuestion.id}`

### Problema: Traduzione sempre in italiano

**Console mostra**:
```
   🔙 Fallback: ritorno parola originale "parola"
```

**Causa**: Tutti i sistemi di traduzione hanno fallito

**Fix**:
1. Controlla connessione internet (per API fallback)
2. Verifica file `questions-en.json` valido
3. Controlla errori in console precedenti

## 📝 PROSSIMI PASSI

### Se tutto funziona:
1. ✅ Traduzioni istantanee per EN
2. 🔄 Estendi ad altre lingue (UR, HI, PA)
   - Crea `questions-ur.json`, `questions-hi.json`, ecc.
   - Aggiorna `wordMapping.ts` per supportarle

### Se non funziona:
1. Leggi questo file
2. Segui troubleshooting
3. Condividi log console completi

## 🎯 RISULTATO FINALE

**OGNI PAROLA** nelle domande quiz tradotta **ISTANTANEAMENTE** in inglese usando le traduzioni già pronte, senza chiamare API!

---

**Data**: 12 Novembre 2025
**Status**: ✅ IMPLEMENTATO - IN TEST

