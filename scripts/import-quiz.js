const fs = require('fs');
const path = require('path');

// Percorsi
const SOURCE_JSON = './temp_quiz/quizPatenteB2023.json';
const SOURCE_IMAGES = './temp_quiz/img_sign';
const DEST_JSON = './src/data/quiz.json';
const DEST_JSON_RAW = './src/data/quiz-raw.json';
const DEST_IMAGES = './public/images/quiz';

// Crea cartelle se non esistono
if (!fs.existsSync('./src/data')) fs.mkdirSync('./src/data', { recursive: true });
if (!fs.existsSync(DEST_IMAGES)) fs.mkdirSync(DEST_IMAGES, { recursive: true });

console.log('🚀 IMPORTAZIONE QUIZ PATENTE B');
console.log('================================\n');

// Leggi JSON originale
console.log('📖 Lettura quiz JSON...');
const rawData = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf8'));
console.log(`✅ Trovate ${rawData.length} domande\n`);

// Salva backup originale
fs.writeFileSync(DEST_JSON_RAW, JSON.stringify(rawData, null, 2));
console.log('💾 Backup salvato in src/data/quiz-raw.json\n');

// Processa e normalizza dati
console.log('⚙️  Processamento dati...');
const processedQuiz = rawData.map((q, index) => {
  // Struttura normalizzata
  const question = {
    id: index + 1,
    domanda: q.domanda || q.question || '',
    risposta: q.risposta === 'V' || q.risposta === true,
    immagine: q.immagine || q.image || null,
    argomento: q.argomento || q.topic || 'Generale',
    difficulty: 'medium' // Default, può essere calcolato in seguito
  };

  // Normalizza percorso immagine
  if (question.immagine) {
    // Rimuovi path relativi e mantieni solo nome file
    question.immagine = question.immagine.replace(/^.*[\\/]/, '');
    // Aggiungi prefisso per path pubblico
    question.immagine = `/images/quiz/${question.immagine}`;
  }

  return question;
});

// Salva JSON processato
fs.writeFileSync(DEST_JSON, JSON.stringify(processedQuiz, null, 2));
console.log(`✅ Quiz processato salvato: ${processedQuiz.length} domande\n`);

// Copia immagini
console.log('🖼️  Copia immagini...');
if (fs.existsSync(SOURCE_IMAGES)) {
  const images = fs.readdirSync(SOURCE_IMAGES);
  let copiedCount = 0;
  
  images.forEach(img => {
    const srcPath = path.join(SOURCE_IMAGES, img);
    const destPath = path.join(DEST_IMAGES, img);
    
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      copiedCount++;
      
      // Progress ogni 500 immagini
      if (copiedCount % 500 === 0) {
        console.log(`   Copiate ${copiedCount} immagini...`);
      }
    }
  });
  
  console.log(`✅ Copiate ${copiedCount} immagini totali\n`);
} else {
  console.log('⚠️  Cartella immagini non trovata\n');
}

// Statistiche finali
const withImages = processedQuiz.filter(q => q.immagine).length;
const topics = [...new Set(processedQuiz.map(q => q.argomento))];

console.log('================================');
console.log('📊 STATISTICHE FINALI:');
console.log('================================');
console.log(`✓ Totale domande: ${processedQuiz.length}`);
console.log(`✓ Domande con immagine: ${withImages}`);
console.log(`✓ Domande solo testo: ${processedQuiz.length - withImages}`);
console.log(`✓ Argomenti unici: ${topics.length}`);
console.log('\n📚 Argomenti trovati:');
topics.forEach((topic, i) => {
  const count = processedQuiz.filter(q => q.argomento === topic).length;
  console.log(`   ${i + 1}. ${topic} (${count} domande)`);
});

console.log('\n================================');
console.log('✅ IMPORTAZIONE COMPLETATA!');
console.log('================================');
console.log('\n📁 File generati:');
console.log('  ✓ src/data/quiz.json (da usare nell\'app)');
console.log('  ✓ src/data/quiz-raw.json (backup originale)');
console.log('  ✓ public/images/quiz/* (tutte le immagini)');
console.log('\n🚀 Prossimo step: npm run dev e testa /test-quiz\n');
