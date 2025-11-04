import { FC, useState } from 'react';
import { X, Volume2, VolumeX, Globe } from 'lucide-react';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  translatedText: string;
  language: 'en' | 'it';
}

export const TranslationModal: FC<TranslationModalProps> = ({
  isOpen,
  onClose,
  originalText,
  translatedText,
  language
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const languageMap: Record<string, string> = {
    'it': 'it-IT',
    'en': 'en-US'
  };

  const languageNames: Record<string, string> = {
    'it': 'Italiano',
    'en': 'English'
  };

  const flagEmoji: Record<string, string> = {
    'it': '🇮🇹',
    'en': '🇬🇧'
  };

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = languageMap[language];
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Cerca voce premium
    const voices = window.speechSynthesis.getVoices();
    const premiumVoices: Record<string, string[]> = {
      'en': ['Google US English', 'Google UK English Female', 'Samantha', 'Microsoft David'],
      'it': ['Google italiano', 'Microsoft Cosimo', 'Alice']
    };

    let selectedVoice = null;
    if (premiumVoices[language]) {
      for (const premiumName of premiumVoices[language]) {
        selectedVoice = voices.find(v => 
          v.name.includes(premiumName) && v.lang.startsWith(language)
        );
        if (selectedVoice) {
          console.log('🎙️ Modal using voice:', selectedVoice.name);
          break;
        }
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Overlay scuro */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-in-out'
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.5rem',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
            animation: 'slideUp 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe className="w-6 h-6" style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                {flagEmoji[language]} {languageNames[language]}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '2rem' }}>
            {/* Testo Originale */}
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                🇮🇹 Italiano (Original)
              </div>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0
                }}
              >
                {originalText}
              </p>
            </div>

            {/* Testo Tradotto */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                borderRadius: '0.75rem',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {flagEmoji[language]} {languageNames[language]} Translation
              </div>
              <p
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  color: '#ffffff',
                  fontWeight: '500',
                  margin: 0
                }}
              >
                {translatedText}
              </p>
            </div>

            {/* Bottone Audio */}
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                onClick={handleSpeak}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: isPlaying 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s',
                  transform: isPlaying ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (!isPlaying) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPlaying) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                  }
                }}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-6 h-6" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-6 h-6" />
                    <span>Listen in {languageNames[language]}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};


