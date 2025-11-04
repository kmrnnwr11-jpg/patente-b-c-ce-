import type { QuizQuestion, QuizFilters, QuizStats } from '@/types/quiz';
import quizData from '@/data/quiz.json';

// Cache dei quiz caricati
let cachedQuestions: QuizQuestion[] | null = null;

// Carica tutti i quiz (con caching)
export function loadAllQuestions(): QuizQuestion[] {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  try {
    // Se Vite ha stringificato il JSON, parsalo
    const data = typeof quizData === 'string' ? JSON.parse(quizData) : quizData;
    cachedQuestions = data as QuizQuestion[];
    console.log('✅ Quiz caricati:', cachedQuestions.length, 'domande');
    return cachedQuestions;
  } catch (error) {
    console.error('❌ Errore caricamento quiz:', error);
    return [];
  }
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
  
// Genera quiz esame (30 domande random)
export function generateExamQuiz(): QuizQuestion[] {
  const all = loadAllQuestions();
  const shuffled = shuffleArray(all);
  return shuffled.slice(0, 30);
}

// Genera quiz per argomento
export function generateTopicQuiz(
  argomento: string,
  count: number = 10
): QuizQuestion[] {
  const all = loadAllQuestions();
  
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
  count: number = 30
): QuizQuestion[] {
  let questions = loadAllQuestions();
  
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
export function getTopics(): string[] {
  const all = loadAllQuestions();
  const topics = [...new Set(all.map(q => q.argomento))];
  return topics.sort();
}

// Conta domande per argomento
export function getTopicQuestionCount(argomento: string): number {
  const all = loadAllQuestions();
  return all.filter(q => 
    q.argomento.toLowerCase() === argomento.toLowerCase()
  ).length;
}

// Statistiche dataset completo
export function getQuizStats(): QuizStats {
  const all = loadAllQuestions();
  const withImages = all.filter(q => q.immagine).length;
  const topics = getTopics();
  
  return {
    total: all.length,
    withImages,
    withoutImages: all.length - withImages,
    topics: topics.length,
    topicList: topics
  };
}

// Cerca domande per testo
export function searchQuestions(query: string): QuizQuestion[] {
  const all = loadAllQuestions();
  const lowerQuery = query.toLowerCase();
  
  return all.filter(q => 
    q.domanda.toLowerCase().includes(lowerQuery) ||
    q.argomento.toLowerCase().includes(lowerQuery)
  );
}

// Ottieni domande random (senza duplicati)
export function getRandomQuestions(
  count: number,
  excludeIds: number[] = []
): QuizQuestion[] {
  const all = loadAllQuestions();
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
