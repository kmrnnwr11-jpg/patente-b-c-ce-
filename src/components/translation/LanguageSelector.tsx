import { useState } from 'react';
import { Settings, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AVAILABLE_LANGUAGES = [
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

interface LanguageSelectorProps {
  selected: string[];
  onChange: (languages: string[]) => void;
  maxSelection?: number;
}

export const LanguageSelector = ({
  selected,
  onChange,
  maxSelection = 4
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = (code: string) => {
    if (selected.includes(code)) {
      onChange(selected.filter((l) => l !== code));
    } else if (selected.length < maxSelection) {
      onChange([...selected, code]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          <span>Lingue Traduzioni</span>
          <span className="text-sm text-gray-500">
            ({selected.length}/{maxSelection})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const isSelected = selected.includes(lang.code);
                  const isDisabled = !isSelected && selected.length >= maxSelection;
                  
                  return (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      disabled={isDisabled}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="flex-1 text-left text-sm font-medium">
                        {lang.name}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Seleziona fino a {maxSelection} lingue per la traduzione rapida
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

