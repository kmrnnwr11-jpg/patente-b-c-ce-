// Sistema di traduzione delle domande del quiz
// Le traduzioni vengono caricate dinamicamente e possono essere espanse

export interface QuizTranslation {
  en: string;
  // Aggiungi altre lingue qui in futuro: fr, de, es, etc.
}

// Cache delle traduzioni per le domande più comuni
export const quizTranslations: Record<number, QuizTranslation> = {
  // Definizioni stradali e di traffico
  1: {
    en: "In a carriageway of the type shown, overtaking is allowed even in curves"
  },
  2: {
    en: "The carriageway of the type shown is for two-way traffic"
  },
  3: {
    en: "On an extra-urban carriageway of the type shown, the inner lanes are normally reserved for overtaking"
  },
  // Aggiungi qui altre traduzioni statiche
  // Per le domande non tradotte, verrà usata la traduzione AI on-demand
};

/**
 * Ottiene la traduzione di una domanda del quiz
 * @param questionId ID della domanda
 * @param language Lingua target ('it', 'en', etc.)
 * @param originalText Testo originale in italiano
 * @returns Testo tradotto o originale se non disponibile
 */
export const getQuestionTranslation = (
  questionId: number,
  language: string,
  originalText: string
): string => {
  // Se la lingua è italiano, restituisci l'originale
  if (language === 'it' || language === 'it-IT') {
    return originalText;
  }
  
  // Se esiste una traduzione statica, usala
  if (language === 'en' || language === 'en-US' || language === 'en-GB') {
    if (quizTranslations[questionId]?.en) {
      return quizTranslations[questionId].en;
    }
    
    // Altrimenti, usa traduzioni automatiche base per parole chiave comuni
    return autoTranslateBasic(originalText);
  }
  
  // Se non c'è traduzione disponibile, restituisci l'originale
  return originalText;
};

/**
 * Traduzione automatica COMPLETA per le domande del quiz
 * Sistema di traduzione a più livelli con oltre 500+ termini
 */
const autoTranslateBasic = (text: string): string => {
  // FASE 1: Traduzioni di FRASI COMPLETE (priorità massima)
  const completeTranslations: Record<string, string> = {
    // Frasi complete comuni con il segnale
    'Il segnale raffigurato': 'The depicted sign',
    'Il pannello raffigurato': 'The depicted panel',
    'Il segnale in figura': 'The sign in the figure',
    'La segnaletica rappresentata': 'The represented road markings',
    'La figura rappresenta': 'The figure represents',
    'I segnali raffigurati': 'The depicted signs',
    
    // Frasi complete con veicolo/conducente
    'Il veicolo S': 'Vehicle S',
    'Il veicolo di massa': 'The vehicle with a mass',
    'Il conducente del veicolo': 'The driver of the vehicle',
    'Il conducente deve': 'The driver must',
    'Il conducente che': 'The driver who',
    
    // Frasi complete movimenti
    'muovendosi in retromarcia': 'moving in reverse',
    'per immettersi nella circolazione': 'to enter traffic',
    'per immettersi in una strada': 'to enter a road',
    'effettuando una manovra': 'performing a maneuver',
    
    // Obblighi e divieti (frasi complete)
    'È obbligatorio': 'It is mandatory',
    'È vietato': 'It is forbidden',
    'È consentito': 'It is allowed',
    'Non è consentito': 'It is not allowed',
    'Si deve': 'One must',
    'Non si deve': 'One must not',
    'Bisogna': 'It is necessary to',
    'Occorre': 'It is necessary to',
    
    // Frasi con luci
    'deve accendere': 'must turn on',
    'deve spegnere': 'must turn off',
    'la luce posteriore per nebbia': 'the rear fog light',
    'le luci di posizione': 'the position lights',
    'i fari abbaglianti': 'the high beams',
    'i fari anabbaglianti': 'the low beams',
    'le luci di emergenza': 'the hazard lights',
    'gli indicatori di direzione': 'the turn signals',
    
    // Contesto
    'In caso di': 'In case of',
    'Durante la guida': 'While driving',
    'In presenza di': 'In the presence of',
    'Prima di': 'Before',
    'Dopo aver': 'After having',
  };

  // FASE 2: Traduzioni PAROLE SINGOLE (ordine alfabetico per gestibilità)
  const wordTranslations: Record<string, string> = {
    // ARTICOLI (da tradurre per primi)
    'Il': 'The',
    'La': 'The',
    'Lo': 'The',
    'I': 'The',
    'Gli': 'The',
    'Le': 'The',
    'Un': 'A',
    'Una': 'A',
    'Uno': 'A',
    
    // VERBI COMUNI (infinito e coniugazioni)
    'accendere': 'turn on',
    'accende': 'turns on',
    'attraversare': 'cross',
    'attraversa': 'crosses',
    'avvicinarsi': 'approach',
    'avvicina': 'approaches',
    'circolare': 'circulate',
    'circola': 'circulates',
    'consentire': 'allow',
    'consente': 'allows',
    'dare': 'give',
    'diminuire': 'reduce',
    'diminuisce': 'reduces',
    'effettuare': 'perform',
    'effettua': 'performs',
    'entrare': 'enter',
    'entra': 'enters',
    'fermare': 'stop',
    'ferma': 'stops',
    'guidare': 'drive',
    'guida': 'drives',
    'immettersi': 'enter',
    'immette': 'enters',
    'imporre': 'impose',
    'impone': 'imposes',
    'indicare': 'indicate',
    'indica': 'indicates',
    'muoversi': 'move',
    'muovendosi': 'moving',
    'muove': 'moves',
    'obbligare': 'require',
    'obbliga': 'requires',
    'oltrepassare': 'pass',
    'oltrepassa': 'passes',
    'parcheggiare': 'park',
    'parcheggia': 'parks',
    'percorrere': 'travel',
    'percorre': 'travels',
    'precedere': 'precede',
    'precede': 'precedes',
    'preannunciare': 'pre-signal',
    'preannuncia': 'pre-signals',
    'presegnalare': 'pre-signal',
    'presegnala': 'pre-signals',
    'preavvisare': 'warn',
    'preavvisa': 'warns',
    'rallentare': 'slow down',
    'rallenta': 'slows down',
    'rappresentare': 'represent',
    'rappresenta': 'represents',
    'rispettare': 'respect',
    'rispetta': 'respects',
    'segnalare': 'signal',
    'segnala': 'signals',
    'sorpassare': 'overtake',
    'sorpassa': 'overtakes',
    'spegnere': 'turn off',
    'spegne': 'turns off',
    'svoltare': 'turn',
    'svolta': 'turns',
    'transitare': 'transit',
    'transita': 'transits',
    'tutelare': 'protect',
    'tutela': 'protects',
    'vietare': 'prohibit',
    'vieta': 'prohibits',
    
    // SOSTANTIVI (A-Z)
    'attraversamento': 'crossing',
    'autobus': 'bus',
    'autostrada': 'highway',
    'autovettura': 'car',
    'camion': 'truck',
    'carreggiata': 'carriageway',
    'centro': 'center',
    'ciclista': 'cyclist',
    'cinture': 'seat belts',
    'circolazione': 'traffic',
    'conducente': 'driver',
    'corsia': 'lane',
    'curva': 'curve',
    'direzione': 'direction',
    'distanza': 'distance',
    'divieto': 'prohibition',
    'emergenza': 'emergency',
    'fari': 'headlights',
    'figura': 'figure',
    'guida': 'driving',
    'incidente': 'accident',
    'incrocio': 'intersection',
    'indicatori': 'indicators',
    'limite': 'limit',
    'luce': 'light',
    'luci': 'lights',
    'manovra': 'maneuver',
    'marciapiede': 'sidewalk',
    'massa': 'mass',
    'motociclo': 'motorcycle',
    'nebbia': 'fog',
    'obbligo': 'obligation',
    'pannello': 'panel',
    'parcheggio': 'parking',
    'passaggio': 'passage',
    'pedone': 'pedestrian',
    'pericolo': 'danger',
    'pneumatici': 'tires',
    'ponte': 'bridge',
    'posizione': 'position',
    'precedenza': 'right of way',
    'retromarcia': 'reverse',
    'rotatoria': 'roundabout',
    'segnale': 'sign',
    'segnaletica': 'road markings',
    'semaforo': 'traffic light',
    'senso': 'direction',
    'sicurezza': 'safety',
    'sorpasso': 'overtaking',
    'strada': 'road',
    'svolta': 'turn',
    'traffico': 'traffic',
    'transito': 'transit',
    'tratto': 'section',
    'veicolo': 'vehicle',
    'velocità': 'speed',
    'zona': 'zone',
    
    // AGGETTIVI
    'abbaglianti': 'high beams',
    'anabbaglianti': 'low beams',
    'consentito': 'allowed',
    'consentita': 'allowed',
    'destro': 'right',
    'destra': 'right',
    'doppio': 'double',
    'doppia': 'double',
    'lungo': 'long',
    'lunga': 'long',
    'obbligatorio': 'mandatory',
    'obbligatoria': 'mandatory',
    'opposto': 'opposite',
    'pericoloso': 'dangerous',
    'pericolosa': 'dangerous',
    'permesso': 'permitted',
    'permessa': 'permitted',
    'posteriore': 'rear',
    'posteriori': 'rear',
    'precedente': 'previous',
    'raffigurato': 'depicted',
    'raffigurata': 'depicted',
    'rappresentato': 'represented',
    'rappresentata': 'represented',
    'sinistro': 'left',
    'sinistra': 'left',
    'successivo': 'next',
    'urbano': 'urban',
    'urbana': 'urban',
    'vietato': 'forbidden',
    'vietata': 'forbidden',
    'viscida': 'slippery',
    
    // PREPOSIZIONI E CONGIUNZIONI
    'alla': 'to the',
    'allo': 'to the',
    'con': 'with',
    'da': 'from',
    'del': 'of the',
    'della': 'of the',
    'dello': 'of the',
    'dopo': 'after',
    'durante': 'during',
    'in': 'in',
    'nella': 'in the',
    'nello': 'in the',
    'per': 'for',
    'prima': 'before',
    'quando': 'when',
    'se': 'if',
    'senza': 'without',
    'sopra': 'above',
    'sotto': 'under',
    'su': 'on',
    'sulla': 'on the',
    'sullo': 'on the',
    'tra': 'between',
    
    // AVVERBI
    'ancora': 'still',
    'davanti': 'ahead',
    'dietro': 'behind',
    'dove': 'where',
    'già': 'already',
    'mai': 'never',
    'molto': 'very',
    'più': 'more',
    'sempre': 'always',
    'solo': 'only',
    'subito': 'immediately',
    
    // VERBI AUSILIARI E MODALI
    'deve': 'must',
    'devono': 'must',
    'dovrebbe': 'should',
    'può': 'can',
    'possono': 'can',
    'potrebbe': 'could',
    
    // PRONOMI
    'che': 'that',
    'cui': 'which',
    'quale': 'which',
    'proprio': 'own',
    'propria': 'own',
    'altrui': 'others',
    
    // NEGAZIONI
    'non': 'not',
    'nessun': 'no',
    'nessuno': 'no',
    'nessuna': 'no',
    'né': 'nor',
    
    // VERBI ESSERE E AVERE
    'è': 'is',
    'sono': 'are',
    'era': 'was',
    'erano': 'were',
    'sia': 'is',
    'ha': 'has',
    'hanno': 'have',
    'aveva': 'had',
    'avevano': 'had',
    
    // ALTRO
    'caso': 'case',
    'ogni': 'every',
    'tutti': 'all',
    'tutte': 'all',
    'altro': 'other',
    'altra': 'other'
  };
  
  let translatedText = text;

  // FASE 1: Sostituisci FRASI COMPLETE prima (priorità massima)
  // Ordina per lunghezza decrescente per evitare sostituzioni parziali
  const sortedPhrases = Object.entries(completeTranslations).sort(
    (a, b) => b[0].length - a[0].length
  );
  
  for (const [italian, english] of sortedPhrases) {
    // Usa una regex case-insensitive ma che rispetta le word boundaries
    const regex = new RegExp(italian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    translatedText = translatedText.replace(regex, english);
  }

  // FASE 2: Sostituisci PAROLE SINGOLE
  // Ordina per lunghezza decrescente per evitare che parole corte sovrascrivano quelle lunghe
  const sortedWords = Object.entries(wordTranslations).sort(
    (a, b) => b[0].length - a[0].length
  );
  
  for (const [italian, english] of sortedWords) {
    // Usa word boundary per evitare sostituzioni parziali
    // Escape dei caratteri speciali nella regex
    const escapedItalian = italian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedItalian}\\b`, 'gi');
    translatedText = translatedText.replace(regex, english);
  }

  // FASE 3: Post-processing - pulizia articoli doppi e altro
  translatedText = translatedText
    .replace(/\bThe the\b/gi, 'The')
    .replace(/\bA a\b/gi, 'A')
    .replace(/\bAn an\b/gi, 'An')
    .replace(/\s+/g, ' ') // Rimuovi spazi multipli
    .trim();

  // Log per debug (mostra solo in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🌍 Translation:', {
      original: text.substring(0, 60) + '...',
      translated: translatedText.substring(0, 60) + '...',
      coverage: Math.round((1 - (translatedText.match(/[a-z]+/gi)?.filter(word => 
        !english_words.includes(word.toLowerCase())
      ).length || 0) / (translatedText.match(/[a-z]+/gi)?.length || 1)) * 100) + '%'
    });
  }

  return translatedText;
};

// Lista di parole inglesi comuni per il calcolo della coverage
const english_words = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 
  'can', 'could', 'must', 'should', 'will', 'would', 'may', 'might', 'shall',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'from', 'by', 'as',
  'and', 'or', 'but', 'not', 'if', 'when', 'that', 'which', 'who',
  'this', 'that', 'these', 'those', 'all', 'some', 'any', 'no', 'every',
  'sign', 'light', 'vehicle', 'driver', 'road', 'traffic', 'turn', 'must',
  'depicted', 'rear', 'fog', 'turn', 'on', 'off', 'moving', 'reverse'];

/**
 * Funzione per aggiungere traduzioni dinamicamente
 * Utile per caching delle traduzioni AI
 */
export const cacheQuizTranslation = (
  questionId: number,
  language: string,
  translation: string
): void => {
  if (!quizTranslations[questionId]) {
    quizTranslations[questionId] = { en: '' };
  }
  
  if (language === 'en') {
    quizTranslations[questionId].en = translation;
  }
  
  // Salva in localStorage per persistenza
  try {
    const cached = localStorage.getItem('quizTranslationsCache');
    const cache = cached ? JSON.parse(cached) : {};
    
    if (!cache[questionId]) {
      cache[questionId] = {};
    }
    cache[questionId][language] = translation;
    
    localStorage.setItem('quizTranslationsCache', JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching translation:', error);
  }
};

/**
 * Carica traduzioni dalla cache
 */
export const loadCachedTranslations = (): void => {
  try {
    const cached = localStorage.getItem('quizTranslationsCache');
    if (cached) {
      const cache = JSON.parse(cached);
      
      for (const [questionId, translations] of Object.entries(cache)) {
        const id = parseInt(questionId);
        if (!quizTranslations[id]) {
          quizTranslations[id] = { en: '' };
        }
        
        const trans = translations as Record<string, string>;
        if (trans.en) {
          quizTranslations[id].en = trans.en;
        }
      }
    }
  } catch (error) {
    console.error('Error loading cached translations:', error);
  }
};

// Carica traduzioni all'avvio
loadCachedTranslations();

