import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, PauseCircle, PlayCircle } from 'lucide-react';
import { InteractiveQuizText } from '@/components/quiz/InteractiveQuizText';
import { useQuizTranslation } from '@/hooks/useQuizTranslation';
import { AdvancedAudioPlayer, AdvancedAudioPlayerHandle } from '@/components/audio/AdvancedAudioPlayer';
import { AdvancedTimer } from '@/components/quiz/AdvancedTimer';
import { AIExplanationPanel } from '@/components/ai/AIExplanationPanel';
import { loadAllQuestions } from '@/lib/quizLoader';
import type { QuizQuestion } from '@/types/quiz';

export const QuizPage20 = () => {
  const navigate = useNavigate();
  const { isEnabled, selectedLang, toggleTranslation, changeLanguage } = useQuizTranslation();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const audioRef = useRef<AdvancedAudioPlayerHandle | null>(null);

  useEffect(() => {
    initQuiz();
  }, []);

  // Ferma l'audio quando cambia la domanda
  useEffect(() => {
    audioRef.current?.stop();
  }, [currentQuestionIndex]);

  const initQuiz = async () => {
    try {
      const allQuestions = loadAllQuestions();
      // Prendi 30 domande random per l'esame
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 30);
      setQuestions(selected);
      setLoading(false);
    } catch (error) {
      console.error('Error loading quiz:', error);
      setLoading(false);
    }
  };

  const handleAnswer = (answer: boolean) => {
    // Ferma la voce corrente quando l'utente risponde
    audioRef.current?.stop();

    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answer
    });

    // Auto-avanza dopo 1 secondo
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowExplanation(false);
      } else {
        handleQuizComplete();
      }
    }, 1000);
  };

  const handleQuizComplete = () => {
    const errors = questions.reduce((count, question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer === undefined) return count + 1;
      return userAnswer === question.risposta ? count : count + 1;
    }, 0);

    const passed = errors <= 3;
    
    // Salva risultati
    const results = {
      questions,
      userAnswers,
      errors,
      passed,
      date: new Date().toISOString()
    };

    localStorage.setItem('last_quiz_result', JSON.stringify(results));
    navigate('/quiz/results');
  };

  const handleTimeUp = () => {
    alert('Tempo scaduto! Il quiz verrà inviato automaticamente.');
    handleQuizComplete();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;
  const isCorrect = hasAnswered && userAnswers[currentQuestionIndex] === currentQuestion?.risposta;
  const questionProgress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700">Errore nel caricamento del quiz</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  const errorCount = Object.entries(userAnswers).filter(([idx, answer]) => {
    const q = questions[parseInt(idx)];
    return answer !== q?.risposta;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header - Glassmorphism */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/20">
          {/* Esci */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white rounded-full transition-all hover:shadow-lg hover:scale-105 text-sm font-semibold border border-white/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Esci</span>
          </button>

          {/* Domanda - HIDDEN */}
          <div className="flex-1 text-center" style={{ display: 'none' }}>
            <span className="text-sm font-bold text-white drop-shadow-lg">
              Domanda {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Errori */}
          <div className="text-right">
            <span className={`text-sm font-bold drop-shadow-lg ${errorCount >= 3 ? 'text-red-300' : 'text-green-300'}`}>
              Errori: {errorCount}/3
            </span>
          </div>
        </div>

        {/* Quiz Overview - Glassmorphism */}
        <div className="mb-6 space-y-4 bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/20">

          <AdvancedTimer
            duration={1200} // 20 minuti
            onTimeUp={handleTimeUp}
            autoStart={true}
            isPaused={isTimerPaused}
            onTogglePause={(next) => setIsTimerPaused(next)}
            hideControls
            variant="linear"
          />

          <div className="flex items-center justify-between text-xs text-white font-semibold">
            <span>Progresso quiz</span>
            <span>{questionProgress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${questionProgress}%` }}
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full shadow-lg"
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

{/* Main Quiz Card - Glassmorphism */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden mb-6 border border-white/30"
        >
          {/* Image - Prima */}
          {currentQuestion.immagine && (
            <div className="relative p-4">
              <img
                src={currentQuestion.immagine}
                alt="Quiz"
                className="w-full max-h-96 object-contain bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20"
                loading="lazy"
              />
              <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 max-w-[200px] text-center leading-tight" style={{ display: 'none' }}>
                {currentQuestion.argomento}
              </div>
            </div>
          )}

          {/* Question Text - Sotto l'immagine */}
          <div className="px-6 pt-2 pb-4">
            <div className="mb-6 text-xl leading-relaxed text-white font-bold text-center p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl rounded-2xl border-2 border-yellow-400/50 shadow-2xl">
              {isEnabled ? (
                <InteractiveQuizText
                  content={currentQuestion.domanda}
                  targetLang={selectedLang}
                />
              ) : (
                <p>{currentQuestion.domanda}</p>
              )}
            </div>
          </div>

          <div className="px-6 pb-8">

            {/* Audio Player + Timer Controls */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full">
                <AdvancedAudioPlayer
                  ref={audioRef}
                  text={currentQuestion.domanda}
                  language="it"
                />
              </div>

              <button
                onClick={() => setIsTimerPaused((prev) => !prev)}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-xl border-2 ${
                  isTimerPaused
                    ? 'bg-green-500/70 hover:bg-green-500/90 text-white border-green-300 shadow-xl shadow-green-500/30'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-xl'
                }`}
              >
                {isTimerPaused ? (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    <span>Riprendi timer</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-5 h-5" />
                    <span>Pausa timer</span>
                  </>
                )}
              </button>
            </div>

            {/* Answer Buttons - Glassmorphism */}
            <div className="grid grid-cols-2 gap-5 mb-6">
              <button
                onClick={() => handleAnswer(true)}
                disabled={hasAnswered}
                className={`h-20 text-2xl font-bold rounded-2xl transition-all backdrop-blur-xl border-2 ${
                  hasAnswered
                    ? currentQuestion.risposta === true
                      ? 'bg-green-500/80 text-white border-green-300 shadow-2xl shadow-green-500/50'
                      : userAnswers[currentQuestionIndex] === true
                      ? 'bg-red-500/80 text-white border-red-300 shadow-2xl shadow-red-500/50'
                      : 'bg-white/10 text-white/40 border-white/20'
                    : 'bg-green-500/70 hover:bg-green-500/90 text-white border-green-300 hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95'
                } disabled:cursor-not-allowed`}
              >
                VERO
              </button>
              
              <button
                onClick={() => handleAnswer(false)}
                disabled={hasAnswered}
                className={`h-20 text-2xl font-bold rounded-2xl transition-all backdrop-blur-xl border-2 ${
                  hasAnswered
                    ? currentQuestion.risposta === false
                      ? 'bg-green-500/80 text-white border-green-300 shadow-2xl shadow-green-500/50'
                      : userAnswers[currentQuestionIndex] === false
                      ? 'bg-red-500/80 text-white border-red-300 shadow-2xl shadow-red-500/50'
                      : 'bg-white/10 text-white/40 border-white/20'
                    : 'bg-red-500/70 hover:bg-red-500/90 text-white border-red-300 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 active:scale-95'
                } disabled:cursor-not-allowed`}
              >
                FALSO
              </button>
            </div>

            {/* Feedback */}
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-4 ${
                  isCorrect
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                }`}
              >
                <div className={`text-center font-bold text-lg ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {isCorrect ? '✅ Risposta Corretta!' : '❌ Risposta Errata'}
                </div>
              </motion.div>
            )}

            {/* AI Explanation */}
            {hasAnswered && (
              <AIExplanationPanel
                question={currentQuestion}
                isVisible={showExplanation}
                onClose={() => setShowExplanation(false)}
              />
            )}

            {hasAnswered && !showExplanation && (
              <button
                onClick={() => setShowExplanation(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition"
              >
                🤖 Mostra Spiegazione AI
              </button>
            )}
          </div>
        </motion.div>

        {/* Language Selector rimosso - usa QuizLanguageSelector sopra */}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              audioRef.current?.stop();
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
            }}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              audioRef.current?.stop();
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setShowExplanation(false);
              } else {
                handleQuizComplete();
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Termina Quiz' : 'Prossima'}
            <ArrowRight className="w-5 h-5 inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

