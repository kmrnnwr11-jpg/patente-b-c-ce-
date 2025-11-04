import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { QuestionSearch } from '@/components/search/QuestionSearch';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import type { Question } from '@/types/quiz';

export const QuestionBrowserPage: FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/data/quiz.json');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Caricamento domande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary bg-pattern p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Esplora Domande
          </h1>
          <p className="text-white/70">
            Cerca e studia tutte le domande dell'esame
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Panel */}
          <div>
            <QuestionSearch
              questions={questions}
              onSelectQuestion={setSelectedQuestion}
            />
          </div>

          {/* Question Display */}
          <div>
            {selectedQuestion ? (
              <QuestionCard
                question={selectedQuestion}
                questionNumber={questions.findIndex(q => q.id === selectedQuestion.id) + 1}
                totalQuestions={questions.length}
                selectedAnswer={null}
                correctAnswer={selectedQuestion.risposta_corretta}
                showFeedback={true}
                onAnswer={() => {}}
                isBookmarked={false}
                onToggleBookmark={() => {}}
              />
            ) : (
              <div className="glass-card p-8 text-center">
                <p className="text-white/70">
                  Seleziona una domanda dalla lista per visualizzarla
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

