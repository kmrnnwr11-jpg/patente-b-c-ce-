import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { 
  Car, 
  HelpCircle, 
  BookOpen, 
  Trophy, 
  TrendingUp,
  Home as HomeIcon,
  Monitor,
  User,
  LogIn,
  Zap,
  Target,
  Award,
  BarChart3,
  Settings,
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';

export const DashboardHome: FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Main feature cards con icone e colori moderni
  const mainFeatures = [
    {
      id: 'quiz20',
      icon: Sparkles,
      title: 'Quiz 2.0 🚀',
      subtitle: 'Traduzione AI + Audio',
      gradient: 'from-pink-500 to-purple-600',
      bgColor: 'bg-pink-500/20',
      route: '/quiz/2.0',
      badge: 'NUOVO!'
    },
    {
      id: 'exam',
      icon: Car,
      title: 'Simulazione Esame',
      subtitle: 'Come quello reale',
      gradient: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/20',
      route: '/test-quiz',
      badge: '40 domande'
    },
    {
      id: 'topics',
      icon: HelpCircle,
      title: 'Quiz per Argomento',
      subtitle: 'Scegli il tema',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/20',
      route: '/quiz/topics',
      badge: '25 argomenti'
    },
    {
      id: 'theory',
      icon: BookOpen,
      title: 'Teoria e Segnali',
      subtitle: 'Studia i capitoli',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/20',
      route: '/theory',
      badge: 'Tutto completo'
    },
    {
      id: 'stats',
      icon: Trophy,
      title: 'I Miei Risultati',
      subtitle: 'Vedi i progressi',
      gradient: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/20',
      route: '/achievements',
      badge: 'Statistiche'
    }
  ];

  // Quick action buttons
  const quickActions = [
    {
      id: 'progress',
      icon: TrendingUp,
      label: 'Progressi',
      route: '/my-progress',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'mistakes',
      icon: Target,
      label: 'Errori',
      route: '/mistakes',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'favorites',
      icon: Award,
      label: 'Preferiti',
      route: '/favorites',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Impostazioni',
      route: '/settings',
      color: 'from-gray-500 to-gray-700'
    }
  ];

  // Bottom navigation
  const tabItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', route: '/dashboard' },
    { id: 'exam', icon: Monitor, label: 'Esame', route: '/test-quiz' },
    { id: 'theory', icon: BookOpen, label: 'Teoria', route: '/theory' },
    { id: 'profile', icon: User, label: 'Profilo', route: '/user-dashboard' }
  ];

  const handleTabClick = (tabId: string, route: string) => {
    setActiveTab(tabId);
    navigate(route);
  };

  return (
    <>
      <OnboardingTour />

      <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] pb-28 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Header Moderno con Glassmorphism */}
        <header className="relative z-10 px-6 pt-8 pb-6">
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              {/* Logo e Saluto */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                  <Car className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-white">
                    {currentUser ? `Ciao, ${currentUser.displayName?.split(' ')[0] || 'Studente'}!` : 'Benvenuto!'}
                  </h1>
                  <p className="text-sm text-cyan-300 font-semibold flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Continua così! 🚀
                  </p>
                </div>
              </div>
          
          {/* Actions */}
              <div className="flex items-center gap-3">
            <NotificationCenter />

            {currentUser ? (
              <button 
                onClick={() => navigate('/user-dashboard')}
                    className="group relative"
              >
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                        className="w-12 h-12 rounded-2xl border-2 border-cyan-400 group-hover:scale-110 transition-transform shadow-lg"
                  />
                ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <User className="w-6 h-6 text-white" />
                  </div>
                )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-[#0F2027]" />
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-2xl transition-all hover:scale-105 shadow-lg"
              >
                <LogIn className="w-5 h-5 text-white" />
                    <span className="text-white text-sm font-bold">Accedi</span>
              </button>
            )}
          </div>
        </div>
          </div>
        </header>

        {/* Hero Banner con Effetto 3D */}
        <section className="relative z-10 px-6 mt-6">
          <button
            onClick={() => navigate('/test-quiz')}
            className="group w-full relative overflow-hidden backdrop-blur-2xl bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl p-6 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/30"
          >
            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Zap className="w-9 h-9 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-black text-white mb-1">
                    Inizia Simulazione Esame
                  </h2>
                  <p className="text-sm text-cyan-300 font-semibold">
                    40 domande • Timer reale • Come l'esame vero
          </p>
        </div>
      </div>
              <ChevronRight className="w-8 h-8 text-white/70 group-hover:translate-x-2 group-hover:text-white transition-all" />
            </div>
          </button>
        </section>

        {/* Main Features Grid 3D */}
        <section className="relative z-10 px-6 mt-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Cosa vuoi fare oggi?
            </h3>
          </div>

        <div className="grid grid-cols-2 gap-4">
            {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => navigate(feature.route)}
                className={`
                    group relative overflow-hidden
                    backdrop-blur-2xl ${feature.bgColor} rounded-3xl p-6
                    border border-white/20 hover:border-white/40
                    min-h-[170px]
                    hover:scale-105 active:scale-95
                    transition-all duration-500
                    hover:shadow-2xl
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-1 rounded-lg">
                        {feature.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 flex flex-col justify-end">
                      <h4 className="text-white font-bold text-base mb-1 leading-tight">
                  {feature.title}
                      </h4>
                      <p className="text-white/60 text-xs font-medium">
                        {feature.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="relative z-10 px-6 mt-8">
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Azioni Rapide
          </h3>

          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => navigate(action.route)}
                  className="group flex flex-col items-center gap-2 backdrop-blur-2xl bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-white text-[10px] font-semibold text-center leading-tight">
                    {action.label}
                </span>
              </button>
            );
          })}
        </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 px-6 mt-8 mb-6">
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Il Tuo Progresso
              </h3>
              <button 
                onClick={() => navigate('/my-progress')}
                className="text-cyan-400 text-sm font-semibold hover:underline flex items-center gap-1"
              >
                Dettagli
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-black text-white mb-1">24</p>
                <p className="text-[10px] text-white/60 font-semibold">Quiz Fatti</p>
              </div>

              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-black text-white mb-1">87%</p>
                <p className="text-[10px] text-white/60 font-semibold">Correttezza</p>
      </div>

              <div className="text-center group cursor-pointer">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-black text-white mb-1">7</p>
                <p className="text-[10px] text-white/60 font-semibold">Giorni Streak</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Navigation Bar Ultra Moderna */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6">
          <div className="backdrop-blur-2xl bg-white/10 rounded-[2rem] border border-white/20 shadow-2xl">
            <div className="flex items-center justify-around px-4 py-4">
          {tabItems.map((item) => {
            const Icon = item.icon;
                const isActive = activeTab === item.id;
                
            return (
              <button
                key={item.id}
                    onClick={() => handleTabClick(item.id, item.route)}
                className={`
                      relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl
                      transition-all duration-300
                      ${isActive 
                        ? 'scale-110' 
                        : 'scale-100 hover:scale-105'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 rounded-2xl blur-xl" />
                    )}
                    
                    {/* Icon Container */}
                    <div className={`
                      relative w-11 h-11 rounded-xl flex items-center justify-center
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-br from-cyan-400 to-purple-600 shadow-lg shadow-cyan-500/50' 
                        : 'bg-white/10'
                  }
                    `}>
                <Icon 
                        className={`w-6 h-6 transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-white/60'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                />
                    </div>
                    
                    {/* Label */}
                    <span className={`
                      text-[10px] font-bold transition-all duration-300
                      ${isActive ? 'text-white' : 'text-white/60'}
                    `}>
                  {item.label}
                </span>

                    {/* Active Dot */}
                    {isActive && (
                      <div className="absolute -top-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    )}
              </button>
            );
          })}
        </div>
      </div>
        </nav>
      </div>
    </>
  );
};

