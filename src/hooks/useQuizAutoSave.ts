import { useEffect, useCallback } from 'react';
import type { QuizQuestion } from '@/types/quiz';

interface QuizState {
  questions: QuizQuestion[];
  userAnswers: (boolean | null)[];
  currentQuestion: number;
  startTime: number;
  quizType: 'exam' | 'topic';
  topicName?: string;
}

const STORAGE_KEY = 'patente_quiz_autosave';
const AUTO_SAVE_INTERVAL = 30000; // 30 secondi

export const useQuizAutoSave = (
  questions: QuizQuestion[],
  userAnswers: (boolean | null)[],
  currentQuestion: number,
  startTime: number,
  quizType: 'exam' | 'topic' = 'exam',
  topicName?: string
) => {
  // Salva lo stato del quiz
  const saveQuizState = useCallback(() => {
    if (questions.length === 0) return;

    const state: QuizState = {
      questions,
      userAnswers,
      currentQuestion,
      startTime,
      quizType,
      topicName
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log('✅ Quiz auto-salvato:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Errore salvataggio quiz:', error);
    }
  }, [questions, userAnswers, currentQuestion, startTime, quizType, topicName]);

  // Carica lo stato salvato
  const loadSavedQuiz = useCallback((): QuizState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const state: QuizState = JSON.parse(saved);
      
      // Verifica che i dati siano validi
      if (!state.questions || state.questions.length === 0) {
        return null;
      }

      console.log('📂 Quiz salvato trovato:', {
        domande: state.questions.length,
        corrente: state.currentQuestion + 1,
        tipo: state.quizType
      });

      return state;
    } catch (error) {
      console.error('❌ Errore caricamento quiz:', error);
      return null;
    }
  }, []);

  // Cancella il salvataggio
  const clearSavedQuiz = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Quiz salvato cancellato');
    } catch (error) {
      console.error('❌ Errore cancellazione quiz:', error);
    }
  }, []);

  // Auto-save ogni 30 secondi
  useEffect(() => {
    if (questions.length === 0) return;

    const interval = setInterval(() => {
      saveQuizState();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [questions, saveQuizState]);

  // Salva anche quando l'utente cambia domanda
  useEffect(() => {
    if (questions.length > 0 && currentQuestion >= 0) {
      saveQuizState();
    }
  }, [currentQuestion, saveQuizState, questions.length]);

  // Salva prima di chiudere la pagina
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (questions.length > 0) {
        saveQuizState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [questions, saveQuizState]);

  return {
    saveQuizState,
    loadSavedQuiz,
    clearSavedQuiz
  };
};

