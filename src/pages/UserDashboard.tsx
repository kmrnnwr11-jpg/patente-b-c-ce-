import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { StreakDisplay } from '@/components/dashboard/StreakDisplay';
import { GlassCard } from '@/components/ui/GlassCard';

export const UserDashboard: FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();

  // Mock data - In produzione questi dati verranno da Firestore
  const [stats] = useState({
    totalQuizzes: 45,
    correctAnswers: 382,
    totalAnswers: 450,
    averageTime: 12,
    currentStreak: 7,
    longestStreak: 14,
    lastActivity: new Date()
  });

  const [progressData] = useState([
    { date: 'Lun', quizzes: 3, correctRate: 75 },
    { date: 'Mar', quizzes: 5, correctRate: 82 },
    { date: 'Mer', quizzes: 4, correctRate: 78 },
    { date: 'Gio', quizzes: 6, correctRate: 85 },
    { date: 'Ven', quizzes: 7, correctRate: 88 },
    { date: 'Sab', quizzes: 5, correctRate: 90 },
    { date: 'Dom', quizzes: 8, correctRate: 92 }
  ]);

  const correctRate = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Redirect se non autenticato
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || 'User'}
                className="w-16 h-16 rounded-full border-4 border-white/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                Ciao, {currentUser.displayName || 'Studente'}!
              </h1>
              <p className="text-white/70 text-sm">
                {currentUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Premium Badge */}
        {userData?.isPremium && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold">
            <Trophy className="w-4 h-4" />
            Premium
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Quiz Completati"
            value={stats.totalQuizzes}
            subtitle="Totale simulazioni"
            icon={BookOpen}
            color="from-blue-500 to-cyan-500"
            trend={{ value: 12, isPositive: true }}
            onClick={() => navigate('/quiz/exam')}
          />

          <StatCard
            title="Tasso Successo"
            value={`${correctRate}%`}
            subtitle={`${stats.correctAnswers}/${stats.totalAnswers} corrette`}
            icon={Target}
            color="from-green-500 to-emerald-500"
            trend={{ value: 8, isPositive: true }}
          />

          <StatCard
            title="Tempo Medio"
            value={`${stats.averageTime}min`}
            subtitle="Per quiz"
            icon={Clock}
            color="from-purple-500 to-pink-500"
            trend={{ value: 5, isPositive: false }}
          />

          <StatCard
            title="Miglioramento"
            value="+15%"
            subtitle="Ultima settimana"
            icon={TrendingUp}
            color="from-orange-500 to-red-500"
            trend={{ value: 15, isPositive: true }}
          />
        </div>
      </div>

      {/* Streak Display */}
      <div className="px-6 mb-6">
        <StreakDisplay
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
          lastActivity={stats.lastActivity}
        />
      </div>

      {/* Progress Chart */}
      <div className="px-6 mb-6">
        <ProgressChart data={progressData} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-4">
            Azioni Rapide
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/quiz/exam')}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:scale-105 transition-all"
            >
              📝 Nuova Simulazione
            </button>
            <button
              onClick={() => navigate('/quiz/topics')}
              className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:scale-105 transition-all"
            >
              🎯 Quiz per Argomento
            </button>
            <button
              onClick={() => navigate('/theory')}
              className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-all"
            >
              📚 Studia Teoria
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:scale-105 transition-all"
            >
              👤 Il Mio Profilo
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Motivational Quote */}
      <div className="px-6">
        <GlassCard>
          <div className="text-center">
            <p className="text-2xl mb-2">💡</p>
            <p className="text-white font-medium mb-2">
              "La costanza è la chiave del successo"
            </p>
            <p className="text-white/70 text-sm">
              Continua a studiare ogni giorno e raggiungerai il tuo obiettivo!
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

