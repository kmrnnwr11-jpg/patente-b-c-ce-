import { FC, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
// Lingue disponibili per traduzione
const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

const ClickableText: FC<ClickableTextProps> = ({
  text,
  contextId,
  targetLang = 'en',
  className = 'text-base leading-relaxed',
  onTranslationFound,
}) => {
  const [hoveredWord, setHoveredWord] = useState<string>('');
  
  // Popup di scelta lingua
  const [languageSelector, setLanguageSelector] = useState<{
    word: string;
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  // Popup di traduzione
  const [translationPopup, setTranslationPopup] = useState<{
    word: string;
    translation: string | null;
    language: string;
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

  // Handler per mostrare popup di selezione lingua
  const handleWordClick = useCallback(
    (word: string, event: React.MouseEvent<HTMLSpanElement>) => {
      if (!word.trim()) return;

      // Mostra popup di selezione lingua
      const rect = event.currentTarget.getBoundingClientRect();
      setLanguageSelector({
        word,
        x: rect.left,
        y: rect.top - 10,
        visible: true,
      });

      console.log(`🌐 Mostrando selezione lingua per: "${word}"`);
    },
    []
  );

  // Handler per quando l'utente seleziona una lingua
  const handleLanguageSelect = useCallback(
    (selectedLang: string) => {
      if (!languageSelector) return;

      const { word, x, y } = languageSelector;

      // Lookup traduzione nella lingua selezionata
      const translation = getTranslation(contextId, selectedLang);

      console.log(
        translation
          ? `✅ Traduzione trovata in memoria: "${word}" (${selectedLang}) → "${translation}"`
          : `ℹ️ Traduzione non trovata per "${word}" in ${selectedLang}`
      );

      // Chiudi selector e mostra traduzione
      setLanguageSelector(null);

      setTranslationPopup({
        word,
        translation: translation || null,
        language: selectedLang,
        x,
        y: y + 50, // Un po' più giù per non coprire il selector
        visible: true,
      });

      if (translation) {
        onTranslationFound?.(word, translation);
      }

      // Nascondi popup dopo 3 secondi
      setTimeout(() => setTranslationPopup(null), 3000);
    },
    [languageSelector, getTranslation, contextId, onTranslationFound]
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

      {/* Popup di selezione lingua - REACT PORTAL */}
      {languageSelector?.visible && createPortal(
        <div
          className="fixed rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{
            left: `${languageSelector.x}px`,
            top: `${languageSelector.y}px`,
            animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            minWidth: '280px',
            maxWidth: '320px',
            zIndex: 9999999,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.95) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          {/* Header con gradiente */}
          <div 
            className="px-5 py-4"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span className="text-2xl">🌐</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight">
                  Scegli lingua:
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  Seleziona per tradurre
                </p>
              </div>
            </div>
          </div>

          {/* Language buttons */}
          <div className="p-4 space-y-2">
            {AVAILABLE_LANGUAGES.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  border: '1.5px solid rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s backwards`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.15)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <span className="font-semibold text-gray-800 text-base">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer con bottone chiudi */}
          <div className="px-4 pb-4">
            <button
              onClick={() => setLanguageSelector(null)}
              className="w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
              style={{
                background: 'rgba(107, 114, 128, 0.08)',
                color: '#6b7280',
                border: '1px solid rgba(107, 114, 128, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(107, 114, 128, 0.15)';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(107, 114, 128, 0.08)';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              Chiudi
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Popup di traduzione - REACT PORTAL */}
      {translationPopup?.visible && createPortal(
        <div
          className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 max-w-xs"
          style={{
            left: `${translationPopup.x}px`,
            top: `${translationPopup.y}px`,
            animation: 'fadeIn 0.2s ease-in',
            zIndex: 9999999,
          }}
        >
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {translationPopup.language.toUpperCase()}
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
        </div>,
        document.body
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export { ClickableText };
