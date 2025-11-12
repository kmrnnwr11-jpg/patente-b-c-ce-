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

      {/* Popup di selezione lingua */}
      {languageSelector?.visible && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3"
          style={{
            left: `${languageSelector.x}px`,
            top: `${languageSelector.y}px`,
            animation: 'fadeIn 0.2s ease-in',
            minWidth: '200px',
          }}
        >
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🌐 Scegli lingua:
          </div>
          <div className="space-y-1">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="w-full text-left px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
              >
                <span className="mr-2">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setLanguageSelector(null)}
            className="w-full mt-2 px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Chiudi
          </button>
        </div>
      )}

      {/* Popup di traduzione */}
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
