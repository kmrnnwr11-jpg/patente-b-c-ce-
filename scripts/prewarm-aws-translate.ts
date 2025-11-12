import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

const LANGUAGES = [
  { code: 'en', target: 'en' },
  { code: 'es', target: 'es' },
  { code: 'fr', target: 'fr' },
  { code: 'de', target: 'de' }
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface TranslationEntry {
  word: string;
  lang: string;
  translation: string;
}

async function translateWithAWS(text: string, targetLang: string): Promise<string | null> {
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials non configurate. Imposta AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY');
    return null;
  }

  try {
    const client = new TranslateClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });

    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: 'it',
      TargetLanguageCode: targetLang
    });

    const response = await client.send(command);
    return response.TranslatedText || null;
  } catch (error) {
    console.error(`❌ AWS Translate error per ${text} → ${targetLang}:`, error instanceof Error ? error.message : String(error));
    return null;
  }
}

async function main() {
  if (!AWS_ACCESS_KEY_ID || !AWS_ACCESS_KEY_ID) {
    console.error('❌ Configura AWS credentials in .env o export');
    process.exit(1);
  }

  const wordsPath = path.join(__dirname, '../src/data/quiz-unique-words.json');
  const words: string[] = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));

  console.log(`🔥 PREWARM AWS TRANSLATE`);
  console.log(`📊 Parole: ${words.length}`);
  console.log(`🌍 Lingue: ${LANGUAGES.map(l => l.code).join(', ')}`);
  console.log(`📈 Totale traduzioni: ${words.length * LANGUAGES.length}`);
  console.log(`⏱️  Rate: 1 richiesta ogni 1 secondo`);
  console.log(`🕐 Tempo stimato: ~${Math.ceil(words.length * LANGUAGES.length / 60)} minuti\n`);
  console.log(`📍 Inizio: ${new Date().toLocaleTimeString()}\n`);

  const results: TranslationEntry[] = [];
  let successCount = 0;
  let failureCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    for (const lang of LANGUAGES) {
      const translation = await translateWithAWS(word, lang.target);

      if (translation) {
        results.push({
          word,
          lang: lang.code,
          translation
        });
        successCount++;

        if (successCount % 50 === 0) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const avgRate = (successCount / elapsed).toFixed(2);
          console.log(`✅ ${successCount}/${words.length * LANGUAGES.length} | ${avgRate} trad/sec | Errori: ${failureCount}`);
        }
      } else {
        failureCount++;
      }

      await sleep(1000); // Rate limit AWS
    }
  }

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  console.log(`\n✅ COMPLETATO!`);
  console.log(`📊 Successi: ${successCount}`);
  console.log(`❌ Fallimenti: ${failureCount}`);
  console.log(`⏱️  Tempo totale: ${elapsedTime}s (${Math.floor(elapsedTime / 60)}min)`);

  const outputPath = path.join(__dirname, '../src/data/prewarm-complete.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 Salvato: ${outputPath}`);
}

main().catch(e => {
  console.error('❌ Errore fatale:', e);
  process.exit(1);
});
