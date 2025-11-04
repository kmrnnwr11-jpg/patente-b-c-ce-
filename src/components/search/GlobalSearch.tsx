import { FC, useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, FileText, Trophy, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'quiz' | 'theory' | 'achievement' | 'page';
  title: string;
  description: string;
  url: string;
  icon: 'quiz' | 'theory' | 'achievement' | 'page';
}

const SEARCH_DATA: SearchResult[] = [
  // Quiz
  { id: '1', type: 'quiz', title: 'Simulazione Esame', description: 'Quiz completo da 30 domande', url: '/quiz/exam', icon: 'quiz' },
  { id: '2', type: 'quiz', title: 'Quiz per Argomento', description: 'Esercitati su argomenti specifici', url: '/quiz/topics', icon: 'quiz' },
  
  // Theory
  { id: '3', type: 'theory', title: 'Segnali di Pericolo', description: 'Teoria sui segnali stradali', url: '/theory/lesson/1', icon: 'theory' },
  { id: '4', type: 'theory', title: 'Precedenza', description: 'Regole di precedenza', url: '/theory/lesson/2', icon: 'theory' },
  { id: '5', type: 'theory', title: 'Limiti di Velocità', description: 'Velocità massime consentite', url: '/theory/lesson/3', icon: 'theory' },
  
  // Pages
  { id: '6', type: 'page', title: 'Bookmarks', description: 'Domande salvate', url: '/bookmarks', icon: 'page' },
  { id: '7', type: 'page', title: 'Ripasso Intelligente', description: 'Smart review delle domande', url: '/smart-review', icon: 'page' },
  { id: '8', type: 'page', title: 'Achievement', description: 'I tuoi traguardi', url: '/achievements', icon: 'achievement' },
  { id: '9', type: 'page', title: 'Classifica', description: 'Leaderboard globale', url: '/leaderboard', icon: 'page' },
  { id: '10', type: 'page', title: 'Statistiche', description: 'Le tue performance', url: '/statistics', icon: 'page' },
  { id: '11', type: 'page', title: 'Impostazioni', description: 'Configura l\'app', url: '/settings', icon: 'page' },
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = SEARCH_DATA.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery)
    ).slice(0, 8);

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].url);
    }
  };

  const getIcon = (icon: SearchResult['icon']) => {
    switch (icon) {
      case 'quiz':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'theory':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fade-in"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[91] px-4 animate-slide-down">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <Search className="w-5 h-5 text-white/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cerca quiz, teoria, achievement..."
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            )}
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">Inizia a digitare per cercare...</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
                    Quiz
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
                    Teoria
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
                    Achievement
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
                    Statistiche
                  </span>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">Nessun risultato per "{query}"</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result.url)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-4 px-4 py-3 transition-colors ${
                      index === selectedIndex
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getIcon(result.icon)}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-white truncate">
                        {result.title}
                      </div>
                      <div className="text-sm text-white/60 truncate">
                        {result.description}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                        ↵
                      </kbd>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-t border-white/10 text-xs text-white/50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded">↑</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded">↓</kbd>
                naviga
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded">↵</kbd>
                seleziona
              </span>
            </div>
            <span>
              {results.length} risultat{results.length === 1 ? 'o' : 'i'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook per gestire la ricerca globale
export const useGlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) o Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
};

