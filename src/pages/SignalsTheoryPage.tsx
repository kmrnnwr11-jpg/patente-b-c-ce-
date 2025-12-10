import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, AlertCircle, Ban, Shield, Eye, Languages } from 'lucide-react';
import { ClickableText } from '@/components/translation/ClickableText';
import { InteractiveTheoryText } from '@/components/theory/InteractiveTheoryText';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { useTheoryTranslation } from '@/hooks/useTheoryTranslation';
import theoryData from '../data/theory-segnali-completo.json';

type Signal = {
  id: string;
  nome: string;
  image: string;
  descrizione: string;
  comportamento: string;
};

type Chapter = {
  id: string;
  title: string;
  icon: string;
  order: number;
  description: string;
  sections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  signals: Signal[];
};

const iconMap: Record<string, any> = {
  AlertTriangle,
  AlertCircle,
  Ban,
  Shield,
  Eye,
};

export const SignalsTheoryPage: FC = () => {
  const navigate = useNavigate();
  const { chapterId } = useParams<{ chapterId: string }>();
  const { visitChapter, addStudyTime } = useStudyProgress();
  const { selectedLang, isEnabled } = useTheoryTranslation();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const foundChapter = theoryData.chapters.find(
      (ch: Chapter) => ch.id === chapterId
    );
    if (foundChapter) {
      setChapter(foundChapter);
      // Registra visita al capitolo
      if (chapterId) {
        visitChapter(chapterId);
      }
    }
  }, [chapterId, visitChapter]);

  // Registra tempo speso quando l'utente lascia la pagina
  useEffect(() => {
    return () => {
      if (chapterId) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        addStudyTime(chapterId, timeSpent);
      }
    };
  }, [chapterId, startTime, addStudyTime]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  const IconComponent = iconMap[chapter.icon] || AlertTriangle;

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
          
          {/* Info traduzione */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Languages className="w-4 h-4 text-white" />
            <span className="text-white text-xs">Clicca parola per tradurre</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <IconComponent className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{chapter.title}</h1>
            <p className="text-base text-white/80">{chapter.signals.length} segnali</p>
          </div>
        </div>

        <p className="text-white/90 text-base leading-relaxed">
          {isEnabled ? (
            <InteractiveTheoryText content={chapter.description} targetLang={selectedLang} />
          ) : (
            chapter.description
          )}
        </p>
      </div>

      {/* Sections (if any) */}
      {chapter.sections && chapter.sections.length > 0 && (
        <div className="px-6 mb-6">
          {chapter.sections.map((section) => (
            <div
              key={section.id}
              className="bg-white/15 backdrop-blur-md rounded-3xl p-5 mb-3 border border-white/20 shadow-lg"
            >
              <h3 className="text-white font-bold text-lg mb-3">{section.title}</h3>
              <p className="text-white/90 text-base leading-relaxed">
                {isEnabled ? (
                  <InteractiveTheoryText content={section.content} targetLang={selectedLang} />
                ) : (
                  section.content
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Signals Grid - NUOVO DESIGN PIÙ LEGGIBILE */}
      <div className="px-6 space-y-6">
        {chapter.signals.map((signal, index) => (
          <div
            key={signal.id}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-white shadow-xl hover:shadow-2xl transition-all"
          >
            {/* Numero segnale */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <h3 className="text-gray-900 font-bold text-xl leading-tight flex-1">
                {signal.nome}
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Signal Image - PIÙ GRANDE */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 bg-white rounded-2xl p-3 flex items-center justify-center shadow-lg border-2 border-gray-200">
                  <img
                    src={signal.image}
                    alt={signal.nome}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23ddd"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999">?</text></svg>';
                    }}
                  />
                </div>
              </div>

              {/* Signal Info - PIÙ LEGGIBILE */}
              <div className="flex-1 space-y-4">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-blue-900 font-bold text-sm uppercase tracking-wide">
                      Descrizione
                    </p>
                  </div>
                  {isEnabled ? (
                    <InteractiveTheoryText 
                      content={signal.descrizione}
                      targetLang={selectedLang}
                    />
                  ) : (
                    <span className="text-gray-800 text-base leading-relaxed">{signal.descrizione}</span>
                  )}
                </div>

                <div className="bg-green-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-900 font-bold text-sm uppercase tracking-wide">
                      Comportamento da Tenere
                    </p>
                  </div>
                  {isEnabled ? (
                    <InteractiveTheoryText 
                      content={signal.comportamento}
                      targetLang={selectedLang}
                    />
                  ) : (
                    <span className="text-gray-800 text-base leading-relaxed">{signal.comportamento}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-20">
        <button
          onClick={() => navigate('/theory')}
          className="w-full bg-white hover:bg-gray-50 rounded-2xl px-4 py-3 text-gray-900 font-semibold transition-colors shadow-lg border-2 border-gray-200"
        >
          ← Torna ai Segnali
        </button>
      </div>
    </div>
  );
};

