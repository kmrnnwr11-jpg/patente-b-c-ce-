import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="container mx-auto px-4 py-3 max-w-4xl">
        {/* Header - Una Riga Moderna */}
        <div className="flex items-center justify-between gap-4 mb-3 bg-white rounded-xl px-4 py-2 shadow-sm">
          {/* Esci */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Esci</span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300"></div>

          {/* Timer - Compatto */}
          <div className="scale-75">
            <AdvancedTimer
              duration={1200} // 20 minuti
              onTimeUp={handleTimeUp}
              autoStart={true}
            />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300"></div>

          {/* Errori */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Errori:</span>
            <span className={`text-lg font-bold ${errorCount >= 3 ? 'text-red-500' : 'text-green-600'}`}>
              {errorCount}/3
            </span>
          </div>
        </div>

        {/* Progress Bar - Compatta */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Domanda {currentQuestionIndex + 1}/{questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              transition={{ duration: 0.3 }}
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
          {/* Image - Più Grande */}
          {currentQuestion.immagine && (
            <div className="relative">
              <img
                src={currentQuestion.immagine}
                alt="Quiz"
                className="w-full max-h-80 object-contain bg-gray-50 rounded-t-3xl"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                {currentQuestion.argomento}
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Question Text - Più Grande e Spazioso */}
            <div className="mb-8">
              <ClickableText
                text={currentQuestion.domanda}
                className="text-2xl leading-relaxed text-gray-900 font-semibold"
                selectedLanguages={selectedLanguages}
                enabled={true}
              />
            </div>

            {/* Audio Player */}
            <div className="mb-6">
              <AdvancedAudioPlayer
                text={currentQuestion.domanda}
                language="it"
              />
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

