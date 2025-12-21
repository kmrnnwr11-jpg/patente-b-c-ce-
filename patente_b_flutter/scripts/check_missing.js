/**
 * Script per verificare e forzare upload traduzioni mancanti su Firebase
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inizializza Firebase
const newApp = admin.initializeApp({
    credential: admin.credential.cert('./new-firebase-key.json'),
    projectId: 'patente-b-2025'
}, 'new');

const db = admin.firestore(newApp);

async function forceUpload() {
    console.log('🔄 Verifica e upload forzato traduzioni...\n');

    // Carica tutte le domande
    const quizPath = path.join(__dirname, '../assets/data/quiz.json');
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    console.log(`📚 Totale domande quiz: ${quizData.length}\n`);

    // Carica traduzioni esistenti da Firebase
    const snapshot = await db.collection('translations').get();
    const existingById = {};
    const existingByText = {};

    for (const doc of snapshot.docs) {
        const data = doc.data();
        existingById[doc.id] = data;
        if (data.it) {
            existingByText[data.it.trim()] = { id: doc.id, ...data };
        }
    }

    console.log(`📋 Traduzioni in Firebase: ${snapshot.docs.length}`);

    // Conta quelle con UR e PA
    let hasUr = 0, hasPa = 0, needsUr = 0, needsPa = 0;
    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.ur) hasUr++;
        if (data.pa) hasPa++;
    }

    console.log(`   Con Urdu: ${hasUr}`);
    console.log(`   Con Punjabi: ${hasPa}\n`);

    // Trova domande senza traduzione
    const missingTranslations = [];
    for (const q of quizData) {
        const text = q.domanda?.trim();
        if (!text) continue;

        const existing = existingByText[text] || existingById[q.id.toString()];

        if (!existing || !existing.ur || !existing.pa) {
            missingTranslations.push({
                id: q.id,
                text,
                hasUr: !!existing?.ur,
                hasPa: !!existing?.pa,
                docId: existing?.id || null
            });
        }
    }

    console.log(`🔍 Domande senza traduzione completa: ${missingTranslations.length}\n`);

    if (missingTranslations.length === 0) {
        console.log('✅ Tutte le domande hanno già traduzione UR e PA!');
        process.exit(0);
    }

    // Mostra primi 5 esempi
    console.log('📝 Esempi mancanti:');
    for (let i = 0; i < Math.min(5, missingTranslations.length); i++) {
        const m = missingTranslations[i];
        console.log(`   ID ${m.id}: ${m.text.substring(0, 40)}... (UR: ${m.hasUr}, PA: ${m.hasPa})`);
    }

    process.exit(0);
}

forceUpload().catch(console.error);
