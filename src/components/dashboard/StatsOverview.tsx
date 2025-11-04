import { FC, useMemo } from 'react';
import { Trophy, Target, Flame, TrendingUp, Clock, Award } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { loadUserStats } from '@/lib/achievementSystem';
import { useQuizHistory } from '@/hooks/useQuizHistory';
import { useBookmarks } from '@/hooks/useBookmarks';

export const StatsOverview: FC = () => {
  const stats = useMemo(() => loadUserStats(), []);
  const { getTotalStats, getWeakQuestions } = useQuizHistory();
  const { bookmarks } = useBookmarks();
  
  const quizStats = useMemo(() => getTotalStats(), [getTotalStats]);
  const weakQuestions = useMemo(() => getWeakQuestions(), [getWeakQuestions]);

  const statsCards = [
    {
      icon: Trophy,
      label: 'Livello',
      value: stats.level,
      subtitle: `${stats.totalXP} XP`,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400'
    },
    {
      icon: Target,
      label: 'Accuratezza',
      value: `${(stats.accuracy || 0).toFixed(1)}%`,
      subtitle: `${stats.correctAnswers || 0}/${stats.totalAnswers || 0} corrette`,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Flame,
      label: 'Streak',
      value: stats.currentStreak,
      subtitle: `Record: ${stats.longestStreak} giorni`,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      iconColor: 'text-orange-400'
    },
    {
      icon: TrendingUp,
      label: 'Quiz Completati',
      value: stats.quizzesCompleted,
      subtitle: `${quizStats.uniqueQuestions} domande uniche`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      icon: Clock,
      label: 'Domande Deboli',
      value: weakQuestions.length,
      subtitle: 'Da ripassare',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/20',
      iconColor: 'text-red-400'
    },
    {
      icon: Award,
      label: 'Salvate',
      value: bookmarks.length,
      subtitle: 'Domande bookmark',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/20',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <GlassCard
            key={index}
            className="p-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-3`}>
              <Icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-white/80 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-white/60">
              {stat.subtitle}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

