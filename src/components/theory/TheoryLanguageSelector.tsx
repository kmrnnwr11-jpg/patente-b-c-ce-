import { FC } from 'react';
import { LANGUAGES } from '@/lib/constants';

interface TheoryLanguageSelectorProps {
  selectedLang: string;
  onLanguageChange: (langCode: string) => void;
  isEnabled: boolean;
  onToggle: () => void;
}

export const TheoryLanguageSelector: FC<TheoryLanguageSelectorProps> = ({
  selectedLang,
  onLanguageChange,
  isEnabled,
  onToggle
}) => {
  const translationLanguages = LANGUAGES.filter(lang =>
    ['en', 'ur', 'hi', 'pa'].includes(lang.code)
  );

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Traduzione Parola-per-Parola
        </h3>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isEnabled && (
        <div>
          <p className="text-white/70 text-sm mb-3">
            Seleziona la lingua per la traduzione. Clicca su qualsiasi parola nel testo per vedere la traduzione.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {translationLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedLang === lang.code
                    ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                    : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 text-xs text-white/50 text-center">
            💡 Suggerimento: Le traduzioni vengono memorizzate per velocità
          </div>
        </div>
      )}
    </div>
  );
};
