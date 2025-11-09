import { useState, useEffect } from 'react';

interface UseQuizTranslationReturn {
  isEnabled: boolean;
  selectedLang: string;
  toggleTranslation: () => void;
  changeLanguage: (lang: string) => void;
}

const STORAGE_KEY_ENABLED = 'quiz_translation_enabled';
const STORAGE_KEY_LANG = 'quiz_translation_lang';

export function useQuizTranslation(): UseQuizTranslationReturn {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
    return stored === 'true';
  });

  const [selectedLang, setSelectedLang] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_LANG) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ENABLED, isEnabled.toString());
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, selectedLang);
  }, [selectedLang]);

  const toggleTranslation = () => {
    setIsEnabled(prev => !prev);
  };

  const changeLanguage = (lang: string) => {
    setSelectedLang(lang);
  };

  return {
    isEnabled,
    selectedLang,
    toggleTranslation,
    changeLanguage
  };
}

