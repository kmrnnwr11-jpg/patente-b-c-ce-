import { FC } from 'react';
import { Flame, Trophy, Target } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  lastActivity?: Date;
}

export const StreakDisplay: FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  lastActivity
}) => {
  // Calcola se l'utente ha studiato oggi
  const today = new Date();
  const isActiveToday = lastActivity && 
    lastActivity.toDateString() === today.toDateString();

  // Calcola il progresso verso il prossimo milestone
  const milestones = [7, 14, 30, 60, 100];
  const nextMilestone = milestones.find(m => m > currentStreak) || 365;
  const progress = (currentStreak / nextMilestone) * 100;

  return (
    <GlassCard className="relative overflow-hidden">
      {/* Background Flame Animation */}
      {currentStreak > 0 && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Flame className="w-full h-full text-orange-500 animate-pulse" />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className={`w-6 h-6 ${currentStreak > 0 ? 'text-orange-500' : 'text-white/50'}`} />
            Streak Giornaliero
          </h3>
          {isActiveToday && (
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <span className="text-green-400 text-sm font-bold">✓ Oggi</span>
            </div>
          )}
        </div>

        {/* Main Streak Display */}
        <div className="text-center mb-6">
          <div className={`
            inline-flex items-center justify-center
            w-32 h-32 rounded-full
            bg-gradient-to-br ${currentStreak > 0 ? 'from-orange-500 to-red-500' : 'from-gray-500 to-gray-600'}
            shadow-2xl
            mb-4
            relative
          `}>
            {currentStreak > 0 && (
              <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-20"></div>
            )}
            <div className="relative">
              <Flame className="w-16 h-16 text-white" strokeWidth={2} />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                {currentStreak}
              </div>
            </div>
          </div>

          <p className="text-3xl font-bold text-white mb-2">
            {currentStreak} {currentStreak === 1 ? 'Giorno' : 'Giorni'}
          </p>
          <p className="text-white/70">
            {currentStreak === 0 
              ? 'Inizia oggi la tua streak!' 
              : `Continua così! ${nextMilestone - currentStreak} giorni al prossimo traguardo`
            }
          </p>
        </div>

        {/* Progress Bar to Next Milestone */}
        {currentStreak > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/70">Progresso</span>
              <span className="text-white font-bold">{currentStreak} / {nextMilestone}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500 relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Longest Streak */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white/70 text-sm">Record</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {longestStreak}
            </p>
            <p className="text-white/60 text-xs mt-1">
              {longestStreak === 1 ? 'giorno' : 'giorni'}
            </p>
          </div>

          {/* Next Milestone */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-white/70 text-sm">Prossimo</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {nextMilestone}
            </p>
            <p className="text-white/60 text-xs mt-1">
              traguardo
            </p>
          </div>
        </div>

        {/* Motivation Message */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <p className="text-white/90 text-sm text-center">
            {currentStreak === 0 && "🚀 Inizia oggi! Fai un quiz per attivare la tua streak"}
            {currentStreak > 0 && currentStreak < 7 && "💪 Ottimo inizio! Continua così per raggiungere 7 giorni"}
            {currentStreak >= 7 && currentStreak < 14 && "🔥 Fantastico! Sei sulla buona strada"}
            {currentStreak >= 14 && currentStreak < 30 && "⭐ Incredibile! La costanza è la chiave del successo"}
            {currentStreak >= 30 && "🏆 Sei un campione! Questa dedizione ti porterà al successo"}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

