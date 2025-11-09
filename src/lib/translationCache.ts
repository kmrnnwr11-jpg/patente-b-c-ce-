import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CachedTranslation {
  word: string;
  translations: Record<string, string>;
  timestamp: number;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 giorni

export const getCachedTranslation = async (
  word: string,
  targetLang: string
): Promise<string | null> => {
  try {
    // 1. Controlla localStorage (cache veloce)
    const localCache = localStorage.getItem(`trans_${word}_${targetLang}`);
    if (localCache) {
      const { translation, timestamp } = JSON.parse(localCache);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return translation;
      }
    }

    // 2. Controlla Firestore (cache condivisa)
    const docRef = doc(db, 'translations', `${word.toLowerCase()}_${targetLang}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as CachedTranslation;
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        // Salva in localStorage per accesso rapido
        localStorage.setItem(
          `trans_${word}_${targetLang}`,
          JSON.stringify({
            translation: data.translations[targetLang],
            timestamp: data.timestamp
          })
        );
        return data.translations[targetLang];
      }
    }

    return null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
};

export const cacheTranslation = async (
  word: string,
  targetLang: string,
  translation: string
) => {
  try {
    // Salva in localStorage
    localStorage.setItem(
      `trans_${word}_${targetLang}`,
      JSON.stringify({ translation, timestamp: Date.now() })
    );

    // Salva in Firestore (async, non blocca UI)
    const docRef = doc(db, 'translations', `${word.toLowerCase()}_${targetLang}`);
    await setDoc(docRef, {
      word: word.toLowerCase(),
      translations: { [targetLang]: translation },
      timestamp: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error('Cache save error:', error);
  }
};

// Funzione traduzione con cache e Google Translate API
export const translateWord = async (
  word: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  // 1. Prova cache
  const cached = await getCachedTranslation(word, targetLang);
  if (cached) return cached;

  // 2. Prova con dizionario locale per parole comuni
  const localTranslation = getLocalTranslation(word, targetLang);
  if (localTranslation) {
    await cacheTranslation(word, targetLang, localTranslation);
    return localTranslation;
  }

  // 3. Chiama API DeepL (primario) con fallback LibreTranslate (gratuito)
  try {
    const deeplKey = import.meta.env.VITE_DEEPL_API_KEY;
    
    // Prova DeepL prima (qualità premium)
    if (deeplKey) {
      console.log(`🔮 Traduzione DeepL: "${word}" (${sourceLang} → ${targetLang})`);
      
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: { 'Authorization': `DeepL-Auth-Key ${deeplKey}` },
        body: new URLSearchParams({
          'text': word,
          'source_lang': sourceLang.toUpperCase(),
          'target_lang': targetLang.toUpperCase(),
          'format': 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const translation = data.translations[0].text;
        console.log('✅ DeepL traduzione ricevuta:', translation);
        
        // Salva in cache
        await cacheTranslation(word, targetLang, translation);
        return translation;
      } else {
        const errorText = await response.text();
        console.warn('⚠️ DeepL error:', response.status, errorText);
        // Continua con fallback LibreTranslate
      }
    }

    // Fallback su LibreTranslate (gratuito, sempre disponibile)
    console.log(`🌐 Traduzione LibreTranslate (fallback): "${word}" (${sourceLang} → ${targetLang})`);
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: word,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (response.ok) {
      const data = await response.json();
      const translation = data.translatedText;
      console.log('✅ LibreTranslate traduzione ricevuta:', translation);
      
      await cacheTranslation(word, targetLang, translation);
      return translation;
    } else {
      const errorText = await response.text();
      console.error('❌ LibreTranslate error:', response.status, errorText);
      throw new Error(`LibreTranslate error: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Translation API error:', error);
    return word; // Ritorna parola originale in caso di errore
  }
};

// Dizionario locale per parole comuni (riduce chiamate API)
const getLocalTranslation = (word: string, targetLang: string): string | null => {
  const dictionary: Record<string, Record<string, string>> = {
    'conducente': {
      en: 'driver',
      ur: 'ڈرائیور',
      hi: 'चालक',
      pa: 'ਡਰਾਈਵਰ'
    },
    'veicolo': {
      en: 'vehicle',
      ur: 'گاڑی',
      hi: 'वाहन',
      pa: 'ਵਾਹਨ'
    },
    'strada': {
      en: 'road',
      ur: 'سڑک',
      hi: 'सड़क',
      pa: 'ਸੜਕ'
    },
    'velocità': {
      en: 'speed',
      ur: 'رفتار',
      hi: 'गति',
      pa: 'ਗਤੀ'
    },
    'limite': {
      en: 'limit',
      ur: 'حد',
      hi: 'सीमा',
      pa: 'ਸੀਮਾ'
    },
    'segnale': {
      en: 'sign',
      ur: 'نشان',
      hi: 'संकेत',
      pa: 'ਸੰਕੇਤ'
    },
    'pericolo': {
      en: 'danger',
      ur: 'خطرہ',
      hi: 'खतरा',
      pa: 'ਖ਼ਤਰਾ'
    },
    'preavvisa': {
      en: 'warns',
      ur: 'خبردار کرتا ہے',
      hi: 'चेतावनी देता है',
      pa: 'ਚੇਤਾਵਨੀ ਦਿੰਦਾ ਹੈ'
    },
    'curva': {
      en: 'curve',
      ur: 'موڑ',
      hi: 'मोड़',
      pa: 'ਮੋੜ'
    },
    'pericolosa': {
      en: 'dangerous',
      ur: 'خطرناک',
      hi: 'खतरनाक',
      pa: 'ਖ਼ਤਰਨਾਕ'
    },
    'destra': {
      en: 'right',
      ur: 'دائیں',
      hi: 'दाहिना',
      pa: 'ਸੱਜੇ'
    },
    'sinistra': {
      en: 'left',
      ur: 'بائیں',
      hi: 'बायां',
      pa: 'ਖੱਬੇ'
    }
  };

  const lowerWord = word.toLowerCase();
  return dictionary[lowerWord]?.[targetLang] || null;
};

// Helper per ottenere definizione italiana
export const getWordDefinition = (word: string): string => {
  const definitions: Record<string, string> = {
    'conducente': 'Persona che guida un veicolo',
    'veicolo': 'Mezzo di trasporto su strada',
    'strada': 'Via pubblica per il transito di veicoli e pedoni',
    'velocità': 'Rapidità con cui si muove un veicolo',
    'limite': 'Valore massimo consentito dalla legge',
    'segnale': 'Cartello stradale che indica regole o pericoli',
    'pericolo': 'Situazione che comporta rischio',
    'divieto': 'Proibizione stabilita dal Codice della Strada',
    'obbligo': 'Imposizione che deve essere rispettata',
    'precedenza': 'Diritto di passare prima di altri veicoli',
    'sorpasso': 'Manovra per superare un altro veicolo',
    'distanza': 'Spazio tra due veicoli',
    'frenata': 'Azione di rallentare o fermare il veicolo',
    'curva': 'Tratto di strada non rettilineo',
    'incrocio': 'Punto dove si intersecano due o più strade',
    'semaforo': 'Dispositivo luminoso che regola il traffico',
    'attraversamento': 'Zona dove i pedoni possono attraversare',
    'corsia': 'Parte della carreggiata delimitata per il transito',
    'carreggiata': 'Parte della strada destinata al transito dei veicoli',
    'marciapiede': 'Parte rialzata della strada per i pedoni'
  };

  return definitions[word.toLowerCase()] || 'Termine tecnico del Codice della Strada';
};

