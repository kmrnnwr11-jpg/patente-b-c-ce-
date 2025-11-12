/**
 * Sistema di traduzione VELOCE per parole singole
 * PRIORITÀ:
 * 1. Mappatura da domanda tradotta (0ms) ⚡⚡⚡
 * 2. Dizionario istantaneo multi-lingua (0ms) ⚡⚡
 * 3. Cache memoria (< 1ms) ⚡
 * 4. Cache localStorage (< 10ms)
 * 5. API (1-8 secondi) - ULTIMO RESORT
 */

import { translateWord as apiTranslateWord } from './translationCache';
import { getWordTranslationFromQuestion } from './wordMapping';

// Cache in-memory per traduzioni rapide
const translationMemoryCache = new Map<string, Record<string, string>>();

/**
 * Dizionario multi-lingua per traduzioni istantanee
 * Contiene le parole più comuni del quiz patente in: EN, UR, HI, PA
 */
const INSTANT_DICTIONARY: Record<string, Record<string, string>> = {
  // Verbi comuni
  'è': { en: 'is', ur: 'ہے', hi: 'है', pa: 'ਹੈ' },
  'sono': { en: 'are', ur: 'ہیں', hi: 'हैं', pa: 'ਹਨ' },
  'può': { en: 'can', ur: 'سکتا ہے', hi: 'सकता है', pa: 'ਸਕਦਾ ਹੈ' },
  'deve': { en: 'must', ur: 'چاہیے', hi: 'चाहिए', pa: 'ਚਾਹੀਦਾ' },
  'possono': { en: 'can', ur: 'سکتے ہیں', hi: 'सकते हैं', pa: 'ਸਕਦੇ ਹਨ' },
  'devono': { en: 'must', ur: 'چاہیے', hi: 'चाहिए', pa: 'ਚਾਹੀਦਾ' },
  'consente': { en: 'allows', ur: 'اجازت دیتا ہے', hi: 'अनुमति देता है', pa: 'ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ' },
  'vieta': { en: 'prohibits', ur: 'منع کرتا ہے', hi: 'निषेध करता है', pa: 'ਮਨ੍ਹਾ ਕਰਦਾ ਹੈ' },
  'obbliga': { en: 'requires', ur: 'لازم کرتا ہے', hi: 'आवश्यक करता है', pa: 'ਲੋੜੀਂਦਾ ਹੈ' },
  'indica': { en: 'indicates', ur: 'اشارہ کرتا ہے', hi: 'संकेत करता है', pa: 'ਸੰਕੇਤ ਕਰਦਾ ਹੈ' },
  'preavvisa': { en: 'warns', ur: 'خبردار کرتا ہے', hi: 'चेतावनी देता है', pa: 'ਚੇਤਾਵਨੀ ਦਿੰਦਾ ਹੈ' },
  'segnala': { en: 'signals', ur: 'اشارہ کرتا ہے', hi: 'संकेत देता है', pa: 'ਸੰਕੇਤ ਦਿੰਦਾ ਹੈ' },
  
  // Sostantivi stradali
  'carreggiata': { en: 'roadway', ur: 'سڑک', hi: 'सड़क मार्ग', pa: 'ਸੜਕ' },
  'strada': { en: 'road', ur: 'سڑک', hi: 'सड़क', pa: 'ਸੜਕ' },
  'autostrada': { en: 'highway', ur: 'موٹر وے', hi: 'राजमार्ग', pa: 'ਹਾਈਵੇ' },
  'corsia': { en: 'lane', ur: 'لین', hi: 'लेन', pa: 'ਲੇਨ' },
  'incrocio': { en: 'intersection', ur: 'چوراہا', hi: 'चौराहा', pa: 'ਚੌਰਾਹਾ' },
  'rotatoria': { en: 'roundabout', ur: 'چکر', hi: 'गोल चक्कर', pa: 'ਚੱਕਰ' },
  'semaforo': { en: 'traffic light', ur: 'ٹریفک لائٹ', hi: 'ट्रैफिक लाइट', pa: 'ਟ੍ਰੈਫਿਕ ਲਾਈਟ' },
  'attraversamento': { en: 'crossing', ur: 'عبور', hi: 'पार करना', pa: 'ਪਾਰ ਕਰਨਾ' },
  'passaggio': { en: 'passage', ur: 'راستہ', hi: 'मार्ग', pa: 'ਰਸਤਾ' },
  'marciapiede': { en: 'sidewalk', ur: 'فٹ پاتھ', hi: 'फुटपाथ', pa: 'ਫੁੱਟਪਾਥ' },
  'banchina': { en: 'shoulder', ur: 'کنارہ', hi: 'किनारा', pa: 'ਕਿਨਾਰਾ' },
  'cunetta': { en: 'gutter', ur: 'نالی', hi: 'नाली', pa: 'ਨਾਲੀ' },
  
  // Veicoli
  'veicolo': { en: 'vehicle', ur: 'گاڑی', hi: 'वाहन', pa: 'ਵਾਹਨ' },
  'automobile': { en: 'car', ur: 'کار', hi: 'कार', pa: 'ਕਾਰ' },
  'motociclo': { en: 'motorcycle', ur: 'موٹرسائیکل', hi: 'मोटरसाइकिल', pa: 'ਮੋਟਰਸਾਈਕਲ' },
  'ciclomotore': { en: 'moped', ur: 'سکوٹر', hi: 'मोपेड', pa: 'ਮੋਪੇਡ' },
  'autobus': { en: 'bus', ur: 'بس', hi: 'बस', pa: 'ਬੱਸ' },
  'autocarro': { en: 'truck', ur: 'ٹرک', hi: 'ट्रक', pa: 'ਟਰੱਕ' },
  'rimorchio': { en: 'trailer', ur: 'ٹریلر', hi: 'ट्रेलर', pa: 'ਟ੍ਰੇਲਰ' },
  'bicicletta': { en: 'bicycle', ur: 'سائیکل', hi: 'साइकिल', pa: 'ਸਾਈਕਲ' },
  
  // Persone
  'conducente': { en: 'driver', ur: 'ڈرائیور', hi: 'चालक', pa: 'ਡਰਾਈਵਰ' },
  'pedone': { en: 'pedestrian', ur: 'پیدل چلنے والا', hi: 'पैदल यात्री', pa: 'ਪੈਦਲ ਯਾਤਰੀ' },
  'pedoni': { en: 'pedestrians', ur: 'پیدل چلنے والے', hi: 'पैदल यात्री', pa: 'ਪੈਦਲ ਯਾਤਰੀ' },
  'passeggero': { en: 'passenger', ur: 'مسافر', hi: 'यात्री', pa: 'ਯਾਤਰੀ' },
  'ciclista': { en: 'cyclist', ur: 'سائیکل سوار', hi: 'साइकिल चालक', pa: 'ਸਾਈਕਲ ਸਵਾਰ' },
  
  // Segnali
  'segnale': { en: 'sign', ur: 'نشان', hi: 'संकेत', pa: 'ਸੰਕੇਤ' },
  'cartello': { en: 'sign', ur: 'بورڈ', hi: 'बोर्ड', pa: 'ਬੋਰਡ' },
  'pannello': { en: 'panel', ur: 'پینل', hi: 'पैनल', pa: 'ਪੈਨਲ' },
  'simbolo': { en: 'symbol', ur: 'علامت', hi: 'प्रतीक', pa: 'ਪ੍ਰਤੀਕ' },
  'figura': { en: 'figure', ur: 'شکل', hi: 'आकृति', pa: 'ਚਿੱਤਰ' },
  'raffigurato': { en: 'depicted', ur: 'دکھایا گیا', hi: 'दर्शाया गया', pa: 'ਦਰਸਾਇਆ ਗਿਆ' },
  'rappresentato': { en: 'shown', ur: 'دکھایا', hi: 'दिखाया गया', pa: 'ਦਿਖਾਇਆ' },
  
  // Direzioni
  'destra': { en: 'right', ur: 'دائیں', hi: 'दाहिना', pa: 'ਸੱਜੇ' },
  'sinistra': { en: 'left', ur: 'بائیں', hi: 'बायां', pa: 'ਖੱਬੇ' },
  'diritto': { en: 'straight', ur: 'سیدھا', hi: 'सीधा', pa: 'ਸਿੱਧਾ' },
  'avanti': { en: 'forward', ur: 'آگے', hi: 'आगे', pa: 'ਅੱਗੇ' },
  'indietro': { en: 'backward', ur: 'پیچھے', hi: 'पीछे', pa: 'ਪਿੱਛੇ' },
  'direzione': { en: 'direction', ur: 'سمت', hi: 'दिशा', pa: 'ਦਿਸ਼ਾ' },
  
  // Condizioni
  'velocità': { en: 'speed', ur: 'رفتار', hi: 'गति', pa: 'ਗਤੀ' },
  'limite': { en: 'limit', ur: 'حد', hi: 'सीमा', pa: 'ਸੀਮਾ' },
  'distanza': { en: 'distance', ur: 'فاصلہ', hi: 'दूरी', pa: 'ਦੂਰੀ' },
  'sicurezza': { en: 'safety', ur: 'حفاظت', hi: 'सुरक्षा', pa: 'ਸੁਰੱਖਿਆ' },
  'pericolo': { en: 'danger', ur: 'خطرہ', hi: 'खतरा', pa: 'ਖ਼ਤਰਾ' },
  'pericoloso': { en: 'dangerous', ur: 'خطرناک', hi: 'खतरनाक', pa: 'ਖ਼ਤਰਨਾਕ' },
  'pericolosa': { en: 'dangerous', ur: 'خطرناک', hi: 'खतरनाक', pa: 'ਖ਼ਤਰਨਾਕ' },
};

/**
 * Normalizza una parola per la ricerca nel dizionario
 */
function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:"""'']/g, ''); // Rimuovi punteggiatura
}

/**
 * Traduzione VELOCE con priorità intelligente
 */
export async function quickTranslate(
  word: string,
  targetLang: string = 'en',
  questionId?: number
): Promise<string> {
  console.log(`\n🔍 === INIZIO quickTranslate ===`);
  console.log(`   Input: "${word}" → ${targetLang}${questionId ? ` (domanda #${questionId})` : ''}`);
  
  const normalized = normalizeWord(word);
  console.log(`   Normalizzata: "${normalized}"`);
  
  if (!normalized) {
    console.log(`   ❌ Parola vuota, ritorno originale`);
    return word;
  }

  // 1. PRIORITÀ MASSIMA: Usa mappatura da domanda tradotta ⚡⚡⚡
  if (questionId && targetLang === 'en') {
    console.log(`   🎯 Cerco nella domanda tradotta #${questionId}...`);
    const mappedTranslation = getWordTranslationFromQuestion(word, questionId, targetLang);
    if (mappedTranslation) {
      console.log(`   ⚡⚡⚡ MAPPATURA DA DOMANDA TRADOTTA: "${word}" → "${mappedTranslation}"`);
      console.log(`🏁 === FINE quickTranslate: QUESTION MAPPING ===\n`);
      return mappedTranslation;
    } else {
      console.log(`   ⚠️ Mappatura non trovata, continuo con dizionario...`);
    }
  }

  // 2. Dizionario istantaneo MULTI-LINGUA ⚡⚡
  const dictEntry = INSTANT_DICTIONARY[normalized];
  console.log(`   Dizionario entry:`, dictEntry ? `TROVATA (tipo: ${typeof dictEntry})` : 'NON TROVATA');
  
  if (dictEntry) {
    if (typeof dictEntry === 'object') {
      console.log(`   Chiavi disponibili:`, Object.keys(dictEntry));
      
      if (dictEntry[targetLang]) {
        console.log(`   ⚡⚡ DIZIONARIO ISTANTANEO [${targetLang}]: "${word}" → "${dictEntry[targetLang]}"`);
        console.log(`🏁 === FINE quickTranslate: DICTIONARY ===\n`);
        return dictEntry[targetLang];
      } else {
        console.warn(`   ⚠️ Lingua ${targetLang} NON trovata nel dizionario per "${word}"`);
      }
    }
  }

  // 3. Cache memoria ⚡
  const memKey = `${normalized}_${targetLang}`;
  console.log(`   🔍 Cerco in cache memoria: ${memKey}`);
  if (translationMemoryCache.has(memKey)) {
    const cached = translationMemoryCache.get(memKey);
    if (cached && cached[targetLang]) {
      console.log(`   ⚡ CACHE MEMORIA HIT: "${word}" → "${cached[targetLang]}"`);
      console.log(`🏁 === FINE quickTranslate: MEMORY CACHE ===\n`);
      return cached[targetLang];
    }
  }
  console.log(`   ❌ Cache memoria: MISS`);

  // 4. Cache localStorage
  try {
    const localKey = `trans_${normalized}_${targetLang}`;
    console.log(`   🔍 Cerco in localStorage: ${localKey}`);
    const localCache = localStorage.getItem(localKey);
    if (localCache) {
      const { translation, timestamp } = JSON.parse(localCache);
      const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 giorni
      
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log(`   📦 LOCALSTORAGE HIT: "${word}" → "${translation}"`);
        
        // Salva anche in memoria per prossimi accessi
        translationMemoryCache.set(memKey, { [targetLang]: translation });
        
        console.log(`🏁 === FINE quickTranslate: LOCAL STORAGE ===\n`);
        return translation;
      } else {
        console.log(`   ⏰ Cache localStorage SCADUTA (${Math.floor((Date.now() - timestamp) / 1000 / 60 / 60 / 24)} giorni)`);
      }
    } else {
      console.log(`   ❌ localStorage: MISS`);
    }
  } catch (error) {
    console.warn('   ⚠️ Errore lettura cache locale:', error);
  }

  // 5. Fallback API (ULTIMO RESORT)
  console.log(`   🌐 CHIAMATA API necessaria per: "${word}" → ${targetLang}`);
  try {
    const translation = await apiTranslateWord(normalized, 'it', targetLang);
    console.log(`   ✅ API RESPONSE: "${translation}"`);
    
    // Salva in cache memoria E localStorage
    translationMemoryCache.set(memKey, { [targetLang]: translation });
    localStorage.setItem(`trans_${normalized}_${targetLang}`, JSON.stringify({
      translation,
      timestamp: Date.now()
    }));
    
    console.log(`   💾 Salvato in cache per futuri riusi`);
    console.log(`🏁 === FINE quickTranslate: API SUCCESS ===\n`);
    return translation;
  } catch (error) {
    console.error('   ❌ ERRORE API traduzione:', error);
    console.log(`   🔙 Fallback: ritorno parola originale "${word}"`);
    console.log(`🏁 === FINE quickTranslate: FALLBACK ===\n`);
    // Ultimo fallback: ritorna parola originale
    return word;
  }
}

/**
 * Pre-carica traduzioni comuni in cache memoria
 * Da chiamare all'avvio dell'app per performance ottimali
 */
export function preloadCommonTranslations() {
  Object.entries(INSTANT_DICTIONARY).forEach(([italianWord, translations]) => {
    if (typeof translations === 'object') {
      // Formato nuovo: multi-lingua
      Object.entries(translations).forEach(([lang, translation]) => {
        const key = `${italianWord}_${lang}`;
        translationMemoryCache.set(key, { [lang]: translation });
      });
    }
  });
  
  console.log(`✅ Pre-caricati ${Object.keys(INSTANT_DICTIONARY).length} termini comuni in cache multi-lingua`);
}

/**
 * Pulisce la cache memoria (utile per liberare RAM se necessario)
 */
export function clearTranslationCache() {
  translationMemoryCache.clear();
  console.log('🗑️ Cache traduzione pulita');
}
