import { FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from './Button';

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full"
    >
      {theme === 'light' ? (
        <Moon size={20} className="text-foreground" />
      ) : (
        <Sun size={20} className="text-foreground" />
      )}
    </Button>
  );
};

