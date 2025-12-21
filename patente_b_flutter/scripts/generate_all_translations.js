/**
 * Script per generare e caricare TUTTE le traduzioni mancanti per Urdu/Punjabi
 * Usa Google Translate API gratuito
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Inizializza nuovo Firebase
const newApp = admin.initializeApp({
    credential: admin.credential.cert('./new-firebase-key.json'),
    projectId: 'patente-b-2025'
}, 'new');

const db = admin.firestore(newApp);

// Delay per evitare rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function translateText(text, targetLang) {
    try {
        const result = await translate(text, { from: 'it', to: targetLang });
        return result.text;
    } catch (error) {
        console.error(`   ❌ Errore traduzione: ${error.message}`);
        return null;
    }
}

async function generateAllTranslations() {
    console.log('🚀 Generazione traduzioni complete Urdu/Punjabi...\n');

    // 1. Carica tutte le domande dal file quiz.json
    const quizPath = path.join(__dirname, '../assets/data/quiz.json');
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    console.log(`📚 Caricate ${quizData.length} domande dal quiz.json\n`);

    // 2. Carica traduzioni esistenti da Firebase
    const existingSnapshot = await db.collection('translations').get();
    const existingByIt = {};
    for (const doc of existingSnapshot.docs) {
        const data = doc.data();
        if (data.it) {
            existingByIt[data.it.trim()] = { docId: doc.id, data };
        }
    }
    console.log(`📋 Traduzioni esistenti: ${existingSnapshot.docs.length}\n`);

    // 3. Trova domande mancanti
    const missingQuestions = [];
    for (const q of quizData) {
        const text = q.domanda?.trim();
        if (!text) continue;

        const existing = existingByIt[text];
        const needsUr = !existing || !existing.data.ur;
        const needsPa = !existing || !existing.data.pa;

        if (needsUr || needsPa) {
            missingQuestions.push({
                id: q.id,
                text,
                existingDocId: existing?.docId,
                existingData: existing?.data || { it: text },
                needsUr,
                needsPa
            });
        }
    }

    console.log(`🔍 Domande che necessitano traduzione: ${missingQuestions.length}`);
    console.log(`   - Mancanti Urdu: ${missingQuestions.filter(q => q.needsUr).length}`);
    console.log(`   - Mancanti Punjabi: ${missingQuestions.filter(q => q.needsPa).length}\n`);

    // 4. Traduci e carica in batch
    let batch = db.batch();
    let batchCount = 0;
    let totalProcessed = 0;
    let successUr = 0, successPa = 0;

    for (const q of missingQuestions) {
        console.log(`\n📝 [${totalProcessed + 1}/${missingQuestions.length}] ID: ${q.id}`);
        console.log(`   IT: ${q.text.substring(0, 50)}...`);

        const updates = { ...q.existingData, it: q.text };

        // Traduci Urdu se mancante
        if (q.needsUr) {
            const urTranslation = await translateText(q.text, 'ur');
            if (urTranslation) {
                updates.ur = urTranslation;
                successUr++;
                console.log(`   UR: ${urTranslation.substring(0, 50)}...`);
            }
            await delay(200); // Rate limiting
        }

        // Traduci Punjabi se mancante
        if (q.needsPa) {
            const paTranslation = await translateText(q.text, 'pa');
            if (paTranslation) {
                updates.pa = paTranslation;
                successPa++;
                console.log(`   PA: ${paTranslation.substring(0, 50)}...`);
            }
            await delay(200); // Rate limiting
        }

        // Aggiungi al batch
        const docId = q.existingDocId || q.id.toString();
        const docRef = db.collection('translations').doc(docId);
        batch.set(docRef, {
            ...updates,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        batchCount++;
        totalProcessed++;

        // Commit batch ogni 100 documenti
        if (batchCount >= 100) {
            await batch.commit();
            console.log(`\n✅ Salvate ${totalProcessed} traduzioni...`);
            batch = db.batch();
            batchCount = 0;
        }

        // Salva progresso ogni 500
        if (totalProcessed % 500 === 0) {
            console.log(`\n📊 Progresso: ${totalProcessed}/${missingQuestions.length}`);
            console.log(`   Urdu: ${successUr}, Punjabi: ${successPa}`);
        }
    }

    // Commit finale
    if (batchCount > 0) {
        await batch.commit();
    }

    console.log('\n\n🎉 COMPLETATO!');
    console.log(`   Totale processate: ${totalProcessed}`);
    console.log(`   Nuove traduzioni Urdu: ${successUr}`);
    console.log(`   Nuove traduzioni Punjabi: ${successPa}`);

    process.exit(0);
}

generateAllTranslations().catch(console.error);
