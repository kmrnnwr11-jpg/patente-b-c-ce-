import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DeepL config (set DEEPL_API_KEY in environment or .env sourced before running)
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
// Endpoint DeepL (usa api.deepl.com per chiavi Pro; api-free.deepl.com per Free)
const DEEPL_ENDPOINT = 'https://api.deepl.com/v2/translate';
const TARGET_LANG = 'EN-US'; // Use EN-GB if you prefer British English

type QuizQuestion = {
  id: number;
  domanda: string;
  risposta: boolean;
  immagine?: string;
  argomento: string;
  sottoArgomento?: string;
  difficulty?: string;
};

type Progress = {
  lastProcessedId: number;
  stats: {
    translatedCount: number;
    skippedCount: number;
    errorCount: number;
    elapsedMinutes: number;
  };
  lastUpdate: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function translateWithDeepL(text: string, retryCount = 0): Promise<string | null> {
  const maxRetries = 3;
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
      const textErr = await response.text().catch(() => '');
      if ((response.status === 429 || response.status >= 500) && retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 2000;
        console.log(`  ⏳ DeepL ${response.status}, retry ${retryCount + 1}/${maxRetries} in ${delay}ms...`);
        await sleep(delay);
        return translateWithDeepL(text, retryCount + 1);
      }
      console.error(`  ❌ DeepL HTTP ${response.status}: ${textErr}`);
      return null;
    }

    const data = await response.json() as { translations: Array<{ text: string }> };
    return data.translations[0]?.text ?? null;
  } catch (err) {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 2000;
      console.log(`  ⏳ Network error, retry ${retryCount + 1}/${maxRetries} in ${delay}ms...`);
      await sleep(delay);
      return translateWithDeepL(text, retryCount + 1);
    }
    console.error('  ❌ DeepL fetch error:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

function loadProgress(progressPath: string): Progress {
  try {
    if (fs.existsSync(progressPath)) {
      return JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    }
  } catch {
    // ignore
  }
  return {
    lastProcessedId: 0,
    stats: {
      translatedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      elapsedMinutes: 0
    },
    lastUpdate: new Date().toISOString()
  };
}

function saveProgress(progressPath: string, progress: Progress) {
  progress.lastUpdate = new Date().toISOString();
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

function loadExistingEnMap(existingFilePath: string): Map<number, string> {
  const map = new Map<number, string>();
  if (!fs.existsSync(existingFilePath)) return map;
  try {
    const content = JSON.parse(fs.readFileSync(existingFilePath, 'utf-8')) as QuizQuestion[];
    for (const q of content) {
      if (typeof q.id === 'number' && typeof q.domanda === 'string') {
        map.set(q.id, q.domanda);
      }
    }
  } catch {
    // ignore corrupt file
  }
  return map;
}

function writeQuestionsToFile(
  outPath: string,
  allQuestions: QuizQuestion[],
  enMap: Map<number, string>
) {
  const merged = allQuestions.map(q => ({
    ...q,
    domanda: enMap.get(q.id) ?? q.domanda
  }));
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
}

async function main() {
  console.log('🚀 TRADUZIONE INGLESE CON DEEPL (LOCAL SAVE)\n');
  if (!DEEPL_API_KEY) {
    console.error('❌ DEEPL_API_KEY non configurata. Esegui: export DEEPL_API_KEY=\"...\"\\n');
    process.exit(1);
  }

  const questionsPath = path.join(__dirname, '../src/data/quiz.json');
  if (!fs.existsSync(questionsPath)) {
    console.error(`❌ File non trovato: ${questionsPath}`);
    process.exit(1);
  }

  const progressPath = path.join(__dirname, '../src/data/prewarm-progress-en.json');
  const outFilePath = path.join(__dirname, '../src/data/questions-en.json');
  const outPartialPath = path.join(__dirname, '../src/data/questions-en.partial.json');

  const questions: QuizQuestion[] = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
  const existingMap = loadExistingEnMap(outFilePath); // resume from prior output if present
  const progress = loadProgress(progressPath);

  console.log(`📚 Domande totali: ${questions.length}`);
  console.log(`🌍 Lingua: EN-US`);
  console.log(`🔄 Riprendo da ID: ${progress.lastProcessedId + 1}`);
  console.log(`📎 Traduzioni già presenti in file: ${existingMap.size}`);
  console.log('');

  const startTime = Date.now();
  let stats = { ...progress.stats };

  // Working map (id -> translated text)
  const enMap = new Map(existingMap);

  for (const question of questions) {
    // Skip if already present in existing output
    if (enMap.has(question.id)) {
      stats.skippedCount++;
      continue;
    }

    // Also skip if iterating before lastProcessedId (old progress file)
    if (question.id <= progress.lastProcessedId) {
      stats.skippedCount++;
      continue;
    }

    const preview = question.domanda.slice(0, 80);
    console.log(`[${question.id}/${questions.length}] 🔄 \"${preview}...\"`);

    const translated = await translateWithDeepL(question.domanda);
    if (!translated) {
      console.log(`[${question.id}/${questions.length}] ❌ Traduzione fallita`);
      stats.errorCount++;
      if (stats.errorCount % 5 === 0) {
        console.log('⏸️  Pausa 10s dopo 5 errori...');
        await sleep(10_000);
      }
      continue;
    }

    enMap.set(question.id, translated);
    stats.translatedCount++;
    console.log(`[${question.id}/${questions.length}] ✅`);

    // Rate limiting (adjust if you have Pro)
    await sleep(500);

    // Save progress and partial output every 50 questions
    if (question.id % 50 === 0) {
      const elapsed = Math.round((Date.now() - startTime) / 60000);
      stats.elapsedMinutes = elapsed;
      const newProgress: Progress = {
        lastProcessedId: question.id,
        stats,
        lastUpdate: new Date().toISOString()
      };
      saveProgress(progressPath, newProgress);
      writeQuestionsToFile(outPartialPath, questions, enMap);
      console.log(`\\n💾 Checkpoint: salvati progress e file parziale (${outPartialPath})\\n`);
    }
  }

  // Final write
  writeQuestionsToFile(outFilePath, questions, enMap);
  const totalMinutes = Math.round((Date.now() - startTime) / 60000);
  const totalSeconds = Math.round((Date.now() - startTime) / 1000);
  console.log('\\n✅ COMPLETATO!');
  console.log(`   - Tradotte nuove: ${stats.translatedCount}`);
  console.log(`   - Saltate: ${stats.skippedCount}`);
  console.log(`   - Errori: ${stats.errorCount}`);
  console.log(`   - Tempo: ${totalMinutes} min (${totalSeconds}s)`);
  console.log(`   - Output: ${outFilePath}`);
}

main().catch(err => {
  console.error('❌ Errore fatale:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});


