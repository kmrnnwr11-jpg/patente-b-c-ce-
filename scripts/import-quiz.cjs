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
console.log('✅ JSON caricato\n');

// Salva backup originale
fs.writeFileSync(DEST_JSON_RAW, JSON.stringify(rawData, null, 2));
console.log('💾 Backup salvato in src/data/quiz-raw.json\n');

// Processa e normalizza dati
console.log('⚙️  Processamento dati...');
const processedQuiz = [];
let questionId = 1;

// Mapping argomenti italiano
const argomentiMap = {
  'definizioni-generali-doveri-strada': 'Definizioni stradali e di traffico',
  'segnali-pericolo': 'Segnali di pericolo',
  'segnali-divieto': 'Segnali di divieto',
  'segnali-obbligo': 'Segnali di obbligo',
  'segnali-precedenza': 'Segnali di precedenza',
  'segnaletica-orizzontale': 'Segnaletica orizzontale',
  'segnalazioni-semaforiche-agenti': 'Segnalazioni semaforiche e degli agenti del traffico',
  'segnali-indicazione': 'Segnali di indicazione',
  'pannelli-integrativi': 'Pannelli integrativi dei segnali',
  'pericolo-intralcio-circolazione': 'Pericolo e intralcio alla circolazione',
  'limiti-velocita': 'Limiti di velocità',
  'distanza-sicurezza': 'Distanza di sicurezza',
  'norme-precedenza': 'Norme sulla precedenza',
  'norme-sorpasso': 'Norme sul sorpasso',
  'fermata-sosta-partenza': 'Fermata, sosta e partenza dei veicoli',
  'trasporto-persone': 'Trasporto di persone',
  'carico-veicoli': 'Carico dei veicoli',
  'uso-luci': 'Uso delle luci',
  'spie-simboli': 'Spie e simboli',
  'patenti-guida': 'Patenti di guida',
  'documenti-circolazione': 'Documenti di circolazione',
  'cinture-caschi': 'Uso delle cinture di sicurezza e dei caschi protettivi',
  'incidenti-comportamenti': 'Incidenti stradali e comportamenti in caso di incidente',
  'elementi-veicolo': 'Elementi del veicolo',
  'comportamenti-prevenzione': 'Comportamenti per prevenire incidenti stradali'
};

// Itera attraverso gli argomenti principali
for (const [mainTopic, subTopics] of Object.entries(rawData)) {
  const argomentoItaliano = argomentiMap[mainTopic] || mainTopic;
  
  // Itera attraverso i sotto-argomenti
  for (const [subTopic, questions] of Object.entries(subTopics)) {
    // Itera attraverso le domande
    if (Array.isArray(questions)) {
      questions.forEach(q => {
        const question = {
          id: questionId++,
          domanda: q.q || '',
          risposta: q.a === true || q.a === 'true' || q.a === 'V',
          immagine: q.img ? `/images/quiz/${path.basename(q.img)}` : null,
          argomento: argomentoItaliano,
          sottoArgomento: subTopic.replace(/-/g, ' '),
          difficulty: 'medium'
        };
        
        processedQuiz.push(question);
      });
    }
  }
}

console.log(`✅ Quiz processato: ${processedQuiz.length} domande\n`);

// Salva JSON processato
fs.writeFileSync(DEST_JSON, JSON.stringify(processedQuiz, null, 2));

// Copia immagini
console.log('🖼️  Copia immagini...');
if (fs.existsSync(SOURCE_IMAGES)) {
  const images = fs.readdirSync(SOURCE_IMAGES);
  let copiedCount = 0;
  
  images.forEach(img => {
    const srcPath = path.join(SOURCE_IMAGES, img);
    const destPath = path.join(DEST_IMAGES, img);
    
    try {
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
        
        // Progress ogni 500 immagini
        if (copiedCount % 500 === 0) {
          console.log(`   Copiate ${copiedCount} immagini...`);
        }
      }
    } catch (err) {
      // Skip errori su file singoli
    }
  });
  
  console.log(`✅ Copiate ${copiedCount} immagini totali\n`);
} else {
  console.log('⚠️  Cartella immagini non trovata\n');
}

// Statistiche finali
const withImages = processedQuiz.filter(q => q.immagine).length;
const topics = [...new Set(processedQuiz.map(q => q.argomento))];
const topicCounts = {};

topics.forEach(topic => {
  topicCounts[topic] = processedQuiz.filter(q => q.argomento === topic).length;
});

console.log('================================');
console.log('📊 STATISTICHE FINALI:');
console.log('================================');
console.log(`✓ Totale domande: ${processedQuiz.length}`);
console.log(`✓ Domande con immagine: ${withImages}`);
console.log(`✓ Domande solo testo: ${processedQuiz.length - withImages}`);
console.log(`✓ Argomenti unici: ${topics.length}`);
console.log('\n📚 Argomenti trovati:');

topics.sort().forEach((topic, i) => {
  console.log(`   ${(i + 1).toString().padStart(2, ' ')}. ${topic.padEnd(55, ' ')} (${topicCounts[topic]} domande)`);
});

console.log('\n================================');
console.log('✅ IMPORTAZIONE COMPLETATA!');
console.log('================================');
console.log('\n📁 File generati:');
console.log('  ✓ src/data/quiz.json (da usare nell\'app)');
console.log('  ✓ src/data/quiz-raw.json (backup originale)');
console.log('  ✓ public/images/quiz/* (tutte le immagini)');
console.log('\n🚀 Prossimo step: npm run dev e testa /test-quiz\n');
