// Script ESECUTIVO per prewarm cache traduzioni
// Genera traduzioni per TUTTE le 5127 parole unique
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simula import dinamico per getOrCreateWordAssets
// (In produzione, questo userebbe Firebase + DeepL)

interface TranslationResult {
  word: string;
  lang: string;
  translation: string;
  cached: boolean;
  error?: string;
}

const DEEPL_API_KEY = process.env.VITE_DEEPL_API_KEY;
const TARGET_LANGS = ['en', 'ur', 'hi', 'pa'];

// Rate limiting: max 5 richieste/secondo (DeepL free tier)
const RATE_LIMIT_MS = 250; // 250ms tra richieste = 4/sec

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (!DEEPL_API_KEY) {
    throw new Error('VITE_DEEPL_API_KEY non configurata');
  }

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}` },
    body: new URLSearchParams({
      'text': text,
      'source_lang': sourceLang.toUpperCase(),
      'target_lang': targetLang.toUpperCase(),
      'format': 'text'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepL error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.translations[0].text;
}

async function main() {
  console.log('🔥 PREWARM EXECUTION: Generazione traduzioni complete\n');

  // Carica lista parole
  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));

  console.log(`📊 Parole da tradurre: ${words.length}`);
  console.log(`🌍 Lingue target: ${TARGET_LANGS.join(', ')}`);
  console.log(`🎯 Operazioni totali: ${words.length * TARGET_LANGS.length}\n`);

  if (!DEEPL_API_KEY) {
    console.error('❌ ERRORE: VITE_DEEPL_API_KEY non configurata!');
    console.log('\n📋 Configura la key:');
    console.log('   export VITE_DEEPL_API_KEY="tua_key_deepl"\n');
    process.exit(1);
  }

  const results: TranslationResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  let cachedCount = 0;

  const startTime = Date.now();

  console.log('🚀 INIZIO PREWARM...\n');

  // Processa in batch (10 parole alla volta per non sovraccaricare)
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (word, batchIndex) => {
      const wordIndex = i + batchIndex;
      
      for (const lang of TARGET_LANGS) {
        try {
          // Rate limiting
          await sleep(RATE_LIMIT_MS);

          const translation = await translateWithDeepL(word, 'it', lang);
          
          results.push({
            word,
            lang,
            translation,
            cached: false
          });

          successCount++;
          
          // Log progress ogni 50 traduzioni
          if (successCount % 50 === 0) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const progress = ((successCount / (words.length * TARGET_LANGS.length)) * 100).toFixed(1);
            console.log(`✅ ${successCount}/${words.length * TARGET_LANGS.length} (${progress}%) - ${elapsed}s elapsed`);
          }

        } catch (error) {
          errorCount++;
          results.push({
            word,
            lang,
            translation: word,
            cached: false,
            error: error.message
          });

          if (errorCount % 10 === 0) {
            console.warn(`⚠️  ${errorCount} errori finora (continuando...)`);
          }
        }
      }
    });

    await Promise.all(batchPromises);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n✅ PREWARM COMPLETATO!\n');
  console.log(`📊 Statistiche:`);
  console.log(`   - Successi: ${successCount}`);
  console.log(`   - Errori: ${errorCount}`);
  console.log(`   - Tempo totale: ${totalTime}s`);
  console.log(`   - Media: ${(parseFloat(totalTime) / successCount).toFixed(2)}s per traduzione\n`);

  // Salva risultati
  const outputPath = path.join(__dirname, '../src/data/prewarm-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 Risultati salvati in: ${outputPath}\n`);

  // Salva anche in formato CSV per import Firestore
  const csvPath = path.join(__dirname, '../src/data/prewarm-cache.csv');
  const csvContent = [
    'word,lang,translation',
    ...results.filter(r => !r.error).map(r => `${r.word},${r.lang},${r.translation}`)
  ].join('\n');
  fs.writeFileSync(csvPath, csvContent);
  console.log(`📄 CSV per Firestore: ${csvPath}\n`);

  console.log('🎯 PROSSIMI STEP:');
  console.log('   1. Importa prewarm-cache.csv in Firestore (collection: word_translations)');
  console.log('   2. Riavvia app → traduzioni istantanee da cache!');
  console.log('   3. Zero chiamate API runtime = €0 costi\n');
}

main().catch(error => {
  console.error('❌ ERRORE FATALE:', error);
  process.exit(1);
});

