import { useState, useEffect, useCallback } from 'react';

// Chiavi LocalStorage
const PROGRESS_KEY = 'patente_study_progress';
const CHAPTERS_KEY = 'patente_chapters_read';
const SESSIONS_KEY = 'patente_study_sessions';

export interface ChapterProgress {
  chapterId: string;
  lastVisited: number; // timestamp
  timeSpent: number; // secondi
  sectionsRead: string[];
  completed: boolean;
}

export interface StudyStats {
  totalChapters: number;
  chaptersRead: number;
  chaptersCompleted: number;
  totalSignals: number;
  signalsStudied: number;
  signalsMastered: number;
  totalStudyTime: number; // minuti
  currentStreak: number; // giorni consecutivi
  lastStudyDate: string | null; // YYYY-MM-DD
  quizzesCompleted: number;
  averageQuizScore: number;
}

export interface QuizResult {
  id: string;
  date: number;
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // secondi
  score: number; // percentuale 0-100
}

export const useStudyProgress = () => {
  const [stats, setStats] = useState<StudyStats>({
    totalChapters: 25,
    chaptersRead: 0,
    chaptersCompleted: 0,
    totalSignals: 76,
    signalsStudied: 0,
    signalsMastered: 0,
    totalStudyTime: 0,
    currentStreak: 0,
    lastStudyDate: null,
    quizzesCompleted: 0,
    averageQuizScore: 0,
  });

  const [chaptersProgress, setChaptersProgress] = useState<Record<string, ChapterProgress>>({});
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  // Carica dati all'avvio
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = useCallback(() => {
    try {
      // Carica progresso capitoli
      const chaptersData = localStorage.getItem(CHAPTERS_KEY);
      const chapters = chaptersData ? JSON.parse(chaptersData) : {};
      setChaptersProgress(chapters);

      // Carica storico quiz
      const quizData = localStorage.getItem(SESSIONS_KEY);
      const quizzes: QuizResult[] = quizData ? JSON.parse(quizData) : [];
      setQuizHistory(quizzes);

      // Carica dati flashcard per statistiche segnali
      const flashcardsData = localStorage.getItem('patente_flashcards_progress');
      let signalsStudied = 0;
      let signalsMastered = 0;
      
      if (flashcardsData) {
        const parsed = JSON.parse(flashcardsData);
        const cards = parsed.cards || [];
        signalsStudied = cards.filter((c: any) => c.status !== 'new').length;
        signalsMastered = cards.filter((c: any) => c.status === 'mastered').length;
      }

      // Calcola statistiche
      const chaptersRead = Object.values(chapters).filter(
        (ch: any) => ch.lastVisited
      ).length;
      
      const chaptersCompleted = Object.values(chapters).filter(
        (ch: any) => ch.completed
      ).length;

      const totalStudyTime = Object.values(chapters).reduce(
        (sum: number, ch: any) => sum + (ch.timeSpent || 0),
        0
      ) / 60; // converti in minuti

      // Calcola streak
      const streak = calculateStreak(chapters, quizzes);
      const lastStudy = getLastStudyDate(chapters, quizzes);

      // Calcola media quiz
      const avgScore = quizzes.length > 0
        ? quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length
        : 0;

      setStats({
        totalChapters: 25,
        chaptersRead,
        chaptersCompleted,
        totalSignals: 76,
        signalsStudied,
        signalsMastered,
        totalStudyTime: Math.round(totalStudyTime),
        currentStreak: streak,
        lastStudyDate: lastStudy,
        quizzesCompleted: quizzes.length,
        averageQuizScore: Math.round(avgScore),
      });
    } catch (error) {
      console.error('Errore caricamento progresso:', error);
    }
  }, []);

  // Calcola giorni consecutivi di studio
  const calculateStreak = (chapters: Record<string, ChapterProgress>, quizzes: QuizResult[]): number => {
    const allDates = [
      ...Object.values(chapters).map((ch: any) => ch.lastVisited),
      ...quizzes.map(q => q.date),
    ].filter(Boolean);

    if (allDates.length === 0) return 0;

    // Ordina date (più recente prima)
    const sortedDates = allDates.sort((a, b) => b - a);
    
    // Converti in giorni (YYYY-MM-DD)
    const uniqueDays = [...new Set(
      sortedDates.map(ts => new Date(ts).toISOString().split('T')[0])
    )];

    // Calcola streak partendo da oggi
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;

    for (let i = 0; i < uniqueDays.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expected = expectedDate.toISOString().split('T')[0];

      if (uniqueDays.includes(expected)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getLastStudyDate = (chapters: Record<string, ChapterProgress>, quizzes: QuizResult[]): string | null => {
    const allDates = [
      ...Object.values(chapters).map((ch: any) => ch.lastVisited),
      ...quizzes.map(q => q.date),
    ].filter(Boolean);

    if (allDates.length === 0) return null;

    const latest = Math.max(...allDates);
    return new Date(latest).toISOString().split('T')[0];
  };

  // Registra visita a un capitolo
  const visitChapter = useCallback((chapterId: string, sectionId?: string) => {
    setChaptersProgress((prev) => {
      const existing = prev[chapterId] || {
        chapterId,
        lastVisited: 0,
        timeSpent: 0,
        sectionsRead: [],
        completed: false,
      };

      const sectionsRead = sectionId && !existing.sectionsRead.includes(sectionId)
        ? [...existing.sectionsRead, sectionId]
        : existing.sectionsRead;

      const updated = {
        ...existing,
        lastVisited: Date.now(),
        sectionsRead,
      };

      const newProgress = { ...prev, [chapterId]: updated };
      localStorage.setItem(CHAPTERS_KEY, JSON.stringify(newProgress));
      
      // Ricarica statistiche
      setTimeout(loadProgress, 100);
      
      return newProgress;
    });
  }, [loadProgress]);

  // Registra tempo speso su un capitolo
  const addStudyTime = useCallback((chapterId: string, seconds: number) => {
    setChaptersProgress((prev) => {
      const existing = prev[chapterId] || {
        chapterId,
        lastVisited: Date.now(),
        timeSpent: 0,
        sectionsRead: [],
        completed: false,
      };

      const updated = {
        ...existing,
        timeSpent: existing.timeSpent + seconds,
      };

      const newProgress = { ...prev, [chapterId]: updated };
      localStorage.setItem(CHAPTERS_KEY, JSON.stringify(newProgress));
      
      setTimeout(loadProgress, 100);
      
      return newProgress;
    });
  }, [loadProgress]);

  // Marca un capitolo come completato
  const completeChapter = useCallback((chapterId: string) => {
    setChaptersProgress((prev) => {
      const existing = prev[chapterId] || {
        chapterId,
        lastVisited: Date.now(),
        timeSpent: 0,
        sectionsRead: [],
        completed: false,
      };

      const updated = { ...existing, completed: true };
      const newProgress = { ...prev, [chapterId]: updated };
      localStorage.setItem(CHAPTERS_KEY, JSON.stringify(newProgress));
      
      setTimeout(loadProgress, 100);
      
      return newProgress;
    });
  }, [loadProgress]);

  // Salva risultato quiz
  const saveQuizResult = useCallback((result: Omit<QuizResult, 'id' | 'date'>) => {
    const newResult: QuizResult = {
      ...result,
      id: `quiz_${Date.now()}`,
      date: Date.now(),
    };

    setQuizHistory((prev) => {
      const updated = [...prev, newResult];
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
      
      setTimeout(loadProgress, 100);
      
      return updated;
    });

    return newResult;
  }, [loadProgress]);

  // Reset progresso (per debug)
  const resetProgress = useCallback(() => {
    localStorage.removeItem(CHAPTERS_KEY);
    localStorage.removeItem(SESSIONS_KEY);
    setChaptersProgress({});
    setQuizHistory([]);
    loadProgress();
  }, [loadProgress]);

  return {
    stats,
    chaptersProgress,
    quizHistory,
    visitChapter,
    addStudyTime,
    completeChapter,
    saveQuizResult,
    resetProgress,
    refreshStats: loadProgress,
  };
};

