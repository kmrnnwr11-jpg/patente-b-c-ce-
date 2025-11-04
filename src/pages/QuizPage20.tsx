import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, PauseCircle, PlayCircle } from 'lucide-react';
import { ClickableText } from '@/components/translation/ClickableText';
import { LanguageSelector } from '@/components/translation/LanguageSelector';
import { AdvancedAudioPlayer } from '@/components/audio/AdvancedAudioPlayer';
import { AdvancedTimer } from '@/components/quiz/AdvancedTimer';
import { AIExplanationPanel } from '@/components/ai/AIExplanationPanel';
import { loadAllQuestions } from '@/lib/quizLoader';
import type { QuizQuestion } from '@/types/quiz';

export const QuizPage20 = () => {
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en', 'ur', 'hi', 'pa']);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  useEffect(() => {
    initQuiz();
    loadUserPreferences();
  }, []);

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

  const loadUserPreferences = () => {
    const saved = localStorage.getItem('preferred_languages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedLanguages(parsed);
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  };

  const saveLanguagePreferences = (langs: string[]) => {
    setSelectedLanguages(langs);
    localStorage.setItem('preferred_languages', JSON.stringify(langs));
  };

  const handleAnswer = (answer: boolean) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        {/* Header - Una Riga Completa */}
        <div className="flex items-center justify-between gap-4 mb-4 bg-white rounded-xl px-4 py-3 shadow-sm">
          {/* Esci */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-100 text-gray-700 rounded-full transition-all hover:shadow-md hover:scale-105 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Esci</span>
          </button>

          {/* Domanda */}
          <div className="flex-1 text-center">
            <span className="text-sm font-semibold text-gray-800">
              Domanda {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>

          {/* Errori */}
          <div className="text-right">
            <span className={`text-sm font-semibold ${errorCount >= 3 ? 'text-red-500' : 'text-green-600'}`}>
              Errori: {errorCount}/3
            </span>
          </div>
        </div>

        {/* Quiz Overview */}
        <div className="mb-6 space-y-3">

          <AdvancedTimer
            duration={1200} // 20 minuti
            onTimeUp={handleTimeUp}
            autoStart={true}
            isPaused={isTimerPaused}
            onTogglePause={(next) => setIsTimerPaused(next)}
            hideControls
            variant="linear"
          />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progresso quiz</span>
            <span>{questionProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${questionProgress}%` }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Main Quiz Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6"
        >
          {/* Image - Prima */}
          {currentQuestion.immagine && (
            <div className="relative">
              <img
                src={currentQuestion.immagine}
                alt="Quiz"
                className="w-full max-h-96 object-contain bg-gray-50 rounded-t-3xl"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                {currentQuestion.argomento}
              </div>
            </div>
          )}

          {/* Question Text - Sotto l'immagine */}
          <div className="px-6 pt-6 pb-4">
            <div className="mb-6">
              <ClickableText
                text={currentQuestion.domanda}
                className="text-xl leading-relaxed text-gray-800 font-medium bg-blue-50 p-4 rounded-xl border border-blue-100"
                selectedLanguages={selectedLanguages}
                enabled={true}
              />
            </div>
          </div>

          <div className="px-6 pb-8">

            {/* Audio Player + Timer Controls */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 w-full">
                <AdvancedAudioPlayer
                  text={currentQuestion.domanda}
                  language="it"
                />
              </div>

              <button
                onClick={() => setIsTimerPaused((prev) => !prev)}
                className={`w-full sm:w-auto px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isTimerPaused
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600'
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

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleAnswer(true)}
                disabled={hasAnswered}
                className={`h-16 text-xl font-bold rounded-xl transition-all ${
                  hasAnswered
                    ? currentQuestion.risposta === true
                      ? 'bg-green-500 text-white'
                      : userAnswers[currentQuestionIndex] === true
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                    : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                } disabled:cursor-not-allowed`}
              >
                VERO
              </button>
              
              <button
                onClick={() => handleAnswer(false)}
                disabled={hasAnswered}
                className={`h-16 text-xl font-bold rounded-xl transition-all ${
                  hasAnswered
                    ? currentQuestion.risposta === false
                      ? 'bg-green-500 text-white'
                      : userAnswers[currentQuestionIndex] === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                    : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
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

        {/* Language Selector */}
        <LanguageSelector
          selected={selectedLanguages}
          onChange={saveLanguagePreferences}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-white rounded-xl font-medium text-gray-700 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
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

