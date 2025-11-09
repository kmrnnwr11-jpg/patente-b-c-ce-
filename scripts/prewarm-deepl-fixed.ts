import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPL_KEY = '6a02d432-5d74-4869-8ac0-08e8490835e2:fx';
const LANGUAGES = ['en', 'ur', 'hi', 'pa'];
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translateDeepL(text: string, targetLang: string): Promise<string | null> {
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}` },
    body: new URLSearchParams({
      'text': text,
      'source_lang': 'IT',
      'target_lang': targetLang.toUpperCase(),
      'format': 'text'
    })
  });
  
  if (res.status === 429) throw new Error('RATE_LIMIT'); // Retry later
  if (res.status === 400) return null; // Skip bad requests
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
  const data = await res.json();
  return data.translations[0].text;
}

async function main() {
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  console.log(`🔥 Prewarm DeepL FIXED (prime 50 parole × 4 lingue = 200 traduzioni)`);
  console.log(`⏱️  Delay: 1.2 sec/richiesta (rate limiting)\n`);
  
  const results: any[] = [];
  let count = 0;
  let skipped = 0;
  const start = Date.now();
  
  for (const word of words.slice(0, 50)) {
    for (const lang of LANGUAGES) {
      let retries = 0;
      
      while (retries < 3) {
        try {
          const translation = await translateDeepL(word, lang);
          
          if (translation === null) {
            skipped++;
            break; // Skip this word-lang combo
          }
          
          results.push({ word, lang, translation });
          count++;
          
          if (count % 10 === 0) {
            const elapsed = ((Date.now() - start) / 1000).toFixed(1);
            console.log(`✅ ${count}/200 (${skipped} skipped) - ${elapsed}s`);
          }
          
          // IMPORTANTE: Delay 1.2 sec tra richieste
          await sleep(1200);
          break;
          
        } catch (e) {
          if (e.message === 'RATE_LIMIT') {
            console.warn(`⏳ Rate limit hit, aspetto 5sec...`);
            await sleep(5000);
            retries++;
          } else {
            console.error(`❌ ${word}-${lang}: ${e.message}`);
            break;
          }
        }
      }
    }
  }
  
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Traduzioni: ${count}`);
  console.log(`⏭️  Skipped (HTTP 400): ${skipped}`);
  console.log(`⏱️  Tempo totale: ${elapsed}s`);
  console.log(`📈 Media: ${(parseFloat(elapsed) / (count + skipped)).toFixed(1)}s/richiesta\n`);
  
  const out = path.join(__dirname, '../src/data/prewarm-fixed.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${out}\n`);
}

main().catch(console.error);
