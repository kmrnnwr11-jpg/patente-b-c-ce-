import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DeepL config
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_ENDPOINT = 'https://api.deepl.com/v2/translate';
const TARGET_LANG = 'EN-US';

type QuizQuestion = {
  id: number;
  domanda: string;
  risposta: boolean;
  immagine?: string;
  argomento: string;
  sottoArgomento?: string;
  difficulty?: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function translateWithDeepL(text: string, retryCount = 0): Promise<string | null> {
  const maxRetries = 5;
  try {
    const response = await fetch(DEEPL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        source_lang: 'IT',
        target_lang: TARGET_LANG,
        formality: 'default'
      })
    });

    if (!response.ok) {
      if (response.status === 429 && retryCount < maxRetries) {
        const delay = Math.min(30000, 2000 * Math.pow(2, retryCount));
        console.log(`⏳ Rate limit, retry ${retryCount + 1}/${maxRetries}, delay ${delay}ms...`);
        await sleep(delay);
        return translateWithDeepL(text, retryCount + 1);
      }
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translations?.[0]?.text || null;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.min(10000, 1000 * Math.pow(2, retryCount));
      console.log(`⏳ Error, retry ${retryCount + 1}/${maxRetries}, delay ${delay}ms...`);
      await sleep(delay);
      return translateWithDeepL(text, retryCount + 1);
    }
    console.error(`❌ Translation failed after ${maxRetries} retries:`, error);
    return null;
  }
}

async function main() {
  console.log('🔧 FIX MISSING ENGLISH TRANSLATIONS\n');

  if (!DEEPL_API_KEY) {
    console.error('❌ DEEPL_API_KEY not set in environment!');
    process.exit(1);
  }

  // Load files
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const originalPath = path.join(dataDir, 'quiz.json');
  const partialPath = path.join(dataDir, 'questions-en.partial.json');
  const errorIdsPath = path.join(__dirname, '..', 'error-ids-en.json');

  const original: QuizQuestion[] = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
  const partial: QuizQuestion[] = JSON.parse(fs.readFileSync(partialPath, 'utf8'));
  const errorIds: number[] = JSON.parse(fs.readFileSync(errorIdsPath, 'utf8'));

  console.log(`📚 Total questions: ${original.length}`);
  console.log(`❌ Missing translations: ${errorIds.length}`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(errorIds.length * 1.5 / 60)} minutes\n`);
  console.log(`📍 Inizio: ${new Date().toLocaleTimeString('it-IT')}\n`);

  let fixed = 0;
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < errorIds.length; i++) {
    const id = errorIds[i];
    const originalQ = original.find(q => q.id === id);
    const partialQ = partial.find(q => q.id === id);

    if (!originalQ || !partialQ) {
      console.log(`[${i + 1}/${errorIds.length}] ⚠️  ID ${id} not found, skipping`);
      continue;
    }

    // Translate
    const translated = await translateWithDeepL(originalQ.domanda);

    if (translated) {
      partialQ.domanda = translated;
      fixed++;
      console.log(`[${i + 1}/${errorIds.length}] ✅ ID ${id}: "${translated.substring(0, 60)}..."`);
    } else {
      errors++;
      console.log(`[${i + 1}/${errorIds.length}] ❌ ID ${id}: Translation failed`);
    }

    // Save progress every 50 questions
    if ((i + 1) % 50 === 0 || i === errorIds.length - 1) {
      fs.writeFileSync(partialPath, JSON.stringify(partial, null, 2));
      const elapsed = Math.round((Date.now() - startTime) / 60000);
      console.log(`💾 Progress saved: ${fixed} fixed, ${errors} errors, ${elapsed}min elapsed\n`);
    }

    // Rate limit: 1 request per second
    await sleep(1000);
  }

  const totalMinutes = Math.round((Date.now() - startTime) / 60000);
  console.log('\n✅ FIX COMPLETATO!');
  console.log(`📊 Statistiche finali:`);
  console.log(`   - Tradotte: ${fixed}`);
  console.log(`   - Errori: ${errors}`);
  console.log(`   - Tempo totale: ${totalMinutes} minuti`);
  console.log(`📍 Fine: ${new Date().toLocaleTimeString('it-IT')}`);

  // Update progress file
  const progressPath = path.join(dataDir, 'prewarm-progress-en.json');
  const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  progress.stats.translatedCount += fixed;
  progress.stats.errorCount = errors;
  progress.lastProcessedId = 7139;
  progress.lastUpdate = new Date().toISOString();
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
  console.log('✅ Progress file updated');
}

main().catch(console.error);

