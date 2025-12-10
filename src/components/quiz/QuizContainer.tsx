import { FC, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, Bookmark, BookOpen } from 'lucide-react';
import type { QuizQuestion } from '@/types/quiz';
import { Button } from '@/components/ui/Button';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { QuizResults, type QuizResultSummary } from './QuizResults';
import { ResumeQuizModal } from './ResumeQuizModal';
import { useQuizHistory } from '@/hooks/useQuizHistory';
import { useBookmarks } from '@/hooks/useBookmarks';
import { updateStatsAfterQuiz } from '@/lib/achievementSystem';
import { AchievementToast } from '@/components/gamification/AchievementToast';
import type { Achievement } from '@/types/gamification';

interface QuizContainerProps {
  questions: QuizQuestion[];
  quizType: 'exam' | 'topic' | 'theory';
  topicName?: string;
  onExit?: () => void;
  showTimer?: boolean;
  timerDuration?: number; // in secondi
  autoAdvanceOnCorrect?: boolean;
  minCorrectToPass?: number;
}

export const QuizContainer: FC<QuizContainerProps> = ({
  questions,
  quizType,
  topicName,
  onExit,
  showTimer = false,
  timerDuration = 1200, // 20 minuti default
  autoAdvanceOnCorrect = true,
  minCorrectToPass = 27 // 27/30 per superare l'esame
}) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(
    Array(questions.length).fill(null)
  );
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultsSummary, setResultsSummary] = useState<QuizResultSummary | null>(null);
  const [quizStartTime] = useState<number>(Date.now());
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedQuizData, setSavedQuizData] = useState<any>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  
  const autoNextTimeout = useRef<number | null>(null);
  
  // Quiz history and bookmarks
  const { recordAttempt } = useQuizHistory();
  const { updateBookmarkStats } = useBookmarks();

  // Auto-save functions
  const saveQuizState = () => {
    const state = {
      questions,
      userAnswers,
      currentQuestion,
      startTime: quizStartTime,
      quizType,
      topicName
    };
    try {
      localStorage.setItem('patente_quiz_autosave', JSON.stringify(state));
    } catch (error) {
      console.error('Errore salvataggio quiz:', error);
    }
  };

  const loadSavedQuiz = () => {
    try {
      const saved = localStorage.getItem('patente_quiz_autosave');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Errore caricamento quiz:', error);
      return null;
    }
  };

  const clearSavedQuiz = () => {
    try {
      localStorage.removeItem('patente_quiz_autosave');
    } catch (error) {
      console.error('Errore cancellazione quiz:', error);
    }
  };

  // Carica quiz salvato all'avvio
  useEffect(() => {
    const saved = loadSavedQuiz();
    if (saved && saved.quizType === quizType) {
      setSavedQuizData(saved);
      setShowResumeModal(true);
    }
  }, []);

  // Auto-save ogni 30 secondi
  useEffect(() => {
    if (showResults || showResumeModal) return;

    const interval = setInterval(() => {
      saveQuizState();
    }, 30000); // 30 secondi

    return () => clearInterval(interval);
  }, [questions, userAnswers, currentQuestion, showResults, showResumeModal]);

  // Carica risposta salvata quando cambia domanda
  useEffect(() => {
    const savedAnswer = userAnswers[currentQuestion];
    setSelectedAnswer(savedAnswer);
    setShowFeedback(savedAnswer !== null);
  }, [currentQuestion, userAnswers]);

  // Ferma l'audio quando cambia la domanda
  useEffect(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }, [currentQuestion]);

  const handleResumeQuiz = () => {
    if (savedQuizData) {
      setUserAnswers(savedQuizData.userAnswers);
      setCurrentQuestion(savedQuizData.currentQuestion);
      setShowResumeModal(false);
    }
  };

  const handleDiscardSaved = () => {
    clearSavedQuiz();
    setShowResumeModal(false);
  };

  const handleAnswer = (answer: boolean) => {
    if (showFeedback) return;

    // Ferma la voce quando l'utente risponde
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    setSelectedAnswer(answer);
    setShowFeedback(true);

    // Salva la risposta
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);

    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.risposta;

    // Registra il tentativo nella storia
    recordAttempt(currentQ, isCorrect);
    
    // Aggiorna statistiche bookmark se la domanda è salvata
    updateBookmarkStats(currentQ.id, isCorrect);

    // Auto-advance solo se la risposta è corretta e l'opzione è attiva
    if (isCorrect && autoAdvanceOnCorrect) {
      autoNextTimeout.current = window.setTimeout(() => {
        handleNext();
      }, 1500);
    }
  };

  const handleNext = () => {
    if (autoNextTimeout.current) {
      window.clearTimeout(autoNextTimeout.current);
      autoNextTimeout.current = null;
    }

    // Ferma la voce quando si va alla prossima domanda
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finalizeQuiz();
    }
  };

  const handlePrevious = () => {
    if (autoNextTimeout.current) {
      window.clearTimeout(autoNextTimeout.current);
      autoNextTimeout.current = null;
    }

    // Ferma la voce quando si torna indietro
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finalizeQuiz = () => {
    // Ferma la voce quando termina il quiz
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    let correctCount = 0;
    const reviewItems = questions.map((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.risposta;
      if (isCorrect) correctCount++;

      return {
        index,
        id: question.id,
        domanda: question.domanda,
        immagine: question.immagine,
        userAnswer,
        correctAnswer: question.risposta,
        isCorrect,
        argomento: question.argomento
      };
    });

    const errors = questions.length - correctCount;
    const durationSeconds = Math.max(1, Math.floor((Date.now() - quizStartTime) / 1000));

    const summary: QuizResultSummary = {
      passed: errors <= (questions.length - minCorrectToPass),
      correctCount,
      errors,
      totalQuestions: questions.length,
      durationSeconds,
      reviewItems
    };

    // Aggiorna stats e controlla achievements
    const newAchievements = updateStatsAfterQuiz(correctCount, questions.length, durationSeconds);
    if (newAchievements.length > 0) {
      setUnlockedAchievements(newAchievements);
      setCurrentAchievementIndex(0);
    }

    setResultsSummary(summary);
    setShowResults(true);
    clearSavedQuiz();
  };

  const handleTimeUp = () => {
    finalizeQuiz();
  };

  const handleReviewQuestion = (index: number) => {
    setShowResults(false);
    setCurrentQuestion(index);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(questions.length).fill(null));
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResults(false);
    setResultsSummary(null);
  };

  const handleExit = () => {
    // Ferma la voce quando si esce dal quiz
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    if (onExit) {
      onExit();
    } else {
      navigate('/dashboard');
    }
  };

  // Mostra modale di resume
  if (showResumeModal && savedQuizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <ResumeQuizModal
          totalQuestions={savedQuizData.questions.length}
          currentQuestion={savedQuizData.currentQuestion}
          answeredCount={savedQuizData.userAnswers.filter((a: any) => a !== null).length}
          quizType={savedQuizData.quizType}
          topicName={savedQuizData.topicName}
          onResume={handleResumeQuiz}
          onDiscard={handleDiscardSaved}
        />
      </div>
    );
  }

  // Mostra risultati
  if (showResults && resultsSummary) {
    return (
      <QuizResults
        summary={resultsSummary}
        onRetry={handleRetry}
        onReviewQuestion={handleReviewQuestion}
        onClose={() => setShowResults(false)}
      />
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.risposta;

  const timerElement = showTimer && !showResults ? (
    <Timer
      duration={timerDuration}
      onTimeUp={handleTimeUp}
      isPaused={false}
      warningThreshold={300}
      variant="inline"
      className="min-w-[180px]"
    />
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto pt-8 pb-20">
        {/* Question Card */}
        <QuestionCard
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          question={question.domanda}
          image={question.immagine}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          correctAnswer={question.risposta}
          fullQuestion={question}
          onAnswer={handleAnswer}
          onSpeak={() => {
            // Se sta già parlando, fermalo e riparte da capo
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
              setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(question.domanda);
                utterance.lang = 'it-IT';
                window.speechSynthesis.speak(utterance);
              }, 100);
              return;
            }
            const utterance = new SpeechSynthesisUtterance(question.domanda);
            utterance.lang = 'it-IT';
            window.speechSynthesis.speak(utterance);
          }}
          timerSlot={timerElement}
        />

        {/* Navigation Card - Glassmorphism */}
        <div className="mt-6 animate-fade-in bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="ghost"
              className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 transition-all hover:scale-105 disabled:opacity-40"
            >
              <ArrowLeft size={20} className="mr-2" />
              Precedente
            </Button>
            <Button
              onClick={handleNext}
              disabled={showResults}
              variant="ghost"
              className="text-white bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 transition-all hover:scale-105"
            >
              Successiva
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-2xl border-t border-white/30 shadow-2xl">
        <div className="flex items-center justify-around px-4 py-3.5 max-w-4xl mx-auto">
          <button
            onClick={handleExit}
            className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button
            onClick={() => navigate('/bookmarks')}
            className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs font-semibold">Salvate</span>
          </button>
          <button
            onClick={finalizeQuiz}
            className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white hover:scale-110 transition-all"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-semibold">Termina</span>
          </button>
        </div>
      </div>

      {/* Achievement Toasts */}
      {unlockedAchievements.length > 0 && currentAchievementIndex < unlockedAchievements.length && (
        <AchievementToast
          achievement={unlockedAchievements[currentAchievementIndex]}
          onClose={() => setCurrentAchievementIndex(prev => prev + 1)}
        />
      )}
    </div>
  );
};

