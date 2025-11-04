import { FC } from 'react';
import { 
  Brain, 
  Trophy, 
  BookOpen, 
  Target, 
  Zap, 
  Shield 
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Brain,
    title: 'Quiz Intelligenti',
    description: 'Oltre 7000 domande ministeriali aggiornate al 2025 con spiegazioni AI personalizzate per ogni risposta.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Trophy,
    title: 'Simulazioni Realistiche',
    description: 'Esercitati con simulazioni identiche all\'esame reale: 30 domande, 20 minuti, massimo 3 errori.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: BookOpen,
    title: 'Teoria Completa',
    description: 'Studia tutti i 25 argomenti ministeriali con contenuti multimediali, immagini e segnali stradali.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Target,
    title: 'Apprendimento Mirato',
    description: 'Concentrati sui tuoi punti deboli con quiz personalizzati per argomento e ripasso errori.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Progressi in Tempo Reale',
    description: 'Monitora le tue statistiche, streak giornalieri e migliora costantemente le tue performance.',
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: Shield,
    title: 'Garanzia di Successo',
    description: 'Il 94% dei nostri utenti supera l\'esame al primo tentativo. Preparati con il metodo più efficace.',
    color: 'from-indigo-500 to-purple-500'
  }
];

export const FeaturesSection: FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tutto quello che ti serve per
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              superare l'esame
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mt-6">
            La piattaforma più completa per la preparazione alla Patente B, 
            con tecnologia AI e contenuti sempre aggiornati.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard
                key={feature.title}
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon with gradient background */}
                <div className={`
                  w-16 h-16 rounded-2xl 
                  bg-gradient-to-br ${feature.color}
                  flex items-center justify-center
                  mb-6
                  group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300
                  shadow-lg
                `}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-sm text-white/50 group-hover:text-yellow-400 transition-colors">
                  <span>Scopri di più</span>
                  <svg 
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* CTA Bottom */}
        <div className="text-center mt-16">
          <GlassCard className="inline-block">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Pronto a iniziare?
                </h3>
                <p className="text-white/70">
                  Unisciti a oltre 50.000 studenti che hanno superato l'esame con noi.
                </p>
              </div>
              <button className="
                px-8 py-4 
                bg-gradient-to-r from-yellow-400 to-orange-500
                text-gray-900 font-bold rounded-2xl
                hover:scale-105 hover:shadow-2xl
                transition-all duration-300
                whitespace-nowrap
              ">
                Inizia Gratis
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

