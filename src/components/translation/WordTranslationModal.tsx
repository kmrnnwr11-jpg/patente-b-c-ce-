import { useState, useEffect } from 'react';
import { X, Volume2, Bookmark, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateWord, getWordDefinition } from '@/lib/translationCache';

interface WordTranslationModalProps {
  word: string;
  onClose: () => void;
  selectedLanguages: string[];
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🏴' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
];

export const WordTranslationModal = ({
  word,
  onClose,
  selectedLanguages
}: WordTranslationModalProps) => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadTranslations();
  }, [word]);

  const loadTranslations = async () => {
    setLoading(true);
    const results: Record<string, string> = {};

    for (const lang of selectedLanguages) {
      try {
        const translation = await translateWord(word, 'it', lang);
        results[lang] = translation;
      } catch (error) {
        console.error(`Translation error for ${lang}:`, error);
        results[lang] = '...';
      }
    }

    setTranslations(results);
    setLoading(false);
  };

  const playAudio = (text: string, lang: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Mappa codici lingua per Speech API
      const langMap: Record<string, string> = {
        en: 'en-GB',
        ar: 'ar-SA',
        ur: 'ur-PK',
        hi: 'hi-IN',
        pa: 'pa-IN',
        fr: 'fr-FR',
        de: 'de-DE',
        es: 'es-ES',
        zh: 'zh-CN',
        ro: 'ro-RO',
        it: 'it-IT'
      };

      utterance.lang = langMap[lang] || 'en-US';
      utterance.rate = 0.9; // Leggermente più lento per chiarezza
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const copyToClipboard = () => {
    const text = Object.entries(translations)
      .map(([lang, trans]) => `${lang.toUpperCase()}: ${trans}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    // Salva parola nei bookmark
    const bookmarks = JSON.parse(localStorage.getItem('word_bookmarks') || '[]');
    if (!bookmarks.includes(word.toLowerCase())) {
      bookmarks.push(word.toLowerCase());
      localStorage.setItem('word_bookmarks', JSON.stringify(bookmarks));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="text-sm opacity-80 mb-2">Parola selezionata</div>
              <div className="text-3xl font-bold mb-3">{word.toUpperCase()}</div>
              
              {/* Quick Actions */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => playAudio(word, 'it')}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="Ascolta pronuncia"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="Copia traduzioni"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleBookmark}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="Salva nei preferiti"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Translations Grid */}
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {selectedLanguages.map((langCode) => {
                  const lang = AVAILABLE_LANGUAGES.find((l) => l.code === langCode);
                  if (!lang) return null;

                  return (
                    <motion.div
                      key={langCode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="group"
                    >
                      <button
                        onClick={() => playAudio(translations[langCode] || '', langCode)}
                        className="w-full bg-gradient-to-br from-gray-50 to-gray-100 
                                   rounded-xl p-4 cursor-pointer
                                   hover:shadow-lg hover:scale-105 active:scale-95
                                   transition-all duration-200
                                   border border-gray-200"
                      >
                        <div className="text-3xl mb-2 text-center">{lang.flag}</div>
                        <div className="text-xs text-gray-500 text-center mb-1">
                          {lang.name}
                        </div>
                        <div className="text-lg font-bold text-center text-gray-800 break-words">
                          {translations[langCode] || '...'}
                        </div>
                        
                        {/* Audio icon on hover */}
                        <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Volume2 className="w-4 h-4 mx-auto text-blue-500" />
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Definizione italiana */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
            >
              <div className="text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1">
                <span>🇮🇹</span>
                <span>Definizione</span>
              </div>
              <div className="text-sm text-gray-700">
                {getWordDefinition(word)}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              Tocca una lingua per ascoltare la pronuncia
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

