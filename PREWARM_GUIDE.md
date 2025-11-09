# 🔥 Guida Prewarm: Genera Cache Completa Traduzioni

## 📋 Problema
- Attualmente: Solo 30 parole nel dizionario locale
- Altre 5097 parole richiedono API call in tempo reale
- **Risultato**: Traduzione lenta (2-5 secondi per parola)

## ✅ Soluzione: Prewarm Cache
Genera traduzioni per TUTTE le 5127 parole una sola volta, poi usi cache (istantaneo).

---

## 🚀 **Opzione 1: LibreTranslate (CONSIGLIATO - Gratuito)**

**Vantaggi:**
- ✅ 100% gratuito
- ✅ Zero setup (API pubblica)
- ✅ Nessuna chiave richiesta
- ✅ Sempre disponibile

**Come fare:**

```bash
cd /Users/kmrnnwr/PATENTE-B-2.0

# Step 1: Crea script prewarm con LibreTranslate
cat > scripts/prewarm-libretr.ts << 'EOF'
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function translateWithLibre(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    })
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data.translatedText;
}

async function main() {
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  console.log(`🔥 Prewarm LibreTranslate: ${words.length} parole × 4 lingue`);
  
  const results: any[] = [];
  let count = 0;
  
  for (const word of words.slice(0, 100)) { // Test: prime 100
    for (const lang of ['en', 'ur', 'hi', 'pa']) {
      try {
        const translation = await translateWithLibre(word, 'it', lang);
        results.push({ word, lang, translation });
        count++;
        
        if (count % 20 === 0) console.log(`✅ ${count}/${words.length * 4}`);
        
        // Rate limit: 1 sec tra richieste
        await new Promise(r => setTimeout(r, 1000));
      } catch (e) {
        console.error(`❌ Errore per ${word}:`, e.message);
      }
    }
  }
  
  const output = path.join(__dirname, '../src/data/cache-libretranslate.json');
  fs.writeFileSync(output, JSON.stringify(results, null, 2));
  console.log(`✅ Salvato: ${output}`);
}

main().catch(console.error);
EOF

# Step 2: Esegui prewarm
npx tsx scripts/prewarm-libretr.ts
```

**Tempo stimato**: ~30 minuti per 100 parole di test

---

## 🔑 **Opzione 2: DeepL (Richiede Key Valida)**

Se hai una **key DeepL valida** (dalla sezione Pro/Free):

```bash
# Verifica che la key sia corretta
curl -X POST "https://api-free.deepl.com/v2/translate" \
  -H "Authorization: DeepL-Auth-Key TUA_KEY_QUA" \
  -d "text=hello&source_lang=EN&target_lang=IT"

# Se funziona, esegui:
export VITE_DEEPL_API_KEY="TUA_KEY_QUA"
npm run prewarm:execute
```

---

## 💾 **Step 3: Importa Cache in Firestore**

Una volta generate le traduzioni, importale in Firestore:

### Via Firebase Console (Manuale):
1. Vai su: https://console.firebase.google.com
2. Progetto: `patente-b-2025`
3. Firestore → Collection `word_translations`
4. Import CSV (se disponibile) oppure manuale

### Via Script (Automatico):
```bash
# Importa tutte le traduzioni in Firestore
npm run firebase:import-cache  # (Da implementare)
```

---

## 🎯 **Risultato Finale**

**Prima (Senza Prewarm):**
```
Clicca parola → "Carico..." → 3 secondi → Traduzione
```

**Dopo (Con Cache):**
```
Clicca parola → Istantaneo ⚡ → Traduzione
```

---

## 📊 **Stima Costi**

| Provider | Parole | Costo |
|----------|--------|-------|
| **LibreTranslate** | 5127 | **€0.00** ✅ |
| **DeepL Free** | 5127 | **€0.00** (dentro 500k/mese) |
| **Dopo Prewarm** | TUTTI | **€0.00** (cache = zero API calls) |

---

## 🚀 **Procedura Consigliata (OGGI)**

1. ✅ Usa **LibreTranslate** (gratuito, no setup)
2. ⏳ Genera cache per 100-200 parole di test
3. 📱 Testa su mobile (dovrebbe essere veloce)
4. 🔄 Se ok, genera per TUTTE le 5127 parole overnight

**Timeline:**
- **LibreTranslate 100 parole**: ~30 min
- **LibreTranslate 5127 parole**: ~4-6 ore overnight
- **Risultato**: Traduzioni istantanee forever! ⚡

---

## 📞 Supporto

Se hai problemi:
1. Controlla log nella console
2. Verifica connessione Internet
3. Prova da telefono (stesso WiFi)

