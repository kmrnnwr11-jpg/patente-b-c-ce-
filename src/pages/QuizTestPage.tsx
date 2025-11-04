import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateExamQuiz, getQuizStats } from '@/lib/quizLoader';
import type { QuizQuestion } from '@/types/quiz';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { SEO, SEO_PRESETS } from '@/components/SEO';

export const QuizTestPage: FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carica statistiche e genera quiz
    const quizStats = getQuizStats();
    if (quizStats) {
      const quiz = generateExamQuiz();
      setQuestions(quiz);
      setIsLoading(false);
    }
  }, []);

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <SEO {...SEO_PRESETS.quiz} />
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white shadow-xl">
          <div className="text-xl">Caricamento quiz...</div>
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
    />
    </>
  );
};
