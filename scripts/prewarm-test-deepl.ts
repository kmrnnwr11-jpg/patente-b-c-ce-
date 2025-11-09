import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPL_KEY = '6a02d432-5d74-4869-8ac0-08e8490835e2:fx';
const LANGUAGES = ['en', 'ur', 'hi', 'pa'];
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translateDeepL(text: string, targetLang: string): Promise<string> {
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
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.translations[0].text;
}

async function main() {
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  console.log(`🔥 Test Prewarm DeepL (prime 100 parole × 4 lingue = 400 traduzioni)\n`);
  
  const results: any[] = [];
  let count = 0;
  let errors = 0;
  const start = Date.now();
  
  for (const word of words.slice(0, 100)) {
    for (const lang of LANGUAGES) {
      try {
        const translation = await translateDeepL(word, lang);
        results.push({ word, lang, translation });
        count++;
        
        if (count % 50 === 0) {
          const elapsed = ((Date.now() - start) / 1000).toFixed(1);
          console.log(`✅ ${count}/400 traduzioni (${elapsed}s) - ${errors} errori`);
        }
        
        await sleep(300); // ~3 req/sec
      } catch (e) {
        errors++;
        console.error(`❌ ${word}-${lang}: ${e.message}`);
      }
    }
  }
  
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ COMPLETATO! ${count} traduzioni in ${elapsed}s (${errors} errori)`);
  
  const out = path.join(__dirname, '../src/data/prewarm-test-deepl.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${out}`);
  console.log(`📊 Successo: ${((count / 400) * 100).toFixed(1)}%\n`);
}

main().catch(console.error);
