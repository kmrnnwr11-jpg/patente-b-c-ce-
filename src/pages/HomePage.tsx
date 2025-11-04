import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Trophy, Brain, Target, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SEO, SEO_PRESETS } from '@/components/SEO';

export const HomePage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9]">
      <SEO {...SEO_PRESETS.home} />
      {/* Header con Login/Register */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Car className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Patente B</h1>
              <p className="text-white/70 text-xs">2025</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
            >
              Accedi
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold hover:scale-105 transition-all"
            >
              Registrati
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 pt-12 pb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Supera l'esame della
          <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Patente B al primo colpo
          </span>
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          Oltre 7000 quiz ministeriali, teoria completa e spiegazioni AI. 
          Il 94% dei nostri studenti supera l'esame al primo tentativo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-2"
          >
            Inizia Gratis
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
          >
            Prova senza registrarti
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <GlassCard className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">7000+ Quiz</h3>
            <p className="text-white/70 text-sm">
              Tutti i quiz ministeriali aggiornati al 2025
            </p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Simulazioni Reali</h3>
            <p className="text-white/70 text-sm">
              Esercitati come all'esame vero
            </p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">94% Successo</h3>
            <p className="text-white/70 text-sm">
              Tasso di successo dei nostri studenti
            </p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Teoria Completa</h3>
            <p className="text-white/70 text-sm">
              25 capitoli con spiegazioni dettagliate
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-yellow-400 mb-2">50K+</p>
              <p className="text-white/70">Studenti</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-green-400 mb-2">94%</p>
              <p className="text-white/70">Promossi</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-blue-400 mb-2">4.9/5</p>
              <p className="text-white/70">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="px-6 py-16 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Pronto a iniziare?
        </h3>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          Unisciti a oltre 50.000 studenti che hanno superato l'esame con noi
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-xl hover:scale-105 hover:shadow-2xl transition-all"
        >
          Inizia Gratis Ora
        </button>
      </div>
    </div>
  );
};

