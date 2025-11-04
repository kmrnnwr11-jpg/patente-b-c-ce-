import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import theoryData from '@/data/theory-structure.json';

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

export const LessonDetailPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [chapter, setChapter] = useState<TheoryChapter | null>(null);
  const [prevChapter, setPrevChapter] = useState<TheoryChapter | null>(null);
  const [nextChapter, setNextChapter] = useState<TheoryChapter | null>(null);

  useEffect(() => {
    const data = typeof theoryData === 'string' ? JSON.parse(theoryData) : theoryData;
    const chapters = data.chapters || [];
    
    const foundChapter = chapters.find((ch: TheoryChapter) => ch.id === id);
    if (foundChapter) {
      setChapter(foundChapter);
      
      // Trova capitolo precedente
      const prevIndex = chapters.findIndex((ch: TheoryChapter) => ch.id === id) - 1;
      if (prevIndex >= 0) {
        setPrevChapter(chapters[prevIndex]);
      } else {
        setPrevChapter(null);
      }
      
      // Trova capitolo successivo
      const nextIndex = chapters.findIndex((ch: TheoryChapter) => ch.id === id) + 1;
      if (nextIndex < chapters.length) {
        setNextChapter(chapters[nextIndex]);
      } else {
        setNextChapter(null);
      }
    } else {
      setChapter(null);
    }
  }, [id]);

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
      <div className="px-6 pt-12 pb-6 sticky top-0 bg-gradient-to-b from-[#5FB894] to-transparent backdrop-blur-sm z-10">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/theory')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium">Indice</span>
          </button>
          <div className="flex items-center gap-2 text-white/80">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm">Capitolo {chapter.order}</span>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            {chapter.title}
          </h1>
        </div>
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
            
            <p className="text-gray-700 leading-relaxed pl-12">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation between chapters */}
      {(prevChapter || nextChapter) && (
        <div className="px-6 max-w-4xl mx-auto mb-6">
          <div className="grid grid-cols-2 gap-4">
            {prevChapter ? (
              <button
                onClick={() => navigate(`/theory/lesson/${prevChapter.id}`)}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl p-4 text-white transition-all hover:scale-[1.02] active:scale-98 text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs opacity-80">Capitolo {prevChapter.order}</span>
                </div>
                <span className="text-sm font-medium line-clamp-2 block">{prevChapter.title}</span>
              </button>
            ) : (
              <div></div>
            )}
            
            {nextChapter ? (
              <button
                onClick={() => navigate(`/theory/lesson/${nextChapter.id}`)}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl p-4 text-white transition-all hover:scale-[1.02] active:scale-98 text-right"
              >
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-xs opacity-80">Capitolo {nextChapter.order}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium line-clamp-2 block">{nextChapter.title}</span>
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={() => navigate('/theory')}
            className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 text-white font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Indice</span>
          </button>
          <button
            onClick={() => navigate(`/topic-quiz?argomento=${encodeURIComponent(chapter.title)}`)}
            className="flex-1 bg-blue-500 backdrop-blur-md rounded-2xl px-4 py-3 text-white font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <span>Fai Quiz</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

