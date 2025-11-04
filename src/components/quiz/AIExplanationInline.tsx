import { FC, useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { getAIExplanation, canUseAI, loadQuota } from '@/lib/aiService';
import type { QuizQuestion } from '@/types/quiz';
import type { AIExplanation } from '@/types/ai';

interface AIExplanationInlineProps {
  question: QuizQuestion;
}

export const AIExplanationInline: FC<AIExplanationInlineProps> = ({ question }) => {
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const quota = loadQuota();
  const { allowed, remaining } = canUseAI();

  const handleGetExplanation = async () => {
    if (!allowed) {
      setError('Hai esaurito le spiegazioni AI disponibili questo mese');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasRequested(true);
    setIsExpanded(true);

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

  return (
    <div className="mb-6">
      {/* Bottone per attivare/espandere */}
      {!isExpanded && (
        <div className="flex justify-center">
          <button
            onClick={handleGetExplanation}
            disabled={!allowed || hasRequested}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200
              ${!allowed || hasRequested
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 text-white border border-purple-500/50 hover:scale-105'
              }
            `}
            style={{
              backdropFilter: 'blur(8px)',
              fontWeight: '600'
            }}
          >
            {!hasRequested ? (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Spiegazione AI</span>
                {remaining > 0 && (
                  <span className="text-xs opacity-70">({remaining} rimanenti)</span>
                )}
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                <span>Mostra Spiegazione</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Contenuto spiegazione */}
      {isExpanded && (
        <div 
          className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-4 border border-purple-500/30 animate-fade-in"
          style={{
            color: '#ffffff'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <span className="font-semibold text-white">Spiegazione AI</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ChevronUp className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-6">
              <Loader2 className="w-8 h-8 text-purple-300 animate-spin mx-auto mb-3" />
              <p className="text-white/70 text-sm">Generazione spiegazione in corso...</p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Explanation Content */}
          {explanation && !isLoading && !error && (
            <div className="space-y-4">
              {/* Spiegazione */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white/90 text-sm leading-relaxed">
                  {explanation.explanation}
                </p>
              </div>

              {/* Tips */}
              {explanation.tips && explanation.tips.length > 0 && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-xs font-semibold text-yellow-300 mb-2 block">Consigli:</span>
                  <ul className="space-y-1">
                    {explanation.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-white/80 text-xs">
                        <span className="text-yellow-400 flex-shrink-0 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cached Badge */}
              {explanation.cached && (
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                    <Sparkles className="w-3 h-3" />
                    Spiegazione salvata
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quota info */}
          {quota.tier === 'free' && remaining > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-white/60 text-center">
                Spiegazioni gratuite: {remaining}/{quota.explanationsLimit} questo mese
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

