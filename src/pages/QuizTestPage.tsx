import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { SEO, SEO_PRESETS } from '@/components/SEO';
import { useStore } from '@/store/useStore';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuizQuestions } from '@/hooks/useQuizQuestions';
import type { QuizQuestion } from '@/types/quiz';

export const QuizTestPage: FC = () => {
  const navigate = useNavigate();
  const [examQuestions, setExamQuestions] = useState<QuizQuestion[]>([]);
  const quizVersion = useStore(state => state.quizVersion);
  
  // Carica domande nella lingua corrente
  const { currentLanguage } = useLanguage();
  const { questions, loading: loadingQuestions, error } = useQuizQuestions(currentLanguage, quizVersion);

  useEffect(() => {
    // Quando le domande sono caricate, genera il quiz esame (30 domande random)
    if (!loadingQuestions && questions.length > 0 && examQuestions.length === 0) {
      // Shuffle e prendi 30 domande
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      const exam = shuffled.slice(0, 30);
      setExamQuestions(exam);
      console.log(`🎯 Generated exam with ${exam.length} questions in ${currentLanguage.toUpperCase()}`);
    }
  }, [questions, loadingQuestions, examQuestions.length, currentLanguage]);

  // Gestione errori
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <SEO {...SEO_PRESETS.quiz} />
        <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-10 text-white shadow-2xl max-w-md">
          <div className="text-2xl font-bold text-center mb-4">⚠️ Errore</div>
          <p className="text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Gestione loading
  if (loadingQuestions || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <SEO {...SEO_PRESETS.quiz} />
        <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-10 text-white shadow-2xl">
          <div className="text-2xl font-bold text-center">
            Caricamento quiz in {currentLanguage.toUpperCase()}...
          </div>
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...SEO_PRESETS.quiz} />
      <QuizContainer
        questions={examQuestions}
        quizType="exam"
        showTimer={true}
        timerDuration={1200} // 20 minuti
        autoAdvanceOnCorrect={true}
        minCorrectToPass={27} // 27/30 per superare
        onExit={() => navigate('/dashboard')}
      />
    </>
  );
};
