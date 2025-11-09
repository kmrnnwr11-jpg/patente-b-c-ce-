// Script per analizzare le parole più frequenti nei quiz
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

// Parole comuni da escludere (articoli, preposizioni, etc.)
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
  'dai', 'dagli', 'dalle', 'col', 'coi', 'collo', 'colla', 'cogli', 'colle'
]);

async function main() {
  console.log('📊 Analisi parole frequenti nei quiz...\n');

  // Carica quiz
  const quizPath = path.join(__dirname, '../src/data/quiz.json');
  const quizData: QuizQuestion[] = JSON.parse(fs.readFileSync(quizPath, 'utf-8'));

  console.log(`✅ Caricate ${quizData.length} domande\n`);

  // Conta frequenze
  const wordFreq = new Map<string, number>();

  quizData.forEach(q => {
    const words = tokenize(q.domanda);
    words.forEach(word => {
      if (!STOPWORDS.has(word) && word.length > 2) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
  });

  // Ordina per frequenza
  const sorted = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  console.log('🔝 Top 100 parole più frequenti:\n');
  
  sorted.forEach(([word, count], index) => {
    console.log(`${(index + 1).toString().padStart(3)}. ${word.padEnd(20)} → ${count} volte`);
  });

  // Salva in file JSON
  const outputPath = path.join(__dirname, '../src/data/quiz-top-words.json');
  const output = sorted.map(([word, count]) => ({ word, count }));
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Salvato in: ${outputPath}`);
  console.log(`\n📊 Statistiche:`);
  console.log(`   - Parole unique totali: ${wordFreq.size}`);
  console.log(`   - Top 100 coprono: ${sorted.reduce((sum, [, count]) => sum + count, 0)} occorrenze`);
}

main().catch(console.error);

