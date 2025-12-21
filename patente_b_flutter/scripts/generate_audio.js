/**
 * Script per generare file audio MP3 per tutte le domande tradotte
 * Usa Google Cloud Text-to-Speech API per Urdu e Punjabi
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Google API Key
const GOOGLE_API_KEY = 'AIzaSyCGqV9OwqRKx4DDpo9qqz-vaRkTle1sw6g';
const TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// Inizializza Firebase
const newApp = admin.initializeApp({
    credential: admin.credential.cert('./new-firebase-key.json'),
    projectId: 'patente-b-2025',
    storageBucket: 'patente-b-2025.firebasestorage.app'
}, 'audio-gen');

const db = admin.firestore(newApp);
const bucket = admin.storage(newApp).bucket();

// Configurazione voci
const VOICE_CONFIG = {
    ur: {
        languageCode: 'ur-IN',
        name: 'ur-IN-Wavenet-A',
        ssmlGender: 'FEMALE'
    },
    pa: {
        languageCode: 'pa-IN',
        name: 'pa-IN-Wavenet-A',
        ssmlGender: 'FEMALE'
    }
};

// Progress file
const PROGRESS_FILE = './audio_generation_progress.json';
const BATCH_SIZE = 10;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Genera audio con Google TTS API
async function generateAudio(text, langCode) {
    const voiceConfig = VOICE_CONFIG[langCode];
    if (!voiceConfig) throw new Error(`Language ${langCode} not supported`);

    return new Promise((resolve, reject) => {
        const requestBody = JSON.stringify({
            input: { text },
            voice: {
                languageCode: voiceConfig.languageCode,
                name: voiceConfig.name,
                ssmlGender: voiceConfig.ssmlGender
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.9,
                pitch: 0.0
            }
        });

        const url = new URL(`${TTS_URL}?key=${GOOGLE_API_KEY}`);

        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
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
                    } else if (parsed.audioContent) {
                        // Ritorna i bytes del file MP3
                        const audioBuffer = Buffer.from(parsed.audioContent, 'base64');
                        resolve(audioBuffer);
                    } else {
                        reject(new Error('No audio content in response'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(requestBody);
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
    return {
        processedIds: [],
        urCount: 0,
        paCount: 0,
        errors: []
    };
}

function saveProgress(progress) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Upload audio to Firebase Storage
async function uploadToStorage(audioBuffer, questionId, langCode) {
    const fileName = `audio/${langCode}/${questionId}.mp3`;
    const file = bucket.file(fileName);

    await file.save(audioBuffer, {
        metadata: {
            contentType: 'audio/mpeg',
            cacheControl: 'public, max-age=31536000' // Cache per 1 anno
        }
    });

    // Ottieni URL pubblico
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return publicUrl;
}

// Salva URL audio in Firestore
async function saveAudioUrl(questionId, langCode, audioUrl) {
    const docRef = db.collection('translations').doc(questionId.toString());
    await docRef.set({
        [`${langCode}_audio`]: audioUrl,
        audioUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
}

async function main() {
    console.log('🎙️ Generazione audio MP3 per domande...\n');

    // Carica progresso
    let progress = loadProgress();
    console.log(`📊 Progresso precedente: UR=${progress.urCount}, PA=${progress.paCount}\n`);

    // Carica traduzioni da Firestore
    console.log('📚 Caricamento traduzioni...');
    const snapshot = await db.collection('translations').get();
    console.log(`📚 Trovate ${snapshot.docs.length} traduzioni\n`);

    let generated = 0;
    let errors = 0;

    for (const doc of snapshot.docs) {
        const data = doc.data();
        const questionId = doc.id;

        // Skip se già processato
        if (progress.processedIds.includes(questionId)) {
            continue;
        }

        console.log(`\n📝 [${generated + 1}] ID: ${questionId}`);

        // Genera audio per Urdu
        if (data.ur && !data.ur_audio) {
            try {
                console.log('   🎙️ Generando audio Urdu...');
                const audioBuffer = await generateAudio(data.ur, 'ur');
                const audioUrl = await uploadToStorage(audioBuffer, questionId, 'ur');
                await saveAudioUrl(questionId, 'ur', audioUrl);
                progress.urCount++;
                console.log(`   ✅ UR: ${audioUrl.substring(0, 60)}...`);
                await delay(200); // Rate limiting
            } catch (e) {
                console.error(`   ❌ UR Error: ${e.message}`);
                errors++;
            }
        }

        // Genera audio per Punjabi
        if (data.pa && !data.pa_audio) {
            try {
                console.log('   🎙️ Generando audio Punjabi...');
                const audioBuffer = await generateAudio(data.pa, 'pa');
                const audioUrl = await uploadToStorage(audioBuffer, questionId, 'pa');
                await saveAudioUrl(questionId, 'pa', audioUrl);
                progress.paCount++;
                console.log(`   ✅ PA: ${audioUrl.substring(0, 60)}...`);
                await delay(200); // Rate limiting
            } catch (e) {
                console.error(`   ❌ PA Error: ${e.message}`);
                errors++;
            }
        }

        progress.processedIds.push(questionId);
        generated++;

        // Salva progresso ogni BATCH_SIZE
        if (generated % BATCH_SIZE === 0) {
            saveProgress(progress);
            console.log(`\n💾 Progresso salvato: UR=${progress.urCount}, PA=${progress.paCount}`);
        }
    }

    // Salva progresso finale
    saveProgress(progress);

    console.log('\n\n🎉 COMPLETATO!');
    console.log(`   Audio Urdu generati: ${progress.urCount}`);
    console.log(`   Audio Punjabi generati: ${progress.paCount}`);
    console.log(`   Errori: ${errors}`);

    process.exit(0);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
