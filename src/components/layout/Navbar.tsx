import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';

export const Navbar: FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-primary rounded-lg">
              <Car size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Patente B 2025</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost">Accedi</Button>
            <Button size="default">Registrati</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

