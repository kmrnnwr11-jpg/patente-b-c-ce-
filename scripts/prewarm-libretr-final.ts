import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['en', 'ur', 'hi', 'pa'];
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translate(text: string, targetLang: string): Promise<string> {
  const res = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'it', target: targetLang })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).translatedText;
}

async function main() {
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  console.log(`🔥 Prewarm LibreTranslate (TUTTE 5127 parole × 4 lingue)\n`);
  
  const results: any[] = [];
  let count = 0;
  const start = Date.now();
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    for (const lang of LANGUAGES) {
      try {
        const translation = await translate(word, lang);
        results.push({ word, lang, translation });
        count++;
        
        if (count % 100 === 0) {
          const elapsed = ((Date.now() - start) / 1000).toFixed(1);
          const eta = ((parseFloat(elapsed) / count) * (words.length * 4)).toFixed(0);
          console.log(`✅ ${count}/${words.length * 4} (${((count / (words.length * 4)) * 100).toFixed(1)}%) - ETA: ${eta}s`);
        }
        
        // 2 req/sec
        await sleep(500);
      } catch (e) {
        console.error(`❌ ${word}-${lang}:`, e.message);
      }
    }
  }
  
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Traduzioni generate: ${count}/${words.length * 4}`);
  console.log(`⏱️  Tempo: ${elapsed}s (~${(parseFloat(elapsed) / 3600).toFixed(2)}h)`);
  console.log(`📈 Media: ${(parseFloat(elapsed) / count).toFixed(2)}s/traduzione\n`);
  
  const out = path.join(__dirname, '../src/data/prewarm-complete.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${out}`);
  console.log(`📄 Record: ${results.length}`);
}

main().catch(console.error);
