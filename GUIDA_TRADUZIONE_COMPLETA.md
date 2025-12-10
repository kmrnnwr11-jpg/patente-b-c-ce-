# 🌍 Guida Completa Traduzione Parola-per-Parola

## ✅ Cosa è stato implementato

Ho integrato il sistema di **traduzione parola-per-parola** sia per **Quiz** che per **Teoria**:

### 📝 Quiz (QuizPage20.tsx)
- ✅ Ogni parola della domanda è cliccabile
- ✅ Click → popup con traduzione + audio + fonetica
- ✅ Usa `InteractiveQuizText` component
- ✅ Gestisce lingua con `useQuizTranslation` hook

### 📚 Teoria (SignalsTheoryPage.tsx)
- ✅ Ogni parola in descrizione/comportamento è cliccabile
- ✅ Click → popup con traduzione
- ✅ Usa `InteractiveTheoryText` component
- ✅ Gestisce lingua con `useTheoryTranslation` hook

### 🔧 Servizi Backend
- ✅ `getTheoryTranslation()` in `googleTranslateService.ts`
- ✅ Cache locale (localStorage) per traduzioni
- ✅ Supporto Google Translate API
- ✅ Fallback automatico se API non disponibile

---

## 🚀 Come Usare il Sistema

### 1️⃣ Configura la tua API Key

**Passo 1**: Crea il file `.env` dalla root del progetto:

```bash
cp .env.example .env
```

**Passo 2**: Apri `.env` e inserisci la tua **Google Translate API Key**:

```env
VITE_GOOGLE_TRANSLATE_API_KEY=AIza_LA_TUA_CHIAVE_QUI
```

**Come ottenere la key**:
1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto (o usa uno esistente)
3. Abilita "Cloud Translation API"
4. Vai in "Credenziali" → "Crea credenziali" → "API Key"
5. Copia la key nel file `.env`

**Passo 3**: Riavvia il server di sviluppo:

```bash
npm run dev
```

---

### 2️⃣ Come Funziona per l'Utente

#### **Nel Quiz**:
1. Vai in una pagina quiz (es. `/quiz/20`)
2. Attiva traduzione dal selettore lingua (in alto)
3. **Clicca su qualsiasi parola** della domanda
4. Vedi popup con:
   - 📝 Traduzione
   - 🔊 Audio (se disponibile)
   - 📖 Traslitterazione fonetica (lingue non-latine)

#### **Nella Teoria**:
1. Vai in una pagina teoria (es. `/theory/segnali`)
2. Il sistema usa `useTheoryTranslation` hook
3. **Clicca su qualsiasi parola** in:
   - Descrizione capitolo
   - Sezioni
   - Descrizione segnali
   - Comportamento da tenere
4. Vedi popup con traduzione istantanea

---

### 3️⃣ Logica di Traduzione (Priority)

Il sistema cerca traduzioni in questo ordine:

**Quiz** (`quickTranslate`):
1. 🎯 **Mappatura da domanda tradotta** (istantanea, già pre-tradotta)
2. 📚 **Dizionario parole comuni** (in memoria)
3. 🔥 **Cache Firebase** (traduzioni già viste)
4. 🌐 **Google Translate API** (se configurata)
5. ⚡ **LibreTranslate** (fallback gratuito)

**Teoria** (`getOrCreateWordAssets`):
1. 📦 **Cache locale** (Zustand + localStorage)
2. 🔥 **Firebase cache**
3. 🌐 **Google Translate API** (se configurata)
4. 📝 **Testo originale** (se niente funziona)

---

## 🔍 Verifica Installazione

### Test 1: Controlla che le chiavi siano caricate

Apri la **console del browser** (F12) e scrivi:

```javascript
console.log(import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY)
```

Dovresti vedere la tua API key (o `undefined` se non configurata).

### Test 2: Prova traduzione quiz

1. Vai su `/quiz/20`
2. Clicca su una parola della domanda
3. Nella console vedi:
   ```
   🔍 === INIZIO quickTranslate ===
   ✅ MAPPATURA DA DOMANDA TRADOTTA: "parola" → "word"
   ```

### Test 3: Prova traduzione teoria

1. Vai su `/theory/segnali`
2. Clicca su una parola in una descrizione
3. Nella console vedi:
   ```
   🔍 Richiesta traduzione per: "parola" → en
   ✅ Traduzione completata: {...}
   ```

---

## 🎨 Personalizzazione

### Cambiare lingue disponibili

**Quiz**: modifica `src/hooks/useQuizTranslation.ts`
**Teoria**: modifica `src/hooks/useTheoryTranslation.ts`

Aggiungi lingue in `src/lib/constants.ts`:

```typescript
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  // Aggiungi qui altre lingue...
];
```

### Modificare lo stile del popup

Il popup usa **React Portal** con z-index massimo.

**Quiz**: vedi `src/components/quiz/InteractiveQuizText.tsx` (linea 145+)
**Teoria**: vedi `src/components/theory/InteractiveTheoryText.tsx`

Puoi modificare:
- Colori (`bg-gradient-to-br`, `border-purple-500`)
- Dimensioni (`max-w-md`, `p-6`)
- Posizione (`top-1/2 left-1/2`)

---

## 📊 Performance e Costi

### Cache & Ottimizzazione

- ✅ **Cache locale**: traduzioni salvate in `localStorage`
- ✅ **Firebase cache**: traduzioni condivise tra utenti
- ✅ **Prewarm**: puoi pre-tradurre parole comuni (vedi `scripts/prewarm-*`)

### Costi API Google

- 💰 **$20 gratis/mese** (primo anno Google Cloud)
- 💰 **$20 per 1M caratteri** dopo il free tier
- 📉 Una parola media = 5 caratteri
- 📉 200,000 parole = $1 circa

**Tip**: Usa il prewarm per le parole più comuni (gratis):

```bash
npm run prewarm  # Pre-traduce top 1000 parole
```

---

## 🐛 Troubleshooting

### Problema: "Traduzione non disponibile"

**Causa**: API key mancante o non valida

**Soluzione**:
1. Verifica `.env` contiene `VITE_GOOGLE_TRANSLATE_API_KEY`
2. Riavvia `npm run dev`
3. Controlla console per errori API

### Problema: Popup non visibile

**Causa**: z-index basso o posizionamento errato

**Soluzione**:
1. Il popup usa `z-index: 9999999` (massimo)
2. Controlla se un altro elemento ha z-index superiore
3. Vedi memorie progetto: "Translation Popup Visibility Style"

### Problema: Traduzione lenta

**Causa**: API esterne impiegano 1-2 secondi

**Soluzione**:
1. Prima traduzione: lenta (API call)
2. Successive: istantanea (cache)
3. Usa prewarm per pre-caricare traduzioni comuni

---

## 📚 File Modificati

### Nuovi/Modificati:
- ✅ `src/lib/googleTranslateService.ts` → aggiunta `getTheoryTranslation()`
- ✅ `src/pages/SignalsTheoryPage.tsx` → integrazione `InteractiveTheoryText`
- ✅ `.env.example` → template configurazione

### Già Esistenti (utilizzati):
- ✅ `src/components/quiz/InteractiveQuizText.tsx`
- ✅ `src/components/theory/InteractiveTheoryText.tsx`
- ✅ `src/lib/quickTranslation.ts`
- ✅ `src/lib/wordTranslation.ts`
- ✅ `src/lib/wordAssets.ts`
- ✅ `src/hooks/useQuizTranslation.ts`
- ✅ `src/hooks/useTheoryTranslation.ts`

---

## 🎯 Prossimi Passi (Opzionali)

1. **Prewarm traduzioni**: esegui `npm run prewarm` per pre-tradurre top 1000 parole
2. **Espandi lingue**: aggiungi altre lingue in `constants.ts`
3. **Audio multilingua**: integra Google Text-to-Speech per audio tradotto
4. **Offline mode**: usa IndexedDB per cache più grande

---

## 🆘 Supporto

Se hai problemi:
1. Controlla la console browser (F12)
2. Verifica `.env` configurato correttamente
3. Riavvia `npm run dev`
4. Consulta i log nella console

---

## ✨ Fatto!

Il sistema è **pronto all'uso**. Configura la tua API key e inizia a tradurre! 🚀
