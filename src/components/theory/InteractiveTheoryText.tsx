import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import { getOrCreateWordAssets } from '@/lib/wordAssets';

interface InteractiveTheoryTextProps {
  content: string;
  targetLang: string;
}

interface WordPopup {
  word: string;
  translation: string;
  phonetic?: string;
  audioUrl: string | null;
  position: { x: number; y: number };
  loading: boolean;
}

export const InteractiveTheoryText: FC<InteractiveTheoryTextProps> = ({
  content,
  targetLang
}) => {
  const [popup, setPopup] = useState<WordPopup | null>(null);

  const handleWordClick = async (word: string, event: React.MouseEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    // Chiudi popup se clicchi sulla stessa parola
    if (popup?.word === word) {
      setPopup(null);
      return;
    }

    setPopup({
      word,
      translation: '',
      audioUrl: null,
      position: { x: rect.left, y: rect.bottom + 5 },
      loading: true
    });

    try {
      console.log(`🔍 Richiesta traduzione per: "${word}" → ${targetLang}`);
      const result = await getOrCreateWordAssets(word, 'it', targetLang);
      console.log('✅ Traduzione completata:', result);

      setPopup({
        word,
        translation: result.translation,
        audioUrl: result.audioUrl,
        position: { x: rect.left, y: rect.bottom + 5 },
        loading: false
      });
    } catch (error) {
      console.error('❌ Errore traduzione:', error);
      setPopup({
        word,
        translation: `Errore: ${error instanceof Error ? error.message : 'Servizio non disponibile'}`,
        audioUrl: null,
        position: { x: rect.left, y: rect.bottom + 5 },
        loading: false
      });
    }
  };

  const closePopup = () => {
    setPopup(null);
  };

  // Suddividi il testo in parole e spazi preservando la formattazione
  const parts = content.split(/(\s+)/);

  return (
    <>
      <div className="leading-relaxed text-white/90">
        {parts.map((part, index) => {
          // Controlla se è una parola (non solo spazi/punteggiatura)
          const isWord = /\w+/.test(part);

          return isWord ? (
            <span
              key={index}
              onClick={(e) => handleWordClick(part, e)}
              className="hover:bg-blue-500/20 cursor-pointer px-1 rounded transition-colors duration-200 select-none"
              title="Clicca per tradurre"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </div>

      {/* Popup Traduzione - REACT PORTAL with ULTIMATE Z-INDEX */}
      {popup && createPortal(
        <>
          {/* Overlay per chiudere */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePopup}
            style={{ zIndex: 9999998 }}
          />
          <div
            className="fixed glass-card p-4 sm:p-5 rounded-2xl shadow-2xl w-[90vw] max-w-sm sm:max-w-md border border-white/20 bg-gradient-to-br from-gray-800/95 to-gray-900/95"
            style={{
              left: '50%',
              top: '8%',
              transform: 'translate(-50%, 0)',
              maxHeight: '70vh',
              overflowY: 'auto',
              zIndex: 9999999
            }}
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="font-semibold text-white text-lg mb-1">
                {popup.word}
              </div>
              {popup.phonetic && (
                <div className="text-sm text-white/70 italic">
                  {popup.phonetic}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePopup();
              }}
              className="text-white/50 hover:text-white ml-2 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {popup.loading ? (
            <div className="flex items-center justify-center py-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-white/70">Traduzione...</span>
            </div>
          ) : (
            <>
              <div className="text-blue-300 font-medium text-base mb-2">
                {popup.translation}
              </div>
              
              {popup.audioUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const audio = new Audio(popup.audioUrl!);
                    audio.play().catch(err => console.error('Audio play error:', err));
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm text-white/90"
                >
                  <span className="text-lg">🔊</span>
                  <span>Ascolta pronuncia</span>
                </button>
              )}
            </>
          )}

          <div className="text-xs text-white/50 mt-2 text-center">
            Clicca per chiudere
          </div>
        </div>
        </>,
        document.body
      )}
    </>
  );
};
