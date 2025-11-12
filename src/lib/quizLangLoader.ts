import type { QuizQuestion } from '@/types/quiz';

// LocalStorage keys used by useQuizTranslation
const STORAGE_KEY_ENABLED = 'quiz_translation_enabled';
const STORAGE_KEY_LANG = 'quiz_translation_lang';

function isTranslationEnabled(): boolean {
  try {
    return typeof window !== 'undefined' &&
      localStorage.getItem(STORAGE_KEY_ENABLED) === 'true';
  } catch {
    return false;
  }
}

function getSelectedLanguage(): string {
  try {
    return typeof window !== 'undefined'
      ? (localStorage.getItem(STORAGE_KEY_LANG) || 'en')
      : 'en';
  } catch {
    return 'en';
  }
}

// Static import for Italian (always available)
const itQuestionsModule = await import('@/data/quiz.json');
const itQuestions = (itQuestionsModule as any).default as QuizQuestion[];

export async function loadQuestionsConsideringLanguage(language?: string): Promise<QuizQuestion[]> {
  const lang = language || 'it';

  // If language is not Italian, try to fetch translated dataset
  if (lang !== 'it') {
    try {
      const response = await fetch(`/data/questions-${lang}.json`);
      if (response.ok) {
        const translatedData = await response.json() as QuizQuestion[];
        if (Array.isArray(translatedData) && translatedData.length > 0) {
          console.log(`Loaded ${translatedData.length} questions for language: ${lang}`);
          return translatedData;
        }
      }
    } catch (error) {
      console.warn(`Translated questions for ${lang} not available, falling back to Italian:`, error);
    }
  }

  // Fallback: Italian questions
  console.log('Loading Italian questions (fallback)');
  return itQuestions;
}


