import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['en', 'ur', 'hi', 'pa'];
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translate(text: string, targetLang: string): Promise<string | null> {
  try {
    const langPair = `it|${targetLang}`;
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`);
    
    if (res.status === 429) {
      console.log(`⏳ Rate limit, aspetto 5sec...`);
      await sleep(5000);
      return translate(text, targetLang); // Retry
    }
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.responseData.translatedText || null;
  } catch (e) {
    console.error(`❌ Errore fetch:`, e.message);
    return null;
  }
}

async function main() {
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  console.log(`🔥 PREWARM MYMEMORY ACCELERATO (5127 parole × 4 lingue = 20.508 traduzioni)`);
  console.log(`⏱️  Rate: 1 richiesta ogni 1 secondo (ACCELERATO GRATUITO)`);
  console.log(`🕐 Tempo stimato: ~6 ore\n`);
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
      
      await sleep(1000); // Delay 1s per accelerare
    }
  }
  
  const elapsedTime = Math.floor((Date.now() - start) / 1000);
  
  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Successi: ${count} | Skipped: ${skipped}`);
  console.log(`⏱️  Tempo: ${elapsedTime}s`);
  
  const outputPath = path.join(__dirname, '../src/data/prewarm-complete.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${outputPath}`);
}

main().catch(e => {
  console.error('❌ Errore fatale:', e);
  process.exit(1);
});
