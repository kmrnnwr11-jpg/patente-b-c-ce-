import { FC, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioButtonProps {
  text: string;
  language?: string;
}

export const AudioButton: FC<AudioButtonProps> = ({ 
  text, 
  language = 'it-IT' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    // Se sta già parlando, ferma
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Crea utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9; // Velocità leggermente ridotta per chiarezza
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      console.error('Errore durante la riproduzione audio');
    };

    // Parla
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`
        p-3 backdrop-blur-md rounded-full 
        transition-all duration-300
        hover:scale-110 active:scale-95
        ${isPlaying 
          ? 'bg-blue-500/80 text-white' 
          : 'bg-white/20 text-white hover:bg-white/30'
        }
      `}
      title={isPlaying ? 'Ferma audio' : 'Ascolta domanda'}
    >
      {isPlaying ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
};

