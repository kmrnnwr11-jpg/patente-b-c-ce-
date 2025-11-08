import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { SEO, SEO_PRESETS } from '@/components/SEO';
import { useStore } from '@/store/useStore';
import { generateExamQuiz, getQuizStats } from '@/lib/quizLoader';
import { getQuizDatasetMeta } from '@/lib/quizVersions';
import type { QuizQuestion } from '@/types/quiz';

export const QuizTestPage: FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const quizVersion = useStore(state => state.quizVersion);

  useEffect(() => {
    setIsLoading(true);
    // Carica statistiche e genera quiz
    const quizStats = getQuizStats(quizVersion);
    if (quizStats) {
      const quiz = generateExamQuiz({ version: quizVersion });
      setQuestions(quiz);
      setIsLoading(false);
    }
  }, [quizVersion]);

  const datasetMeta = useMemo(() => getQuizDatasetMeta(quizVersion), [quizVersion]);

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <SEO {...SEO_PRESETS.quiz} />
        <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-10 text-white shadow-2xl">
          <div className="text-2xl font-bold text-center">Caricamento quiz...</div>
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
        questions={questions}
        quizType="exam"
        showTimer={true}
        timerDuration={1200} // 20 minuti
        autoAdvanceOnCorrect={true}
        minCorrectToPass={27} // 27/30 per superare
        onExit={() => navigate('/dashboard')}
        datasetMeta={datasetMeta}
      />
    </>
  );
};
