export type QuizDatasetVersionId = 'ministeriale-2023' | 'ministeriale-2025';

export interface QuizDatasetMeta {
  id: QuizDatasetVersionId;
  label: string;
  description: string;
  yearRange: string;
  badge?: string;
  isBeta?: boolean;
  isDefault?: boolean;
  totalQuestions: number;
}

export interface QuizQuestion {
  id: number;
  domanda: string;
  risposta: boolean; // true = VERO, false = FALSO
  immagine: string | null; // URL relativo: /images/quiz/segnale.png
  argomento: string; // Es: "Segnaletica", "Precedenza", ecc.
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuestionAttempt {
  questionId: number;
  domanda: string;
  correctAnswer: boolean;
  userAnswer: boolean | null;
  answeredAt: Date | null;
  timeSpent: number; // secondi su questa domanda
  correct: boolean;
  immagine: string | null;
  argomento: string;
}

export interface QuizAttempt {
  attemptId: string;
  userId: string;
  questions: QuestionAttempt[];
  startedAt: Date;
  completedAt: Date | null;
  timeElapsed: number; // secondi totali
  score: number;
  errors: number;
  passed: boolean;
  mode: 'exam' | 'practice' | 'topic';
  argomento?: string; // Se mode = 'topic'
}

export interface QuizFilters {
  argomento?: string;
  hasImage?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  excludeIds?: number[];
}

export interface QuizStats {
  total: number;
  withImages: number;
  withoutImages: number;
  topics: number;
  topicList: string[];
}

export type QuizMode = 'exam' | 'practice' | 'topic';

export interface BookmarkedQuestion {
  questionId: number;
  question: QuizQuestion;
  bookmarkedAt: Date;
  note?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timesAttempted: number;
  timesCorrect: number;
  lastAttemptedAt?: Date;
}

export interface ReviewSession {
  sessionId: string;
  userId: string;
  questions: QuizQuestion[];
  startedAt: Date;
  completedAt?: Date;
  reviewType: 'bookmarked' | 'errors' | 'weak-topics' | 'all';
  targetTopic?: string;
}
