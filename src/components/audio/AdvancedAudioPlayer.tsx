import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvancedAudioPlayerProps {
  text: string;
  language?: string;
  className?: string;
}

const LANGUAGE_VOICES: Record<string, string> = {
  it: 'it-IT',
  en: 'en-GB',
  ur: 'ur-PK',
  hi: 'hi-IN',
  pa: 'pa-IN'
};

const LANGUAGE_FLAGS: Record<string, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  ur: '🇵🇰',
  hi: '🇮🇳',
  pa: '☬'
};

export const AdvancedAudioPlayer = ({
  text,
  language = 'it',
  className = ''
}: AdvancedAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [currentLang, setCurrentLang] = useState(language);
  const [loading, setLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setLoading(true);

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANGUAGE_VOICES[currentLang] || 'it-IT';
      utterance.rate = speed;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        setLoading(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setLoading(false);
      };

      utterance.onerror = (error) => {
        console.error('Speech error:', error);
        setIsPlaying(false);
        setLoading(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Audio playback error:', error);
      setLoading(false);
    }
  };

  const handlePause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleDownload = async () => {
    // Per il download audio, servirebbe ElevenLabs API
    // Qui mostriamo un placeholder
    alert('Feature Premium: Scarica audio con voce naturale!\nDisponibile con abbonamento Premium.');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : 1;
    }
  };

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={loading}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 
                     text-white flex items-center justify-center transition-all
                     hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          {/* Speed Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Velocità:</span>
            <div className="flex gap-1">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 text-xs rounded transition-all ${
                    speed === s
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium">Lingua:</span>
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {Object.entries(LANGUAGE_FLAGS).map(([code, flag]) => (
                <option key={code} value={code}>
                  {flag} {code.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
            aria-label={isMuted ? 'Attiva audio' : 'Disattiva audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
            title="Download audio (Premium)"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {isPlaying && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="mt-3 h-1 bg-blue-500 rounded-full origin-left"
        />
      )}
    </motion.div>
  );
};

