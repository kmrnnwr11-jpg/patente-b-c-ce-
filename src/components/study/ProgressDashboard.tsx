import { FC } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Target,
  Flame,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { useStudyProgress } from '@/hooks/useStudyProgress';

export const ProgressDashboard: FC = () => {
  const { stats, quizHistory } = useStudyProgress();

  const progressPercentage = Math.round(
    (stats.chaptersRead / stats.totalChapters) * 100
  );

  const signalsProgress = Math.round(
    (stats.signalsStudied / stats.totalSignals) * 100
  );

  // Ultimi 5 quiz
  const recentQuizzes = quizHistory.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Streak e Studio Giornaliero */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-8 h-8" />
            <div>
              <div className="text-4xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm opacity-90">Giorni Consecutivi</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8" />
            <div>
              <div className="text-4xl font-bold">{stats.totalStudyTime}</div>
              <div className="text-sm opacity-90">Minuti Totali</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progresso Capitoli */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Capitoli di Teoria</h3>
          </div>
          <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
        </div>

        <div className="bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">
              Letti: <strong>{stats.chaptersRead}/{stats.totalChapters}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-gray-700">
              Completati: <strong>{stats.chaptersCompleted}</strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Progresso Segnali */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Segnali Stradali</h3>
          </div>
          <span className="text-2xl font-bold text-green-600">{signalsProgress}%</span>
        </div>

        <div className="bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${signalsProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">
              Studiati: <strong>{stats.signalsStudied}/{stats.totalSignals}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-gray-700">
              Imparati: <strong>{stats.signalsMastered}</strong>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quiz Completati */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Quiz Completati</h3>
          </div>
          <span className="text-2xl font-bold text-purple-600">{stats.quizzesCompleted}</span>
        </div>

        {stats.quizzesCompleted > 0 ? (
          <>
            <div className="mb-4">
              <div className="text-center mb-2">
                <span className="text-4xl font-bold text-purple-600">
                  {stats.averageQuizScore}%
                </span>
                <p className="text-sm text-gray-600">Punteggio Medio</p>
              </div>
            </div>

            {/* Ultimi quiz */}
            {recentQuizzes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Ultimi Quiz
                </p>
                {recentQuizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm"
                  >
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">
                        {quiz.category === 'tutti' ? 'Tutti i segnali' : quiz.category}
                      </span>
                      <p className="text-xs text-gray-500">
                        {new Date(quiz.date).toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-lg font-bold ${
                          quiz.score >= 80
                            ? 'text-green-600'
                            : quiz.score >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {quiz.score}%
                      </span>
                      <p className="text-xs text-gray-500">
                        {quiz.correctAnswers}/{quiz.totalQuestions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p className="mb-2">📝</p>
            <p className="text-sm">Nessun quiz completato ancora</p>
            <p className="text-xs">Inizia un quiz per vedere i tuoi progressi!</p>
          </div>
        )}
      </motion.div>

      {/* Ultimo aggiornamento */}
      {stats.lastStudyDate && (
        <p className="text-center text-xs text-gray-500">
          Ultimo studio: {new Date(stats.lastStudyDate).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
};

