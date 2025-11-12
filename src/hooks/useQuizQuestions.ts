import { useState, useEffect } from 'react';
import { loadAllQuestionsAsync } from '@/lib/quizLoader';
import type { QuizQuestion, QuizDatasetVersionId } from '@/types/quiz';

/**
 * Hook per caricare domande quiz nella lingua corrente
 * Usa file JSON precaricati (NO API)
 */
export function useQuizQuestions(
  language: string,
  version?: QuizDatasetVersionId
) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchQuestions() {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔄 Loading questions for language: ${language.toUpperCase()}`);
        const startTime = performance.now();
        
        // Carica da file precaricato (NO API)
        const loadedQuestions = await loadAllQuestionsAsync(language, version);
        
        const loadTime = Math.round(performance.now() - startTime);
        
        if (isMounted) {
          setQuestions(loadedQuestions);
          console.log(`✅ Questions loaded in ${loadTime}ms (${language.toUpperCase()})`);
          console.log(`📊 Total questions: ${loadedQuestions.length}`);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
          setError(errorMessage);
          console.error('❌ Quiz loading error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [language, version]);

  return { questions, loading, error };
}

