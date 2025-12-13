import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, X, Copy, Loader2, BookOpen } from 'lucide-react';
import { getOrCreateWordAssets } from '@/lib/wordAssets';

interface InteractiveTheoryTextProps {
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

export const InteractiveTheoryText: FC<InteractiveTheoryTextProps> = ({
  content,
  targetLang
}) => {
  const [popup, setPopup] = useState<WordPopup | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);

  // Tokenizza il testo in parole e punteggiatura - Advanced Logic
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
    // Prevent default selection behavior
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    // Chiudi se clicchi sulla stessa parola già aperta
    if (popup?.word === word) {
      setPopup(null);
      return;
    }

    setPopup({
      word,
      translation: '',
      position,
      loading: true
    });

    try {
      console.log(`🔍 Richiesta traduzione teoria: "${word}" → ${targetLang}`);
      const result = await getOrCreateWordAssets(word, 'it', targetLang);
      console.log('✅ Traduzione completata:', result);

      setPopup({
        word,
        translation: result.translation,
        audioUrl: result.audioUrl || undefined,
        position,
        loading: false
      });
    } catch (error: any) {
      console.error('❌ Errore traduzione:', error);
      setPopup({
        word,
        translation: word,
        position,
        loading: false,
        error: `Errore: ${error.message || 'Traduzione non disponibile'}`
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
      <div className="leading-relaxed text-current">
        {tokens.map((token, index) => {
          if (!token.isWord) {
            return <span key={index}>{token.text}</span>;
          }

          return (
            <span
              key={index}
              onClick={(e) => handleWordClick(token.text, e)}
              className="cursor-pointer hover:bg-blue-200/50 dark:hover:bg-blue-500/30 rounded px-0.5 transition-all duration-200 select-none border-b border-transparent hover:border-blue-400"
              title="Clicca per tradurre"
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Popup Traduzione - REACT PORTAL */}
      {popup && createPortal(
        <>
          {/* Overlay per chiudere */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setPopup(null)}
            style={{
              zIndex: 9999998,
              animation: 'fadeIn 0.2s ease-out'
            }}
          />

          {/* Popup Card */}
          <div
            className="fixed bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[90vw] max-w-sm border border-white/20 ring-1 ring-black/5"
            style={{
              left: '50%',
              top: '15%',
              transform: 'translate(-50%, 0)',
              maxHeight: '70vh',
              overflowY: 'auto',
              zIndex: 9999999,
              animation: 'slideInFromTop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {popup.word.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                    {popup.word}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Italiano</span>
                </div>
              </div>
              <button
                onClick={() => setPopup(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Traduzione Content */}
            {popup.loading ? (
              <div className="flex flex-col items-center justify-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <Loader2 size={32} className="animate-spin text-blue-500 mb-3" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Traduzione in corso...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={14} className="text-blue-500" />
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Traduzione</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {popup.translation}
                  </p>
                  {popup.error && (
                    <p className="text-sm text-red-500 mt-2 font-medium">
                      {popup.error}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {popup.audioUrl && (
                    <button
                      onClick={playAudio}
                      disabled={playingAudio}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-[0.98] font-medium shadow-sm hover:shadow"
                    >
                      <Volume2 size={18} className={playingAudio ? 'animate-pulse' : ''} />
                      {playingAudio ? 'Ascolto...' : 'Ascolta'}
                    </button>
                  )}
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-all active:scale-[0.98] font-medium"
                  >
                    <Copy size={18} />
                    Copia
                  </button>
                </div>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
