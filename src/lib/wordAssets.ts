import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;

const VOICE_IDS: Record<string, string | undefined> = {
  ur: import.meta.env.VITE_ELEVENLABS_VOICE_UR,
  pa: import.meta.env.VITE_ELEVENLABS_VOICE_PA,
  hi: import.meta.env.VITE_ELEVENLABS_VOICE_HI,
  en: import.meta.env.VITE_ELEVENLABS_VOICE_EN,
};

interface WordAsset {
  word: string;
  sourceLang: string;
  targetLang: string;
  translation: string;
  phonetic?: string;
  audioUrl?: string;
  createdAt: Timestamp;
  usageCount: number;
  version: number;
}

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '').trim();
}

function getDocId(word: string, targetLang: string): string {
  return `${normalizeWord(word)}_${targetLang}`;
}

function getAudioPath(word: string, targetLang: string): string {
  return `audio/words/${targetLang}/${encodeURIComponent(normalizeWord(word))}.mp3`;
}

// Traduzione con Google Translate (primario)
async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google Translate API key not configured');
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Google Translate error: ${response.status}`);
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

// Traduzione con LibreTranslate (fallback gratuito)
async function translateWithLibre(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  console.log(`🌐 Traduzione LibreTranslate: "${text}" (${sourceLang} → ${targetLang})`);
  
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('LibreTranslate error:', response.status, errorText);
    throw new Error(`LibreTranslate error: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Traduzione ricevuta:', data.translatedText);
  return data.translatedText;
}

// Aggiungi dopo translateWithLibre
async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (!DEEPL_API_KEY) {
    throw new Error('DeepL API key not configured');
  }

  console.log(`🔮 Traduzione DeepL: "${text}" (${sourceLang} → ${targetLang})`);

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}` },
    body: new URLSearchParams({
      'text': text,
      'source_lang': sourceLang.toUpperCase(),
      'target_lang': targetLang.toUpperCase(),
      'format': 'text'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DeepL error:', response.status, errorText);
    throw new Error(`DeepL error: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ DeepL traduzione ricevuta:', data.translations[0].text);
  return data.translations[0].text;
}

// Aggiorna translateText per usare DeepL primario
async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    // Prova DeepL prima
    return await translateWithDeepL(text, sourceLang, targetLang);
  } catch (error) {
    console.warn('DeepL fallito, uso LibreTranslate:', error);
    return await translateWithLibre(text, sourceLang, targetLang);
  }
}

// Genera audio con ElevenLabs
async function generateAudio(
  text: string,
  targetLang: string
): Promise<string | null> {
  const voiceId = VOICE_IDS[targetLang];
  
  if (!ELEVENLABS_API_KEY || !voiceId) {
    console.warn(`Audio non disponibile per ${targetLang}: manca API key o voice ID`);
    return null;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('ElevenLabs error:', error);
    return null;
  }
}

// Salva audio su Storage e ritorna URL
async function saveAudioToStorage(
  audioBlob: Blob,
  word: string,
  targetLang: string
): Promise<string> {
  const audioRef = ref(storage, getAudioPath(word, targetLang));
  await uploadBytes(audioRef, audioBlob, { contentType: 'audio/mpeg' });
  return await getDownloadURL(audioRef);
}

// Ottieni audio da Storage (se esiste)
async function getAudioFromStorage(
  word: string,
  targetLang: string
): Promise<string | null> {
  try {
    const audioRef = ref(storage, getAudioPath(word, targetLang));
    return await getDownloadURL(audioRef);
  } catch {
    return null;
  }
}

// Funzione principale: ottieni o crea asset parola (traduzione + audio)
export async function getOrCreateWordAssets(
  word: string,
  sourceLang: string,
  targetLang: string
): Promise<{ translation: string; audioUrl: string | null }> {
  const normWord = normalizeWord(word);
  
  if (!normWord) {
    return { translation: word, audioUrl: null };
  }

  const docId = getDocId(normWord, targetLang);
  const docRef = doc(db, 'word_translations', docId);

  // 1) Controlla cache Firestore
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    const data = snap.data() as WordAsset;
    
    // Incrementa usage count
    setDoc(docRef, { usageCount: data.usageCount + 1 }, { merge: true }).catch(() => {});
    
    return {
      translation: data.translation,
      audioUrl: data.audioUrl || null
    };
  }

  // 2) Non in cache: genera traduzione
  const translation = await translateText(normWord, sourceLang, targetLang);

  // 3) Genera audio (se configurato)
  let audioUrl: string | null = null;
  
  // Prima controlla se esiste già su Storage
  audioUrl = await getAudioFromStorage(normWord, targetLang);
  
  if (!audioUrl) {
    // Genera nuovo audio
    const audioBlob = await generateAudio(translation, targetLang);
    
    if (audioBlob) {
      audioUrl = await saveAudioToStorage(audioBlob, normWord, targetLang);
    }
  }

  // 4) Salva tutto in Firestore per riuso
  const assetData: WordAsset = {
    word: normWord,
    sourceLang,
    targetLang,
    translation,
    audioUrl: audioUrl || undefined,
    createdAt: Timestamp.now(),
    usageCount: 1,
    version: 1
  };

  await setDoc(docRef, assetData);

  return { translation, audioUrl };
}

// Funzione per pre-generare asset (batch)
export async function prewarmWordAssets(
  words: string[],
  sourceLang: string,
  targetLang: string,
  onProgress?: (current: number, total: number, word: string) => void
): Promise<void> {
  const total = words.length;
  
  for (let i = 0; i < total; i++) {
    const word = words[i];
    
    try {
      await getOrCreateWordAssets(word, sourceLang, targetLang);
      
      if (onProgress) {
        onProgress(i + 1, total, word);
      }
      
      // Rate limit: pausa tra richieste
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Errore prewarm parola "${word}":`, error);
    }
  }
}

