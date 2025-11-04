import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';

export const LoginForm: FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Compila tutti i campi');
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('Utente non trovato');
      } else if (err.code === 'auth/wrong-password') {
        setError('Password errata');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email non valida');
      } else {
        setError('Errore durante il login. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Errore durante il login con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="w-full max-w-md mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Torna alla Home</span>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Bentornato!
        </h2>
        <p className="text-white/70">
          Accedi al tuo account per continuare
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-white font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tua@email.com"
              className="
                w-full pl-12 pr-4 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white placeholder:text-white/50
                focus:outline-none focus:ring-2 focus:ring-yellow-400
                transition-all
              "
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-white font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full pl-12 pr-12 py-3 rounded-xl
                bg-white/10 border border-white/20
                text-white placeholder:text-white/50
                focus:outline-none focus:ring-2 focus:ring-yellow-400
                transition-all
              "
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/reset-password')}
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Password dimenticata?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-4 rounded-xl font-bold text-lg
            bg-gradient-to-r from-yellow-400 to-orange-500
            text-gray-900
            hover:scale-105 hover:shadow-2xl
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          "
        >
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-white/20"></div>
        <span className="text-white/50 text-sm">oppure</span>
        <div className="flex-1 h-px bg-white/20"></div>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="
          w-full py-4 rounded-xl font-medium
          bg-white/10 border border-white/20
          text-white
          hover:bg-white/20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300
          flex items-center justify-center gap-3
        "
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continua con Google
      </button>

      {/* Sign Up Link */}
      <div className="text-center mt-6">
        <p className="text-white/70">
          Non hai un account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            Registrati
          </button>
        </p>
      </div>
    </GlassCard>
  );
};

