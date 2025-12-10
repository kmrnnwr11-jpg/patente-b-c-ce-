import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, X, Copy, Loader2 } from 'lucide-react';
import { getOrCreateWordAssets } from '@/lib/wordAssets';

interface InteractiveQuizTextProps {
  content: string;
  targetLang: string;
}

interface WordPopup {
  word: string;
  translation: string;
  audioUrl?: string;
  position: { x: number; y: number };
  loading: boolean;
  error?: string;
}

export const InteractiveQuizText: FC<InteractiveQuizTextProps> = ({ 
  content, 
  targetLang 
}) => {
  const [popup, setPopup] = useState<WordPopup | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);

  // Tokenizza il testo in parole e punteggiatura
  const tokenize = (text: string): Array<{ text: string; isWord: boolean }> => {
    const tokens: Array<{ text: string; isWord: boolean }> = [];
    const regex = /(\p{L}+(?:'\p{L}+)?)/gu;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Aggiungi testo prima della parola (spazi, punteggiatura)
      if (match.index > lastIndex) {
        tokens.push({
          text: text.slice(lastIndex, match.index),
          isWord: false
        });
      }
      
      // Aggiungi la parola
      tokens.push({
        text: match[0],
        isWord: true
      });
      
      lastIndex = regex.lastIndex;
    }

    // Aggiungi testo rimanente
    if (lastIndex < text.length) {
      tokens.push({
        text: text.slice(lastIndex),
        isWord: false
      });
    }

    return tokens;
  };

  const handleWordClick = async (word: string, event: React.MouseEvent<HTMLSpanElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    // Mostra popup con loading
    setPopup({
      word,
      translation: '',
      position,
      loading: true
    });

    try {
      console.log(`🔍 Richiesta traduzione quiz: "${word}" → ${targetLang}`);
      const result = await getOrCreateWordAssets(word, 'it', targetLang);
      console.log('✅ Traduzione quiz completata:', result);
      
      setPopup({
        word,
        translation: result.translation,
        audioUrl: result.audioUrl || undefined,
        position,
        loading: false
      });
    } catch (error) {
      console.error('❌ Errore traduzione quiz:', error);
      setPopup({
        word,
        translation: word,
        position,
        loading: false,
        error: 'Traduzione non disponibile'
      });
    }
  };

  const playAudio = async () => {
    if (!popup?.audioUrl || playingAudio) return;

    try {
      setPlayingAudio(true);
      const audio = new Audio(popup.audioUrl);
      audio.onended = () => setPlayingAudio(false);
      audio.onerror = () => setPlayingAudio(false);
      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      setPlayingAudio(false);
    }
  };

  const copyToClipboard = () => {
    if (!popup) return;
    navigator.clipboard.writeText(`${popup.word} = ${popup.translation}`);
  };

  const tokens = tokenize(content);

  return (
    <>
      <div className="relative leading-relaxed">
        {tokens.map((token, index) => {
          if (!token.isWord) {
            return <span key={index}>{token.text}</span>;
          }

          return (
            <span
              key={index}
              onClick={(e) => handleWordClick(token.text, e)}
              className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded px-0.5 transition-colors"
              style={{ display: 'inline' }}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Popup Traduzione - REACT PORTAL with ULTIMATE Z-INDEX */}
      {popup && createPortal(
        <>
          {/* Overlay per chiudere - MAXIMUM PRIORITY */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPopup(null)}
            style={{
              zIndex: 9999998,
              animation: 'fadeIn 0.2s ease-out'
            }}
          />

          {/* Popup Card - ABSOLUTE MAXIMUM Z-INDEX */}
          <div
            className="fixed bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 p-6 rounded-3xl shadow-2xl w-[90vw] max-w-md border-2 border-blue-400"
            style={{
              left: '50%',
              top: '8%',
              transform: 'translate(-50%, 0)',
              maxHeight: '70vh',
              overflowY: 'auto',
              zIndex: 9999999,
              animation: 'slideInFromTop 0.3s ease-out',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.3)',
              position: 'fixed'
            }}
          >
            {/* Header - ELEGANT DESIGN */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {popup.word.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {popup.word}
                </h3>
              </div>
              <button
                onClick={() => setPopup(null)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all transform hover:scale-110 hover:rotate-90"
              >
                <X size={22} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Traduzione - ELEGANT DISPLAY */}
            {popup.loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative">
                  <Loader2 size={40} className="animate-spin text-blue-600" />
                  <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
                </div>
                <span className="mt-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Traduzione in corso...
                </span>
              </div>
            ) : (
              <>
                <div className="mb-5 p-6 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-pink-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-inner">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Traduzione</span>
                  </div>
                  <p className="text-4xl font-black bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent text-center leading-relaxed">
                    {popup.translation}
                  </p>
                  {popup.error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-3 text-center font-semibold bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-lg">
                      {popup.error}
                    </p>
                  )}
                </div>

                {/* Actions - ELEGANT BUTTONS */}
                <div className="flex gap-3">
                  {popup.audioUrl && (
                    <button
                      onClick={playAudio}
                      disabled={playingAudio}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg font-semibold text-sm"
                    >
                      <Volume2 size={18} className={playingAudio ? 'animate-pulse' : ''} />
                      {playingAudio ? 'In riproduzione...' : 'Ascolta'}
                    </button>
                  )}
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-gray-100 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm"
                  >
                    <Copy size={18} />
                    Copia
                  </button>
                </div>
              </>
            )}
          </div>
        </>,
        document.body
      )}

      {/* Elegant Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
};

