import { FC, useState, useCallback, useMemo } from 'react';
import { useStore } from '@/store/useStore';

interface ClickableTextProps {
  text: string;
  contextId: string; // questionId, chapterId, etc.
  targetLang?: string; // Es: 'en'
  className?: string;
  onTranslationFound?: (word: string, translation: string) => void;
}

/**
 * Componente per renderizzare testo con parole cliccabili
 * Click su parola → lookup istantaneo da memoria (Zustand cache)
 * Se non trovato → mostra avviso
 * 
 * Versione semplificata senza dipendenze esterne
 */
const ClickableText: FC<ClickableTextProps> = ({
  text,
  contextId,
  targetLang = 'en',
  className = 'text-base leading-relaxed',
  onTranslationFound,
}) => {
  const [hoveredWord, setHoveredWord] = useState<string>('');
  const [translationPopup, setTranslationPopup] = useState<{
    word: string;
    translation: string | null;
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  const { getTranslation } = useStore();

  // Splitta il testo in parole e punteggiatura
  const wordTokens = useMemo(() => {
    // Split preservando spazi e punteggiatura
    return text.split(/(\s+|[.,!?;:\-—])/);
  }, [text]);

  const handleWordClick = useCallback(
    (word: string, event: React.MouseEvent<HTMLSpanElement>) => {
      if (!word.trim()) return;

      // 1. Lookup istantaneo da memoria Zustand (0ms!)
      const cachedTranslation = getTranslation(contextId, targetLang);
      
      if (cachedTranslation) {
        console.log(`✅ Traduzione trovata in memoria: "${word}" → "${cachedTranslation}"`);
        
        // Mostra popup vicino al mouse
        const rect = event.currentTarget.getBoundingClientRect();
        setTranslationPopup({
          word,
          translation: cachedTranslation,
          x: rect.left,
          y: rect.top - 10,
          visible: true,
        });

        onTranslationFound?.(word, cachedTranslation);
        
        // Nascondi popup dopo 3 secondi
        setTimeout(() => setTranslationPopup(null), 3000);
      } else {
        console.log(`ℹ️ Traduzione non trovata in memoria per "${word}"`);
        
        // Mostra messaggio che non c'è traduzione
        const rect = event.currentTarget.getBoundingClientRect();
        setTranslationPopup({
          word,
          translation: null,
          x: rect.left,
          y: rect.top - 10,
          visible: true,
        });

        setTimeout(() => setTranslationPopup(null), 1500);
      }
    },
    [contextId, targetLang, getTranslation, onTranslationFound]
  );

  return (
    <div className={className}>
      {wordTokens.map((token, index) => {
        // Se è spazio o punteggiatura, renderizza come-è senza click
        if (!token.trim() || /^[.,!?;:\-—\s]+$/.test(token)) {
          return <span key={index}>{token}</span>;
        }

        const isHovered = hoveredWord === token;

        return (
          <span
            key={index}
            className={`cursor-pointer underline decoration-dotted transition-colors select-none ${
              isHovered 
                ? 'text-primary-500 decoration-solid' 
                : 'hover:text-primary-500 hover:decoration-solid'
            }`}
            onClick={(e) => handleWordClick(token, e)}
            onMouseEnter={() => setHoveredWord(token)}
            onMouseLeave={() => setHoveredWord('')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleWordClick(token, e as any);
              }
            }}
          >
            {token}
          </span>
        );
      })}

      {/* Popup di traduzione semplice */}
      {translationPopup?.visible && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 max-w-xs"
          style={{
            left: `${translationPopup.x}px`,
            top: `${translationPopup.y}px`,
            animation: 'fadeIn 0.2s ease-in',
          }}
        >
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {targetLang.toUpperCase()}
          </div>
          {translationPopup.translation ? (
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
              {translationPopup.translation}
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Traduzione non disponibile in memoria
            </p>
          )}
          <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            ✨ In memoria
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export { ClickableText };
