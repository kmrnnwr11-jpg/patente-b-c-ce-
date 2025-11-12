import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['en', 'ur', 'hi', 'pa'];
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translate(text: string, targetLang: string): Promise<string | null> {
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'it', target: targetLang })
    });
    
    if (res.status === 429) {
      console.log(`⏳ Rate limit, aspetto 15sec...`);
      await sleep(15000);
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
  
  console.log(`🔥 PREWARM LIBRE ALT SERVER (5127 parole × 4 lingue = 20.508 traduzioni)`);
  console.log(`⏱️  Rate: 1 richiesta ogni 5 secondi (STABILE con server alternativo)`);
  console.log(`🕐 Tempo stimato: ~14 ore (overnight OK)`);
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
      
      if (count % 50 === 0) {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        console.log(`✅ ${count}/${words.length * LANGUAGES.length} | Skipped: ${skipped}`);
      }
      
      await sleep(5000); // Delay aumentato per stabilità
    }
  }
  
  const elapsedTime = Math.floor((Date.now() - start) / 1000);
  
  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Successi: ${count}`);
  console.log(`❌ Skipped: ${skipped}`);
  console.log(`⏱️  Tempo totale: ${elapsedTime}s`);
  
  const outputPath = path.join(__dirname, '../src/data/prewarm-complete.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${outputPath}`);
}

main().catch(e => {
  console.error('❌ Errore fatale:', e);
  process.exit(1);
});
