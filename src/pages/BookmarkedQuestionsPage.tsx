import { FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Filter, Trash2, Play, BookOpen } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import type { BookmarkedQuestion } from '@/types/quiz';

export const BookmarkedQuestionsPage: FC = () => {
  const navigate = useNavigate();
  const { bookmarks, isLoading, clearAllBookmarks, getWeakQuestions } = useBookmarks();
  
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showOnlyWeak, setShowOnlyWeak] = useState(false);

  // Estrai topics unici
  const topics = useMemo(() => {
    const uniqueTopics = new Set(bookmarks.map(b => b.question.argomento));
    return Array.from(uniqueTopics).sort();
  }, [bookmarks]);

  // Filtra bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;

    if (showOnlyWeak) {
      filtered = getWeakQuestions();
    }

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(b => b.question.argomento === selectedTopic);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(b => b.difficulty === selectedDifficulty);
    }

    return filtered.sort((a, b) => 
      new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
    );
  }, [bookmarks, selectedTopic, selectedDifficulty, showOnlyWeak, getWeakQuestions]);

  const handleStartReview = () => {
    if (filteredBookmarks.length === 0) return;
    
    // Salva le domande da rivedere in sessionStorage
    const questions = filteredBookmarks.map(b => b.question);
    sessionStorage.setItem('review_questions', JSON.stringify(questions));
    sessionStorage.setItem('review_type', 'bookmarked');
    
    navigate('/quiz/review');
  };

  const handleClearAll = () => {
    if (confirm('Sei sicuro di voler rimuovere tutti i segnalibri?')) {
      clearAllBookmarks();
    }
  };

  const getSuccessRate = (bookmark: BookmarkedQuestion) => {
    if (bookmark.timesAttempted === 0) return null;
    return Math.round((bookmark.timesCorrect / bookmark.timesAttempted) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary bg-pattern p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Title & Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Bookmark className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Domande Salvate
              </h1>
              <p className="text-white/70 text-sm">
                {bookmarks.length} domande totali • {filteredBookmarks.length} visualizzate
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <GlassCard className="mb-6 p-6">
          <div className="flex items-center gap-2 mb-4 text-white">
            <Filter className="w-5 h-5" />
            <h3 className="font-semibold">Filtri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Topic Filter */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Argomento</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Tutti gli argomenti</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Difficoltà</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Tutte</option>
                <option value="easy">Facile</option>
                <option value="medium">Media</option>
                <option value="hard">Difficile</option>
              </select>
            </div>

            {/* Weak Questions Toggle */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Mostra solo</label>
              <button
                onClick={() => setShowOnlyWeak(!showOnlyWeak)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                  showOnlyWeak
                    ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50'
                    : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                }`}
              >
                {showOnlyWeak ? '✓ Domande deboli' : 'Domande deboli'}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Action Buttons */}
        {filteredBookmarks.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={handleStartReview}
              className="bg-gradient-to-r from-primary to-secondary text-white flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Rivedi {filteredBookmarks.length} domande
            </Button>
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="text-white border-white/30 hover:bg-red-500/20 hover:border-red-500/50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Cancella tutti
            </Button>
          </div>
        )}

        {/* Bookmarks List */}
        {filteredBookmarks.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nessuna domanda salvata
            </h3>
            <p className="text-white/70 mb-6">
              {bookmarks.length === 0
                ? 'Inizia a salvare le domande difficili durante i quiz'
                : 'Nessuna domanda corrisponde ai filtri selezionati'}
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="text-white border-white/30"
            >
              Torna alla Dashboard
            </Button>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark) => {
              const successRate = getSuccessRate(bookmark);
              
              return (
                <GlassCard key={bookmark.questionId} className="p-6 hover:bg-white/15 transition-all">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {bookmark.question.immagine && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white/5">
                        <img
                          src={bookmark.question.immagine}
                          alt="Segnale"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="text-white font-medium leading-relaxed">
                          {bookmark.question.domanda}
                        </h4>
                        <Bookmark className="w-5 h-5 text-yellow-400 flex-shrink-0 fill-current" />
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="px-3 py-1 bg-primary/20 text-primary-300 rounded-full">
                          {bookmark.question.argomento}
                        </span>
                        
                        {bookmark.difficulty && (
                          <span className={`px-3 py-1 rounded-full ${
                            bookmark.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                            bookmark.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {bookmark.difficulty === 'easy' ? 'Facile' :
                             bookmark.difficulty === 'medium' ? 'Media' : 'Difficile'}
                          </span>
                        )}

                        {successRate !== null && (
                          <span className={`px-3 py-1 rounded-full ${
                            successRate >= 70 ? 'bg-emerald-500/20 text-emerald-300' :
                            successRate >= 50 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {successRate}% successo ({bookmark.timesCorrect}/{bookmark.timesAttempted})
                          </span>
                        )}

                        <span className="text-white/50">
                          Salvata {new Date(bookmark.bookmarkedAt).toLocaleDateString('it-IT')}
                        </span>
                      </div>

                      {/* Note */}
                      {bookmark.note && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm italic">"{bookmark.note}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

