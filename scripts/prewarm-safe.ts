import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['en', 'ur', 'hi', 'pa'];
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translate(text: string, targetLang: string): Promise<string | null> {
  try {
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'it', target: targetLang })
    });
    
    if (res.status === 429) {
      console.log(`⏳ Rate limit, aspetto 10sec...`);
      await sleep(10000);
      return translate(text, targetLang); // Retry
    }
    
    if (!res.ok) return null;
    return (await res.json()).translatedText;
  } catch (e) {
    console.error(`❌ Errore fetch:`, e.message);
    return null;
  }
}

async function main() {
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  console.log(`🔥 PREWARM SAFE MODE (5127 parole × 4 lingue = 20.508 traduzioni)`);
  console.log(`⏱️  Rate: 1 richiesta ogni 2 secondi (SUPER LENTO ma SICURO)`);
  console.log(`🕐 Tempo stimato: ~11.5 ore (overnight OK)\n`);
  console.log(`📍 Inizio: ${new Date().toLocaleTimeString()}\n`);
  
  const results: any[] = [];
  let count = 0;
  let skipped = 0;
  const start = Date.now();
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    for (const lang of LANGUAGES) {
      const translation = await translate(word, lang);
      
      if (translation) {
        results.push({ word, lang, translation });
        count++;
      } else {
        skipped++;
      }
      
      if ((count + skipped) % 100 === 0) {
        const elapsed = ((Date.now() - start) / 1000 / 3600).toFixed(2);
        const eta = ((parseFloat(elapsed) / (count + skipped)) * (words.length * 4) - parseFloat(elapsed)).toFixed(1);
        const pct = (((count + skipped) / (words.length * 4)) * 100).toFixed(1);
        console.log(`✅ ${count}/${words.length * 4} (${pct}%) - ${elapsed}h elapsed - ETA: ${eta}h - ${new Date().toLocaleTimeString()}`);
      }
      
      // LENTO ma SICURO: 2 secondi tra richieste
      await sleep(2000);
    }
  }
  
  const elapsed = ((Date.now() - start) / 1000 / 3600).toFixed(2);
  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Traduzioni: ${count}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`⏱️  Tempo totale: ${elapsed}h`);
  console.log(`📌 Fine: ${new Date().toLocaleTimeString()}\n`);
  
  const out = path.join(__dirname, '../src/data/prewarm-complete.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${out}`);
  console.log(`📄 Record: ${results.length}`);
}

main().catch(console.error);
