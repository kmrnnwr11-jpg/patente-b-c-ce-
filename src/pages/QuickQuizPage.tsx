import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, RotateCcw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import theorySignalsData from '@/data/theory-segnali-completo.json';
import { useStudyProgress } from '@/hooks/useStudyProgress';

interface QuizQuestion {
  id: string;
  signalId: string;
  image: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  category: string;
}

export const QuickQuizPage: FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const { saveQuizResult } = useStudyProgress();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Genera domande all'avvio
  useEffect(() => {
    generateQuestions();
  }, [category]);

  const generateQuestions = () => {
    // Ottieni tutti i segnali dalla categoria (o tutte se non specificata)
    let allSignals = theorySignalsData.chapters.flatMap(chapter =>
      chapter.signals.map(signal => ({
        ...signal,
        category: chapter.id,
        categoryTitle: chapter.title,
      }))
    );

    // Filtra per categoria se specificata
    if (category) {
      allSignals = allSignals.filter(s => s.category === category);
    }

    // Mescola e prendi 10 segnali casuali
    const shuffled = allSignals.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, allSignals.length));

    // Crea domande con opzioni multiple
    const quizQuestions: QuizQuestion[] = selected.map(signal => {
      // Ottieni 3 opzioni sbagliate casuali (dallo stesso tipo di segnale se possibile)
      const sameCategory = allSignals.filter(
        s => s.category === signal.category && s.id !== signal.id
      );
      const wrongOptions = sameCategory
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(s => s.nome);

      // Assicurati di avere esattamente 4 opzioni
      while (wrongOptions.length < 3) {
        const randomSignal = allSignals[Math.floor(Math.random() * allSignals.length)];
        if (randomSignal.id !== signal.id && !wrongOptions.includes(randomSignal.nome)) {
          wrongOptions.push(randomSignal.nome);
        }
      }

      // Mescola opzioni (risposta corretta + 3 sbagliate)
      const allOptions = [signal.nome, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        id: `q_${signal.id}`,
        signalId: signal.id,
        image: signal.image,
        correctAnswer: signal.nome,
        options: allOptions,
        explanation: signal.descrizione + ' ' + signal.comportamento,
        category: signal.category,
      };
    });

    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setWrongAnswers(0);
    setIsQuizComplete(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    if (selectedAnswer !== null) return; // Già risposto

    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const isCorrect = currentQuestion.options[optionIndex] === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completato
      setIsQuizComplete(true);
      
      // Salva risultato
      const finalScore = Math.round((score / questions.length) * 100);
      saveQuizResult({
        category: category || 'tutti',
        totalQuestions: questions.length,
        correctAnswers: score,
        timeSpent: timeElapsed,
        score: finalScore,
      });
    }
  };

  const handleRestart = () => {
    generateQuestions();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] flex items-center justify-center">
        <div className="text-white text-xl">Caricamento quiz...</div>
      </div>
    );
  }

  // Schermata finale
  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = score === questions.length;
    const isGood = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6"
            >
              {isPerfect ? (
                <div className="text-8xl">🏆</div>
              ) : isGood ? (
                <div className="text-8xl">🎉</div>
              ) : (
                <div className="text-8xl">💪</div>
              )}
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isPerfect ? 'Perfetto!' : isGood ? 'Ottimo lavoro!' : 'Continua così!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isPerfect
                ? 'Hai risposto correttamente a tutte le domande!'
                : isGood
                ? 'Hai una buona conoscenza dei segnali!'
                : 'Continua a studiare, migliorerai!'}
            </p>

            {/* Statistiche */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Punteggio</span>
                <span className="text-3xl font-bold text-blue-600">{percentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Corrette</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircle size={18} /> {score}/{questions.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Errate</span>
                <span className="text-red-600 font-semibold flex items-center gap-1">
                  <XCircle size={18} /> {wrongAnswers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tempo impiegato</span>
                <span className="text-purple-600 font-semibold flex items-center gap-1">
                  <Clock size={18} /> {formatTime(timeElapsed)}
                </span>
              </div>
            </div>

            {/* Pulsanti */}
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <RotateCcw size={20} />
                Rifai il Quiz
              </button>
              <button
                onClick={() => navigate('/theory')}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 border-gray-200 transition-all"
              >
                <Home size={20} />
                Torna alla Teoria
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Schermata quiz
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 sticky top-0 bg-gradient-to-b from-[#5FB894] to-[#4AA9D0] z-10 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/theory')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white font-semibold">{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold mb-2">Quiz Rapido</h1>
        <div className="flex items-center justify-between text-white/90">
          <span>Domanda {currentQuestionIndex + 1} di {questions.length}</span>
          <span>Punteggio: {score}/{questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-white h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Domanda */}
      <div className="px-6 mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Immagine segnale */}
            <div className="bg-white rounded-3xl p-8 mb-6 shadow-xl">
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 bg-gray-50 rounded-2xl p-4 flex items-center justify-center">
                  <img
                    src={currentQuestion.image}
                    alt="Segnale"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ddd"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999">?</text></svg>';
                    }}
                  />
                </div>
              </div>
              <p className="text-center text-gray-900 text-lg font-semibold">
                Che segnale è questo?
              </p>
            </div>

            {/* Opzioni risposta */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showResult = selectedAnswer !== null;

                let bgColor = 'bg-white hover:bg-gray-50';
                let borderColor = 'border-gray-200';
                let textColor = 'text-gray-900';

                if (showResult) {
                  if (isSelected && isCorrect) {
                    bgColor = 'bg-green-100';
                    borderColor = 'border-green-500';
                    textColor = 'text-green-800';
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-red-100';
                    borderColor = 'border-red-500';
                    textColor = 'text-red-800';
                  } else if (isCorrect) {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-300';
                    textColor = 'text-green-700';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full ${bgColor} ${textColor} border-2 ${borderColor} rounded-xl p-4 text-left font-medium transition-all shadow-sm disabled:cursor-not-allowed`}
                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle className="text-green-600" size={24} />}
                      {showResult && isSelected && !isCorrect && <XCircle className="text-red-600" size={24} />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Spiegazione */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6"
              >
                <h3 className="font-bold text-blue-900 mb-2 text-lg">
                  {selectedAnswer !== null && currentQuestion.options[selectedAnswer] === currentQuestion.correctAnswer
                    ? '✅ Risposta corretta!'
                    : '❌ Risposta errata'}
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>Risposta corretta:</strong> {currentQuestion.correctAnswer}
                </p>
                <p className="text-blue-700 text-sm mt-2 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Pulsante Avanti */}
            {showExplanation && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Prossima Domanda →' : 'Vedi Risultati 🏆'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

