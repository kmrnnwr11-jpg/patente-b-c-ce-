import { FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, TrendingDown, Clock, Target, Play } from 'lucide-react';
import { useQuizHistory } from '@/hooks/useQuizHistory';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

export const SmartReviewPage: FC = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    getWeakQuestions, 
    getTopicPerformance, 
    getRecentErrors,
    getTotalStats 
  } = useQuizHistory();
  
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const weakQuestions = useMemo(() => getWeakQuestions(2, 0.5), [getWeakQuestions]);
  const recentErrors = useMemo(() => getRecentErrors(15), [getRecentErrors]);
  const topicPerformance = useMemo(() => getTopicPerformance(), [getTopicPerformance]);
  const totalStats = useMemo(() => getTotalStats(), [getTotalStats]);

  const handleStartReview = (type: 'weak' | 'recent' | 'topic', topic?: string) => {
    let questions;
    
    switch (type) {
      case 'weak':
        questions = weakQuestions;
        break;
      case 'recent':
        questions = recentErrors;
        break;
      case 'topic':
        if (!topic) return;
        const topicData = topicPerformance.find(t => t.topic === topic);
        if (!topicData) return;
        questions = weakQuestions.filter(q => q.argomento === topic);
        break;
      default:
        return;
    }

    if (questions.length === 0) {
      alert('Nessuna domanda disponibile per questa revisione');
      return;
    }

    // Salva le domande da rivedere
    sessionStorage.setItem('review_questions', JSON.stringify(questions));
    sessionStorage.setItem('review_type', type);
    if (topic) sessionStorage.setItem('review_topic', topic);
    
    navigate('/quiz/review');
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

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Smart Review
              </h1>
              <p className="text-white/70 text-sm">
                Sistema intelligente di ripasso basato sui tuoi errori
              </p>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <GlassCard className="mb-8 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Le tue statistiche</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {totalStats.uniqueQuestions}
              </div>
              <div className="text-sm text-white/70">Domande provate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {totalStats.totalAttempts}
              </div>
              <div className="text-sm text-white/70">Tentativi totali</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {Math.round(totalStats.overallSuccessRate * 100)}%
              </div>
              <div className="text-sm text-white/70">Tasso di successo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-1">
                {weakQuestions.length}
              </div>
              <div className="text-sm text-white/70">Domande deboli</div>
            </div>
          </div>
        </GlassCard>

        {/* Review Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weak Questions Review */}
          <GlassCard className="p-6 hover:bg-white/15 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium">
                {weakQuestions.length} domande
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Domande Deboli
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Ripassa le domande con meno del 50% di successo
            </p>
            
            <Button
              onClick={() => handleStartReview('weak')}
              disabled={weakQuestions.length === 0}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Inizia Ripasso
            </Button>
          </GlassCard>

          {/* Recent Errors Review */}
          <GlassCard className="p-6 hover:bg-white/15 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium">
                {recentErrors.length} domande
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Errori Recenti
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Ripassa gli ultimi errori commessi
            </p>
            
            <Button
              onClick={() => handleStartReview('recent')}
              disabled={recentErrors.length === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Inizia Ripasso
            </Button>
          </GlassCard>

          {/* Topic-based Review */}
          <GlassCard className="p-6 hover:bg-white/15 transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                Per argomento
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Ripasso Mirato
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Scegli un argomento specifico da ripassare
            </p>
            
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Seleziona argomento</option>
              {topicPerformance.map(topic => (
                <option key={topic.topic} value={topic.topic}>
                  {topic.topic} ({Math.round(topic.successRate * 100)}%)
                </option>
              ))}
            </select>
            
            <Button
              onClick={() => handleStartReview('topic', selectedTopic)}
              disabled={!selectedTopic}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Inizia Ripasso
            </Button>
          </GlassCard>
        </div>

        {/* Topic Performance Details */}
        {topicPerformance.length > 0 && (
          <GlassCard className="mt-8 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance per Argomento
            </h3>
            <div className="space-y-3">
              {topicPerformance.map((topic) => (
                <div key={topic.topic} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{topic.topic}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${
                        topic.successRate >= 0.7 ? 'text-emerald-400' :
                        topic.successRate >= 0.5 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {Math.round(topic.successRate * 100)}%
                      </span>
                      <span className="text-xs text-white/60">
                        {topic.correctAnswers}/{topic.totalAttempts}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          topic.successRate >= 0.7 ? 'bg-emerald-500' :
                          topic.successRate >= 0.5 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${topic.successRate * 100}%` }}
                      />
                    </div>
                    {topic.weakQuestions.length > 0 && (
                      <span className="text-xs text-red-300 whitespace-nowrap">
                        {topic.weakQuestions.length} deboli
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

