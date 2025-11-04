import { FC, useState } from 'react';
import { Sparkles, Lightbulb, BookOpen, X, Loader2, Lock } from 'lucide-react';
import { getAIExplanation, canUseAI, loadQuota } from '@/lib/aiService';
import type { QuizQuestion } from '@/types/quiz';
import type { AIExplanation } from '@/types/ai';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { PaywallModal } from '@/components/premium/PaywallModal';

interface AIExplanationPanelProps {
  question: QuizQuestion;
  isVisible: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const AIExplanationPanel: FC<AIExplanationPanelProps> = ({
  question,
  isVisible,
  onClose
}) => {
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const quota = loadQuota();
  const { allowed, remaining } = canUseAI();

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId);
    // TODO: Implementare pagamento
    setShowPaywall(false);
    alert(`Piano ${planId} selezionato! (Pagamento da implementare)`);
  };

  const handleGetExplanation = async () => {
    if (!allowed) {
      setError('Hai esaurito le spiegazioni AI disponibili questo mese');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasRequested(true);

    try {
      const result = await getAIExplanation(question);
      setExplanation(result);
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('Hai raggiunto il limite di spiegazioni AI per questo mese');
      } else {
        setError('Errore nel generare la spiegazione. Riprova.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-6 py-4 border-b border-white/10 backdrop-blur-md z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Spiegazione AI</h3>
                <p className="text-sm text-white/70">
                  {quota.tier === 'free' ? (
                    <>Rimanenti: {remaining}/{quota.explanationsLimit} questo mese</>
                  ) : quota.tier === 'premium' ? (
                    <>Premium: {remaining}/{quota.explanationsLimit}</>
                  ) : (
                    <>Unlimited ∞</>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Question */}
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white font-medium leading-relaxed">
              {question.domanda}
            </p>
            {question.immagine && (
              <div className="mt-3 rounded-lg overflow-hidden">
                <img
                  src={question.immagine}
                  alt="Segnale"
                  className="w-full max-h-40 object-contain bg-white/5"
                />
              </div>
            )}
          </div>

          {/* Initial State - Request Explanation */}
          {!hasRequested && !explanation && (
            <div className="text-center py-8">
              <div className="inline-flex p-4 bg-purple-500/20 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Ottieni una spiegazione dettagliata
              </h4>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                L'AI analizzerà la domanda e ti fornirà una spiegazione completa con consigli utili
              </p>
              
              {allowed ? (
                <Button
                  onClick={handleGetExplanation}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Genera Spiegazione
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-300 font-medium">
                      Hai esaurito le spiegazioni AI gratuite
                    </p>
                    <p className="text-red-200/70 text-sm mt-1">
                      Passa a Premium per spiegazioni illimitate
                    </p>
                  </div>
                  <Button
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  >
                    Passa a Premium
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white/70">Generazione spiegazione in corso...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-center">
              <p className="text-red-300 font-medium">{error}</p>
              {!allowed && (
                <Button
                  onClick={handleUpgrade}
                  className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                >
                  Passa a Premium
                </Button>
              )}
            </div>
          )}

          {/* Explanation Content */}
          {explanation && !isLoading && (
            <div className="space-y-6 animate-fade-in">
              {/* Main Explanation */}
              <div className="p-5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
                <div className="flex items-start gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                  <h4 className="font-semibold text-white">Spiegazione</h4>
                </div>
                <p className="text-white/90 leading-relaxed">
                  {explanation.explanation}
                </p>
              </div>

              {/* Tips */}
              {explanation.tips.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <h4 className="font-semibold text-white">Consigli Utili</h4>
                  </div>
                  <ul className="space-y-2">
                    {explanation.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-white/90">
                        <span className="text-yellow-400 flex-shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cached Badge */}
              {explanation.cached && (
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    <Sparkles className="w-4 h-4" />
                    Spiegazione salvata (non consuma crediti)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Paywall Modal */}
      <PaywallModal
        isVisible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSelectPlan={handleSelectPlan}
        reason="Hai esaurito le spiegazioni AI gratuite. Passa a Premium per continuare!"
      />
    </div>
  );
};

