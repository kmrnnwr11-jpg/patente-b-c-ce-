/**
 * Script per generare traduzioni usando Google Cloud Translation API UFFICIALE
 * Usa la stessa chiave API di Firebase (se abilitata)
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Google API Key (stessa di Firebase)
const GOOGLE_API_KEY = 'AIzaSyCGqV9OwqRKx4DDpo9qqz-vaRkTle1sw6g';

// Inizializza Firebase
const newApp = admin.initializeApp({
    credential: admin.credential.cert('./new-firebase-key.json'),
    projectId: 'patente-b-2025'
}, 'new');

const db = admin.firestore(newApp);

// Progress file per riprendere
const PROGRESS_FILE = './google_translation_progress.json';
const BATCH_SIZE = 50;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Traduzione usando Google Cloud Translation API REST
async function translateWithGoogleCloud(text, targetLang) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            q: text,
            target: targetLang,
            source: 'it',
            format: 'text'
        });

        const options = {
            hostname: 'translation.googleapis.com',
            port: 443,
            path: `/language/translate/v2?key=${GOOGLE_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.error) {
                        reject(new Error(parsed.error.message));
                    } else if (parsed.data?.translations?.[0]) {
                        resolve(parsed.data.translations[0].translatedText);
                    } else {
                        reject(new Error('Unexpected response format'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Carica/Salva progresso
function loadProgress() {
    try {
        if (fs.existsSync(PROGRESS_FILE)) {
            return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
        }
    } catch (e) { }
    return { processedIds: [], urCount: 0, paCount: 0 };
}

function saveProgress(progress) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function main() {
    console.log('🚀 Traduzione con Google Cloud Translation API...\n');

    // Test API prima di iniziare
    console.log('🧪 Test API...');
    try {
        const testResult = await translateWithGoogleCloud('Ciao mondo', 'ur');
        console.log(`✅ API funzionante! Test: "Ciao mondo" → "${testResult}"\n`);
    } catch (error) {
        console.error('❌ ERRORE API:', error.message);
        console.error('\n⚠️ La Translation API potrebbe non essere abilitata.');
        console.error('   Vai su: https://console.cloud.google.com/apis/library/translate.googleapis.com');
        console.error('   e abilita "Cloud Translation API" per il tuo progetto.\n');
        process.exit(1);
    }

    // Carica progresso
    let progress = loadProgress();
    console.log(`📊 Progresso: UR=${progress.urCount}, PA=${progress.paCount}\n`);

    // Carica domande
    const quizPath = path.join(__dirname, '../assets/data/quiz.json');
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    console.log(`📚 Totale domande: ${quizData.length}`);

    // Carica traduzioni esistenti
    const existingSnapshot = await db.collection('translations').get();
    const existingByIt = {};
    for (const doc of existingSnapshot.docs) {
        const data = doc.data();
        if (data.it) {
            existingByIt[data.it.trim()] = { docId: doc.id, data };
        }
    }
    console.log(`📋 Traduzioni esistenti: ${existingSnapshot.docs.length}\n`);

    // Trova domande da processare
    const toProcess = quizData.filter(q => {
        if (!q.domanda) return false;
        if (progress.processedIds.includes(q.id)) return false;

        const existing = existingByIt[q.domanda.trim()];
        return !existing || !existing.data.ur || !existing.data.pa;
    });

    console.log(`🔍 Domande da tradurre: ${toProcess.length}\n`);

    let batch = db.batch();
    let batchCount = 0;

    for (let i = 0; i < toProcess.length; i++) {
        const q = toProcess[i];
        const text = q.domanda.trim();
        const existing = existingByIt[text];

        console.log(`📝 [${i + 1}/${toProcess.length}] ID: ${q.id}`);
        console.log(`   IT: ${text.substring(0, 50)}...`);

        const updates = { it: text, ...(existing?.data || {}) };

        try {
            // Traduci Urdu
            if (!existing?.data?.ur) {
                const ur = await translateWithGoogleCloud(text, 'ur');
                updates.ur = ur;
                progress.urCount++;
                console.log(`   UR ✅`);
                await delay(100);
            }

            // Traduci Punjabi
            if (!existing?.data?.pa) {
                const pa = await translateWithGoogleCloud(text, 'pa');
                updates.pa = pa;
                progress.paCount++;
                console.log(`   PA ✅`);
                await delay(100);
            }

            // Aggiungi al batch
            const docId = existing?.docId || q.id.toString();
            batch.set(db.collection('translations').doc(docId), {
                ...updates,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            batchCount++;

            progress.processedIds.push(q.id);

            // Commit batch
            if (batchCount >= BATCH_SIZE) {
                await batch.commit();
                saveProgress(progress);
                console.log(`\n✅ Salvate ${batchCount} traduzioni (UR: ${progress.urCount}, PA: ${progress.paCount})\n`);
                batch = db.batch();
                batchCount = 0;
            }

        } catch (error) {
            console.error(`   ❌ Errore: ${error.message}`);
            // Salva progresso comunque
            saveProgress(progress);
        }
    }

    // Commit finale
    if (batchCount > 0) {
        await batch.commit();
        saveProgress(progress);
    }

    console.log('\n🎉 COMPLETATO!');
    console.log(`   Urdu: ${progress.urCount}`);
    console.log(`   Punjabi: ${progress.paCount}`);

    process.exit(0);
}

main().catch(console.error);
