/**
 * Script per verificare le traduzioni esistenti nel vecchio Firebase
 */

const admin = require('firebase-admin');

// Inizializza vecchio progetto
const oldApp = admin.initializeApp({
    credential: admin.credential.cert('./old-firebase-key.json'),
    projectId: 'patente-b-2-o'
}, 'old');

const oldDb = admin.firestore(oldApp);

async function checkTranslations() {
    console.log('🔍 Verifico traduzioni nel vecchio Firebase...\n');

    try {
        // Controlla la collezione theory_translations
        const snapshot = await oldDb.collection('theory_translations').get();
        console.log(`📊 theory_translations: ${snapshot.docs.length} documenti\n`);

        // Conta per lingua
        const langCounts = {};
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const lang = data.lang;
            if (lang) {
                langCounts[lang] = (langCounts[lang] || 0) + 1;
            }
        }

        console.log('📈 Traduzioni per lingua:');
        for (const [lang, count] of Object.entries(langCounts)) {
            console.log(`   ${lang}: ${count}`);
        }

        // Mostra qualche esempio
        console.log('\n📝 Primi 3 esempi:');
        for (let i = 0; i < Math.min(3, snapshot.docs.length); i++) {
            const doc = snapshot.docs[i];
            const data = doc.data();
            console.log(`\n   ID: ${doc.id}`);
            console.log(`   Lang: ${data.lang}`);
            console.log(`   Original: ${data.originalText?.substring(0, 50)}...`);
            console.log(`   Translation: ${data.translation?.substring(0, 50)}...`);
        }

    } catch (error) {
        console.error('❌ Errore:', error);
    }

    process.exit(0);
}

checkTranslations();
