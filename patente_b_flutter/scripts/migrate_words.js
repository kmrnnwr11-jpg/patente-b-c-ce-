/**
 * Script per migrare la collezione word_translations da patente-b-2-o a patente-b-2025
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

async function migrateWords() {
    console.log('🔄 Inizio migrazione word_translations...\n');

    try {
        console.log('📥 Caricando parole da patente-b-2-o...');
        const snapshot = await oldDb.collection('word_translations').get();

        console.log(`   Trovate ${snapshot.docs.length} parole\n`);
        console.log('📤 Caricando parole in patente-b-2025...');

        let batch = newDb.batch();
        let batchCount = 0;
        let totalCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            const docId = doc.id; // Use existing ID (cache key format: word_source_target)

            const docRef = newDb.collection('word_translations').doc(docId);
            batch.set(docRef, data);

            batchCount++;
            totalCount++;

            if (batchCount >= 400) {
                await batch.commit();
                console.log(`   ✅ Caricate ${totalCount} parole...`);
                batch = newDb.batch();
                batchCount = 0;
            }
        }

        if (batchCount > 0) {
            await batch.commit();
        }

        console.log(`\n🎉 Migrazione completata! ${totalCount} parole migrate.\n`);

    } catch (error) {
        console.error('❌ Errore durante la migrazione:', error);
    }

    process.exit(0);
}

migrateWords();
