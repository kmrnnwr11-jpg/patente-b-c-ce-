import { FC } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '@/lib/constants';

interface QuizLanguageSelectorProps {
  selectedLang: string;
  onLanguageChange: (lang: string) => void;
  isEnabled: boolean;
  onToggle: () => void;
}

export const QuizLanguageSelector: FC<QuizLanguageSelectorProps> = ({
  selectedLang,
  onLanguageChange,
  isEnabled,
  onToggle
}) => {
  const currentLang = LANGUAGES.find(l => l.code === selectedLang);

  return (
    <div className="glass-card p-4 rounded-xl mb-4">
      <div className="flex items-center justify-between">
        {/* Toggle */}
        <div className="flex items-center gap-3">
          <Languages size={20} className="text-blue-500" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Traduzione Parola-per-Parola
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Clicca su una parola per tradurla
            </p>
          </div>
        </div>

        {/* Switch Toggle */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Language Selector (mostra solo se abilitato) */}
      {isEnabled && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lingua di traduzione:
          </label>
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LANGUAGES.filter(l => l.code !== 'it').map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={16} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
          
          {currentLang && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Selezionata: {currentLang.flag} <strong>{currentLang.name}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

