// Prewarm SUPER ROBUST - Handle all errors + retry
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['en', 'ur', 'hi', 'pa'];
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Salva progress ogni 50 traduzioni (per riprendere se crashato)
const progressFile = path.join(__dirname, '../src/data/prewarm-progress.json');

interface Progress {
  totalProcessed: number;
  totalSuccess: number;
  totalSkipped: number;
  lastWord: string;
  lastLang: string;
  lastUpdate: string;
}

function loadProgress(): Progress {
  try {
    if (fs.existsSync(progressFile)) {
      return JSON.parse(fs.readFileSync(progressFile, 'utf-8'));
    }
  } catch (e) {
    console.log('⚠️ Progress file corrotto, ricominciamo da zero');
  }
  
  return {
    totalProcessed: 0,
    totalSuccess: 0,
    totalSkipped: 0,
    lastWord: '',
    lastLang: '',
    lastUpdate: new Date().toISOString()
  };
}

function saveProgress(progress: Progress) {
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

async function translate(text: string, targetLang: string, retries = 0): Promise<string | null> {
  const MAX_RETRIES = 5;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sec timeout
    
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'it', target: targetLang }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (res.status === 429) {
      if (retries < MAX_RETRIES) {
        const backoff = 1000 * (retries + 1);
        console.log(`⏳ Rate limit (retry ${retries + 1}/${MAX_RETRIES}), aspetto ${backoff}ms...`);
        await sleep(backoff);
        return translate(text, targetLang, retries + 1);
      }
      return null;
    }
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.translatedText || null;
    
  } catch (e) {
    if (retries < MAX_RETRIES) {
      const backoff = 2000 * (retries + 1);
      console.log(`⚠️ Errore (${e.message}), retry ${retries + 1}/${MAX_RETRIES} in ${backoff}ms...`);
      await sleep(backoff);
      return translate(text, targetLang, retries + 1);
    }
    return null;
  }
}

async function main() {
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  
  const progress = loadProgress();
  
  console.log(`🔥 PREWARM ROBUST MODE`);
  console.log(`📊 Riprendendo da: ${progress.totalProcessed} traduzioni (${progress.lastWord} ${progress.lastLang})`);
  console.log(`✅ Successi: ${progress.totalSuccess} | ⏭️ Skipped: ${progress.totalSkipped}\n`);
  
  const results: any[] = [];
  const start = Date.now();
  let count = progress.totalSuccess;
  let skipped = progress.totalSkipped;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    for (const lang of LANGUAGES) {
      try {
        const translation = await translate(word, lang);
        
        if (translation) {
          results.push({ word, lang, translation });
          count++;
        } else {
          skipped++;
        }
        
        progress.totalProcessed++;
        progress.totalSuccess = count;
        progress.totalSkipped = skipped;
        progress.lastWord = word;
        progress.lastLang = lang;
        progress.lastUpdate = new Date().toISOString();
        
        if ((count + skipped) % 50 === 0) {
          saveProgress(progress);
          const elapsed = ((Date.now() - start) / 1000 / 3600).toFixed(2);
          const pct = (((count + skipped) / (words.length * 4)) * 100).toFixed(1);
          const eta = ((parseFloat(elapsed) / (count + skipped)) * (words.length * 4) - parseFloat(elapsed)).toFixed(1);
          console.log(`✅ ${count}/${words.length * 4} (${pct}%) - ${elapsed}h - ETA: ${eta}h - ${new Date().toLocaleTimeString()}`);
        }
        
        // Rate: 2 sec per request (SAFE)
        await sleep(2000);
        
      } catch (e) {
        console.error(`💥 Errore critico: ${e.message}`);
        saveProgress(progress);
        throw e;
      }
    }
  }
  
  // Salva risultati finali
  const out = path.join(__dirname, '../src/data/prewarm-complete.json');
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  
  const elapsed = ((Date.now() - start) / 1000 / 3600).toFixed(2);
  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Traduzioni: ${count}`);
  console.log(`⏭️ Skipped: ${skipped}`);
  console.log(`⏱️ Tempo totale: ${elapsed}h`);
  console.log(`💾 Salvato: ${out}\n`);
  
  // Cleanup
  fs.unlinkSync(progressFile);
  console.log(`🧹 Progress file rimosso (completato)\n`);
}

main().catch(e => {
  console.error('💥 ERRORE CRITICO:', e);
  process.exit(1);
});

