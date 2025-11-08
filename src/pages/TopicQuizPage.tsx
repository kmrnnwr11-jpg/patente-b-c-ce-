import { FC, useEffect, useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Home, Bookmark, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateTopicQuiz, getTopicQuestionCount } from '@/lib/quizLoader';
import type { QuizQuestion } from '@/types/quiz';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { AudioButton } from '@/components/quiz/AudioButton';
import { QuizResults, type QuizResultSummary } from '@/components/quiz/QuizResults';

export const TopicQuizPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicName = searchParams.get('argomento') || '';
  
  const [sampleQuiz, setSampleQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const autoNextTimeout = useRef<number | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [resultsSummary, setResultsSummary] = useState<QuizResultSummary | null>(null);

  useEffect(() => {
    if (!topicName) {
      navigate('/quiz/topics');
      return;
    }

    try {
      // Forza l'uso del dataset 2023 completo (ministeriale-2023) per avere TUTTI gli argomenti
      const totalQuestions = getTopicQuestionCount(topicName, 'ministeriale-2023');
      const count = Math.min(20, totalQuestions);
      const quiz = generateTopicQuiz(topicName, count, 'ministeriale-2023');
      setSampleQuiz(quiz);
      setUserAnswers(new Array(quiz.length).fill(null));
      setQuizStartTime(Date.now());
    } catch (error) {
      console.error('Errore generazione quiz:', error);
      navigate('/quiz/topics');
    }
  }, [topicName, navigate]);

  const handleAnswer = (answer: boolean) => {
    if (showCorrectAnswer) return;

    setSelectedAnswer(answer);
    setShowCorrectAnswer(true);
    setUserAnswers(prev => {
      const next = [...prev];
      next[currentQuestion] = answer;
      return next;
    });

    const isAnswerCorrect = sampleQuiz[currentQuestion]?.risposta === answer;
    const isLastQuestion = currentQuestion === sampleQuiz.length - 1;

    if (autoNextTimeout.current) {
      window.clearTimeout(autoNextTimeout.current);
      autoNextTimeout.current = null;
    }

    if (isLastQuestion) {
      autoNextTimeout.current = window.setTimeout(() => {
        finalizeQuiz();
      }, 1500);
      return;
    }

    if (isAnswerCorrect) {
      autoNextTimeout.current = window.setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowCorrectAnswer(false);
        autoNextTimeout.current = null;
      }, 1200);
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestion === sampleQuiz.length - 1;

    if (isLastQuestion) {
      finalizeQuiz();
      return;
    }

    if (currentQuestion < sampleQuiz.length - 1) {
      if (autoNextTimeout.current) {
        window.clearTimeout(autoNextTimeout.current);
        autoNextTimeout.current = null;
      }
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      if (autoNextTimeout.current) {
        window.clearTimeout(autoNextTimeout.current);
        autoNextTimeout.current = null;
      }
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log('Quiz salvato:', { currentQuestion, sampleQuiz });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoTheory = () => {
    navigate('/theory');
  };

  useEffect(() => {
    return () => {
      if (autoNextTimeout.current) {
        window.clearTimeout(autoNextTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (userAnswers.length === 0) return;
    const savedAnswer = userAnswers[currentQuestion];
    if (savedAnswer === true || savedAnswer === false) {
      setSelectedAnswer(savedAnswer);
      setShowCorrectAnswer(true);
    } else {
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
    }
  }, [currentQuestion, userAnswers]);

  const finalizeQuiz = () => {
    if (autoNextTimeout.current) {
      window.clearTimeout(autoNextTimeout.current);
      autoNextTimeout.current = null;
    }

    if (!sampleQuiz.length) return;

    const totalQuestions = sampleQuiz.length;
    let correctCount = 0;

    const reviewItems = sampleQuiz.map((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.risposta;
      if (isCorrect) correctCount += 1;

      return {
        index,
        id: question.id,
        domanda: question.domanda,
        immagine: question.immagine,
        userAnswer,
        correctAnswer: question.risposta,
        isCorrect
      };
    });

    const errors = totalQuestions - correctCount;
    const durationSeconds = Math.max(1, Math.floor((Date.now() - quizStartTime) / 1000));

    const summary: QuizResultSummary = {
      passed: errors <= 3,
      correctCount,
      errors,
      totalQuestions,
      durationSeconds,
      reviewItems
    };

    setResultsSummary(summary);
    setShowResults(true);
  };

  const handleReviewQuestion = (index: number) => {
    if (autoNextTimeout.current) {
      window.clearTimeout(autoNextTimeout.current);
      autoNextTimeout.current = null;
    }
    setShowResults(false);
    setCurrentQuestion(index);
  };

  const handleRetry = () => {
    if (autoNextTimeout.current) {
      window.clearTimeout(autoNextTimeout.current);
      autoNextTimeout.current = null;
    }

    const totalQuestions = getTopicQuestionCount(topicName);
    const count = Math.min(20, totalQuestions);
    const quiz = generateTopicQuiz(topicName, count);
    setSampleQuiz(quiz);
    setUserAnswers(new Array(quiz.length).fill(null));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setIsSaved(false);
    setShowResults(false);
    setResultsSummary(null);
    setQuizStartTime(Date.now());
  };

  if (!topicName || sampleQuiz.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <GlassCard className="text-white">
          <div className="text-xl">Caricamento quiz...</div>
        </GlassCard>
      </div>
    );
  }

  const question = sampleQuiz[currentQuestion];
  const isCorrect = selectedAnswer === question.risposta;

  return (
    <div className="min-h-screen bg-gradient-primary bg-pattern p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto pt-8 pb-20">
        {/* Quiz Card */}
        <div className="animate-fade-in bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center text-white">
              <span className="text-sm font-medium">
                Domanda {currentQuestion + 1} / {sampleQuiz.length}
              </span>
            </div>
            <div className="text-xs text-white/60">
              Argomento: {topicName}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-8">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / sampleQuiz.length) * 100}%` }}
            />
          </div>

          {/* Immagine se presente */}
          {question.immagine && (
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-lg w-full bg-white/5 flex items-center justify-center p-4">
                <img
                  src={question.immagine}
                  alt="Segnale stradale"
                  className="w-full max-h-[220px] object-contain"
                  onError={(e) => {
                    console.error('Errore caricamento immagine:', question.immagine);
                    e.currentTarget.parentElement!.innerHTML = 
                      '<div class="bg-slate-800 p-8 text-white text-center rounded-xl">⚠️ Immagine non disponibile</div>';
                  }}
                />
              </div>
            </div>
          )}

          {/* Domanda */}
          <p className="text-2xl text-white mb-6 leading-relaxed font-medium text-center">
            {question.domanda}
          </p>

          {/* Audio Button */}
          <div className="flex justify-center mb-10">
            <AudioButton text={question.domanda} />
          </div>

          {/* Bottoni risposta */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleAnswer(true)}
              disabled={showCorrectAnswer}
              className={`px-8 py-4 font-bold rounded-xl transition-all ${
                showCorrectAnswer
                  ? selectedAnswer === true
                    ? isCorrect
                      ? 'bg-success text-white'
                      : 'bg-error text-white'
                    : 'bg-white/20 text-white/50'
                  : 'bg-success hover:bg-success/80 text-white hover:scale-105'
              } disabled:cursor-not-allowed`}
            >
              {showCorrectAnswer && selectedAnswer === true && (
                isCorrect ? <CheckCircle className="inline mr-2" size={20} /> : <XCircle className="inline mr-2" size={20} />
              )}
              VERO
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={showCorrectAnswer}
              className={`px-8 py-4 font-bold rounded-xl transition-all ${
                showCorrectAnswer
                  ? selectedAnswer === false
                    ? isCorrect
                      ? 'bg-success text-white'
                      : 'bg-error text-white'
                    : 'bg-white/20 text-white/50'
                  : 'bg-error hover:bg-error/80 text-white hover:scale-105'
              } disabled:cursor-not-allowed`}
            >
              {showCorrectAnswer && selectedAnswer === false && (
                isCorrect ? <CheckCircle className="inline mr-2" size={20} /> : <XCircle className="inline mr-2" size={20} />
              )}
              FALSO
            </button>
          </div>

          {/* Feedback */}
          {showCorrectAnswer && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-success/20 border border-success/30' : 'bg-error/20 border border-error/30'
              }`}
            >
              <p className={`font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
                {isCorrect ? '✅ Corretto!' : '❌ Sbagliato!'}
              </p>
              <p className="text-white text-sm mt-2">
                La risposta corretta è: <strong>{question.risposta ? 'VERO' : 'FALSO'}</strong>
              </p>
            </div>
          )}

          {/* Navigazione */}
          <div className="flex justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="ghost"
              className="text-white"
            >
              <ArrowLeft size={20} className="mr-2" />
              Precedente
            </Button>
            <Button
              onClick={handleNext}
              disabled={showResults}
              variant="ghost"
              className="text-white"
            >
              Successiva
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/20 shadow-2xl">
        <div className="flex items-center justify-around px-4 py-2.5 max-w-4xl mx-auto">
          <button
            onClick={handleGoHome}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
          >
            <Home className="w-5 h-5 text-white" strokeWidth={2} />
            <span className="text-[11px] text-white font-medium">Home</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 ${
              isSaved ? 'text-blue-400' : ''
            }`}
          >
            <Bookmark 
              className="w-5 h-5 text-white" 
              strokeWidth={2}
              fill={isSaved ? 'currentColor' : 'none'}
            />
            <span className="text-[11px] text-white font-medium">
              {isSaved ? 'Salvato' : 'Salva'}
            </span>
          </button>

          <button
            onClick={handleGoTheory}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
          >
            <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
            <span className="text-[11px] text-white font-medium">Teoria</span>
          </button>
        </div>
      </div>

      {showResults && resultsSummary && (
        <QuizResults
          summary={resultsSummary}
          onClose={() => setShowResults(false)}
          onRetry={handleRetry}
          onReviewQuestion={handleReviewQuestion}
        />
      )}
    </div>
  );
};

