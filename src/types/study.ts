// Types per il sistema di studio con flashcard

export type FlashcardDifficulty = 'easy' | 'medium' | 'hard' | 'unknown';

export type FlashcardStatus = 'new' | 'learning' | 'review' | 'mastered';

export interface Flashcard {
  id: string;
  front: string; // Testo o ID immagine per il fronte
  back: string; // Testo per il retro
  image?: string; // URL immagine del segnale
  category: string; // Categoria (segnali-pericolo, segnali-divieto, etc)
  difficulty: FlashcardDifficulty;
  status: FlashcardStatus;
  lastReviewed?: number; // timestamp
  nextReview?: number; // timestamp
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
}

export interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  category?: string;
}

export interface StudyProgress {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;
  todayStudied: number;
  streak: number; // giorni consecutivi di studio
  lastStudyDate?: string; // YYYY-MM-DD
}

export interface QuizQuestion {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number; // index della risposta corretta
  explanation?: string;
  category: string;
}

