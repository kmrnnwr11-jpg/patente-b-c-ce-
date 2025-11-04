import { FC, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { QuizQuestion } from '@/types/quiz';

interface BookmarkButtonProps {
  question: QuizQuestion;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onToggle?: (isBookmarked: boolean) => void;
}

export const BookmarkButton: FC<BookmarkButtonProps> = ({
  question,
  size = 'md',
  showLabel = false,
  onToggle
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [showAnimation, setShowAnimation] = useState(false);
  
  const bookmarked = isBookmarked(question.id);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const handleToggle = () => {
    const newState = toggleBookmark(question);
    
    // Animazione
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 600);
    
    // Callback
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${buttonSizeClasses[size]}
        rounded-full transition-all duration-300
        ${bookmarked 
          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        }
        ${showAnimation ? 'scale-125' : 'scale-100'}
        hover:scale-110 active:scale-95
        backdrop-blur-sm border border-white/10
        flex items-center gap-2
      `}
      aria-label={bookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      title={bookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
    >
      {bookmarked ? (
        <BookmarkCheck className={`${sizeClasses[size]} fill-current`} />
      ) : (
        <Bookmark className={sizeClasses[size]} />
      )}
      
      {showLabel && (
        <span className="text-sm font-medium pr-1">
          {bookmarked ? 'Salvata' : 'Salva'}
        </span>
      )}
    </button>
  );
};

