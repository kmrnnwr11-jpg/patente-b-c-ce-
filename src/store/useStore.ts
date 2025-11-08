import { create } from 'zustand';
import { User, Question, QuizAttempt, ThemeMode } from '@/types';
import type { QuizDatasetVersionId } from '@/types/quiz';
import { getDefaultQuizDatasetVersion, isQuizDatasetDefined } from '@/lib/quizVersions';

interface AppState {
  // User State
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Theme State
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  // Quiz State
  currentQuiz: QuizAttempt | null;
  setCurrentQuiz: (quiz: QuizAttempt | null) => void;
  
  // Questions Bank
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  
  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // AI Quota
  aiQuotaRemaining: number;
  updateAIQuota: (used: number) => void;
  
  // Translation Quota
  translationQuotaRemaining: number;
  updateTranslationQuota: (used: number) => void;

  // Quiz Dataset Version
  quizVersion: QuizDatasetVersionId;
  setQuizVersion: (version: QuizDatasetVersionId) => void;
}

const FREE_AI_QUOTA = Number(import.meta.env.VITE_FREE_AI_QUOTA_DAILY) || 5;
const FREE_TRANSLATION_QUOTA = Number(import.meta.env.VITE_FREE_TRANSLATION_QUOTA_DAILY) || 30;
const QUIZ_VERSION_STORAGE_KEY = 'patente.quizVersion';

const defaultQuizVersion = getDefaultQuizDatasetVersion();

const initialQuizVersion: QuizDatasetVersionId = (() => {
  if (typeof window === 'undefined') {
    return defaultQuizVersion;
  }

  try {
    const stored = window.localStorage.getItem(QUIZ_VERSION_STORAGE_KEY) as QuizDatasetVersionId | null;
    if (stored && isQuizDatasetDefined(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('useStore: impossibile leggere quizVersion da localStorage', error);
  }

  return defaultQuizVersion;
})();

export const useStore = create<AppState>((set) => ({
  // User State
  user: null,
  setUser: (user) => set({ user }),
  
  // Theme State
  theme: 'light',
  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  
  // Quiz State
  currentQuiz: null,
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  
  // Questions Bank
  questions: [],
  setQuestions: (questions) => set({ questions }),
  
  // Loading States
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // AI Quota
  aiQuotaRemaining: FREE_AI_QUOTA,
  updateAIQuota: (used) => set((state) => ({
    aiQuotaRemaining: state.user?.isPremium ? 999999 : Math.max(0, FREE_AI_QUOTA - used)
  })),
  
  // Translation Quota
  translationQuotaRemaining: FREE_TRANSLATION_QUOTA,
  updateTranslationQuota: (used) => set((state) => ({
    translationQuotaRemaining: state.user?.isPremium ? 999999 : Math.max(0, FREE_TRANSLATION_QUOTA - used)
  })),

  // Quiz Dataset Version
  quizVersion: initialQuizVersion,
  setQuizVersion: (version) => {
    if (!isQuizDatasetDefined(version)) {
      console.warn('useStore: quizVersion non valida', version);
      return;
    }

    set({ quizVersion: version });

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(QUIZ_VERSION_STORAGE_KEY, version);
      } catch (error) {
        console.warn('useStore: impossibile salvare quizVersion su localStorage', error);
      }
    }
  }
}));

