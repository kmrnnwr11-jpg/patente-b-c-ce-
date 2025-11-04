import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Lock, Star } from 'lucide-react';
import { loadAchievements, loadUserStats } from '@/lib/achievementSystem';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

export const AchievementsPage: FC = () => {
  const navigate = useNavigate();
  const achievements = useMemo(() => loadAchievements(), []);
  const stats = useMemo(() => loadUserStats(), []);

  const categories = useMemo(() => {
    const cats = new Map<string, typeof achievements>();
    achievements.forEach(achievement => {
      const cat = achievement.category;
      if (!cats.has(cat)) {
        cats.set(cat, []);
      }
      cats.get(cat)!.push(achievement);
    });
    return cats;
  }, [achievements]);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const rarityColors = {
    common: 'from-gray-500/20 to-gray-600/10 border-gray-500/30',
    rare: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    epic: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    legendary: 'from-yellow-500/20 to-orange-500/10 border-yellow-500/30'
  };

  const categoryNames = {
    quiz: 'Quiz',
    study: 'Studio',
    streak: 'Costanza',
    social: 'Social',
    special: 'Speciali'
  };

  const categoryIcons = {
    quiz: '🎯',
    study: '📚',
    streak: '🔥',
    social: '👥',
    special: '⭐'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 md:p-8">
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

        {/* Title & Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Achievements
              </h1>
              <p className="text-white/70 text-sm">
                {unlockedCount} di {totalCount} sbloccati ({completionPercentage}%)
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Progresso Totale</span>
              <span className="text-white/70 text-sm">
                {stats.totalXP} XP • Livello {stats.level}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </GlassCard>
        </div>

        {/* Achievements by Category */}
        {Array.from(categories.entries()).map(([category, categoryAchievements]) => (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
              <h2 className="text-2xl font-bold text-white">
                {categoryNames[category as keyof typeof categoryNames]}
              </h2>
              <span className="text-white/60 text-sm">
                ({categoryAchievements.filter(a => a.isUnlocked).length}/{categoryAchievements.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map(achievement => (
                <GlassCard
                  key={achievement.id}
                  className={`p-5 transition-all ${
                    achievement.isUnlocked
                      ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} border-2`
                      : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                      ${achievement.isUnlocked ? 'bg-white/20' : 'bg-white/10'}
                    `}>
                      {achievement.isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-white/50" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-white">
                          {achievement.name}
                        </h3>
                        {achievement.isUnlocked && (
                          <Star className="w-5 h-5 text-yellow-400 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-white/80 text-sm mb-2">
                        {achievement.description}
                      </p>

                      {/* Rarity & XP */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${achievement.rarity === 'common' ? 'bg-gray-500/30 text-gray-200' :
                            achievement.rarity === 'rare' ? 'bg-blue-500/30 text-blue-200' :
                            achievement.rarity === 'epic' ? 'bg-purple-500/30 text-purple-200' :
                            'bg-yellow-500/30 text-yellow-200'}
                        `}>
                          {achievement.rarity.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 bg-yellow-500/20 rounded-full text-xs text-yellow-300 font-bold">
                          +{achievement.xpReward} XP
                        </span>
                      </div>

                      {/* Unlock Date */}
                      {achievement.isUnlocked && achievement.unlockedAt && (
                        <p className="text-white/50 text-xs mt-2">
                          Sbloccato il {new Date(achievement.unlockedAt).toLocaleDateString('it-IT')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress (if not unlocked) */}
                  {!achievement.isUnlocked && achievement.requirement.current !== undefined && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                        <span>Progresso</span>
                        <span>{achievement.requirement.current}/{achievement.requirement.target}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (achievement.requirement.current / achievement.requirement.target) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <GlassCard className="p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Continua a studiare!
          </h3>
          <p className="text-white/70 mb-6">
            Completa più quiz per sbloccare nuovi achievements e salire di livello
          </p>
          <Button
            onClick={() => navigate('/quiz/exam')}
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            Inizia un Quiz
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};

