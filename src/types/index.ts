// Re-export quiz types for backwards compatibility
export type { QuizQuestion, QuizAttempt, QuizFilters, QuizStats, QuizMode } from './quiz';
import type { QuizMode } from './quiz';

export interface Question {
  id: number;
  domanda: string;
  risposta: boolean; // true = VERO, false = FALSO
  immagine?: string;
  argomento: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  aiQuotaUsed: number;
  translationQuotaUsed: number;
  lastQuotaReset: Date;
  createdAt: Date;
}

export interface StudyProgress {
  userId: string;
  argomento: string;
  questionsCompleted: number;
  correctAnswers: number;
  lastStudied: Date;
}

export interface TheoryChapter {
  id: string;
  title: string;
  argomento: string;
  content: string;
  images?: string[];
  order: number;
}

export interface AIExplanation {
  questionId: number;
  explanation: string;
  createdAt: Date;
  cached: boolean;
}

export type ThemeMode = 'light' | 'dark';

export interface QuizConfig {
  mode: QuizMode;
  questionCount: number;
  timeLimit: number; // in seconds
  maxErrors: number;
  argomento?: string; // for study mode
}

