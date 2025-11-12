import type {
  QuizDatasetVersionId,
  QuizFilters,
  QuizQuestion,
  QuizStats
} from '@/types/quiz';
import { getQuizQuestionsForVersion, getQuizQuestionsForVersionAsync } from './quizVersions';
import { useStore } from '@/store/useStore';

// Cache dei quiz per versione (deprecata, usa quella in quizVersions.ts)
const cachedQuestions = new Map<QuizDatasetVersionId, QuizQuestion[]>();

function resolveVersion(version?: QuizDatasetVersionId): QuizDatasetVersionId {
  if (version) {
    return version;
  }

  const state = useStore.getState();
  return state.quizVersion;
}

function loadDataset(version: QuizDatasetVersionId): QuizQuestion[] {
  if (cachedQuestions.has(version)) {
    return cachedQuestions.get(version)!;
  }

  const questions = getQuizQuestionsForVersion(version);
  cachedQuestions.set(version, questions);
  return questions;
}

/**
 * Carica tutti i quiz in modo sincrono (solo italiano)
 * @deprecated Use loadAllQuestionsAsync with language parameter
 */
export function loadAllQuestions(version?: QuizDatasetVersionId): QuizQuestion[] {
  const resolvedVersion = resolveVersion(version);
  return loadDataset(resolvedVersion);
}

/**
 * Carica tutti i quiz in modo asincrono con supporto multilingua
 * @param language - Codice lingua ('it', 'en', ecc.)
 * @param version - Versione del dataset (opzionale)
 */
export async function loadAllQuestionsAsync(
  language: string = 'it',
  version?: QuizDatasetVersionId
): Promise<QuizQuestion[]> {
  const resolvedVersion = resolveVersion(version);
  return getQuizQuestionsForVersionAsync(resolvedVersion, language);
}

// Shuffle array utility (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
  }
  
interface GenerateExamQuizOptions {
  count?: number;
  version?: QuizDatasetVersionId;
}

// Genera quiz esame (30 domande random)
export function generateExamQuiz(options: GenerateExamQuizOptions = {}): QuizQuestion[] {
  const { count = 30, version } = options;
  const all = loadAllQuestions(version);
  const shuffled = shuffleArray(all);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Genera quiz per argomento
export function generateTopicQuiz(
  argomento: string,
  count: number = 10,
  version?: QuizDatasetVersionId
): QuizQuestion[] {
  const all = loadAllQuestions(version);
  
  // Filtra per argomento (case-insensitive)
  const filtered = all.filter(q => 
    q.argomento.toLowerCase() === argomento.toLowerCase()
  );
  
  if (filtered.length === 0) {
    throw new Error(`Nessuna domanda trovata per argomento: ${argomento}`);
  }
  
  // Shuffle e prendi N domande
  const shuffled = shuffleArray(filtered);
  return shuffled.slice(0, Math.min(count, filtered.length));
}

// Quiz con filtri avanzati
export function generateFilteredQuiz(
  filters: QuizFilters,
  count: number = 30,
  version?: QuizDatasetVersionId
): QuizQuestion[] {
  let questions = loadAllQuestions(version);
  
  // Applica filtri
  if (filters.argomento) {
    questions = questions.filter(q => 
      q.argomento.toLowerCase() === filters.argomento!.toLowerCase()
    );
  }
  
  if (filters.hasImage !== undefined) {
    questions = questions.filter(q => 
      filters.hasImage ? q.immagine !== null : q.immagine === null
    );
  }
  
  if (filters.difficulty) {
    questions = questions.filter(q => q.difficulty === filters.difficulty);
  }
  
  if (filters.excludeIds && filters.excludeIds.length > 0) {
    questions = questions.filter(q => !filters.excludeIds!.includes(q.id));
  }
  
  // Shuffle e prendi N domande
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, questions.length));
}

// Ottieni domanda per ID
export function getQuestionById(id: number): QuizQuestion | undefined {
  const all = loadAllQuestions();
  return all.find(q => q.id === id);
}

// Ottieni lista argomenti unici (ordinata alfabeticamente)
export function getTopics(version?: QuizDatasetVersionId): string[] {
  const all = loadAllQuestions(version);
  const topics = [...new Set(all.map(q => q.argomento))];
  return topics.sort();
}

// Conta domande per argomento
export function getTopicQuestionCount(argomento: string, version?: QuizDatasetVersionId): number {
  const all = loadAllQuestions(version);
  return all.filter(q => 
    q.argomento.toLowerCase() === argomento.toLowerCase()
  ).length;
}

// Statistiche dataset completo
export function getQuizStats(version?: QuizDatasetVersionId): QuizStats {
  const all = loadAllQuestions(version);
  const withImages = all.filter(q => q.immagine).length;
  const topics = getTopics(version);
  
  return {
    total: all.length,
    withImages,
    withoutImages: all.length - withImages,
    topics: topics.length,
    topicList: topics
  };
}

// Cerca domande per testo
export function searchQuestions(query: string, version?: QuizDatasetVersionId): QuizQuestion[] {
  const all = loadAllQuestions(version);
  const lowerQuery = query.toLowerCase();
  
  return all.filter(q => 
    q.domanda.toLowerCase().includes(lowerQuery) ||
    q.argomento.toLowerCase().includes(lowerQuery)
  );
}

// Ottieni domande random (senza duplicati)
export function getRandomQuestions(
  count: number,
  excludeIds: number[] = [],
  version?: QuizDatasetVersionId
): QuizQuestion[] {
  const all = loadAllQuestions(version);
  const filtered = all.filter(q => !excludeIds.includes(q.id));
  const shuffled = shuffleArray(filtered);
  return shuffled.slice(0, Math.min(count, filtered.length));
}

// Valida risposta
export function checkAnswer(
  question: QuizQuestion,
  userAnswer: boolean
): boolean {
  return question.risposta === userAnswer;
}
