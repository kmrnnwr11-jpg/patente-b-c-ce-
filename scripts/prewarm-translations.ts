/**
 * Script per pre-generare traduzioni e audio di tutte le parole della teoria
 * Uso: npm run prewarm -- --lang=ur
 */

import theoryData from '../src/data/theory-structure.json';
import { prewarmWordAssets } from '../src/lib/wordAssets';

interface TheoryChapter {
  id: string;
  title: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

// Estrai tutte le parole uniche dalla teoria
function extractUniqueWords(chapters: TheoryChapter[]): string[] {
  const allText = chapters
    .flatMap(ch => ch.sections.map(s => `${s.title} ${s.content}`))
    .join(' ');

  // Split per parole (solo lettere e apostrofi)
  const words = allText
    .split(/\s+/)
    .map(w => w.replace(/[^\p{L}\p{N}']/gu, '').toLowerCase())
    .filter(w => w.length > 2); // Ignora parole troppo corte

  return [...new Set(words)].sort();
}

async function main() {
  const args = process.argv.slice(2);
  const langArg = args.find(a => a.startsWith('--lang='));
  const targetLang = langArg ? langArg.split('=')[1] : 'en';

  console.log(`🚀 Prewarm traduzioni/audio per lingua: ${targetLang}\n`);

  const data = typeof theoryData === 'string' ? JSON.parse(theoryData) : theoryData;
  const words = extractUniqueWords(data.chapters);

  console.log(`📚 Trovate ${words.length} parole uniche nella teoria\n`);
  console.log(`⏳ Inizio generazione (può richiedere tempo)...\n`);

  const startTime = Date.now();

  await prewarmWordAssets(
    words,
    'it',
    targetLang,
    (current, total, word) => {
      const percent = Math.round((current / total) * 100);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const eta = Math.round((elapsed / current) * (total - current));

      process.stdout.write(
        `\r[${percent}%] ${current}/${total} - "${word}" (ETA: ${eta}s)    `
      );
    }
  );

  const totalTime = Math.round((Date.now() - startTime) / 1000);

  console.log(`\n\n✅ Completato in ${totalTime}s!`);
  console.log(`📦 ${words.length} parole salvate in cache (Firestore + Storage)`);
  console.log(`💰 Costo zero per utenti runtime (tutto da cache)`);
}

main().catch(console.error);

