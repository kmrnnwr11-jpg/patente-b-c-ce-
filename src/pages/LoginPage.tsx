import { FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Phone, Chrome, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

type LoginMethod = 'email' | 'phone' | 'google';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  
  const [method, setMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Account non trovato. Registrati prima.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Password errata.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email non valida.');
      } else {
        setError('Errore durante il login. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Errore login Google. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    // Redirect to phone verification page
    navigate('/auth/phone-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
            >
              <ArrowLeft size={20} />
              <span>Torna alla Home</span>
            </button>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Accedi
            </h1>
            <p className="text-white/70">
              Benvenuto! Scegli come accedere
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Methods Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                method === 'email'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Mail size={18} className="inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                method === 'phone'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Phone size={18} className="inline mr-2" />
              Telefono
            </button>
          </div>

          {/* Email Login Form */}
          {method === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tua@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Password dimenticata?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl"
              >
                {loading ? 'Accesso in corso...' : 'Accedi con Email'}
              </Button>
            </form>
          )}

          {/* Phone Login */}
          {method === 'phone' && (
            <div className="space-y-4">
              <p className="text-white/70 text-sm text-center mb-4">
                Riceverai un codice SMS per verificare il tuo numero
              </p>
              <Button
                onClick={handlePhoneLogin}
                disabled={loading}
                className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl"
              >
                <Phone size={20} className="inline mr-2" />
                Continua con Telefono
              </Button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/50 text-sm">oppure</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-gray-700 hover:bg-white/90 font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Chrome size={20} />
            Accedi con Google
          </Button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Non hai un account?{' '}
              <Link
                to="/auth/register"
                className="text-white font-semibold hover:underline"
              >
                Registrati
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

