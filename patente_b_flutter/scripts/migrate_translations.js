/**
 * Script per migrare traduzioni da patente-b-2-o a patente-b-2025
 * 
 * ISTRUZIONI:
 * 1. Copia il file della chiave del service account nella cartella scripts/
 * 2. Rinomina il file in: old-firebase-key.json (per patente-b-2-o)
 * 3. Genera una nuova chiave per patente-b-2025 e salvala come: new-firebase-key.json
 * 4. Esegui: node migrate_translations.js
 */

const admin = require('firebase-admin');

// Configurazione progetti Firebase
const OLD_PROJECT_ID = 'patente-b-2-o';
const NEW_PROJECT_ID = 'patente-b-2025';

// Inizializza vecchio progetto (sorgente)
const oldApp = admin.initializeApp({
    credential: admin.credential.cert('./old-firebase-key.json'),
    projectId: OLD_PROJECT_ID
}, 'old');

// Inizializza nuovo progetto (destinazione)
const newApp = admin.initializeApp({
    credential: admin.credential.cert('./new-firebase-key.json'),
    projectId: NEW_PROJECT_ID
}, 'new');

const oldDb = admin.firestore(oldApp);
const newDb = admin.firestore(newApp);

async function migrateTranslations() {
    console.log('🔄 Inizio migrazione traduzioni...\n');

    try {
        // 1. Leggi tutte le traduzioni dal vecchio progetto
        console.log('📥 Caricando traduzioni da patente-b-2-o...');
        const snapshot = await oldDb.collection('theory_translations').get();

        console.log(`   Trovate ${snapshot.docs.length} traduzioni\n`);

        // 2. Raggruppa per originalText per unire le lingue
        const translationsByText = {};

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const originalText = data.originalText;
            const lang = data.lang;
            const translation = data.translation;

            if (!originalText || !lang || !translation) continue;

            if (!translationsByText[originalText]) {
                translationsByText[originalText] = {
                    it: originalText,
                };
            }

            translationsByText[originalText][lang] = translation;
        }

        const groupedCount = Object.keys(translationsByText).length;
        console.log(`📊 Raggruppate in ${groupedCount} testi unici\n`);

        // 3. Scrivi nel nuovo progetto
        console.log('📤 Caricando traduzioni in patente-b-2025...');

        let batch = newDb.batch();
        let batchCount = 0;
        let totalCount = 0;

        for (const [originalText, translations] of Object.entries(translationsByText)) {
            // Crea un ID basato sull'hash del testo originale
            const docId = Buffer.from(originalText).toString('base64').substring(0, 40);

            const docRef = newDb.collection('translations').doc(docId);
            batch.set(docRef, {
                ...translations,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            batchCount++;
            totalCount++;

            // Firestore supporta max 500 operazioni per batch
            if (batchCount >= 400) {
                await batch.commit();
                console.log(`   ✅ Caricate ${totalCount} traduzioni...`);
                batch = newDb.batch(); // Crea nuovo batch
                batchCount = 0;
            }
        }

        // Commit finale
        if (batchCount > 0) {
            await batch.commit();
        }

        console.log(`\n🎉 Migrazione completata! ${totalCount} traduzioni migrate.\n`);

    } catch (error) {
        console.error('❌ Errore durante la migrazione:', error);
    }

    process.exit(0);
}

// Esegui
migrateTranslations();
