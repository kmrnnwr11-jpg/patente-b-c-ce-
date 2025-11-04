import { FC, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Image as ImageIcon } from 'lucide-react';
import { 
  generateExamQuiz, 
  getQuizStats 
} from '@/lib/quizLoader';
import type { QuizQuestion, QuizStats } from '@/types/quiz';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

export const QuizTest: FC = () => {
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [sampleQuiz, setSampleQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        
        // Carica statistiche
        const quizStats = await getQuizStats();
        setStats(quizStats);
        
        // Genera quiz di test
        const quiz = await generateExamQuiz();
        setSampleQuiz(quiz);
        
        console.log('📊 Quiz caricati:', quizStats);
        console.log('📝 Quiz di test:', quiz.length, 'domande');
        
        setLoading(false);
      } catch (err) {
        console.error('Errore caricamento quiz:', err);
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
        setLoading(false);
      }
    }
    
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary dark:bg-gradient-dark flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Caricamento quiz...</p>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-primary dark:bg-gradient-dark flex items-center justify-center p-4">
        <GlassCard className="p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Errore Caricamento Quiz</h2>
          <p className="text-white/80 mb-4">{error}</p>
          <p className="text-sm text-white/60">
            Assicurati di aver eseguito: <code className="bg-black/20 px-2 py-1 rounded">npm run import-quiz</code>
          </p>
        </GlassCard>
      </div>
    );
  }

  if (!stats || sampleQuiz.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-primary dark:bg-gradient-dark flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center">
          <p className="text-white text-lg">Nessun quiz disponibile</p>
          <p className="text-white/60 text-sm mt-2">Esegui: npm run import-quiz</p>
        </GlassCard>
      </div>
    );
  }

  const question = sampleQuiz[currentQuestion];
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === sampleQuiz.length - 1;

  return (
    <div className="min-h-screen bg-gradient-primary dark:bg-gradient-dark p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header con statistiche */}
        <GlassCard className="p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            🧪 Test Quiz Patente B
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-80">Domande Totali</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.withImages}</div>
              <div className="text-sm opacity-80">Con Immagine</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.withoutImages}</div>
              <div className="text-sm opacity-80">Solo Testo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.topics}</div>
              <div className="text-sm opacity-80">Argomenti</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{sampleQuiz.length}</div>
              <div className="text-sm opacity-80">Quiz Test</div>
            </div>
          </div>
        </GlassCard>

        {/* Quiz Card */}
        <GlassCard variant="strong" className="p-8">
          {/* Header domanda */}
          <div className="flex justify-between items-center mb-6 text-white">
            <span className="text-sm font-medium">
              Domanda {currentQuestion + 1} / {sampleQuiz.length}
            </span>
            <span className="text-xs px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              {question.argomento}
            </span>
          </div>

          {/* Immagine */}
          {question.immagine ? (
            <div className="mb-6 flex justify-center">
              <div className="relative max-w-md w-full">
                <img
                  src={question.immagine}
                  alt="Segnale stradale"
                  className="w-full rounded-xl shadow-xl"
                  onError={(e) => {
                    console.error('Errore caricamento immagine:', question.immagine);
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="flex flex-col items-center justify-center p-8 bg-red-500/10 rounded-xl border border-red-500/20">
                          <svg class="w-16 h-16 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p class="text-red-400 text-sm">Immagine non trovata</p>
                          <p class="text-red-300/60 text-xs mt-1">Scarica immagini da GitHub</p>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <ImageIcon size={16} />
                <span>Nessuna immagine</span>
              </div>
            </div>
          )}

          {/* Domanda */}
          <div className="text-xl text-white mb-8 leading-relaxed text-center md:text-left">
            {question.domanda}
          </div>

          {/* Bottoni risposta */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              size="lg"
              className="bg-success hover:bg-success/90 text-white font-bold h-14 text-lg"
              onClick={() => setShowAnswer(true)}
            >
              <Check size={24} className="mr-2" />
              VERO
            </Button>
            <Button
              size="lg"
              className="bg-error hover:bg-error/90 text-white font-bold h-14 text-lg"
              onClick={() => setShowAnswer(true)}
            >
              <X size={24} className="mr-2" />
              FALSO
            </Button>
          </div>

          {/* Risposta corretta (solo se show answer) */}
          {showAnswer && (
            <div className={`p-4 rounded-xl mb-6 ${
              question.risposta 
                ? 'bg-success/20 border border-success/30' 
                : 'bg-error/20 border border-error/30'
            }`}>
              <p className="text-white text-center font-semibold">
                ✅ Risposta corretta: {question.risposta ? 'VERO' : 'FALSO'}
              </p>
            </div>
          )}

          {/* Navigazione */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestion(Math.max(0, currentQuestion - 1));
                setShowAnswer(false);
              }}
              disabled={isFirst}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Precedente
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-white/80"
            >
              {showAnswer ? 'Nascondi' : 'Mostra'} Risposta
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestion(Math.min(sampleQuiz.length - 1, currentQuestion + 1));
                setShowAnswer(false);
              }}
              disabled={isLast}
              className="flex items-center gap-2"
            >
              Successiva
              <ChevronRight size={20} />
            </Button>
          </div>

          {/* Info debug */}
          <div className="mt-6 p-4 bg-black/20 rounded-lg text-xs text-white/60 space-y-1">
            <div><strong>ID:</strong> {question.id}</div>
            <div><strong>Risposta:</strong> {question.risposta ? 'VERO ✓' : 'FALSO ✗'}</div>
            <div><strong>Argomento:</strong> {question.argomento}</div>
            <div><strong>Difficoltà:</strong> {question.difficulty || 'N/A'}</div>
            <div><strong>Immagine:</strong> {question.immagine || 'Nessuna'}</div>
          </div>
        </GlassCard>

        {/* Footer info */}
        <div className="mt-6 text-center text-white/60 text-sm">
          <p>🧪 Componente di test per verificare caricamento quiz</p>
          <p className="mt-1">Dati da: src/data/quiz.json | Immagini da: public/images/quiz/</p>
        </div>
      </div>
    </div>
  );
};

