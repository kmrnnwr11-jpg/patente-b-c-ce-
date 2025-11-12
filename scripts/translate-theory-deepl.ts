/**
 * Script per tradurre theory-segnali-completo.json in inglese usando DeepL
 * 
 * Traduce:
 * - Titoli capitoli
 * - Descrizioni capitoli
 * - Nomi segnali
 * - Descrizioni segnali
 * - Comportamenti
 * 
 * Output: theory-segnali-completo-en.json
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// ============================================================================
// CONFIGURAZIONE
// ============================================================================

// Carica variabili ambiente da .env
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEEPL_API_KEY = process.env.VITE_DEEPL_API_KEY || process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

const INPUT_FILE = path.join(__dirname, '../src/data/theory-segnali-completo.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/theory-segnali-completo-en.json');
const PROGRESS_FILE = path.join(__dirname, '../src/data/theory-translation-progress.json');

// Rate limiting
const DELAY_BETWEEN_REQUESTS = 100; // ms
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // ms

// ============================================================================
// TYPES
// ============================================================================

interface Signal {
  id: string;
  nome: string;
  image: string;
  categoria: string;
  descrizione: string;
  comportamento: string;
  importanza: string;
  frequenza_esame: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  signals: Signal[];
}

interface TheoryData {
  title: string;
  description: string;
  version: string;
  lastUpdated: string;
  chapters: Chapter[];
}

interface TranslationProgress {
  completedChapters: number;
  completedSignals: number;
  totalChapters: number;
  totalSignals: number;
  lastChapterId?: string;
  lastSignalId?: string;
  timestamp: string;
}

// ============================================================================
// DEEPL TRANSLATION
// ============================================================================

async function translateText(text: string, retries = 0): Promise<string> {
  if (!text || text.trim() === '') {
    return text;
  }

  try {
    const response = await axios.post(
      DEEPL_API_URL,
      new URLSearchParams({
        auth_key: DEEPL_API_KEY!,
        text: text,
        source_lang: 'IT',
        target_lang: 'EN-US',
        formality: 'default',
        preserve_formatting: '1',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      }
    );

    if (response.data && response.data.translations && response.data.translations[0]) {
      return response.data.translations[0].text;
    }

    throw new Error('Invalid DeepL response');
  } catch (error: any) {
    if (retries < MAX_RETRIES) {
      console.warn(`⚠️  Errore traduzione, retry ${retries + 1}/${MAX_RETRIES}...`);
      await sleep(RETRY_DELAY * (retries + 1));
      return translateText(text, retries + 1);
    }

    console.error('❌ Errore traduzione:', error.message);
    return text; // Fallback: ritorna testo originale
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// PROGRESS MANAGEMENT
// ============================================================================

function loadProgress(): TranslationProgress | null {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('⚠️  Impossibile caricare progress, ricomincio da zero');
  }
  return null;
}

function saveProgress(progress: TranslationProgress): void {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Errore salvataggio progress:', error);
  }
}

// ============================================================================
// TRANSLATION LOGIC
// ============================================================================

async function translateTheory(): Promise<void> {
  console.log('🚀 === TRADUZIONE TEORIA SEGNALI STRADALI ===\n');

  // Verifica API key
  if (!DEEPL_API_KEY) {
    console.error('❌ DEEPL_API_KEY non trovata nelle variabili d\'ambiente!');
    console.error('   Aggiungi nel file .env: DEEPL_API_KEY=your_key_here');
    process.exit(1);
  }

  // Carica dati italiani
  console.log('📥 Caricamento teoria italiana...');
  const italianData: TheoryData = JSON.parse(
    fs.readFileSync(INPUT_FILE, 'utf-8')
  );

  const totalChapters = italianData.chapters.length;
  const totalSignals = italianData.chapters.reduce((sum, ch) => sum + ch.signals.length, 0);

  console.log(`✅ Caricato:`);
  console.log(`   - ${totalChapters} capitoli`);
  console.log(`   - ${totalSignals} segnali`);
  console.log('');

  // Carica progress (se esiste)
  let progress = loadProgress();
  let startChapterIndex = 0;
  let startSignalIndex = 0;

  if (progress) {
    console.log('📋 Trovato progresso precedente:');
    console.log(`   - Capitoli completati: ${progress.completedChapters}/${progress.totalChapters}`);
    console.log(`   - Segnali completati: ${progress.completedSignals}/${progress.totalSignals}`);
    console.log(`   - Ultimo capitolo: ${progress.lastChapterId}`);
    console.log(`   - Ultimo segnale: ${progress.lastSignalId}`);
    console.log('   🔄 Riprendo da dove interrotto...\n');

    startChapterIndex = progress.completedChapters;
  } else {
    progress = {
      completedChapters: 0,
      completedSignals: 0,
      totalChapters,
      totalSignals,
      timestamp: new Date().toISOString(),
    };
  }

  // Prepara struttura inglese
  const englishData: TheoryData = {
    ...italianData,
    chapters: [],
  };

  console.log('🌐 === INIZIO TRADUZIONE ===\n');

  const startTime = Date.now();
  let translatedCount = 0;

  // Traduci metadata principale (solo se inizio da zero)
  if (startChapterIndex === 0) {
    console.log('📝 Traduzione metadata principale...');
    englishData.title = await translateText(italianData.title);
    englishData.description = await translateText(italianData.description);
    await sleep(DELAY_BETWEEN_REQUESTS);
    console.log('✅ Metadata tradotto\n');
  }

  // Traduci capitoli
  for (let chapterIdx = 0; chapterIdx < italianData.chapters.length; chapterIdx++) {
    const chapter = italianData.chapters[chapterIdx];
    
    console.log(`\n📂 CAPITOLO ${chapterIdx + 1}/${totalChapters}: ${chapter.title}`);
    console.log(`   ${chapter.signals.length} segnali da tradurre`);

    const englishChapter: Chapter = {
      id: chapter.id,
      icon: chapter.icon,
      title: '',
      description: '',
      signals: [],
    };

    // Skip capitoli già completati
    if (chapterIdx < startChapterIndex) {
      console.log('   ⏭️  Capitolo già completato, skip...');
      continue;
    }

    // Traduci titolo e descrizione capitolo
    console.log(`   📝 Traduzione titolo capitolo...`);
    englishChapter.title = await translateText(chapter.title);
    translatedCount++;
    await sleep(DELAY_BETWEEN_REQUESTS);

    console.log(`   📝 Traduzione descrizione capitolo...`);
    englishChapter.description = await translateText(chapter.description);
    translatedCount++;
    await sleep(DELAY_BETWEEN_REQUESTS);

    // Traduci segnali
    for (let signalIdx = 0; signalIdx < chapter.signals.length; signalIdx++) {
      const signal = chapter.signals[signalIdx];
      
      // Skip segnali già completati nel capitolo corrente
      if (chapterIdx === startChapterIndex && signalIdx < startSignalIndex) {
        continue;
      }

      const percentage = Math.round((progress.completedSignals / totalSignals) * 100);
      process.stdout.write(
        `\r   🔄 Segnale ${signalIdx + 1}/${chapter.signals.length}: ${signal.nome.substring(0, 30)}... [${percentage}%]`
      );

      const englishSignal: Signal = {
        id: signal.id,
        image: signal.image,
        categoria: signal.categoria,
        importanza: signal.importanza,
        frequenza_esame: signal.frequenza_esame,
        nome: await translateText(signal.nome),
        descrizione: await translateText(signal.descrizione),
        comportamento: await translateText(signal.comportamento),
      };

      translatedCount += 3; // nome + descrizione + comportamento
      englishChapter.signals.push(englishSignal);

      progress.completedSignals++;
      progress.lastChapterId = chapter.id;
      progress.lastSignalId = signal.id;

      // Salva progress ogni 5 segnali
      if (progress.completedSignals % 5 === 0) {
        saveProgress(progress);
      }

      await sleep(DELAY_BETWEEN_REQUESTS);
    }

    console.log(`\n   ✅ Capitolo completato!\n`);
    englishData.chapters.push(englishChapter);

    progress.completedChapters++;
    saveProgress(progress);
  }

  // Salva file finale
  console.log('\n💾 Salvataggio file tradotto...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(englishData, null, 2), 'utf-8');

  // Salva anche in public per accesso runtime
  const publicOutputFile = path.join(__dirname, '../public/data/theory-segnali-completo-en.json');
  fs.mkdirSync(path.dirname(publicOutputFile), { recursive: true });
  fs.writeFileSync(publicOutputFile, JSON.stringify(englishData, null, 2), 'utf-8');

  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  console.log('\n🎉 === TRADUZIONE COMPLETATA ===\n');
  console.log(`✅ File salvato: ${OUTPUT_FILE}`);
  console.log(`✅ File pubblico: ${publicOutputFile}`);
  console.log(`\n📊 STATISTICHE:`);
  console.log(`   - Capitoli tradotti: ${totalChapters}`);
  console.log(`   - Segnali tradotti: ${totalSignals}`);
  console.log(`   - Traduzioni totali: ${translatedCount}`);
  console.log(`   - Tempo impiegato: ${minutes}m ${seconds}s`);
  console.log(`   - Media: ${(translatedCount / duration * 1000).toFixed(1)} traduzioni/secondo`);

  // Pulisci file progress
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
    console.log(`\n🗑️  File progress rimosso`);
  }

  console.log('\n✨ Tutto fatto! La teoria è pronta in inglese.\n');
}

// ============================================================================
// MAIN
// ============================================================================

translateTheory().catch((error) => {
  console.error('\n❌ ERRORE FATALE:', error);
  process.exit(1);
});

