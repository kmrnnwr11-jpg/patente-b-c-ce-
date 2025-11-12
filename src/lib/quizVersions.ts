import type { QuizDatasetMeta, QuizDatasetVersionId, QuizQuestion } from '@/types/quiz';
import baseQuizData from '@/data/quiz.json';

type RawQuizDataset = QuizQuestion[] | string;

interface QuizVersionDefinition {
  id: QuizDatasetVersionId;
  label: string;
  description: string;
  yearRange: string;
  badge?: string;
  isBeta?: boolean;
  isDefault?: boolean;
  rawData: RawQuizDataset;
}

const VERSION_DEFINITIONS: Record<QuizDatasetVersionId, QuizVersionDefinition> = {
  'ministeriale-2023': {
    id: 'ministeriale-2023',
    label: 'Quiz Ministeriali 2023',
    description: 'Dataset ufficiale ministeriale.',
    yearRange: '2023',
    isDefault: true,
    rawData: baseQuizData as RawQuizDataset
  }
};

// Cache con supporto lingua: key = "versionId-lang"
const DATA_CACHE = new Map<string, QuizQuestion[]>();

// Cache delle promesse di caricamento per evitare richieste duplicate
const LOADING_PROMISES = new Map<string, Promise<QuizQuestion[]>>();

function parseRawDataset(raw: RawQuizDataset): QuizQuestion[] {
  if (Array.isArray(raw)) {
    return raw as QuizQuestion[];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as QuizQuestion[];
    }
    console.warn('quizVersions: parsed dataset is not an array. Returning empty array.');
    return [];
  } catch (error) {
    console.error('quizVersions: error parsing dataset', error);
    return [];
  }
}

/**
 * Carica domande tradotte da file JSON precaricato
 * Supporta: 'it' (default), 'en' (precaricato)
 */
async function loadTranslatedQuestions(
  versionId: QuizDatasetVersionId,
  language: string
): Promise<QuizQuestion[]> {
  const cacheKey = `${versionId}-${language}`;
  
  // Controlla cache
  if (DATA_CACHE.has(cacheKey)) {
    console.log(`✅ Quiz loaded from cache (${language.toUpperCase()})`);
    return DATA_CACHE.get(cacheKey)!;
  }

  // Controlla se già in caricamento
  if (LOADING_PROMISES.has(cacheKey)) {
    console.log(`⏳ Waiting for ongoing quiz load (${language.toUpperCase()})`);
    return LOADING_PROMISES.get(cacheKey)!;
  }

  // Crea promessa di caricamento
  const loadPromise = (async () => {
    try {
      let questions: QuizQuestion[];

      if (language === 'en') {
        // Carica traduzioni inglesi PRECARICATE da public folder
        console.log(`📥 Loading English questions from /data/questions-en.json...`);
        const response = await fetch('/data/questions-en.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        questions = await response.json();
        console.log(`✅ Loaded ${questions.length} English questions (PRELOADED, NO API)`);
      } else {
        // Default italiano o altre lingue non supportate → usa italiano
        if (language !== 'it') {
          console.log(`⚠️ Language '${language}' not available, using Italian`);
        }
        
        const definition = VERSION_DEFINITIONS[versionId];
        if (!definition) {
          throw new Error(`Dataset ${versionId} not defined`);
        }
        
        questions = parseRawDataset(definition.rawData);
        console.log(`✅ Loaded ${questions.length} Italian questions (DEFAULT)`);
      }

      // Salva in cache
      DATA_CACHE.set(cacheKey, questions);
      return questions;

    } catch (error) {
      console.error(`❌ Error loading questions for ${language}:`, error);
      
      // Fallback su italiano
      console.log('🔄 Falling back to Italian questions');
      const definition = VERSION_DEFINITIONS[versionId];
      
      if (!definition) {
        throw new Error(`Dataset ${versionId} not defined`);
      }
      
      const fallbackQuestions = parseRawDataset(definition.rawData);
      DATA_CACHE.set(cacheKey, fallbackQuestions);
      return fallbackQuestions;
      
    } finally {
      // Rimuovi dalla mappa delle promesse
      LOADING_PROMISES.delete(cacheKey);
    }
  })();

  // Salva promessa
  LOADING_PROMISES.set(cacheKey, loadPromise);
  return loadPromise;
}

/**
 * Versione sincrona per compatibilità (usa solo italiano)
 * @deprecated Use getQuizQuestionsForVersionAsync with language parameter
 */
export function getQuizQuestionsForVersion(versionId: QuizDatasetVersionId): QuizQuestion[] {
  const cacheKey = `${versionId}-it`;
  
  if (DATA_CACHE.has(cacheKey)) {
    return DATA_CACHE.get(cacheKey)!;
  }

  const definition = VERSION_DEFINITIONS[versionId];
  if (!definition) {
    console.warn(`quizVersions: dataset ${versionId} non definito`);
    return [];
  }

  const questions = parseRawDataset(definition.rawData);
  DATA_CACHE.set(cacheKey, questions);
  return questions;
}

/**
 * Versione asincrona con supporto multilingua (CONSIGLIATA)
 * @param versionId - ID del dataset quiz
 * @param language - Codice lingua ('it', 'en', ecc.)
 * @returns Promise con array di domande tradotte
 */
export async function getQuizQuestionsForVersionAsync(
  versionId: QuizDatasetVersionId,
  language: string = 'it'
): Promise<QuizQuestion[]> {
  return loadTranslatedQuestions(versionId, language);
}

export function getQuizDatasetMeta(versionId: QuizDatasetVersionId): QuizDatasetMeta {
  const definition = VERSION_DEFINITIONS[versionId];
  if (!definition) {
    throw new Error(`quizVersions: dataset ${versionId} non definito`);
  }

  const questions = getQuizQuestionsForVersion(versionId);

  return {
    id: definition.id,
    label: definition.label,
    description: definition.description,
    yearRange: definition.yearRange,
    badge: definition.badge,
    isBeta: definition.isBeta,
    isDefault: definition.isDefault,
    totalQuestions: questions.length
  };
}

export function getAllQuizDatasetMeta(): QuizDatasetMeta[] {
  return Object.keys(VERSION_DEFINITIONS).map(versionId =>
    getQuizDatasetMeta(versionId as QuizDatasetVersionId)
  );
}

export function getDefaultQuizDatasetVersion(): QuizDatasetVersionId {
  const defaultEntry = Object.values(VERSION_DEFINITIONS).find(def => def.isDefault);
  return defaultEntry ? defaultEntry.id : 'ministeriale-2023';
}

export function isQuizDatasetDefined(versionId: string): versionId is QuizDatasetVersionId {
  return Boolean(VERSION_DEFINITIONS[versionId as QuizDatasetVersionId]);
}

export function parseQuizDatasetVersionId(
  value: string | null | undefined
): QuizDatasetVersionId | null {
  if (!value) {
    return null;
  }

  return isQuizDatasetDefined(value) ? (value as QuizDatasetVersionId) : null;
}


