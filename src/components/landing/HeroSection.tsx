import { FC } from 'react';
import { ArrowRight, BookOpen, Brain, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

export const HeroSection: FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-primary dark:bg-gradient-dark bg-pattern" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Patente B 2025
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in">
            La tua piattaforma completa per superare l'esame della patente B 
            con quiz ministeriali, teoria interattiva e spiegazioni AI
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Button size="lg" className="text-lg">
              Inizia Gratis
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg bg-white/10 text-white border-white hover:bg-white hover:text-primary">
              Scopri Premium
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <GlassCard className="text-white text-center animate-slide-up">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-white/20">
                  <BookOpen size={28} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">7139 Quiz</h3>
              <p className="text-white/80 text-sm">
                Tutti i quiz ministeriali ufficiali aggiornati 2025
              </p>
            </GlassCard>

            <GlassCard className="text-white text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-white/20">
                  <Brain size={28} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Spiegazioni AI</h3>
              <p className="text-white/80 text-sm">
                Claude AI ti spiega ogni domanda in modo semplice
              </p>
            </GlassCard>

            <GlassCard className="text-white text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-white/20">
                  <Trophy size={28} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simulazioni Esame</h3>
              <p className="text-white/80 text-sm">
                Simula l'esame reale: 30 domande, 20 minuti, max 3 errori
              </p>
            </GlassCard>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-12 text-white">
            <div>
              <div className="text-3xl font-bold">7139</div>
              <div className="text-sm text-white/70">Quiz Totali</div>
            </div>
            <div>
              <div className="text-3xl font-bold">25</div>
              <div className="text-sm text-white/70">Argomenti</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-white/70">Gratuito</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

