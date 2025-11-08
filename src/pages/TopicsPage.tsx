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
  Target
} from 'lucide-react';
import { getTopics, getTopicQuestionCount } from '@/lib/quizLoader';

export const TopicsPage: FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Array<{ name: string; count: number; icon: any }>>([]);

  // Mapping argomento -> icona
  const getTopicIcon = (topicName: string) => {
    const iconMap: Record<string, any> = {
      'Definizioni stradali e di traffico': Circle,
      'Pannelli integrativi dei segnali': Info,
      'Segnali di divieto': Ban,
      'Segnali di indicazione': Eye,
      'Segnali di obbligo': Shield,
      'Segnali di pericolo': AlertTriangle,
      'Segnali di precedenza': AlertCircle,
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
    return iconMap[topicName] || Car;
  };

  useEffect(() => {
    // Forza l'uso del dataset 2023 completo (ministeriale-2023) per avere TUTTI gli argomenti
    const allTopics = getTopics('ministeriale-2023');
    const topicsWithCounts = allTopics.map(topic => ({
      name: topic,
      count: getTopicQuestionCount(topic, 'ministeriale-2023'),
      icon: getTopicIcon(topic)
    }));
    setTopics(topicsWithCounts);
  }, []);

  const handleSelectTopic = (topicName: string) => {
    navigate(`/topic-quiz?argomento=${encodeURIComponent(topicName)}`);
  };

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
            Quiz per Argomento
          </h1>
          <p className="text-sm text-white/80">
            Scegli un argomento da studiare
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.name}
                onClick={() => handleSelectTopic(topic.name)}
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
                <Icon className="w-12 h-12 text-green-200 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div className="text-center">
                  <span className="text-white text-center font-medium text-sm leading-tight block">
                    {topic.name}
                  </span>
                  <span className="text-white/70 text-xs mt-1 block">
                    {topic.count} quiz
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

