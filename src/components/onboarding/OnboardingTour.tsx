import { FC, useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  icon?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: '👋 Benvenuto!',
    description: 'Sei pronto a superare l\'esame della Patente B? Ti guideremo attraverso tutte le funzionalità dell\'app!',
    icon: '🎓'
  },
  {
    title: '📝 Quiz Ministeriali',
    description: 'Esercitati con quiz ufficiali. Rispondi correttamente e passerai automaticamente alla domanda successiva!',
    icon: '✅'
  },
  {
    title: '⏱️ Simulazione Esame',
    description: '30 domande in 20 minuti, proprio come l\'esame reale. Il tuo progresso viene salvato automaticamente!',
    icon: '🎯'
  },
  {
    title: '📚 Teoria Interattiva',
    description: 'Studia tutti gli argomenti con capitoli interattivi e immagini esplicative.',
    icon: '📖'
  },
  {
    title: '🤖 Spiegazioni AI',
    description: 'Non capisci una domanda? Chiedi spiegazioni all\'intelligenza artificiale!',
    icon: '✨'
  },
  {
    title: '🔖 Bookmark & Review',
    description: 'Salva le domande difficili e ripassale quando vuoi. Il sistema identifica automaticamente le tue debolezze!',
    icon: '💡'
  },
  {
    title: '🏆 Gamification',
    description: 'Sblocca achievement, sali di livello e competi nella classifica globale!',
    icon: '🎮'
  },
  {
    title: '🚀 Sei Pronto!',
    description: 'Ora conosci tutte le funzionalità. Inizia subito il tuo percorso verso la patente!',
    icon: '🎉'
  }
];

const STORAGE_KEY = 'patente_onboarding_completed';

export const OnboardingTour: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Controlla se l'onboarding è già stato completato
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Mostra dopo un breve delay
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (confirm('Sei sicuro di voler saltare il tutorial?')) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <GlassCard className="max-w-2xl w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-white/60 text-sm">
              Passo {currentStep + 1} di {ONBOARDING_STEPS.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Salta tutorial
            </button>
          </div>
        </div>

        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-6xl mb-4">
            {step.icon}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {step.title}
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="text-white border-white/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Indietro
          </Button>

          <div className="flex gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-blue-500'
                    : index < currentStep
                    ? 'bg-blue-500/50'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center gap-2"
          >
            {isLastStep ? (
              <>
                <Check className="w-5 h-5" />
                Inizia
              </>
            ) : (
              <>
                Avanti
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>

        {/* Tips */}
        {currentStep === 0 && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-sm text-white/70 text-center">
              💡 <strong>Suggerimento:</strong> Puoi sempre rivedere questo tutorial dalle impostazioni
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

// Hook per mostrare l'onboarding manualmente
export const useOnboarding = () => {
  const showOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const hasCompletedOnboarding = () => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  };

  return { showOnboarding, hasCompletedOnboarding };
};
