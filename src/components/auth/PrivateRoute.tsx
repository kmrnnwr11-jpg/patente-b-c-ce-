import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

