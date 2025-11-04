import { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion } from '@/types/quiz';

interface QuestionHistory {
  questionId: number;
  question: QuizQuestion;
  attempts: number;
  correct: number;
  incorrect: number;
  lastAttemptedAt: Date;
  lastWasCorrect: boolean;
  consecutiveErrors: number;
}

interface TopicPerformance {
  topic: string;
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  successRate: number;
  weakQuestions: number[];
}

const HISTORY_STORAGE_KEY = 'patente_quiz_history';

export const useQuizHistory = () => {
  const [history, setHistory] = useState<Map<number, QuestionHistory>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Carica storia da localStorage
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const historyMap = new Map<number, QuestionHistory>();
        
        Object.entries(parsed).forEach(([key, value]: [string, any]) => {
          historyMap.set(Number(key), {
            ...value,
            lastAttemptedAt: new Date(value.lastAttemptedAt)
          });
        });
        
        setHistory(historyMap);
      }
    } catch (error) {
      console.error('Errore caricamento storia quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHistory = (newHistory: Map<number, QuestionHistory>) => {
    try {
      const obj = Object.fromEntries(newHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(obj));
      setHistory(newHistory);
    } catch (error) {
      console.error('Errore salvataggio storia quiz:', error);
    }
  };

  const recordAttempt = useCallback((question: QuizQuestion, isCorrect: boolean) => {
    const newHistory = new Map(history);
    const existing = newHistory.get(question.id);

    if (existing) {
      const newEntry: QuestionHistory = {
        ...existing,
        attempts: existing.attempts + 1,
        correct: existing.correct + (isCorrect ? 1 : 0),
        incorrect: existing.incorrect + (isCorrect ? 0 : 1),
        lastAttemptedAt: new Date(),
        lastWasCorrect: isCorrect,
        consecutiveErrors: isCorrect ? 0 : existing.consecutiveErrors + 1
      };
      newHistory.set(question.id, newEntry);
    } else {
      const newEntry: QuestionHistory = {
        questionId: question.id,
        question,
        attempts: 1,
        correct: isCorrect ? 1 : 0,
        incorrect: isCorrect ? 0 : 1,
        lastAttemptedAt: new Date(),
        lastWasCorrect: isCorrect,
        consecutiveErrors: isCorrect ? 0 : 1
      };
      newHistory.set(question.id, newEntry);
    }

    saveHistory(newHistory);
  }, [history]);

  const getQuestionHistory = useCallback((questionId: number): QuestionHistory | undefined => {
    return history.get(questionId);
  }, [history]);

  const getWeakQuestions = useCallback((minAttempts: number = 2, maxSuccessRate: number = 0.5): QuizQuestion[] => {
    const weak: QuizQuestion[] = [];
    
    history.forEach((entry) => {
      if (entry.attempts >= minAttempts) {
        const successRate = entry.correct / entry.attempts;
        if (successRate <= maxSuccessRate) {
          weak.push(entry.question);
        }
      }
    });

    return weak.sort((a, b) => {
      const histA = history.get(a.id)!;
      const histB = history.get(b.id)!;
      return histB.consecutiveErrors - histA.consecutiveErrors;
    });
  }, [history]);

  const getTopicPerformance = useCallback((): TopicPerformance[] => {
    const topicMap = new Map<string, TopicPerformance>();

    history.forEach((entry) => {
      const topic = entry.question.argomento;
      const existing = topicMap.get(topic);

      if (existing) {
        existing.totalAttempts += entry.attempts;
        existing.correctAnswers += entry.correct;
        existing.incorrectAnswers += entry.incorrect;
        
        const successRate = entry.correct / entry.attempts;
        if (successRate < 0.5) {
          existing.weakQuestions.push(entry.questionId);
        }
      } else {
        const successRate = entry.correct / entry.attempts;
        topicMap.set(topic, {
          topic,
          totalAttempts: entry.attempts,
          correctAnswers: entry.correct,
          incorrectAnswers: entry.incorrect,
          successRate: 0,
          weakQuestions: successRate < 0.5 ? [entry.questionId] : []
        });
      }
    });

    // Calcola success rate per ogni topic
    const performance: TopicPerformance[] = [];
    topicMap.forEach((perf) => {
      perf.successRate = perf.correctAnswers / perf.totalAttempts;
      performance.push(perf);
    });

    return performance.sort((a, b) => a.successRate - b.successRate);
  }, [history]);

  const getRecentErrors = useCallback((limit: number = 10): QuizQuestion[] => {
    const errors: Array<{ question: QuizQuestion; date: Date }> = [];
    
    history.forEach((entry) => {
      if (!entry.lastWasCorrect) {
        errors.push({
          question: entry.question,
          date: entry.lastAttemptedAt
        });
      }
    });

    return errors
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit)
      .map(e => e.question);
  }, [history]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    setHistory(new Map());
  }, []);

  const getTotalStats = useCallback(() => {
    let totalAttempts = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let uniqueQuestions = history.size;

    history.forEach((entry) => {
      totalAttempts += entry.attempts;
      totalCorrect += entry.correct;
      totalIncorrect += entry.incorrect;
    });

    return {
      totalAttempts,
      totalCorrect,
      totalIncorrect,
      uniqueQuestions,
      overallSuccessRate: totalAttempts > 0 ? totalCorrect / totalAttempts : 0
    };
  }, [history]);

  return {
    history,
    isLoading,
    recordAttempt,
    getQuestionHistory,
    getWeakQuestions,
    getTopicPerformance,
    getRecentErrors,
    clearHistory,
    getTotalStats
  };
};

