/**
 * Sistema di mappatura parola-per-parola usando traduzioni già esistenti
 * Usa le domande tradotte per evitare chiamate API
 */

import questionsIT from '@/data/quiz.json';
import questionsEN from '@/data/questions-en.json';

interface Question {
  id: number;
  domanda: string;
}

// Cache per mappature parola-per-parola
const wordMappingCache = new Map<string, Map<string, string>>();

/**
 * Normalizza testo per confronto (rimuove punteggiatura, lowercase)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"""''()]/g, '')
    .trim();
}

/**
 * Estrae parole da un testo
 */
function extractWords(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized.split(/\s+/).filter(w => w.length > 0);
}

/**
 * Crea mappatura parola-per-parola tra due frasi allineate
 * Algoritmo semplice: allinea parole per posizione
 */
function createWordMapping(
  sourceText: string,
  targetText: string
): Map<string, string> {
  const sourceWords = extractWords(sourceText);
  const targetWords = extractWords(targetText);
  
  const mapping = new Map<string, string>();
  
  // Allineamento semplice: stessa posizione
  const minLength = Math.min(sourceWords.length, targetWords.length);
  for (let i = 0; i < minLength; i++) {
    const sourceWord = sourceWords[i];
    const targetWord = targetWords[i];
    
    if (sourceWord && targetWord) {
      // Salva mappatura bidirezionale per flessibilità
      mapping.set(sourceWord, targetWord);
    }
  }
  
  return mapping;
}

/**
 * Ottiene la traduzione di una parola dal contesto di una domanda specifica
 */
export function getWordTranslationFromQuestion(
  word: string,
  questionId: number,
  targetLang: string
): string | null {
  // Solo inglese supportato per ora (possiamo espandere)
  if (targetLang !== 'en') {
    return null;
  }
  
  const cacheKey = `${questionId}_${targetLang}`;
  
  // Controlla cache
  if (!wordMappingCache.has(cacheKey)) {
    // Trova domanda italiana
    const questionIT = questionsIT.find((q: Question) => q.id === questionId);
    const questionEN = questionsEN.find((q: Question) => q.id === questionId);
    
    if (!questionIT || !questionEN) {
      console.warn(`⚠️ Domanda ${questionId} non trovata in uno dei dataset`);
      return null;
    }
    
    // Crea mappatura per questa domanda
    const mapping = createWordMapping(questionIT.domanda, questionEN.domanda);
    wordMappingCache.set(cacheKey, mapping);
    
    console.log(`📖 Creata mappatura per domanda ${questionId}:`, {
      italiano: questionIT.domanda,
      inglese: questionEN.domanda,
      mappature: mapping.size
    });
  }
  
  const mapping = wordMappingCache.get(cacheKey);
  if (!mapping) return null;
  
  // Cerca traduzione
  const normalized = normalizeText(word);
  const translation = mapping.get(normalized);
  
  if (translation) {
    console.log(`✅ Mappatura trovata: "${word}" → "${translation}" (domanda ${questionId})`);
    return translation;
  }
  
  console.log(`❌ Mappatura NON trovata per: "${word}" in domanda ${questionId}`);
  return null;
}

/**
 * Pre-carica mappature per tutte le domande (opzionale, per performance)
 */
export function preloadQuestionMappings(questionIds: number[], targetLang: string = 'en') {
  console.log(`🚀 Pre-caricamento mappature per ${questionIds.length} domande...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  questionIds.forEach((questionId) => {
    const cacheKey = `${questionId}_${targetLang}`;
    
    if (wordMappingCache.has(cacheKey)) {
      return; // Già in cache
    }
    
    try {
      const questionIT = questionsIT.find((q: Question) => q.id === questionId);
      const questionEN = questionsEN.find((q: Question) => q.id === questionId);
      
      if (questionIT && questionEN) {
        const mapping = createWordMapping(questionIT.domanda, questionEN.domanda);
        wordMappingCache.set(cacheKey, mapping);
        successCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`Errore pre-caricamento domanda ${questionId}:`, error);
      errorCount++;
    }
  });
  
  console.log(`✅ Pre-caricamento completato: ${successCount} OK, ${errorCount} errori`);
}

/**
 * Ottiene statistiche cache
 */
export function getCacheStats() {
  return {
    cachedQuestions: wordMappingCache.size,
    totalMappings: Array.from(wordMappingCache.values()).reduce(
      (sum, map) => sum + map.size,
      0
    )
  };
}

/**
 * Pulisce cache (per testing o reset)
 */
export function clearMappingCache() {
  wordMappingCache.clear();
  console.log('🗑️ Cache mappature pulita');
}

// Basic word mapping for quiz translations
// Expand this map with more terms from quiz.json analysis

export const commonQuizWords: Record<string, Record<string, string>> = {
  'patente': { en: 'driving license' },
  'strada': { en: 'road' },
  'semaforo': { en: 'traffic light' },
  'velocità': { en: 'speed' },
  'segnaletica': { en: 'signage' },
  'incrocio': { en: 'intersection' },
  'sorpasso': { en: 'overtaking' },
  'pedone': { en: 'pedestrian' },
  'autostrada': { en: 'motorway' },
  'fermata': { en: 'stop' },
  'priorità': { en: 'priority' },
  'parcheggio': { en: 'parking' },
  'guida': { en: 'driving' },
  'veicolo': { en: 'vehicle' },
  'luce': { en: 'light' },
  // Add more as needed; ideally generate from scripts/analyze-quiz-words.ts
};

export interface WordTranslation {
  original: string;
  translated: string;
  language: string;
  context?: string;
}

export function getWordTranslation(
  word: string, 
  targetLang: string = 'en', 
  fullQuestion?: string
): WordTranslation | null {
  const lowerWord = word.toLowerCase().replace(/[^\w]/g, ''); // Clean punctuation
  const translation = commonQuizWords[lowerWord]?.[targetLang];
  
  if (translation) {
    return {
      original: word,
      translated: translation,
      language: targetLang,
    };
  }

  // Fallback: Placeholder or integrate with lib/translation.ts if exists
  // For now, simple fallback message
  return {
    original: word,
    translated: `No translation cached for "${word}". Context: ${fullQuestion?.substring(0, 50)}...`,
    language: targetLang,
    context: fullQuestion,
  };
}

// Function to expand map (call in dev script)
export function loadMoreTranslations(questionsIt: any[], questionsEn: any[]) {
  // Simple: For each question, split and map words - but advanced alignment needed
  // Placeholder: console.log('Load more...');
  return commonQuizWords;
}

