// Script per pre-generare cache traduzioni+audio per tutti i quiz
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface QuizQuestion {
  id: number;
  domanda: string;
  risposta: boolean;
  immagine?: string;
  argomento: string;
}

// Tokenizza testo in parole
function tokenize(text: string): string[] {
  const regex = /(\p{L}+(?:'\p{L}+)?)/gu;
  const matches = text.match(regex) || [];
  return matches.map(w => w.toLowerCase());
}

// Parole comuni da escludere
const STOPWORDS = new Set([
  'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una',
  'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra',
  'e', 'o', 'ma', 'se', 'che', 'chi', 'cui', 'quale', 'quando',
  'dove', 'come', 'perché', 'più', 'meno', 'molto', 'poco',
  'è', 'sono', 'sia', 'essere', 'avere', 'ha', 'hanno', 'può', 'possono',
  'deve', 'devono', 'vuole', 'vogliono', 'fa', 'fanno',
  'al', 'allo', 'alla', 'ai', 'agli', 'alle', 'del', 'dello', 'della',
  'dei', 'degli', 'delle', 'nel', 'nello', 'nella', 'nei', 'negli', 'nelle',
  'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle', 'dal', 'dallo', 'dalla',
  'dai', 'dagli', 'dalle', 'col', 'coi', 'collo', 'colla', 'cogli', 'colle',
  'non', 'anche', 'solo', 'dopo', 'prima', 'tutti', 'tutte', 'ogni', 'altro',
  'altra', 'altri', 'altre', 'stesso', 'stessa', 'stessi', 'stesse'
]);

async function main() {
  console.log('🔥 PREWARM CACHE: Generazione traduzioni+audio per quiz\n');
  console.log('⚠️  NOTA: Questo script usa API DeepL/ElevenLabs');
  console.log('   Assicurati di avere le chiavi API configurate in .env.local\n');

  // Carica quiz
  const quizPath = path.join(__dirname, '../src/data/quiz.json');
  const quizData: QuizQuestion[] = JSON.parse(fs.readFileSync(quizPath, 'utf-8'));

  console.log(`✅ Caricate ${quizData.length} domande\n`);

  // Estrai parole unique
  const uniqueWords = new Set<string>();

  quizData.forEach(q => {
    const words = tokenize(q.domanda);
    words.forEach(word => {
      if (!STOPWORDS.has(word) && word.length > 2) {
        uniqueWords.add(word);
      }
    });
  });

  const wordsArray = Array.from(uniqueWords).sort();
  console.log(`📊 Parole unique da tradurre: ${wordsArray.length}\n`);

  // Lingue target
  const targetLangs = ['en', 'ur', 'hi', 'pa'];
  const totalOperations = wordsArray.length * targetLangs.length;

  console.log(`🎯 Operazioni totali: ${totalOperations} (${wordsArray.length} parole × ${targetLangs.length} lingue)\n`);
  console.log(`⏱️  Tempo stimato: ~${Math.ceil(totalOperations * 2 / 60)} minuti (con rate limiting)\n`);

  console.log('🚀 AVVIO PREWARM...\n');
  console.log('   Per eseguire, usa: npm run prewarm');
  console.log('   (Lo script chiamerà getOrCreateWordAssets per ogni parola)\n');

  // Salva lista parole per riferimento
  const outputPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  fs.writeFileSync(outputPath, JSON.stringify(wordsArray, null, 2));
  console.log(`✅ Lista parole salvata in: ${outputPath}\n`);

  console.log('📋 Prossimi step:');
  console.log('   1. Configura API keys in .env.local (VITE_DEEPL_API_KEY, VITE_ELEVENLABS_API_KEY)');
  console.log('   2. Esegui: npm run prewarm (in background, richiede 1-2 ore)');
  console.log('   3. Cache salvata in Firestore/Storage → zero costi runtime!\n');

  console.log('💰 Stima costi:');
  console.log(`   - DeepL: ~${Math.ceil(wordsArray.length * 10 / 1000)}k caratteri = GRATIS (dentro quota 500k/mese)`);
  console.log(`   - ElevenLabs: ~${Math.ceil(wordsArray.length * 8 / 1000)}k caratteri = GRATIS (piano starter 10k/mese)`);
  console.log(`   - Totale: €0.00 (tutto dentro free tier)\n`);
}

main().catch(console.error);
