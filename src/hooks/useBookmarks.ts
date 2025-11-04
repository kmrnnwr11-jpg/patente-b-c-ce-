import { useState, useEffect, useCallback } from 'react';
import type { BookmarkedQuestion, QuizQuestion } from '@/types/quiz';

const BOOKMARKS_STORAGE_KEY = 'patente_bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carica bookmarks da localStorage
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Converti le date da stringhe a oggetti Date
        const bookmarksWithDates = parsed.map((b: any) => ({
          ...b,
          bookmarkedAt: new Date(b.bookmarkedAt),
          lastAttemptedAt: b.lastAttemptedAt ? new Date(b.lastAttemptedAt) : undefined
        }));
        setBookmarks(bookmarksWithDates);
      }
    } catch (error) {
      console.error('Errore caricamento bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBookmarks = (newBookmarks: BookmarkedQuestion[]) => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Errore salvataggio bookmarks:', error);
    }
  };

  const isBookmarked = useCallback((questionId: number): boolean => {
    return bookmarks.some(b => b.questionId === questionId);
  }, [bookmarks]);

  const toggleBookmark = useCallback((question: QuizQuestion, note?: string) => {
    const existing = bookmarks.find(b => b.questionId === question.id);
    
    if (existing) {
      // Rimuovi bookmark
      const newBookmarks = bookmarks.filter(b => b.questionId !== question.id);
      saveBookmarks(newBookmarks);
      return false; // Removed
    } else {
      // Aggiungi bookmark
      const newBookmark: BookmarkedQuestion = {
        questionId: question.id,
        question,
        bookmarkedAt: new Date(),
        note,
        difficulty: question.difficulty,
        timesAttempted: 0,
        timesCorrect: 0
      };
      const newBookmarks = [...bookmarks, newBookmark];
      saveBookmarks(newBookmarks);
      return true; // Added
    }
  }, [bookmarks]);

  const updateBookmarkStats = useCallback((questionId: number, isCorrect: boolean) => {
    const bookmark = bookmarks.find(b => b.questionId === questionId);
    if (!bookmark) return;

    const updatedBookmark: BookmarkedQuestion = {
      ...bookmark,
      timesAttempted: bookmark.timesAttempted + 1,
      timesCorrect: bookmark.timesCorrect + (isCorrect ? 1 : 0),
      lastAttemptedAt: new Date()
    };

    const newBookmarks = bookmarks.map(b => 
      b.questionId === questionId ? updatedBookmark : b
    );
    saveBookmarks(newBookmarks);
  }, [bookmarks]);

  const updateBookmarkNote = useCallback((questionId: number, note: string) => {
    const newBookmarks = bookmarks.map(b => 
      b.questionId === questionId ? { ...b, note } : b
    );
    saveBookmarks(newBookmarks);
  }, [bookmarks]);

  const updateBookmarkDifficulty = useCallback((questionId: number, difficulty: 'easy' | 'medium' | 'hard') => {
    const newBookmarks = bookmarks.map(b => 
      b.questionId === questionId ? { ...b, difficulty } : b
    );
    saveBookmarks(newBookmarks);
  }, [bookmarks]);

  const clearAllBookmarks = useCallback(() => {
    saveBookmarks([]);
  }, []);

  const getBookmarksByTopic = useCallback((topic: string) => {
    return bookmarks.filter(b => b.question.argomento === topic);
  }, [bookmarks]);

  const getBookmarksByDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    return bookmarks.filter(b => b.difficulty === difficulty);
  }, [bookmarks]);

  const getWeakQuestions = useCallback(() => {
    // Domande con bassa percentuale di successo
    return bookmarks.filter(b => {
      if (b.timesAttempted === 0) return true;
      const successRate = b.timesCorrect / b.timesAttempted;
      return successRate < 0.5; // Meno del 50% di successo
    });
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    toggleBookmark,
    updateBookmarkStats,
    updateBookmarkNote,
    updateBookmarkDifficulty,
    clearAllBookmarks,
    getBookmarksByTopic,
    getBookmarksByDifficulty,
    getWeakQuestions
  };
};

