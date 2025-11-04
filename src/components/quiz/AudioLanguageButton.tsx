import { FC, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioLanguageButtonProps {
  text: string;
  language: 'it' | 'en';
  label?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void; // Callback per aprire modal invece di parlare
}

/**
 * Bottone audio per lingue specifiche
 * Permette di ascoltare il testo in una lingua specifica
 */
export const AudioLanguageButton: FC<AudioLanguageButtonProps> = ({ 
  text, 
  language,
  label,
  variant = 'primary',
  onClick
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Mappa lingua -> codice Speech API
  const languageMap: Record<string, string> = {
    'it': 'it-IT',
    'en': 'en-US'
  };

  // Flag emoji per lingua
  const flagEmoji: Record<string, string> = {
    'it': '🇮🇹',
    'en': '🇬🇧'
  };

  // Label default
  const defaultLabel: Record<string, string> = {
    'it': 'IT',
    'en': 'EN'
  };

  // Colori per variante
  const colors = {
    primary: {
      bg: 'rgba(59, 130, 246, 0.9)',
      bgHover: 'rgba(59, 130, 246, 1)',
      border: 'rgba(59, 130, 246, 0.5)',
      shadow: 'rgba(59, 130, 246, 0.4)'
    },
    secondary: {
      bg: 'rgba(16, 185, 129, 0.9)',
      bgHover: 'rgba(16, 185, 129, 1)',
      border: 'rgba(16, 185, 129, 0.5)',
      shadow: 'rgba(16, 185, 129, 0.4)'
    }
  };

  const color = colors[variant];

  // Verifica disponibilità voce per la lingua
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const checkVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const langCode = languageMap[language].split('-')[0];
        const available = voices.some(voice => voice.lang.startsWith(langCode));
        setIsAvailable(available);
      };

      checkVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = checkVoices;
      }
    }
  }, [language]);

  const handleClick = () => {
    // Se c'è un onClick personalizzato, usalo (per aprire modal)
    if (onClick) {
      onClick();
      return;
    }
    
    // Altrimenti parla direttamente
    handleSpeak();
  };

  const handleSpeak = () => {
    // Se sta già parlando, ferma
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!text || text.trim() === '') {
      console.warn('AudioLanguageButton: No text to speak');
      return;
    }

    // Log per debug - mostra anche le voci disponibili
    if (process.env.NODE_ENV === 'development') {
      const voices = window.speechSynthesis.getVoices();
      const availableVoices = voices
        .filter(v => v.lang.startsWith(languageMap[language].split('-')[0]))
        .map(v => ({ name: v.name, lang: v.lang, local: v.localService }));
      
      console.log('🔊 Speaking:', {
        language: language,
        speechLang: languageMap[language],
        textPreview: text.substring(0, 50) + '...',
        availableVoices: availableVoices.length > 0 ? availableVoices : 'Loading...'
      });
    }

    // Crea utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language];
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Cerca la MIGLIORE voce per la lingua (premium quality)
    const voices = window.speechSynthesis.getVoices();
    const targetLang = languageMap[language];
    const langPrefix = targetLang.split('-')[0];
    
    // Lista di voci premium in ordine di preferenza (migliore qualità)
    const premiumVoices: Record<string, string[]> = {
      'en': [
        'Google US English',
        'Google UK English Female',
        'Google UK English Male',
        'Microsoft David - English (United States)',
        'Microsoft Zira - English (United States)',
        'Samantha',  // macOS
        'Karen',     // macOS
        'Daniel',    // macOS UK
        'Alex'       // macOS
      ],
      'it': [
        'Google italiano',
        'Microsoft Cosimo - Italian (Italy)',
        'Microsoft Elsa - Italian (Italy)',
        'Alice',     // macOS
        'Luca',      // macOS
        'Paolo'      // macOS
      ]
    };
    
    let selectedVoice = null;
    
    // 1. Prova prima con voci premium specifiche
    if (premiumVoices[langPrefix]) {
      for (const premiumName of premiumVoices[langPrefix]) {
        selectedVoice = voices.find(v => 
          v.name.includes(premiumName) && v.lang.startsWith(langPrefix)
        );
        if (selectedVoice) {
          console.log('🎙️ Using premium voice:', selectedVoice.name);
          break;
        }
      }
    }
    
    // 2. Se non trovata, cerca voci locali (non-network, migliore qualità)
    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        v.lang.startsWith(langPrefix) && v.localService
      );
      if (selectedVoice) {
        console.log('🎙️ Using local voice:', selectedVoice.name);
      }
    }
    
    // 3. Altrimenti cerca qualsiasi voce che matcha la lingua esatta
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang === targetLang);
      if (selectedVoice) {
        console.log('🎙️ Using exact match voice:', selectedVoice.name);
      }
    }
    
    // 4. Ultima opzione: qualsiasi voce con prefisso lingua
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith(langPrefix));
      if (selectedVoice) {
        console.log('🎙️ Using fallback voice:', selectedVoice.name);
      }
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn('⚠️ No suitable voice found for', language);
    }

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

    // Ferma eventuali letture precedenti
    window.speechSynthesis.cancel();
    
    // Parla
    window.speechSynthesis.speak(utterance);
  };

  if (!isAvailable) {
    return null; // Non mostrare se la voce non è disponibile
  }

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        backgroundColor: isPlaying ? color.bgHover : color.bg,
        border: `2px solid ${color.border}`,
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: isPlaying 
          ? `0 6px 16px ${color.shadow}, 0 0 20px ${color.shadow}`
          : `0 4px 12px ${color.shadow}`,
        flexShrink: 0,
        transform: isPlaying ? 'scale(1.05)' : 'scale(1)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (!isPlaying) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = `0 6px 16px ${color.shadow}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isPlaying) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${color.shadow}`;
        }
      }}
      title={`${isPlaying ? 'Stop' : 'Listen in'} ${language.toUpperCase()}`}
    >
      {/* Icona audio */}
      <div style={{ position: 'relative' }}>
        {isPlaying ? (
          <VolumeX className="w-6 h-6" style={{ color: '#ffffff' }} />
        ) : (
          <Volume2 className="w-6 h-6" style={{ color: '#ffffff' }} />
        )}
        
        {/* Badge animato quando sta parlando */}
        {isPlaying && (
          <div 
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        )}
      </div>

      {/* Label lingua */}
      <div 
        style={{ 
          fontSize: '0.7rem', 
          fontWeight: '700',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        <span>{flagEmoji[language]}</span>
        <span>{label || defaultLabel[language]}</span>
      </div>
    </button>
  );
};

