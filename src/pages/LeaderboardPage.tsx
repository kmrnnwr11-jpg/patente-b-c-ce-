import { FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { getGlobalLeaderboard, getUserRank } from '@/lib/leaderboardSystem';
import { GlassCard } from '@/components/ui/GlassCard';

export const LeaderboardPage: FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'global' | 'friends' | 'topic'>('global');
  
  const leaderboard = useMemo(() => getGlobalLeaderboard(50), []);
  const userRank = useMemo(() => getUserRank(), []);
  const currentUser = leaderboard.find(e => e.userId === 'local');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400 fill-current" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400 fill-current" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400 fill-current" />;
      default:
        return <span className="text-white/70 font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    return 'bg-white/10';
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

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Classifica
              </h1>
              <p className="text-white/70 text-sm">
                Confrontati con gli altri studenti
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('global')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'global'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Globale
          </button>
          <button
            onClick={() => setFilter('friends')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'friends'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Amici
          </button>
          <button
            onClick={() => setFilter('topic')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'topic'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Per Argomento
          </button>
        </div>

        {/* User Position Card */}
        {currentUser && (
          <GlassCard className="mb-6 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{currentUser.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    La Tua Posizione
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span>Livello {currentUser.level}</span>
                    <span>•</span>
                    <span>{currentUser.totalQuizzes} quiz</span>
                    <span>•</span>
                    <span>{(currentUser.accuracy || 0).toFixed(1)}% accuratezza</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white mb-1">
                  #{userRank}
                </div>
                <div className="text-sm text-white/70">
                  {currentUser.score.toLocaleString()} punti
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {leaderboard.slice(0, 3).map((entry, idx) => (
            <GlassCard
              key={entry.userId}
              className={`p-6 text-center ${getRankBadge(entry.rank)} ${
                idx === 0 ? 'order-2 scale-110' : idx === 1 ? 'order-1' : 'order-3'
              }`}
            >
              <div className="mb-3">
                {getRankIcon(entry.rank)}
              </div>
              <div className="text-4xl mb-2">{entry.avatar}</div>
              <h3 className="font-bold text-white mb-1 truncate">
                {entry.username}
              </h3>
              <div className="text-2xl font-bold text-white mb-1">
                {entry.score.toLocaleString()}
              </div>
              <div className="text-xs text-white/70">
                Livello {entry.level}
              </div>
              {entry.streak > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full text-xs text-orange-300">
                  🔥 {entry.streak} giorni
                </div>
              )}
            </GlassCard>
          ))}
        </div>

        {/* Full Leaderboard */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Classifica Completa
          </h3>

          <div className="space-y-2">
            {leaderboard.slice(3).map((entry) => (
              <div
                key={entry.userId}
                className={`
                  flex items-center justify-between p-4 rounded-xl transition-all
                  ${entry.userId === 'local'
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50'
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar & Name */}
                  <div className="text-2xl flex-shrink-0">{entry.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {entry.username}
                      {entry.userId === 'local' && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs">
                          Tu
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>Lv. {entry.level}</span>
                      <span>•</span>
                      <span>{entry.totalQuizzes} quiz</span>
                      <span>•</span>
                      <span>{(entry.accuracy || 0).toFixed(1)}%</span>
                      {entry.streak > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-orange-400">🔥 {entry.streak}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-white">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60">punti</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="mt-6 p-6 text-center">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">
            Come Salire in Classifica?
          </h3>
          <p className="text-white/70 text-sm">
            Completa più quiz, mantieni una streak giornaliera e migliora la tua accuratezza per guadagnare punti!
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

