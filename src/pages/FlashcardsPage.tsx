import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, TrendingUp, RotateCw } from 'lucide-react';
import { FlashCard } from '@/components/study/FlashCard';
import { useFlashcards } from '@/hooks/useFlashcards';

export const FlashcardsPage: FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const {
    flashcards,
    loading,
    markCardAsCorrect,
    markCardAsIncorrect,
    getDueCards,
    getStats,
  } = useFlashcards(category);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionIncorrect, setSessionIncorrect] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);

  const dueCards = getDueCards();
  const stats = getStats();
  const currentCard = dueCards[currentIndex];

  useEffect(() => {
    if (dueCards.length === 0 && flashcards.length > 0) {
      setShowCompleted(true);
    }
  }, [dueCards.length, flashcards.length]);

  const handleCorrect = () => {
    if (currentCard) {
      markCardAsCorrect(currentCard.id);
      setSessionCorrect(prev => prev + 1);
      goToNext();
    }
  };

  const handleIncorrect = () => {
    if (currentCard) {
      markCardAsIncorrect(currentCard.id);
      setSessionIncorrect(prev => prev + 1);
      goToNext();
    }
  };

  const goToNext = () => {
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (showCompleted || dueCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] pb-24">
        <div className="px-6 pt-12 pb-6">
          <button
            onClick={() => navigate('/theory')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="px-6 max-w-2xl mx-auto">
          <div className="bg-white/95 rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sessione Completata! 🎉
            </h1>
            
            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="bg-green-50 rounded-2xl p-4">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {sessionCorrect}
                </div>
                <div className="text-sm text-green-700">Corrette</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-4">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {sessionIncorrect}
                </div>
                <div className="text-sm text-red-700">Da rivedere</div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">Statistiche Totali</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.mastered}</div>
                  <div className="text-blue-700">Padroneggiate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.learning}</div>
                  <div className="text-purple-700">In apprendimento</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="text-lg font-bold text-blue-900">
                  {stats.percentMastered}% completato
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${stats.percentMastered}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/theory')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all"
            >
              Torna alla Teoria
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 sticky top-0 bg-gradient-to-b from-[#5FB894] to-[#4AA9D0] z-10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/theory')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <Target className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                {currentIndex + 1}/{dueCards.length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="text-white text-sm font-medium">
                {sessionCorrect}
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Modalità Flashcard
        </h1>
        <p className="text-white/80 text-center text-sm">
          Studia i segnali con le carte interattive
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="px-6">
        {currentCard && (
          <FlashCard
            key={currentCard.id}
            front={currentCard.front}
            back={currentCard.back}
            image={currentCard.image}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
          />
        )}
      </div>

      {/* Stats Footer */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-white font-bold text-lg">{stats.total}</div>
            <div className="text-white/70 text-xs">Totali</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-green-300 font-bold text-lg">{stats.mastered}</div>
            <div className="text-white/70 text-xs">Imparate</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-yellow-300 font-bold text-lg">{stats.learning}</div>
            <div className="text-white/70 text-xs">In studio</div>
          </div>
        </div>
      </div>
    </div>
  );
};

