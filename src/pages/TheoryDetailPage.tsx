import { FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, BookOpen } from 'lucide-react';
import theoryData from '@/data/theory-structure.json';
import { InteractiveTheoryText } from '@/components/theory/InteractiveTheoryText';
import { TheoryLanguageSelector } from '@/components/theory/TheoryLanguageSelector';
import { useTheoryTranslation } from '@/hooks/useTheoryTranslation';

interface TheoryChapter {
  id: string;
  title: string;
  icon: string;
  order: number;
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export const TheoryDetailPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapter');

  const [chapter, setChapter] = useState<TheoryChapter | null>(null);
  const {
    selectedLang,
    isEnabled,
    availableLanguages,
    toggleTranslation,
    changeLanguage
  } = useTheoryTranslation();

  useEffect(() => {
    const data = typeof theoryData === 'string' ? JSON.parse(theoryData) : theoryData;
    const foundChapter = data.chapters.find((ch: TheoryChapter) => ch.id === chapterId);
    setChapter(foundChapter || null);
  }, [chapterId]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 text-center max-w-md">
          <p className="text-xl text-gray-700 mb-4">Capitolo non trovato</p>
          <button
            onClick={() => navigate('/theory')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Torna alla Teoria
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/theory')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            {chapter.title}
          </h1>
          <p className="text-sm text-white/80">
            Capitolo {chapter.order} di 25
          </p>
        </div>
      </div>

      {/* Language Selector */}
      <div className="px-6">
        <TheoryLanguageSelector
          selectedLang={selectedLang}
          onLanguageChange={changeLanguage}
          isEnabled={isEnabled}
          onToggle={toggleTranslation}
        />
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {chapter.sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {section.title}
              </h2>
            </div>
            
            <div className="text-gray-700 leading-relaxed pl-12">
              {isEnabled ? (
                <InteractiveTheoryText
                  content={section.content}
                  targetLang={selectedLang}
                />
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={() => navigate('/theory')}
            className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 text-white font-medium hover:bg-white/30 transition-colors"
          >
            ← Indice
          </button>
          <button
            onClick={() => navigate(`/topic-quiz?argomento=${encodeURIComponent(chapter.title)}`)}
            className="flex-1 bg-blue-500 backdrop-blur-md rounded-2xl px-4 py-3 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Fai Quiz →
          </button>
        </div>
      </div>
    </div>
  );
};

