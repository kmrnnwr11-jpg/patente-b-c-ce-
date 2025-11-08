import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { LANGUAGES } from '@/lib/constants';

export function useTheoryTranslation() {
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [isEnabled, setIsEnabled] = useState(true);

  const availableLanguages = LANGUAGES.filter(lang =>
    ['en', 'ur', 'hi', 'pa'].includes(lang.code)
  );

  const toggleTranslation = () => {
    setIsEnabled(!isEnabled);
  };

  const changeLanguage = (langCode: string) => {
    setSelectedLang(langCode);
  };

  return {
    selectedLang,
    isEnabled,
    availableLanguages,
    toggleTranslation,
    changeLanguage
  };
}
