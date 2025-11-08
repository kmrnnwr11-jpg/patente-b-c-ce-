import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  AlertTriangle, 
  Circle,
  Info,
  Shield,
  Ban,
  Eye,
  AlertCircle,
  Pill,
  Headphones,
  Gauge,
  Navigation,
  Clock,
  Briefcase,
  Scale,
  MapPin,
  TrafficCone,
  Timer,
  Users,
  FileText,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { getTopics } from '@/lib/quizLoader';
import { ProgressDashboard } from '@/components/study/ProgressDashboard';

type TheoryTopic = {
  name: string;
  iconSrc?: string;
  fallbackIcon: any;
};

const normalizeTopic = (topic: string) => topic.toLowerCase();

const imageIconMap: Record<string, string> = {
  'segnali di pericolo': '/images/theory-icons/pericolo.png',
  'segnali di divieto': '/images/theory-icons/divieto.png',
  'segnali di obbligo': '/images/theory-icons/obbligo.png',
  'segnali di precedenza': '/images/theory-icons/precedenza.png',
  'segnali di indicazione': '/images/theory-icons/indicazione.png',
  'segnali-complementari-cantiere': '/images/theory-icons/cantiere.png',
  'pannelli integrativi dei segnali': '/images/theory-icons/indicazione.png',
  'segnaletica-orizzontale-ostacoli': '/images/theory-icons/segnaletica.png',
  'semafori-vigili': '/images/theory-icons/semaforo.png',
  'limiti-di-velocita': '/images/theory-icons/velocita.png',
  'distanza-di-sicurezza': '/images/theory-icons/velocita.png',
  'norme-di-circolazione': '/images/theory-icons/direzioni.png',
  'norme-varie-autostrade-pannelli': '/images/theory-icons/direzioni.png',
  'precedenza-incroci': '/images/theory-icons/precedenza.png',
  'fermata-sosta-arresto': '/images/theory-icons/divieto.png'
};

const fallbackIconMap: Record<string, any> = {
  'definizioni stradali e di traffico': Circle,
  'pannelli integrativi dei segnali': Info,
  'segnali di divieto': Ban,
  'segnali di indicazione': Eye,
  'segnali di obbligo': Shield,
  'segnali di pericolo': AlertTriangle,
  'segnali di precedenza': AlertCircle,
      'alcool-droga-primo-soccorso': Pill,
      'cinture-casco-sicurezza': Briefcase,
      'consumi-ambiente-inquinamento': Lightbulb,
      'distanza-di-sicurezza': Scale,
      'elementi-veicolo-manutenzione-comportamenti': Car,
      'fermata-sosta-arresto': Clock,
      'incidenti-stradali-comportamenti': AlertCircle,
      'limiti-di-velocita': Gauge,
      'luci-dispositivi-acustici': Headphones,
      'norme-di-circolazione': MapPin,
      'norme-varie-autostrade-pannelli': Navigation,
      'patente-punti-documenti': FileText,
      'precedenza-incroci': Users,
      'responsabilita-civile-penale-e-assicurazione': Scale,
      'segnaletica-orizzontale-ostacoli': MapPin,
      'segnali-complementari-cantiere': TrafficCone,
      'semafori-vigili': Timer,
      'sorpasso': Target
    };

export const TheoryPage: FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TheoryTopic[]>([]);
  const [showProgress, setShowProgress] = useState(false);

  const chapterIdMap: Record<string, string> = {
    'definizioni stradali e di traffico': 'definizioni-stradali',
    'pannelli integrativi dei segnali': 'pannelli-integrativi',
    'segnali di divieto': 'segnali-divieto',
    'segnali di indicazione': 'segnali-indicazione',
    'segnali di obbligo': 'segnali-obbligo',
    'segnali di pericolo': 'segnali-pericolo',
    'segnali di precedenza': 'segnali-precedenza',
      'alcool-droga-primo-soccorso': 'alcool-droga',
      'cinture-casco-sicurezza': 'cinture-casco',
      'consumi-ambiente-inquinamento': 'ambiente',
      'distanza-di-sicurezza': 'distanza-sicurezza',
      'elementi-veicolo-manutenzione-comportamenti': 'elementi-veicolo',
      'fermata-sosta-arresto': 'fermata-sosta',
      'incidenti-stradali-comportamenti': 'incidenti',
      'limiti-di-velocita': 'limiti-velocita',
      'luci-dispositivi-acustici': 'luci-veicoli',
      'norme-di-circolazione': 'norme-circolazione',
      'norme-varie-autostrade-pannelli': 'autostrade',
      'patente-punti-documenti': 'patente-documenti',
      'precedenza-incroci': 'norme-precedenza',
      'responsabilita-civile-penale-e-assicurazione': 'responsabilita-assicurazione',
      'segnaletica-orizzontale-ostacoli': 'segnaletica-orizzontale',
      'segnali-complementari-cantiere': 'segnali-cantiere',
      'semafori-vigili': 'semafori',
      'sorpasso': 'sorpasso'
    };

  const getChapterId = (topicName: string): string => {
    const normalized = normalizeTopic(topicName);
    return chapterIdMap[normalized] || 'segnali-pericolo';
  };

  useEffect(() => {
    // Forza l'uso del dataset 2023 completo (ministeriale-2023) per avere TUTTI gli argomenti
    const allTopics = getTopics('ministeriale-2023');
    const topicsWithIcons: TheoryTopic[] = allTopics.map(topic => {
      const key = normalizeTopic(topic);
      return {
      name: topic,
        iconSrc: imageIconMap[key],
        fallbackIcon: fallbackIconMap[key] || Car
      };
    });
    setTopics(topicsWithIcons);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-1">
            Teoria e Segnali
          </h1>
          <p className="text-sm text-white/80">
            Studia la teoria per argomento
          </p>
        </div>
      </div>

      {/* Pulsanti Studio */}
      <div className="px-6 mb-8 space-y-4">
        {/* Pulsante Flashcard */}
        <button
          onClick={() => navigate('/study/flashcards')}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">📇</span>
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-xl mb-1">Modalità Flashcard</h3>
                <p className="text-white/90 text-sm">Studia i segnali con le carte interattive</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Pulsante Quiz Rapido */}
        <button
          onClick={() => navigate('/study/quick-quiz')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-xl mb-1">Quiz Rapido</h3>
                <p className="text-white/90 text-sm">Metti alla prova le tue conoscenze</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Pulsante Progresso */}
        <button
          onClick={() => setShowProgress(!showProgress)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-xl mb-1">Il Mio Progresso</h3>
                <p className="text-white/90 text-sm">Visualizza le tue statistiche di studio</p>
              </div>
            </div>
            <svg 
              className={`w-6 h-6 text-white transition-transform ${showProgress ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Dashboard Progresso (collapsibile) */}
      {showProgress && (
        <div className="px-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <ProgressDashboard />
          </div>
        </div>
      )}

      {/* Sezione Segnali Stradali */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">🚦 Segnali Stradali</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/theory/signals/segnali-pericolo')}
            className="backdrop-blur-md rounded-3xl p-6 bg-red-500/30 border border-white/20 flex flex-col items-center justify-center gap-3 min-h-[140px] hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300"
          >
            <AlertTriangle className="w-12 h-12 text-white" strokeWidth={1.5} />
            <span className="text-white text-center font-medium text-sm leading-tight">
              Segnali di Pericolo
            </span>
          </button>

          <button
            onClick={() => navigate('/theory/signals/segnali-precedenza')}
            className="backdrop-blur-md rounded-3xl p-6 bg-yellow-500/30 border border-white/20 flex flex-col items-center justify-center gap-3 min-h-[140px] hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300"
          >
            <AlertCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            <span className="text-white text-center font-medium text-sm leading-tight">
              Segnali di Precedenza
            </span>
          </button>

          <button
            onClick={() => navigate('/theory/signals/segnali-divieto')}
            className="backdrop-blur-md rounded-3xl p-6 bg-red-600/30 border border-white/20 flex flex-col items-center justify-center gap-3 min-h-[140px] hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300"
          >
            <Ban className="w-12 h-12 text-white" strokeWidth={1.5} />
            <span className="text-white text-center font-medium text-sm leading-tight">
              Segnali di Divieto
            </span>
          </button>

          <button
            onClick={() => navigate('/theory/signals/segnali-obbligo')}
            className="backdrop-blur-md rounded-3xl p-6 bg-blue-500/30 border border-white/20 flex flex-col items-center justify-center gap-3 min-h-[140px] hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300"
          >
            <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
            <span className="text-white text-center font-medium text-sm leading-tight">
              Segnali di Obbligo
            </span>
          </button>

          <button
            onClick={() => navigate('/theory/signals/segnali-indicazione')}
            className="backdrop-blur-md rounded-3xl p-6 bg-green-500/30 border border-white/20 flex flex-col items-center justify-center gap-3 min-h-[140px] hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300 col-span-2"
          >
            <Eye className="w-12 h-12 text-white" strokeWidth={1.5} />
            <span className="text-white text-center font-medium text-sm leading-tight">
              Segnali di Indicazione
            </span>
          </button>
        </div>
      </div>

      {/* Altre lezioni di Teoria */}
      <div className="px-6 mb-4">
        <h2 className="text-lg font-bold text-white mb-4">📚 Altre Lezioni di Teoria</h2>
      </div>

      {/* Topics Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {topics.map((topic, index) => {
            const FallbackIcon = topic.fallbackIcon;
            return (
              <button
                key={topic.name}
                onClick={() => navigate(`/theory/lesson/${getChapterId(topic.name)}`)}
                className={`
                  backdrop-blur-md rounded-3xl p-6
                  border border-white/20
                  flex flex-col items-center justify-center gap-3
                  min-h-[140px]
                  hover:scale-105 hover:brightness-110
                  active:scale-95
                  transition-all duration-300
                  group
                  ${index % 4 === 0 ? 'bg-teal-500/30' : ''}
                  ${index % 4 === 1 ? 'bg-cyan-500/30' : ''}
                  ${index % 4 === 2 ? 'bg-blue-500/30' : ''}
                  ${index % 4 === 3 ? 'bg-purple-500/30' : ''}
                `}
              >
                {topic.iconSrc ? (
                  <img
                    src={topic.iconSrc}
                    alt={topic.name}
                    className="w-14 h-14 object-contain drop-shadow-lg group-hover:scale-110 transition-transform"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <FallbackIcon className="w-12 h-12 text-green-200 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                )}
                <div className="text-center">
                  <span className="text-white text-center font-medium text-sm leading-tight block">
                    {topic.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 text-white font-medium hover:bg-white/30 transition-colors"
        >
          ← Torna alla Home
        </button>
      </div>
    </div>
  );
};

