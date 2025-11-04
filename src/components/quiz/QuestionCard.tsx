import { FC, useState, useEffect, ReactNode } from 'react';
import { Volume2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { BookmarkButton } from './BookmarkButton';
import { AIExplanationPanel } from '@/components/ai/AIExplanationPanel';
import type { QuizQuestion } from '@/types/quiz';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  image?: string | null;
  selectedAnswer: boolean | null;
  showFeedback: boolean;
  isCorrect: boolean;
  correctAnswer: boolean;
  onAnswer: (answer: boolean) => void;
  onSpeak?: () => void;
  fullQuestion?: QuizQuestion; // Per il bookmark
  timerSlot?: ReactNode;
}

export const QuestionCard: FC<QuestionCardProps> = ({
  questionNumber,
  totalQuestions,
  question,
  image,
  selectedAnswer,
  showFeedback,
  isCorrect,
  correctAnswer,
  onAnswer,
  onSpeak,
  fullQuestion,
  timerSlot
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Handler per aprire il pannello AI
  const handleAIClick = () => {
    if (showFeedback) {
      setShowAIPanel(true);
    }
  };

  // Handler per text-to-speech
  const handleSpeak = () => {
    if (onSpeak) {
      onSpeak();
    } else {
      // Fallback: usa Web Speech API
      if ('speechSynthesis' in window && question) {
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.lang = 'it-IT';
        utterance.rate = 0.9;
        window.speechSynthesis.cancel(); // Ferma eventuali letture precedenti
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Forza visibilità del testo domanda e bottoni
  useEffect(() => {
    const forceVisibility = () => {
      // Testo domanda
      const domandaElement = document.getElementById('testo-domanda-simulazione');
      if (domandaElement) {
        domandaElement.removeAttribute('class');
        domandaElement.className = '';
        domandaElement.style.setProperty('color', 'rgb(250, 204, 21)', 'important');
        domandaElement.style.setProperty('visibility', 'visible', 'important');
        domandaElement.style.setProperty('opacity', '1', 'important');
        domandaElement.style.setProperty('display', 'block', 'important');
        domandaElement.style.setProperty('font-size', '1.25rem', 'important');
        domandaElement.style.setProperty('font-weight', '700', 'important');
        domandaElement.style.setProperty('text-align', 'center', 'important');
        domandaElement.style.setProperty('line-height', '1.875rem', 'important');
        domandaElement.style.setProperty('padding', '1.5rem', 'important');
        domandaElement.style.setProperty('margin', '0', 'important');
        domandaElement.style.setProperty('text-shadow', '2px 2px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9), 0 0 20px rgba(250,204,21,0.3)', 'important');
        domandaElement.style.setProperty('-webkit-text-fill-color', 'rgb(250, 204, 21)', 'important');
        domandaElement.style.setProperty('background-color', 'rgba(15, 23, 42, 0.98)', 'important');
        domandaElement.style.setProperty('backdrop-filter', 'blur(8px)', 'important');
        domandaElement.style.setProperty('border', '3px solid rgba(250, 204, 21, 0.5)', 'important');
        domandaElement.style.setProperty('border-radius', '1rem', 'important');
        domandaElement.style.setProperty('z-index', '999', 'important');
        domandaElement.style.setProperty('position', 'relative', 'important');
        domandaElement.style.setProperty('box-shadow', '0 8px 24px rgba(0,0,0,0.8)', 'important');
      }

      // Bottoni VERO/FALSO
      const buttons = document.querySelectorAll('button[class*="bg-white"], button[class*="backdrop"]');
      buttons.forEach(btn => {
        const btnEl = btn as HTMLElement;
        const btnText = btnEl.textContent?.trim() || '';
        if (btnText.includes('VERO')) {
          if (!showFeedback || (selectedAnswer === true && showFeedback)) {
            btnEl.style.setProperty('color', 'rgb(255, 255, 255)', 'important');
            btnEl.style.setProperty('background-color', selectedAnswer === true && showFeedback && isCorrect ? '#22c55e' : selectedAnswer === true && showFeedback && !isCorrect ? '#ef4444' : '#22c55e', 'important');
            btnEl.style.setProperty('border', '3px solid #16a34a', 'important');
          }
        } else if (btnText.includes('FALSO')) {
          if (!showFeedback || (selectedAnswer === false && showFeedback)) {
            btnEl.style.setProperty('color', 'rgb(255, 255, 255)', 'important');
            btnEl.style.setProperty('background-color', selectedAnswer === false && showFeedback && isCorrect ? '#22c55e' : selectedAnswer === false && showFeedback && !isCorrect ? '#ef4444' : '#ef4444', 'important');
            btnEl.style.setProperty('border', '3px solid #dc2626', 'important');
          }
        }
        btnEl.style.setProperty('font-weight', '700', 'important');
        btnEl.style.setProperty('font-size', '1.125rem', 'important');
        btnEl.style.setProperty('text-shadow', '1px 1px 3px rgba(0,0,0,0.5)', 'important');
      });
    };

    forceVisibility();
    const timeoutId1 = setTimeout(forceVisibility, 10);
    const timeoutId2 = setTimeout(forceVisibility, 50);
    const timeoutId3 = setTimeout(forceVisibility, 200);
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [question, showFeedback, selectedAnswer, isCorrect]);

  return (
    <>
      <GlassCard className="w-full max-w-3xl mx-auto overflow-hidden quiz-card">
      {/* Header con numero domanda */}
      <div className="relative px-6 py-5 border-b border-white/10" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(139, 92, 246, 0.18) 100%)'
      }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">{questionNumber}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Domanda {questionNumber}
              </h2>
              <p className="text-white/60 text-sm">di {totalQuestions} totali</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            {timerSlot && (
              <div className="w-full sm:w-auto">
                {timerSlot}
              </div>
            )}
            {/* Bottone Bookmark */}
            {fullQuestion && (
              <BookmarkButton question={fullQuestion} size="md" />
            )}
          </div>
        </div>
        
        {/* Progress bar - Redesigned */}
        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-white/50">Progresso</span>
          <span className="text-xs font-semibold text-white/80">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
      </div>

      {/* Contenuto domanda */}
      <div className="p-6 space-y-6">
        {/* Testo domanda */}
        <div id="domanda-quiz-simulazione" style={{ marginBottom: '1.5rem', minHeight: '80px', width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: 'visible', opacity: '1', zIndex: 999, position: 'relative' }}>
          {question ? (
            <div
              id="testo-domanda-simulazione"
              style={{
                color: 'rgb(250, 204, 21)',
                fontSize: '1.25rem',
                lineHeight: '1.875rem',
                fontWeight: 700,
                textAlign: 'center',
                padding: '1.5rem',
                margin: 0,
                textShadow: '2px 2px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9), 0 0 20px rgba(250,204,21,0.3)',
                display: 'block',
                visibility: 'visible',
                opacity: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.98)',
                backdropFilter: 'blur(8px)',
                borderRadius: '1rem',
                border: '3px solid rgba(250, 204, 21, 0.5)',
                maxWidth: '100%',
                wordWrap: 'break-word',
                position: 'relative',
                zIndex: 999,
                WebkitTextFillColor: 'rgb(250, 204, 21)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(250,204,21,0.2)'
              }}
            >
              {question}
            </div>
          ) : (
            <div className="text-white/60">Caricamento domanda...</div>
          )}
        </div>

        {/* Immagine (se presente) */}
        {image && !imageError && (
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-white/60">
                  <ImageIcon className="w-8 h-8 animate-pulse" />
                  <span className="text-sm">Caricamento immagine...</span>
                </div>
              </div>
            )}
            <img
              src={image}
              alt="Immagine domanda"
              className={`w-full h-auto max-h-[280px] object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Bottoni risposta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {/* Bottone VERO */}
          <button
            onClick={() => onAnswer(true)}
            disabled={showFeedback}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              fontWeight: '700',
              fontSize: '1rem',
              borderRadius: '0.75rem',
              cursor: showFeedback ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              color: '#ffffff',
              backgroundColor: showFeedback
                ? selectedAnswer === true
                  ? isCorrect
                    ? '#22c55e'
                    : '#ef4444'
                  : 'rgba(255, 255, 255, 0.3)'
                : '#22c55e',
              border: showFeedback && selectedAnswer === true
                ? isCorrect
                  ? '3px solid #16a34a'
                  : '3px solid #dc2626'
                : '3px solid #16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: '700' }}>VERO</span>
          </button>

          {/* Bottoni centrali */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Bottone Audio */}
            <button
              onClick={handleSpeak}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                border: '2px solid rgba(59, 130, 246, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                flexShrink: 0
              }}
              title="Ascolta domanda"
            >
              <Volume2 className="w-6 h-6" style={{ color: '#ffffff' }} />
            </button>

            {/* Bottone AI Spiegazione */}
            <button
              onClick={handleAIClick}
              disabled={!showFeedback}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: showFeedback ? 'rgba(139, 92, 246, 0.9)' : 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(139, 92, 246, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: showFeedback ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                boxShadow: showFeedback ? '0 4px 12px rgba(139, 92, 246, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
                flexShrink: 0,
                opacity: showFeedback ? 1 : 0.5
              }}
              title={showFeedback ? "Spiegazione AI" : "Rispondi prima per vedere la spiegazione"}
            >
              <Sparkles className="w-6 h-6" style={{ color: '#ffffff' }} />
            </button>
          </div>

          {/* Bottone FALSO */}
          <button
            onClick={() => onAnswer(false)}
            disabled={showFeedback}
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              fontWeight: '700',
              fontSize: '1rem',
              borderRadius: '0.75rem',
              cursor: showFeedback ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              color: '#ffffff',
              backgroundColor: showFeedback
                ? selectedAnswer === false
                  ? isCorrect
                    ? '#22c55e'
                    : '#ef4444'
                  : 'rgba(255, 255, 255, 0.3)'
                : '#ef4444',
              border: showFeedback && selectedAnswer === false
                ? isCorrect
                  ? '3px solid #16a34a'
                  : '3px solid #dc2626'
                : '3px solid #dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: '700' }}>FALSO</span>
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && selectedAnswer !== null && (
          <div
            className={`
              rounded-xl p-5 border-2 backdrop-blur-sm animate-fade-in
              ${isCorrect
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/50'
                : 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isCorrect ? 'bg-emerald-500' : 'bg-red-500'
              }`}>
                {isCorrect ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                  {isCorrect ? '✓ Risposta Corretta!' : '✗ Risposta Errata'}
                </h3>
                {!isCorrect && (
                  <p className="text-white/90 text-sm">
                    La risposta corretta è: <span className="font-bold">{correctAnswer ? 'VERO' : 'FALSO'}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>

      {/* AI Explanation Panel */}
      {fullQuestion && (
        <AIExplanationPanel
          question={fullQuestion}
          isVisible={showAIPanel}
          onClose={() => setShowAIPanel(false)}
        />
      )}
    </>
  );
};

