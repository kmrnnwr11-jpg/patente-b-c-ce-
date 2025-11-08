const fs = require('fs');
const path = require('path');

// Controlla immagini nel quiz-2025.json
const quiz2025 = JSON.parse(fs.readFileSync('src/data/quiz-2025.json', 'utf-8'));

console.log('📊 Analisi Immagini quiz-2025.json:');
console.log('='.repeat(50));

const imagesWithPath = quiz2025.filter(q => q.immagine && q.immagine !== null);
console.log(`✅ Domande con immagine: ${imagesWithPath.length}/${quiz2025.length}`);

const uniqueImages = new Set(imagesWithPath.map(q => q.immagine));
console.log(`🖼️  Immagini uniche: ${uniqueImages.size}`);

console.log('\nPercorsi immagini (check file system):');
uniqueImages.forEach(img => {
  // img è come "/images/quiz/704.png", dobbiamo controllare in "public/images/quiz/704.png"
  const filePath = path.join(__dirname, 'public', img);
  const exists = fs.existsSync(filePath);
  const fileSize = exists ? fs.statSync(filePath).size : 0;
  console.log(`  ${exists ? '✅' : '❌'} ${img} ${fileSize ? '(' + fileSize + ' bytes)' : ''}`);
});

console.log('\n📊 Analisi Immagini quiz.json:');
console.log('='.repeat(50));
const quiz = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf-8'));
const withImages = quiz.filter(q => q.immagine && q.immagine !== null);
console.log(`✅ Domande con immagine: ${withImages.length}/${quiz.length}`);
