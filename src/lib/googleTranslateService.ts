/**
 * Servizio di traduzione usando Google Translate API
 * Per traduzioni professionali e accurate
 */

interface TranslationCache {
  [questionId: number]: {
    en: string;
    timestamp: number;
  };
}

// Cache locale delle traduzioni
let translationCache: TranslationCache = {};

// Carica cache da localStorage
const loadCacheFromStorage = (): void => {
  try {
    const cached = localStorage.getItem('professionalTranslationsCache');
    if (cached) {
      translationCache = JSON.parse(cached);
      console.log('✅ Loaded', Object.keys(translationCache).length, 'cached translations');
    }
  } catch (error) {
    console.error('Error loading translation cache:', error);
  }
};

// Salva cache in localStorage
const saveCacheToStorage = (): void => {
  try {
    localStorage.setItem('professionalTranslationsCache', JSON.stringify(translationCache));
  } catch (error) {
    console.error('Error saving translation cache:', error);
  }
};

/**
 * OPZIONE 1: Usa Google Translate API (MIGLIORE QUALITÀ)
 * Richiede API Key da Google Cloud Console
 */
export const translateWithGoogleAPI = async (
  text: string,
  targetLang: string = 'en',
  apiKey?: string
): Promise<string> => {
  if (!apiKey) {
    console.warn('⚠️ Google Translate API key not provided. Using fallback translation.');
    return text; // Fallback al testo originale
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'it',
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    
    console.log('✅ Google Translate:', { original: text.substring(0, 50), translated: translatedText.substring(0, 50) });
    
    return translatedText;
  } catch (error) {
    console.error('Google Translate API error:', error);
    return text; // Fallback
  }
};

/**
 * OPZIONE 2: Usa traduzioni pre-generate da file JSON
 * Carica traduzioni professionali già fatte
 */
export const translateFromPregenerated = async (
  questionId: number
): Promise<string | null> => {
  try {
    // Importa il file con traduzioni pre-generate
    const response = await fetch('/translations/quiz-en.json');
    if (!response.ok) return null;
    
    const translations = await response.json();
    return translations[questionId] || null;
  } catch (error) {
    console.error('Error loading pregenerated translations:', error);
    return null;
  }
};

/**
 * OPZIONE 3: Sistema misto con cache intelligente
 * Usa cache → Pre-generate → API → Fallback
 */
export const getSmartTranslation = async (
  questionId: number,
  text: string,
  apiKey?: string
): Promise<string> => {
  // 1. Controlla cache locale
  if (translationCache[questionId]) {
    console.log('📦 Using cached translation for question', questionId);
    return translationCache[questionId].en;
  }

  // 2. Prova traduzioni pre-generate
  const pregenerated = await translateFromPregenerated(questionId);
  if (pregenerated) {
    console.log('📁 Using pregenerated translation for question', questionId);
    // Salva in cache
    translationCache[questionId] = {
      en: pregenerated,
      timestamp: Date.now()
    };
    saveCacheToStorage();
    return pregenerated;
  }

  // 3. Usa Google Translate API se disponibile
  if (apiKey) {
    const translated = await translateWithGoogleAPI(text, 'en', apiKey);
    if (translated !== text) {
      // Salva in cache
      translationCache[questionId] = {
        en: translated,
        timestamp: Date.now()
      };
      saveCacheToStorage();
      return translated;
    }
  }

  // 4. Fallback a traduzione automatica base
  console.log('⚠️ Using basic translation for question', questionId);
  return text; // Verrà gestito da autoTranslateBasic
};

/**
 * TRADUZIONE PER TESTO DI TEORIA
 * Usa cache locale (per chiave di sezione) + Google API + fallback
 * @param sectionId - ID univoco della sezione teoria (es: "signals-intro-1")
 * @param text - Testo italiano da tradurre
 * @param targetLang - Lingua target (default: 'en')
 * @param apiKey - Google Translate API key (opzionale)
 * @returns Testo tradotto o originale se traduzione non disponibile
 */
export const getTheoryTranslation = async (
  sectionId: string,
  text: string,
  targetLang: string = 'en',
  apiKey?: string
): Promise<string> => {
  // Crea una chiave hash numerica da sectionId + lingua per riusare translationCache
  const cacheKeyString = `${sectionId}_${targetLang}`;
  let cacheKey = 0;
  for (let i = 0; i < cacheKeyString.length; i++) {
    cacheKey = (cacheKey * 31 + cacheKeyString.charCodeAt(i)) >>> 0;
  }

  // 1. Controlla cache locale
  if ((translationCache as any)[cacheKey]) {
    console.log('📦 Using cached theory translation for section', sectionId);
    return (translationCache as any)[cacheKey].en;
  }

  // 2. Usa Google Translate API se disponibile
  if (apiKey) {
    const translated = await translateWithGoogleAPI(text, targetLang, apiKey);
    if (translated !== text) {
      (translationCache as any)[cacheKey] = {
        en: translated,
        timestamp: Date.now()
      };
      saveCacheToStorage();
      console.log('✅ Cached theory translation for section', sectionId);
      return translated;
    }
  }

  // 3. Fallback: restituisci il testo originale
  console.log('⚠️ Using original text for theory section', sectionId);
  return text;
};

/**
 * UTILITY: Genera file con tutte le traduzioni
 * Utile per pre-tradurre tutte le domande una volta
 */
export const generateAllTranslations = async (
  questions: Array<{ id: number; domanda: string }>,
  apiKey: string
): Promise<Record<number, string>> => {
  const translations: Record<number, string> = {};
  
  console.log('🔄 Starting batch translation of', questions.length, 'questions...');
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    // Rate limiting: 1 richiesta al secondo
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
    
    try {
      const translated = await translateWithGoogleAPI(question.domanda, 'en', apiKey);
      translations[question.id] = translated;
      
      console.log(`✅ Translated ${i + 1}/${questions.length}:`, question.domanda.substring(0, 40));
    } catch (error) {
      console.error(`❌ Failed to translate question ${question.id}:`, error);
      translations[question.id] = question.domanda; // Mantieni originale
    }
  }
  
  console.log('✅ Batch translation completed!');
  console.log('📥 Download this JSON and save as /public/translations/quiz-en.json');
  console.log(JSON.stringify(translations, null, 2));
  
  return translations;
};

/**
 * UTILITY: Scarica traduzioni come file JSON
 */
export const downloadTranslationsAsJSON = (translations: Record<number, string>): void => {
  const dataStr = JSON.stringify(translations, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quiz-translations-en.json';
  link.click();
  
  URL.revokeObjectURL(url);
  console.log('✅ Translations downloaded as JSON file');
};

// Inizializza cache all'avvio
loadCacheFromStorage();

export default {
  translateWithGoogleAPI,
  translateFromPregenerated,
  getSmartTranslation,
  generateAllTranslations,
  downloadTranslationsAsJSON
};


