import { FC, useState } from 'react';
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
        audioUrl: result.audioUrl,
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

      {/* Popup Traduzione */}
      {popup && (
        <>
          {/* Overlay per chiudere */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setPopup(null)}
          />

          {/* Popup Card - Mobile Optimized */}
          <div
            className="fixed z-50 glass-card p-4 sm:p-5 rounded-2xl shadow-2xl w-[90vw] max-w-sm sm:max-w-md"
            style={{
              left: '50%',
              top: popup.position.y > window.innerHeight / 2 
                ? `${popup.position.y - 10}px`
                : `${popup.position.y + 30}px`,
              transform: popup.position.y > window.innerHeight / 2
                ? 'translate(-50%, -100%)'
                : 'translate(-50%, 0)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {popup.word}
              </h3>
              <button
                onClick={() => setPopup(null)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Traduzione */}
            {popup.loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  Traduzione...
                </span>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 text-center">
                    {popup.translation}
                  </p>
                  {popup.error && (
                    <p className="text-xs text-red-500 mt-1 text-center">
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
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Volume2 size={16} />
                      {playingAudio ? 'Playing...' : 'Ascolta'}
                    </button>
                  )}
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Copy size={16} />
                    Copia
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

