import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || 'your-key-here';
const LANGUAGES = [
  { code: 'en', deepl: 'EN' },
  { code: 'es', deepl: 'ES' },
  { code: 'fr', deepl: 'FR' },
  { code: 'de', deepl: 'DE' }
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface TranslationEntry {
  word: string;
  lang: string;
  translation: string;
}

// Sostituisci l'intera funzione translateWithDeepL con questa versione corretta per v2 API
async function translateWithDeepL(
  text: string,
  targetLang: string,
  retryCount = 0
): Promise<string | null> {
  const maxRetries = 3;
  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        source_lang: 'IT',
        target_lang: targetLang
      })
    });

    if (response.status === 429 || response.status === 500 || !response.ok) {
      const delay = Math.pow(2, retryCount) * 1000; // Backoff esponenziale: 1s, 2s, 4s
      console.log(`⏳ Retry ${retryCount + 1}/${maxRetries} per ${text} (${targetLang}), delay ${delay}ms...`);
      await sleep(delay);
      
      if (retryCount < maxRetries) {
        return translateWithDeepL(text, targetLang, retryCount + 1);
      }
      console.error(`❌ Max retry raggiunto per ${text} (${targetLang})`);
      return null;
    }

    const data = await response.json() as { translations: Array<{ text: string }> };
    return data.translations[0]?.text || null;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`⏳ Retry fetch ${retryCount + 1}/${maxRetries}, delay ${delay}ms...`);
      await sleep(delay);
      return translateWithDeepL(text, targetLang, retryCount + 1);
    }
    console.error(`❌ Errore fetch max retry:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function main() {
  // Verifica API key
  if (!DEEPL_API_KEY || DEEPL_API_KEY === 'your-key-here') {
    console.error('❌ DEEPL_API_KEY non configurata. Configura in .env');
    process.exit(1);
  }

  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  
  if (!fs.existsSync(wordsPath)) {
    console.error(`❌ File non trovato: ${wordsPath}`);
    process.exit(1);
  }

  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  console.log(`🔥 PREWARM DEEPL ULTRA`);
  console.log(`📊 Parole: ${words.length}`);
  console.log(`🌍 Lingue: ${LANGUAGES.map(l => l.code).join(', ')}`);
  console.log(`📈 Totale traduzioni: ${words.length * LANGUAGES.length}`);
  console.log(`⏱️  Rate: 1 richiesta ogni 1 secondo`);
  console.log(`🕐 Tempo stimato: ~${Math.ceil(words.length * LANGUAGES.length / 60)} minuti\n`);
  console.log(`📍 Inizio: ${new Date().toLocaleTimeString()}\n`);
  
  const results: TranslationEntry[] = [];
  let successCount = 0;
  let failureCount = 0;
  const startTime = Date.now();
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    for (const lang of LANGUAGES) {
      const translation = await translateWithDeepL(word, lang.deepl);
      
      if (translation) {
        results.push({
          word,
          lang: lang.code,
          translation
        });
        successCount++;
        
        if (successCount % 50 === 0) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const avgRate = (successCount / elapsed).toFixed(2);
          console.log(`✅ ${successCount}/${words.length * LANGUAGES.length} | ${avgRate} trad/sec | Errori: ${failureCount}`);
        }
      } else {
        failureCount++;
      }
      
      // Rate limiting: 1 richiesta al secondo
      await sleep(1500);
    }
  }
  
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  
  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Successi: ${successCount}`);
  console.log(`❌ Fallimenti: ${failureCount}`);
  console.log(`⏱️  Tempo totale: ${elapsedTime}s (${Math.floor(elapsedTime / 60)}min)`);
  
  const outputPath = path.join(__dirname, '../src/data/prewarm-complete.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${outputPath}`);
}

main().catch(e => {
  console.error('❌ Errore fatale:', e);
  process.exit(1);
});

