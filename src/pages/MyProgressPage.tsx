import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp, 
  Clock, 
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  BookOpen,
  Zap
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { loadUserStats } from '@/lib/achievementSystem';
import { useQuizHistory } from '@/hooks/useQuizHistory';
import { useBookmarks } from '@/hooks/useBookmarks';

export const MyProgressPage: FC = () => {
  const navigate = useNavigate();
  const stats = useMemo(() => loadUserStats(), []);
  const { getTotalStats, getWeakQuestions, getTopicPerformance } = useQuizHistory();
  const { bookmarks } = useBookmarks();
  
  const quizStats = useMemo(() => getTotalStats(), [getTotalStats]);
  const weakQuestions = useMemo(() => getWeakQuestions(), [getWeakQuestions]);
  const topicPerformance = useMemo(() => getTopicPerformance(), [getTopicPerformance]);

  // Calcola giorni consecutivi
  const lastQuizDate = stats.lastQuizDate ? new Date(stats.lastQuizDate) : null;
  const today = new Date();
  const isActiveToday = lastQuizDate && 
    lastQuizDate.toDateString() === today.toDateString();

  return (
    <div className="min-h-screen bg-gradient-quiz bg-pattern p-4 md:p-8">
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Il Mio Progresso
          </h1>
          <p className="text-white/70">
            Monitora le tue statistiche e i tuoi miglioramenti
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {/* Livello */}
          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="inline-flex p-3 rounded-xl bg-yellow-500/20 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.level}
            </div>
            <div className="text-sm font-medium text-white/80 mb-1">
              Livello
            </div>
            <div className="text-xs text-white/60">
              {stats.totalXP || 0} XP totali
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${((stats.totalXP || 0) % 100)}%` }}
              />
            </div>
            <div className="text-xs text-white/50 mt-1">
              {100 - ((stats.totalXP || 0) % 100)} XP al prossimo livello
            </div>
          </GlassCard>

          {/* Accuratezza */}
          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="inline-flex p-3 rounded-xl bg-emerald-500/20 mb-4">
              <Target className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {(stats.accuracy || 0).toFixed(1)}%
            </div>
            <div className="text-sm font-medium text-white/80 mb-1">
              Accuratezza
            </div>
            <div className="text-xs text-white/60">
              {stats.correctAnswers || 0}/{stats.totalAnswers || 0} corrette
            </div>
            <div className="mt-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-white/70">
                {stats.correctAnswers || 0} risposte corrette
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-white/70">
                {(stats.totalAnswers || 0) - (stats.correctAnswers || 0)} errori
              </span>
            </div>
          </GlassCard>

          {/* Streak */}
          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="inline-flex p-3 rounded-xl bg-orange-500/20 mb-4">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.currentStreak || 0}
            </div>
            <div className="text-sm font-medium text-white/80 mb-1">
              Streak Corrente
            </div>
            <div className="text-xs text-white/60">
              Record: {stats.longestStreak || 0} giorni
            </div>
            {isActiveToday && (
              <div className="mt-3 px-3 py-1 bg-orange-500/20 rounded-full inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-300 font-medium">
                  Attivo oggi!
                </span>
              </div>
            )}
          </GlassCard>

          {/* Quiz Completati */}
          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="inline-flex p-3 rounded-xl bg-blue-500/20 mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.quizzesCompleted || 0}
            </div>
            <div className="text-sm font-medium text-white/80 mb-1">
              Quiz Completati
            </div>
            <div className="text-xs text-white/60">
              {quizStats.uniqueQuestions || 0} domande uniche
            </div>
            <div className="mt-3 text-xs text-white/70">
              Media: {((stats.totalAnswers || 0) / Math.max(stats.quizzesCompleted || 1, 1)).toFixed(1)} domande/quiz
            </div>
          </GlassCard>

          {/* Domande Deboli */}
          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => navigate('/smart-review')}>
            <div className="inline-flex p-3 rounded-xl bg-red-500/20 mb-4">
              <Clock className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {weakQuestions.length}
            </div>
            <div className="text-sm font-medium text-white/80 mb-1">
              Domande Deboli
            </div>
            <div className="text-xs text-white/60">
              Da ripassare
            </div>
            {weakQuestions.length > 0 && (
              <div className="mt-3 px-3 py-1 bg-red-500/20 rounded-full inline-block">
                <span className="text-xs text-red-300 font-medium">
                  Clicca per ripassare
                </span>
              </div>
            )}
          </GlassCard>

          {/* Salvate */}
          <GlassCard className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => navigate('/bookmarks')}>
            <div className="inline-flex p-3 rounded-xl bg-purple-500/20 mb-4">
              <Award className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {bookmarks.length}
            </div>
            <div className="text-sm font-medium text-white/80 mb-1">
              Domande Salvate
            </div>
            <div className="text-xs text-white/60">
              Bookmarks attivi
            </div>
            {bookmarks.length > 0 && (
              <div className="mt-3 px-3 py-1 bg-purple-500/20 rounded-full inline-block">
                <span className="text-xs text-purple-300 font-medium">
                  Clicca per vedere
                </span>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Performance per Argomento */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Performance per Argomento</h2>
          </div>

          {topicPerformance.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70">Nessun dato disponibile</p>
              <p className="text-white/50 text-sm mt-2">
                Completa alcuni quiz per vedere le statistiche per argomento
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topicPerformance.map((topic) => (
                <div
                  key={topic.topic}
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-950/90 via-indigo-900/75 to-slate-900/70 border border-indigo-400/20 shadow-lg shadow-indigo-900/30 backdrop-blur"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{topic.topic}</span>
                    <span className="text-white/70 text-sm">
                      {topic.correct}/{topic.total} ({(topic.percentage || 0).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        topic.percentage >= 80 
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                          : topic.percentage >= 60
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : 'bg-gradient-to-r from-red-400 to-red-500'
                      }`}
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Activity Calendar */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Attività Recente</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl text-center bg-gradient-to-br from-slate-950/90 via-indigo-900/75 to-slate-900/70 border border-indigo-400/20 shadow-lg shadow-indigo-900/30 backdrop-blur">
              <div className="text-2xl font-bold text-white mb-1">
                {stats.quizzesCompleted}
              </div>
              <div className="text-sm text-white/70">Quiz Totali</div>
            </div>
            <div className="p-4 rounded-xl text-center bg-gradient-to-br from-slate-950/90 via-indigo-900/75 to-slate-900/70 border border-indigo-400/20 shadow-lg shadow-indigo-900/30 backdrop-blur">
              <div className="text-2xl font-bold text-white mb-1">
                {stats.totalAnswers}
              </div>
              <div className="text-sm text-white/70">Domande Risposte</div>
            </div>
            <div className="p-4 rounded-xl text-center bg-gradient-to-br from-slate-950/90 via-indigo-900/75 to-slate-900/70 border border-indigo-400/20 shadow-lg shadow-indigo-900/30 backdrop-blur">
              <div className="text-2xl font-bold text-white mb-1">
                {stats.longestStreak}
              </div>
              <div className="text-sm text-white/70">Streak Record</div>
            </div>
            <div className="p-4 rounded-xl text-center bg-gradient-to-br from-slate-950/90 via-indigo-900/75 to-slate-900/70 border border-indigo-400/20 shadow-lg shadow-indigo-900/30 backdrop-blur">
              <div className="text-2xl font-bold text-white mb-1">
                {lastQuizDate ? lastQuizDate.toLocaleDateString('it-IT') : 'N/A'}
              </div>
              <div className="text-sm text-white/70">Ultimo Quiz</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

