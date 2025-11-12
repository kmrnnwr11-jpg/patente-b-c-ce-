import { FC, useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowLeft, Shield } from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { RecaptchaVerifier, auth } from '@/lib/firebase';

export const PhoneLoginPage: FC = () => {
  const navigate = useNavigate();
  const { loginWithPhone, verifyPhoneCode } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+39 ');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Setup reCAPTCHA
  useEffect(() => {
    if (step === 'phone' && recaptchaRef.current && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        });
      } catch (err) {
        console.error('reCAPTCHA setup error:', err);
      }
    }
  }, [step]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validazione numero
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (cleanPhone.length < 10) {
      setError('Numero di telefono non valido');
      setLoading(false);
      return;
    }

    try {
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA non inizializzato');
      }

      const result = await loginWithPhone(cleanPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('Numero di telefono non valido. Usa il formato internazionale (+39...)');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Troppi tentativi. Riprova più tardi.');
      } else {
        setError('Errore invio SMS. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const code = otp.join('');
    if (code.length !== 6) {
      setError('Inserisci il codice completo');
      setLoading(false);
      return;
    }

    try {
      if (!confirmationResult) {
        throw new Error('Nessuna verifica in corso');
      }

      await verifyPhoneCode(confirmationResult, code);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Codice non valido. Riprova.');
      } else if (err.code === 'auth/code-expired') {
        setError('Codice scaduto. Richiedi un nuovo SMS.');
      } else {
        setError('Errore verifica codice. Riprova.');
      }
      // Reset OTP inputs
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Solo numeri
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePhoneChange = (value: string) => {
    // Mantieni sempre il prefisso +39
    if (!value.startsWith('+39')) {
      setPhoneNumber('+39 ');
      return;
    }
    
    // Formatta con spazi ogni 3 cifre
    let cleaned = value.replace(/\s/g, '');
    if (cleaned.length > 3) {
      const prefix = cleaned.slice(0, 3);
      const rest = cleaned.slice(3);
      cleaned = prefix + ' ' + rest.match(/.{1,3}/g)?.join(' ');
    }
    
    setPhoneNumber(cleaned);
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
              onClick={() => step === 'phone' ? navigate('/auth/login') : setStep('phone')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
            >
              <ArrowLeft size={20} />
              <span>Indietro</span>
            </button>
            
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 'phone' ? <Phone size={32} className="text-white" /> : <Shield size={32} className="text-white" />}
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 'phone' ? 'Numero di Telefono' : 'Verifica Codice'}
            </h1>
            <p className="text-white/70">
              {step === 'phone' 
                ? 'Inserisci il tuo numero per ricevere un SMS'
                : `Codice inviato a ${phoneNumber}`
              }
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

          {/* Phone Input Step */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Numero di Telefono
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+39 123 456 7890"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">
                  Usa il formato internazionale (es. +39 per Italia)
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl"
              >
                {loading ? 'Invio SMS...' : 'Invia Codice SMS'}
              </Button>

              {/* reCAPTCHA container */}
              <div ref={recaptchaRef} id="recaptcha-container"></div>
            </form>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-4 text-center">
                  Inserisci il codice a 6 cifre
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.some(d => !d)}
                className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl"
              >
                {loading ? 'Verifica...' : 'Verifica Codice'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-white/70 hover:text-white text-sm transition"
              >
                Non hai ricevuto il codice? Riprova
              </button>
            </form>
          )}

          {/* Alternative Login */}
          {step === 'phone' && (
            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                Preferisci usare email?{' '}
                <Link
                  to="/auth/login"
                  className="text-white font-semibold hover:underline"
                >
                  Accedi con Email
                </Link>
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

// Extend window type for recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

