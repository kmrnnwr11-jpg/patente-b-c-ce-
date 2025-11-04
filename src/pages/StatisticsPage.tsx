import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Target, Clock, Zap, Calendar } from 'lucide-react';
import { loadUserStats } from '@/lib/achievementSystem';
import { useQuizHistory } from '@/hooks/useQuizHistory';
import { GlassCard } from '@/components/ui/GlassCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';

export const StatisticsPage: FC = () => {
  const navigate = useNavigate();
  const stats = useMemo(() => loadUserStats(), []);
  const { getTotalStats, getTopicPerformance } = useQuizHistory();
  const totalStats = useMemo(() => getTotalStats(), [getTotalStats]);
  const topicPerformance = useMemo(() => getTopicPerformance(), [getTopicPerformance]);

  // Mock data per grafici (in produzione useremo dati reali)
  const accuracyData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
        value: Math.round(75 + Math.random() * 20),
        label: date.toLocaleDateString('it-IT', { weekday: 'short' })
      });
    }
    return last7Days;
  }, []);

  const quizCountData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
        value: Math.floor(Math.random() * 5),
        label: date.toLocaleDateString('it-IT', { weekday: 'short' })
      });
    }
    return last7Days;
  }, []);

  return (
    <div 
      className="min-h-screen p-4 md:p-8"
      style={{
        background: 'linear-gradient(to bottom, #5FB894, #4AA9D0, #3B9ED9)',
        minHeight: '100vh'
      }}
    >
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Le Tue Statistiche
              </h1>
              <p className="text-white/70 text-sm">
                Analisi dettagliata delle tue performance
              </p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="inline-flex p-3 bg-emerald-500/20 rounded-xl mb-3">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {(totalStats.overallSuccessRate || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-white/70">Accuratezza</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="inline-flex p-3 bg-blue-500/20 rounded-xl mb-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {totalStats.totalAttempts}
            </div>
            <div className="text-sm text-white/70">Domande Totali</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="inline-flex p-3 bg-orange-500/20 rounded-xl mb-3">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-white/70">Giorni Streak</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="inline-flex p-3 bg-purple-500/20 rounded-xl mb-3">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.quizzesCompleted}
            </div>
            <div className="text-sm text-white/70">Quiz Completati</div>
          </GlassCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart
            data={accuracyData}
            title="Accuratezza Ultimi 7 Giorni"
            color="#10b981"
          />
          <PerformanceChart
            data={quizCountData}
            title="Quiz Completati Ultimi 7 Giorni"
            color="#3b82f6"
          />
        </div>

        {/* Topic Performance */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Performance per Argomento
          </h3>

          {topicPerformance.length > 0 ? (
            <div className="space-y-4">
              {topicPerformance.map((topic) => (
                <div key={topic.topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{topic.topic}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${
                        topic.successRate >= 0.8 ? 'text-emerald-400' :
                        topic.successRate >= 0.6 ? 'text-yellow-400' :
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
                    <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          topic.successRate >= 0.8 ? 'bg-emerald-500' :
                          topic.successRate >= 0.6 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${topic.successRate * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">
                Completa alcuni quiz per vedere le statistiche per argomento
              </p>
            </div>
          )}
        </GlassCard>

        {/* Time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white">Tempo Medio</h4>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              ~15 min
            </div>
            <p className="text-sm text-white/60">
              Per quiz completo
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-white">Miglior Tempo</h4>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              8:32
            </div>
            <p className="text-sm text-white/60">
              Record personale
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white">Giorni Attivi</h4>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.longestStreak}
            </div>
            <p className="text-sm text-white/60">
              Streak più lunga
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

