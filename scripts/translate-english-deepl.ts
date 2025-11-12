import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DeepL config
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_ENDPOINT = 'https://api-free.deepl.com/v2/translate'; // Cambia a 'https://api.deepl.com/v2/translate' se hai Pro
const TARGET_LANG = 'EN-US'; // Inglese americano

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface QuizQuestion {
  id: number;
  domanda: string;
  risposta: boolean;
  immagine?: string;
  argomento: string;
  sottoArgomento?: string;
  difficulty?: string;
}

interface Progress {
  lastProcessedId: number;
  stats: {
    translatedCount: number;
    skippedCount: number;
    errorCount: number;
    elapsedMinutes: number;
  };
  lastUpdate: string;
}

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
      const errorText = await response.text();
      
      // Rate limit o errore temporaneo
      if (response.status === 429 || response.status >= 500) {
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
          console.log(`  ⏳ Rate limit/errore temporaneo, retry ${retryCount + 1}/${maxRetries} tra ${delay}ms...`);
          await sleep(delay);
          return translateWithDeepL(text, retryCount + 1);
        }
      }
      
      throw new Error(`DeepL HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json() as { translations: Array<{ text: string }> };
    return data.translations[0]?.text || null;
    
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 2000;
      console.log(`  ⏳ Errore rete, retry ${retryCount + 1}/${maxRetries} tra ${delay}ms...`);
      await sleep(delay);
      return translateWithDeepL(text, retryCount + 1);
    }
    
    console.error(`  ❌ Errore traduzione:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

function loadProgress(): Progress {
  const progressPath = path.join(__dirname, '../src/data/prewarm-progress-en.json');
  
  try {
    if (fs.existsSync(progressPath)) {
      return JSON.parse(fs.readFileSync(progressPath, 'utf-8'));
    }
  } catch (error) {
    console.log('⚠️  Errore lettura progresso, ricomincio da zero');
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

function saveProgress(progress: Progress): void {
  const progressPath = path.join(__dirname, '../src/data/prewarm-progress-en.json');
  progress.lastUpdate = new Date().toISOString();
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

async function main() {
  console.log('🚀 TRADUZIONE INGLESE CON DEEPL\n');
  
  // Verifica API key
  if (!DEEPL_API_KEY || DEEPL_API_KEY === 'your-key-here') {
    console.error('❌ ERRORE: DEEPL_API_KEY non configurata');
    console.error('   Esporta la chiave: export DEEPL_API_KEY="tua_chiave"');
    process.exit(1);
  }
  
  // Carica domande
  const questionsPath = path.join(__dirname, '../src/data/quiz.json');
  if (!fs.existsSync(questionsPath)) {
    console.error(`❌ File non trovato: ${questionsPath}`);
    process.exit(1);
  }
  
  const questions: QuizQuestion[] = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
  const progress = loadProgress();
  
  console.log(`📚 Domande totali: ${questions.length}`);
  console.log(`🌍 Lingua: Inglese (EN-US)`);
  console.log(`🔄 Riprendo da ID: ${progress.lastProcessedId + 1}`);
  console.log(`📊 Statistiche precedenti:`);
  console.log(`   - Tradotte: ${progress.stats.translatedCount}`);
  console.log(`   - Saltate (cache): ${progress.stats.skippedCount}`);
  console.log(`   - Errori: ${progress.stats.errorCount}`);
  console.log(`⏱️  Tempo stimato: ~${Math.ceil((questions.length - progress.lastProcessedId) * 0.5 / 60)} minuti\n`);
  console.log(`📍 Inizio: ${new Date().toLocaleTimeString()}\n`);
  
  const startTime = Date.now();
  let stats = { ...progress.stats };
  
  for (const question of questions) {
    // Salta se già processato
    if (question.id <= progress.lastProcessedId) {
      continue;
    }
    
    const cacheKey = `${question.id}-en`;
    const questionShort = question.domanda.substring(0, 70);
    
    try {
      // Controlla cache Firestore
      const cached = await getDoc(doc(db, 'translation_cache', cacheKey));
      
      if (cached.exists()) {
        console.log(`[${question.id}/${questions.length}] ✓ Già tradotto (cache)`);
        stats.skippedCount++;
      } else {
        // Traduci con DeepL
        console.log(`[${question.id}/${questions.length}] 🔄 "${questionShort}..."`);
        const translated = await translateWithDeepL(question.domanda);
        
        if (!translated) {
          console.log(`[${question.id}/${questions.length}] ❌ Traduzione fallita`);
          stats.errorCount++;
          
          // Se troppi errori consecutivi, pausa più lunga
          if (stats.errorCount % 5 === 0) {
            console.log(`⏸️  Pausa 10s dopo ${stats.errorCount} errori...`);
            await sleep(10000);
          }
          continue;
        }
        
        // Salva in Firestore
        await setDoc(doc(db, 'translation_cache', cacheKey), {
          questionId: question.id,
          language: 'en',
          originalText: question.domanda,
          translatedText: translated,
          cachedAt: new Date().toISOString(),
          service: 'deepl',
          argomento: question.argomento,
          sottoArgomento: question.sottoArgomento || ''
        });
        
        console.log(`[${question.id}/${questions.length}] ✅ Salvato: "${translated.substring(0, 60)}..."`);
        stats.translatedCount++;
        
        // Rate limit: 500ms tra richieste (2 req/sec per Free, 5 req/sec per Pro)
        await sleep(500);
      }
      
      // Salva progresso ogni 50 domande
      if (question.id % 50 === 0) {
        const elapsed = Math.round((Date.now() - startTime) / 60000);
        stats.elapsedMinutes = elapsed;
        progress.lastProcessedId = question.id;
        progress.stats = stats;
        saveProgress(progress);
        
        const avgSpeed = stats.translatedCount / (elapsed || 1);
        const remaining = questions.length - question.id;
        const etaMinutes = Math.ceil(remaining / (avgSpeed * 60));
        
        console.log(`\n💾 Progresso salvato:`);
        console.log(`   - Processate: ${question.id}/${questions.length} (${Math.round(question.id/questions.length*100)}%)`);
        console.log(`   - Nuove traduzioni: ${stats.translatedCount}`);
        console.log(`   - Cache hits: ${stats.skippedCount}`);
        console.log(`   - Errori: ${stats.errorCount}`);
        console.log(`   - Tempo trascorso: ${elapsed} min`);
        console.log(`   - ETA: ~${etaMinutes} min\n`);
      }
      
    } catch (error) {
      console.error(`[${question.id}/${questions.length}] ❌ Errore:`, error);
      stats.errorCount++;
      
      // Se errore Firebase, pausa più lunga
      await sleep(2000);
    }
  }
  
  // Salva progresso finale
  progress.lastProcessedId = questions[questions.length - 1].id;
  progress.stats = stats;
  saveProgress(progress);
  
  const totalMinutes = Math.round((Date.now() - startTime) / 60000);
  const totalSeconds = Math.round((Date.now() - startTime) / 1000);
  
  console.log('\n✅ TRADUZIONE COMPLETATA!\n');
  console.log(`📊 STATISTICHE FINALI:`);
  console.log(`   - Domande totali: ${questions.length}`);
  console.log(`   - Nuove traduzioni: ${stats.translatedCount}`);
  console.log(`   - Già in cache: ${stats.skippedCount}`);
  console.log(`   - Errori: ${stats.errorCount}`);
  console.log(`   - Tempo totale: ${totalMinutes} min (${totalSeconds}s)`);
  console.log(`   - Velocità media: ${(stats.translatedCount / (totalMinutes || 1)).toFixed(1)} trad/min`);
  console.log(`   - Caratteri stimati: ~${stats.translatedCount * 150} (${Math.round(stats.translatedCount * 150 / 1000)}k)`);
  console.log(`\n📍 Fine: ${new Date().toLocaleTimeString()}`);
  console.log(`\n💡 Le traduzioni sono salvate in Firestore: collection "translation_cache"`);
}

main().catch(error => {
  console.error('\n❌ ERRORE FATALE:', error);
  process.exit(1);
});

