import { FC } from 'react';
import { Play, Trash2, Clock, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface ResumeQuizModalProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredCount: number;
  quizType: 'exam' | 'topic';
  topicName?: string;
  onResume: () => void;
  onDiscard: () => void;
}

export const ResumeQuizModal: FC<ResumeQuizModalProps> = ({
  totalQuestions,
  currentQuestion,
  answeredCount,
  quizType,
  topicName,
  onResume,
  onDiscard
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassCard className="max-w-md w-full animate-scale-in">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Clock className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Quiz in Sospeso
        </h2>
        <p className="text-white/70 text-center mb-6">
          Abbiamo trovato un quiz non completato
        </p>

        {/* Info */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/70 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tipo Quiz
            </span>
            <span className="text-white font-medium">
              {quizType === 'exam' ? 'Simulazione Esame' : `Quiz: ${topicName}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/70">Domande Totali</span>
            <span className="text-white font-medium">{totalQuestions}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/70">Domanda Corrente</span>
            <span className="text-white font-medium">{currentQuestion + 1}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/70">Risposte Date</span>
            <span className="text-white font-medium">{answeredCount}/{totalQuestions}</span>
          </div>

          {/* Progress Bar */}
          <div className="pt-2">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5" />
            Riprendi Quiz
          </button>

          <button
            onClick={onDiscard}
            className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Inizia Nuovo Quiz
          </button>
        </div>

        <p className="text-white/50 text-xs text-center mt-4">
          Il quiz viene salvato automaticamente ogni 30 secondi
        </p>
      </GlassCard>
    </div>
  );
};

