import { FC, useEffect, useState } from 'react';
import { Trophy, XCircle, RotateCcw, Clock, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatTime } from '@/lib/utils';

export interface QuizReviewItem {
  index: number;
  id: number;
  domanda: string;
  immagine: string | null | undefined;
  userAnswer: boolean | null;
  correctAnswer: boolean;
  isCorrect: boolean;
  argomento?: string;
}

export interface QuizResultSummary {
  passed: boolean;
  correctCount: number;
  errors: number;
  totalQuestions: number;
  durationSeconds: number;
  reviewItems: QuizReviewItem[];
}

interface QuizResultsProps {
  summary: QuizResultSummary;
  onRetry: () => void;
  onReviewQuestion: (index: number) => void;
  onClose: () => void;
}

export const QuizResults: FC<QuizResultsProps> = ({
  summary,
  onClose,
  onRetry,
  onReviewQuestion
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setShowAnimation(true);
  }, []);

  const percentage = Math.round((summary.correctCount / summary.totalQuestions) * 100);
  const avgTimePerQuestion = Math.round(summary.durationSeconds / summary.totalQuestions);
  
  // Calcola statistiche per argomento
  const topicStats = summary.reviewItems.reduce((acc, item) => {
    const topic = item.argomento || 'Generale';
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0 };
    }
    acc[topic].total++;
    if (item.isCorrect) {
      acc[topic].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const topicStatsArray = Object.entries(topicStats)
    .map(([topic, stats]) => ({
      topic,
      percentage: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Results Card with Glassmorphism */}
        <div 
          className={`bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 transform transition-all duration-700 ${
            showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Animated Status Icon */}
          <div className="flex justify-center mb-6">
            <div 
              className={`${summary.passed ? 'text-success' : 'text-error'} animate-bounce`}
              style={{ animationDuration: '2s' }}
            >
              {summary.passed ? (
                <Trophy size={80} strokeWidth={1.5} />
              ) : (
                <XCircle size={80} strokeWidth={1.5} />
              )}
            </div>
          </div>

          {/* Result Title */}
          <h2 
            className={`text-4xl font-bold text-center mb-4 ${
              summary.passed ? 'text-success' : 'text-error'
            }`}
          >
            {summary.passed ? '🎉 PROMOSSO!' : '❌ BOCCIATO'}
          </h2>

          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/20"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={summary.passed ? '#10b981' : '#ef4444'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white">{percentage}%</div>
                  <div className="text-sm text-white/60">
                    {summary.correctCount}/{summary.totalQuestions}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-emerald-500/20">
              <div className="flex justify-center mb-2">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white">{summary.correctCount}</div>
              <div className="text-xs text-white/70 mt-1">Corrette</div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-red-500/20">
              <div className="flex justify-center mb-2">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-error">{summary.errors}</div>
              <div className="text-xs text-white/70 mt-1">Errori</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/20">
              <div className="flex justify-center mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(summary.durationSeconds)}</div>
              <div className="text-xs text-white/70 mt-1">Tempo Totale</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-purple-500/20">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{avgTimePerQuestion}s</div>
              <div className="text-xs text-white/70 mt-1">Media/Domanda</div>
            </div>
          </div>

          {/* Topic Statistics */}
          {topicStatsArray.length > 1 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Statistiche per Argomento
              </h3>
              <div className="space-y-3">
                {topicStatsArray.map((stat, idx) => (
                  <div 
                    key={stat.topic}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white/90">{stat.topic}</span>
                      <span className={`text-sm font-bold ${stat.percentage >= 80 ? 'text-emerald-400' : stat.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {stat.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            stat.percentage >= 80 ? 'bg-emerald-500' : 
                            stat.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/60 whitespace-nowrap">
                        {stat.correct}/{stat.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Questions Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Ripassa tutte le domande
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300 font-medium">
                  {summary.reviewItems.filter(item => !item.isCorrect).length} errori
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-300 font-medium">
                  {summary.reviewItems.filter(item => item.isCorrect).length} corrette
                </span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto pr-2 space-y-2 scrollbar-thin">
              {summary.reviewItems.map((item, idx) => {
                const itemStatus = item.isCorrect 
                  ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5' 
                  : 'border-red-500/40 bg-gradient-to-r from-red-500/10 to-red-600/5';
                const answerLabel = item.userAnswer === null ? 'Non risposto' : item.userAnswer ? 'Vero' : 'Falso';
                const iconColor = item.isCorrect ? 'text-emerald-400' : 'text-red-400';
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onReviewQuestion(item.index)}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition-all hover:scale-[1.01] hover:shadow-lg backdrop-blur-sm ${itemStatus}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${item.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {item.isCorrect ? (
                          <Target className={`w-4 h-4 ${iconColor}`} />
                        ) : (
                          <XCircle className={`w-4 h-4 ${iconColor}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-white/90 line-clamp-2">
                            {item.index + 1}. {item.domanda}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span>Tua: <span className={item.isCorrect ? 'text-emerald-400' : 'text-red-400'}>{answerLabel}</span></span>
                          <span>Corretta: <span className="text-white/80">{item.correctAnswer ? 'Vero' : 'Falso'}</span></span>
                          {item.argomento && (
                            <span className="px-2 py-0.5 bg-white/10 rounded text-white/70">{item.argomento}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 w-full sm:w-auto"
              onClick={onClose}
            >
              Continua a rivedere
            </Button>
            <Button
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 w-full sm:w-auto backdrop-blur-sm"
              onClick={onRetry}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nuova simulazione
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


