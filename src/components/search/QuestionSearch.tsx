import { FC, useState, useMemo } from 'react';
import { Search, Filter, X, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import type { Question } from '@/types/quiz';

interface QuestionSearchProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
}

export const QuestionSearch: FC<QuestionSearchProps> = ({
  questions,
  onSelectQuestion
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Estrai tutti i topic unici
  const topics = useMemo(() => {
    const topicSet = new Set(questions.map(q => q.argomento).filter(Boolean));
    return Array.from(topicSet).sort();
  }, [questions]);

  // Filtra domande
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      // Filtro per topic
      if (selectedTopic !== 'all' && question.argomento !== selectedTopic) {
        return false;
      }

      // Filtro per search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesQuestion = question.domanda.toLowerCase().includes(term);
        const matchesTopic = question.argomento?.toLowerCase().includes(term);
        return matchesQuestion || matchesTopic;
      }

      return true;
    });
  }, [questions, searchTerm, selectedTopic]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTopic('all');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca domande..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-10 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>
            )}
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`text-white border-white/30 ${showFilters ? 'bg-white/10' : ''}`}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
            <div className="space-y-3">
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">
                  Argomento
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Tutti gli argomenti</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="w-full text-white border-white/30"
              >
                <X className="w-4 h-4 mr-2" />
                Cancella Filtri
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Results Count */}
      <div className="flex items-center justify-between text-white/70 text-sm px-2">
        <span>
          {filteredQuestions.length} {filteredQuestions.length === 1 ? 'domanda trovata' : 'domande trovate'}
        </span>
        {(searchTerm || selectedTopic !== 'all') && (
          <button
            onClick={handleClearFilters}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Cancella filtri
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredQuestions.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/70">Nessuna domanda trovata</p>
            <p className="text-white/50 text-sm mt-2">
              Prova a modificare i filtri di ricerca
            </p>
          </GlassCard>
        ) : (
          filteredQuestions.map((question, index) => (
            <GlassCard
              key={question.id}
              className="p-4 hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => onSelectQuestion(question)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium mb-2 line-clamp-2">
                    {question.domanda}
                  </p>
                  {question.argomento && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-white/50" />
                      <span className="text-white/60">{question.argomento}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

