/**
 * Script MIGLIORATO per generare traduzioni con rate limiting aggressivo
 * Usa delay più lunghi per evitare blocchi
 * Salva progresso incrementalmente
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Inizializza Firebase
const newApp = admin.initializeApp({
    credential: admin.credential.cert('./new-firebase-key.json'),
    projectId: 'patente-b-2025'
}, 'new');

const db = admin.firestore(newApp);

// Progress file per riprendere
const PROGRESS_FILE = './translation_progress.json';

// Delay aggressivo per evitare rate limiting (2 secondi tra traduzioni)
const TRANSLATION_DELAY = 2000;
const BATCH_SIZE = 50; // Batch più piccoli
const PAUSE_AFTER_BATCH = 10000; // 10 secondi di pausa tra batch

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Carica progresso salvato
function loadProgress() {
    try {
        if (fs.existsSync(PROGRESS_FILE)) {
            return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
        }
    } catch (e) { }
    return { lastProcessedId: 0, successCount: 0, urCount: 0, paCount: 0 };
}

// Salva progresso
function saveProgress(progress) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function translateWithRetry(text, targetLang, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await translate(text, { from: 'it', to: targetLang });
            return result.text;
        } catch (error) {
            if (error.message.includes('Too Many Requests')) {
                console.log(`   ⏳ Rate limited, attesa ${30 * attempt}s (tentativo ${attempt}/${maxRetries})...`);
                await delay(30000 * attempt); // 30s, 60s, 90s backoff
            } else {
                console.error(`   ❌ Errore: ${error.message}`);
                return null;
            }
        }
    }
    return null;
}

async function generateTranslations() {
    console.log('🚀 Generazione traduzioni con rate limiting aggressivo...\n');

    // Carica progresso
    let progress = loadProgress();
    console.log(`📊 Progresso precedente: ultimo ID=${progress.lastProcessedId}, UR=${progress.urCount}, PA=${progress.paCount}\n`);

    // Carica domande
    const quizPath = path.join(__dirname, '../assets/data/quiz.json');
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    console.log(`📚 Totale domande: ${quizData.length}\n`);

    // Carica traduzioni esistenti
    const existingSnapshot = await db.collection('translations').get();
    const existingByIt = {};
    for (const doc of existingSnapshot.docs) {
        const data = doc.data();
        if (data.it) {
            existingByIt[data.it.trim()] = { docId: doc.id, data };
        }
    }
    console.log(`📋 Traduzioni esistenti in Firebase: ${existingSnapshot.docs.length}\n`);

    // Trova domande da processare
    const toProcess = quizData.filter(q => {
        if (!q.domanda) return false;
        if (q.id <= progress.lastProcessedId) return false;

        const existing = existingByIt[q.domanda.trim()];
        const needsUr = !existing || !existing.data.ur;
        const needsPa = !existing || !existing.data.pa;

        return needsUr || needsPa;
    });

    console.log(`🔍 Domande da processare: ${toProcess.length}\n`);

    let batch = db.batch();
    let batchCount = 0;

    for (let i = 0; i < toProcess.length; i++) {
        const q = toProcess[i];
        const text = q.domanda.trim();
        const existing = existingByIt[text];

        console.log(`\n📝 [${i + 1}/${toProcess.length}] ID: ${q.id}`);
        console.log(`   IT: ${text.substring(0, 50)}...`);

        const updates = {
            it: text,
            ...(existing?.data || {}),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Traduci Urdu se mancante
        if (!existing?.data?.ur) {
            const urTranslation = await translateWithRetry(text, 'ur');
            if (urTranslation) {
                updates.ur = urTranslation;
                progress.urCount++;
                console.log(`   UR ✅: ${urTranslation.substring(0, 40)}...`);
            }
            await delay(TRANSLATION_DELAY);
        } else {
            console.log(`   UR: già presente`);
        }

        // Traduci Punjabi se mancante
        if (!existing?.data?.pa) {
            const paTranslation = await translateWithRetry(text, 'pa');
            if (paTranslation) {
                updates.pa = paTranslation;
                progress.paCount++;
                console.log(`   PA ✅: ${paTranslation.substring(0, 40)}...`);
            }
            await delay(TRANSLATION_DELAY);
        } else {
            console.log(`   PA: già presente`);
        }

        // Aggiungi al batch
        const docId = existing?.docId || q.id.toString();
        const docRef = db.collection('translations').doc(docId);
        batch.set(docRef, updates, { merge: true });
        batchCount++;

        // Aggiorna progresso
        progress.lastProcessedId = q.id;
        progress.successCount++;

        // Commit batch
        if (batchCount >= BATCH_SIZE) {
            await batch.commit();
            console.log(`\n✅ Salvate ${batchCount} traduzioni!`);
            saveProgress(progress);
            console.log(`📊 Progresso: UR=${progress.urCount}, PA=${progress.paCount}`);

            console.log(`⏳ Pausa ${PAUSE_AFTER_BATCH / 1000}s...`);
            await delay(PAUSE_AFTER_BATCH);

            batch = db.batch();
            batchCount = 0;
        }
    }

    // Commit finale
    if (batchCount > 0) {
        await batch.commit();
        saveProgress(progress);
    }

    console.log('\n\n🎉 COMPLETATO!');
    console.log(`   Totale processate: ${progress.successCount}`);
    console.log(`   Traduzioni Urdu: ${progress.urCount}`);
    console.log(`   Traduzioni Punjabi: ${progress.paCount}`);

    process.exit(0);
}

generateTranslations().catch(console.error);
