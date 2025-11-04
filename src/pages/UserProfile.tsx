import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User as UserIcon, 
  Calendar,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Edit2,
  Crown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';

export const UserProfile: FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Mock stats - In produzione da Firestore
  const stats = {
    totalQuizzes: 45,
    correctAnswers: 382,
    totalAnswers: 450,
    averageTime: 12,
    totalStudyTime: 540, // minuti
    currentStreak: 7,
    longestStreak: 14,
    joinDate: userData?.createdAt || new Date()
  };

  const correctRate = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
  const studyHours = Math.floor(stats.totalStudyTime / 60);
  const studyMinutes = stats.totalStudyTime % 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/user-dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">
            Il Mio Profilo
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <GlassCard>
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
              )}
              
              {/* Premium Badge */}
              {userData?.isPremium && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-gray-900" />
                </div>
              )}
            </div>

            {/* Name & Email */}
            <h2 className="text-2xl font-bold text-white mb-1">
              {currentUser.displayName || 'Studente'}
            </h2>
            <p className="text-white/70 mb-4">
              {currentUser.email}
            </p>

            {/* Member Since */}
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                Membro dal {new Date(stats.joinDate).toLocaleDateString('it-IT', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Statistics */}
      <div className="px-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Le Tue Statistiche
        </h3>

        <div className="space-y-4">
          {/* Quiz Stats */}
          <GlassCard>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">Quiz Completati</p>
                <p className="text-white/70 text-sm">Simulazioni ed esercizi</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalQuizzes}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Tasso di successo</span>
                <span className="text-white font-bold">{correctRate}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${correctRate}%` }}
                ></div>
              </div>
              <p className="text-white/60 text-xs">
                {stats.correctAnswers} corrette su {stats.totalAnswers} totali
              </p>
            </div>
          </GlassCard>

          {/* Study Time */}
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">Tempo di Studio</p>
                <p className="text-white/70 text-sm">Totale ore dedicate</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {studyHours}h {studyMinutes}m
              </p>
            </div>
          </GlassCard>

          {/* Streak */}
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">Streak Attuale</p>
                <p className="text-white/70 text-sm">Giorni consecutivi</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{stats.currentStreak}</p>
                <p className="text-white/60 text-xs">Record: {stats.longestStreak}</p>
              </div>
            </div>
          </GlassCard>

          {/* Average Time */}
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg">Tempo Medio</p>
                <p className="text-white/70 text-sm">Per quiz</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.averageTime}min</p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Traguardi Raggiunti
        </h3>

        <GlassCard>
          <div className="grid grid-cols-3 gap-4">
            {/* Achievement Badges */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-3xl">🏆</span>
              </div>
              <p className="text-white text-xs font-medium">Primo Quiz</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
              <p className="text-white text-xs font-medium">Streak 7 Giorni</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-3xl">⭐</span>
              </div>
              <p className="text-white text-xs font-medium">10 Quiz</p>
            </div>

            <div className="text-center opacity-50">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <p className="text-white text-xs font-medium">90% Successo</p>
            </div>

            <div className="text-center opacity-50">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-3xl">💯</span>
              </div>
              <p className="text-white text-xs font-medium">Quiz Perfetto</p>
            </div>

            <div className="text-center opacity-50">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-3xl">👑</span>
              </div>
              <p className="text-white text-xs font-medium">Streak 30 Giorni</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Upgrade to Premium */}
      {!userData?.isPremium && (
        <div className="px-6">
          <GlassCard className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/30">
            <div className="text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Passa a Premium
              </h3>
              <p className="text-white/80 mb-4">
                Sblocca spiegazioni AI illimitate, audio multilingua e molto altro!
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl hover:scale-105 transition-all"
              >
                Scopri Premium
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

