import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export const EmailVerificationBanner: FC = () => {
  const { currentUser, sendVerificationEmail } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Non mostrare se:
  // - Email già verificata
  // - Utente non ha email (Google/Phone)
  // - Banner dismissato
  if (!currentUser || currentUser.emailVerified || !currentUser.email || dismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setLoading(true);
    setMessage('');

    try {
      await sendVerificationEmail();
      setMessage('✅ Email di verifica inviata! Controlla la tua casella.');
    } catch (err: any) {
      console.error('Resend verification error:', err);
      if (err.code === 'auth/too-many-requests') {
        setMessage('⚠️ Troppi tentativi. Riprova tra qualche minuto.');
      } else {
        setMessage('❌ Errore invio email. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-500/30 rounded-full flex items-center justify-center">
              <Mail size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Verifica la tua Email
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Abbiamo inviato un'email di verifica a <strong>{currentUser.email}</strong>.
              Clicca sul link nell'email per attivare tutte le funzionalità.
            </p>

            {message && (
              <p className="text-sm mb-3 text-foreground">
                {message}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleResendEmail}
                disabled={loading}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Invio...
                  </>
                ) : (
                  <>
                    <Mail size={16} className="mr-2" />
                    Reinvia Email
                  </>
                )}
              </Button>

              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
              >
                <RefreshCw size={16} className="mr-2" />
                Ho Verificato
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

