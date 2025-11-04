import { useState } from 'react';
import { WordTranslationModal } from './WordTranslationModal';

interface ClickableTextProps {
  text: string;
  className?: string;
  selectedLanguages?: string[];
  enabled?: boolean;
}

export const ClickableText = ({
  text,
  className = '',
  selectedLanguages = ['en', 'ar', 'ur', 'hi'],
  enabled = true
}: ClickableTextProps) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Dividi il testo in parole, mantenendo punteggiatura
  const words = text.match(/[\w'àèéìòù]+|[.,;!?()]/g) || [];

  const handleWordClick = (word: string) => {
    if (!enabled) return;
    
    // Ignora punteggiatura
    if (/^[.,;!?()]$/.test(word)) return;
    
    // Rimuovi apostrofi iniziali (es: "l'auto" -> mostra "auto")
    const cleanWord = word.replace(/^[''']/, '').replace(/[''']$/, '');
    
    if (cleanWord.length > 1) {
      setSelectedWord(cleanWord);
    }
  };

  if (!enabled) {
    return <div className={className}>{text}</div>;
  }

  return (
    <>
      <div className={`select-none ${className}`}>
        {words.map((word, index) => {
          const isPunctuation = /^[.,;!?()]$/.test(word);
          const isShort = word.length === 1 && !isPunctuation;
          
          return (
            <span
              key={`${word}-${index}`}
              onClick={() => handleWordClick(word)}
              className={
                isPunctuation || isShort
                  ? 'inline'
                  : `inline-block mx-0.5 px-1.5 py-0.5 rounded-md
                     cursor-pointer transition-all duration-200
                     hover:bg-blue-100 hover:shadow-sm hover:scale-105
                     active:scale-95 active:bg-blue-200
                     underline decoration-dotted decoration-blue-300 decoration-1
                     underline-offset-2`
              }
              style={isPunctuation ? { marginLeft: '-0.125rem' } : {}}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Modal */}
      {selectedWord && (
        <WordTranslationModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          selectedLanguages={selectedLanguages}
        />
      )}
    </>
  );
};

