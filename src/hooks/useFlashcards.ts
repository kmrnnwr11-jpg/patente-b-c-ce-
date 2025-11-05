import { useState, useEffect } from 'react';
import { Flashcard, FlashcardStatus } from '@/types/study';
import signalsData from '../data/theory-segnali-completo.json';

const STORAGE_KEY = 'patente_flashcards_progress';

// Genera flashcard dai segnali
const generateFlashcardsFromSignals = (): Flashcard[] => {
  const flashcards: Flashcard[] = [];
  
  signalsData.chapters.forEach(chapter => {
    if (chapter.signals) {
      chapter.signals.forEach(signal => {
        flashcards.push({
          id: `signal-${signal.id}`,
          front: signal.nome,
          back: signal.descrizione,
          image: signal.image,
          category: chapter.id,
          difficulty: 'unknown',
          status: 'new',
          reviewCount: 0,
          correctCount: 0,
          incorrectCount: 0,
        });
      });
    }
  });
  
  return flashcards;
};

export const useFlashcards = (category?: string) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, [category]);

  const loadFlashcards = () => {
    try {
      // Carica progressi dal localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      const progress = saved ? JSON.parse(saved) : {};

      // Genera flashcard dai segnali
      let allCards = generateFlashcardsFromSignals();

      // Applica progressi salvati
      allCards = allCards.map(card => ({
        ...card,
        ...progress[card.id],
      }));

      // Filtra per categoria se specificata
      if (category) {
        allCards = allCards.filter(card => card.category === category);
      }

      setFlashcards(allCards);
    } catch (error) {
      console.error('Errore caricamento flashcards:', error);
      setFlashcards(generateFlashcardsFromSignals());
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = (updatedCards: Flashcard[]) => {
    try {
      const progress: Record<string, Partial<Flashcard>> = {};
      updatedCards.forEach(card => {
        progress[card.id] = {
          difficulty: card.difficulty,
          status: card.status,
          lastReviewed: card.lastReviewed,
          nextReview: card.nextReview,
          reviewCount: card.reviewCount,
          correctCount: card.correctCount,
          incorrectCount: card.incorrectCount,
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Errore salvataggio progressi:', error);
    }
  };

  const markCardAsCorrect = (cardId: string) => {
    const updated = flashcards.map(card => {
      if (card.id === cardId) {
        const newCorrectCount = card.correctCount + 1;
        const newReviewCount = card.reviewCount + 1;
        
        // Logica ripetizione spaziata
        let newStatus: FlashcardStatus = card.status;
        let nextReview = Date.now();

        if (newCorrectCount >= 5) {
          newStatus = 'mastered';
          nextReview = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 giorni
        } else if (newCorrectCount >= 3) {
          newStatus = 'review';
          nextReview = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 giorni
        } else if (newCorrectCount >= 1) {
          newStatus = 'learning';
          nextReview = Date.now() + 24 * 60 * 60 * 1000; // 1 giorno
        }

        return {
          ...card,
          correctCount: newCorrectCount,
          reviewCount: newReviewCount,
          lastReviewed: Date.now(),
          nextReview,
          status: newStatus,
        };
      }
      return card;
    });

    setFlashcards(updated);
    saveProgress(updated);
  };

  const markCardAsIncorrect = (cardId: string) => {
    const updated = flashcards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          incorrectCount: card.incorrectCount + 1,
          reviewCount: card.reviewCount + 1,
          lastReviewed: Date.now(),
          nextReview: Date.now() + 60 * 60 * 1000, // 1 ora
          status: 'learning' as FlashcardStatus,
        };
      }
      return card;
    });

    setFlashcards(updated);
    saveProgress(updated);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    loadFlashcards();
  };

  // Ottieni card da studiare oggi
  const getDueCards = () => {
    const now = Date.now();
    return flashcards.filter(card => 
      !card.nextReview || card.nextReview <= now
    );
  };

  // Ottieni statistiche
  const getStats = () => {
    const total = flashcards.length;
    const newCards = flashcards.filter(c => c.status === 'new').length;
    const learning = flashcards.filter(c => c.status === 'learning').length;
    const review = flashcards.filter(c => c.status === 'review').length;
    const mastered = flashcards.filter(c => c.status === 'mastered').length;
    
    return {
      total,
      newCards,
      learning,
      review,
      mastered,
      percentMastered: total > 0 ? Math.round((mastered / total) * 100) : 0,
    };
  };

  return {
    flashcards,
    loading,
    markCardAsCorrect,
    markCardAsIncorrect,
    resetProgress,
    getDueCards,
    getStats,
    reload: loadFlashcards,
  };
};

