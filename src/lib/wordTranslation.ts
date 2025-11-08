import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

export interface WordTranslationCache {
  word: string;
  sourceLang: string;
  targetLang: string;
  translation: string;
  phonetic?: string; // Per lingue con caratteri non latini
  cachedAt: Timestamp;
  usageCount: number;
}

export interface TranslationResult {
  translation: string;
  phonetic?: string;
}

// Cache in memoria per velocità
const memoryCache = new Map<string, TranslationResult>();

function getCacheKey(word: string, sourceLang: string, targetLang: string): string {
  return `${word.toLowerCase()}_${sourceLang}_${targetLang}`;
}

export async function getCachedWordTranslation(
  word: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult | null> {
  const cacheKey = getCacheKey(word, sourceLang, targetLang);

  // Check memory cache first
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  try {
    const cacheRef = doc(db, 'word_translations', cacheKey);
    const cacheSnap = await getDoc(cacheRef);

    if (cacheSnap.exists()) {
      const data = cacheSnap.data() as WordTranslationCache;

      const result: TranslationResult = {
        translation: data.translation,
        phonetic: data.phonetic
      };

      // Salva in memory cache
      memoryCache.set(cacheKey, result);

      // Incrementa usage count
      await setDoc(cacheRef, {
        ...data,
        usageCount: data.usageCount + 1,
        lastUsedAt: Timestamp.now()
      }, { merge: true });

      return result;
    }
  } catch (error) {
    console.error('Error reading translation cache:', error);
  }

  return null;
}

export async function cacheWordTranslation(
  word: string,
  sourceLang: string,
  targetLang: string,
  result: TranslationResult
): Promise<void> {
  const cacheKey = getCacheKey(word, sourceLang, targetLang);

  const cacheData: WordTranslationCache = {
    word: word.toLowerCase(),
    sourceLang,
    targetLang,
    translation: result.translation,
    phonetic: result.phonetic,
    cachedAt: Timestamp.now(),
    usageCount: 1
  };

  try {
    const cacheRef = doc(db, 'word_translations', cacheKey);
    await setDoc(cacheRef, cacheData);

    // Salva anche in memory cache
    memoryCache.set(cacheKey, result);
  } catch (error) {
    console.error('Error caching translation:', error);
  }
}

export async function translateWord(
  word: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  // Usa LibreTranslate API (gratuito e open source)
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: word,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    })
  });

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.status}`);
  }

  const data = await response.json();
  const translation = data.translatedText || word;

  // Per lingue non latine, aggiungi traslitterazione fonetica se possibile
  let phonetic: string | undefined;
  if (['ur', 'hi', 'pa', 'ar', 'zh'].includes(targetLang)) {
    // Nota: LibreTranslate non fornisce automaticamente fonetica
    // Per ora lasciamo undefined, ma possiamo aggiungere servizio separato
    phonetic = undefined;
  }

  return {
    translation,
    phonetic
  };
}

export async function translateWordWithCache(
  word: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  // Pulisci la parola da punteggiatura per cache migliore
  const cleanWord = word.replace(/[^\w\s]/g, '').trim();

  if (!cleanWord) {
    return { translation: word };
  }

  // Check cache
  const cached = await getCachedWordTranslation(cleanWord, sourceLang, targetLang);
  if (cached) {
    return cached;
  }

  // Translate
  const result = await translateWord(cleanWord, sourceLang, targetLang);

  // Cache result
  await cacheWordTranslation(cleanWord, sourceLang, targetLang, result);

  return result;
}
