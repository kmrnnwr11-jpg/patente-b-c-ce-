import { FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Chrome, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, sendVerificationEmail } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validazione
    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    if (displayName.trim().length < 2) {
      setError('Il nome deve essere di almeno 2 caratteri');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, displayName);
      
      // Invia email di verifica
      try {
        await sendVerificationEmail();
      } catch (verifyErr) {
        console.error('Verification email error:', verifyErr);
        // Non bloccare il flusso se l'invio email fallisce
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email già registrata. Prova ad accedere.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email non valida.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password troppo debole. Usa almeno 6 caratteri.');
      } else {
        setError('Errore durante la registrazione. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google register error:', err);
      setError('Errore registrazione Google. Riprova.');
    } finally {
      setLoading(false);
    }
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
              Registrati
            </h1>
            <p className="text-white/70">
              Crea il tuo account per iniziare
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

          {/* Quick Register Options */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full bg-white text-gray-700 hover:bg-white/90 font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Chrome size={20} />
              Registrati con Google
            </Button>

            <Button
              onClick={() => navigate('/auth/phone-register')}
              disabled={loading}
              className="w-full bg-white/10 text-white hover:bg-white/20 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/30"
            >
              <Phone size={20} />
              Registrati con Telefono
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/50 text-sm">oppure con email</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Mario Rossi"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

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
                  minLength={6}
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
              <p className="text-white/50 text-xs mt-1">Minimo 6 caratteri</p>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Conferma Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl"
            >
              {loading ? 'Registrazione in corso...' : 'Crea Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Hai già un account?{' '}
              <Link
                to="/auth/login"
                className="text-white font-semibold hover:underline"
              >
                Accedi
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="text-white/50 text-xs text-center mt-6">
            Registrandoti accetti i nostri{' '}
            <Link to="/terms" className="underline hover:text-white/70">
              Termini di Servizio
            </Link>{' '}
            e la{' '}
            <Link to="/privacy" className="underline hover:text-white/70">
              Privacy Policy
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

