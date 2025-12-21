/**
 * Script per verificare le traduzioni nel NUOVO Firebase
 */

const admin = require('firebase-admin');

// Inizializza nuovo progetto
const newApp = admin.initializeApp({
    credential: admin.credential.cert('./new-firebase-key.json'),
    projectId: 'patente-b-2025'
}, 'new');

const newDb = admin.firestore(newApp);

async function verifyMigration() {
    console.log('🔍 Verifico traduzioni nel nuovo Firebase...\n');

    try {
        const snapshot = await newDb.collection('translations').get();
        console.log(`📊 translations: ${snapshot.docs.length} documenti\n`);

        // Conta traduzioni per lingua
        let urCount = 0, paCount = 0, enCount = 0, hiCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.ur) urCount++;
            if (data.pa) paCount++;
            if (data.en) enCount++;
            if (data.hi) hiCount++;
        }

        console.log('📈 Traduzioni disponibili:');
        console.log(`   Urdu (ur): ${urCount}`);
        console.log(`   Punjabi (pa): ${paCount}`);
        console.log(`   English (en): ${enCount}`);
        console.log(`   Hindi (hi): ${hiCount}`);

        // Mostra esempi
        console.log('\n📝 Primi 3 esempi:');
        for (let i = 0; i < Math.min(3, snapshot.docs.length); i++) {
            const doc = snapshot.docs[i];
            const data = doc.data();
            console.log(`\n   IT: ${data.it?.substring(0, 60)}...`);
            if (data.ur) console.log(`   UR: ${data.ur?.substring(0, 60)}...`);
            if (data.pa) console.log(`   PA: ${data.pa?.substring(0, 60)}...`);
        }

    } catch (error) {
        console.error('❌ Errore:', error);
    }

    process.exit(0);
}

verifyMigration();
