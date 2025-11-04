import { useEffect, useState } from 'react';
import { Clock, AlertCircle, Pause, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvancedTimerProps {
  duration: number; // in secondi (1200 per 20 minuti)
  onTimeUp: () => void;
  autoStart?: boolean;
}

export const AdvancedTimer = ({
  duration,
  onTimeUp,
  autoStart = true
}: AdvancedTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / duration) * 100;

  // Warning negli ultimi 5 minuti
  const isWarning = timeLeft <= 300 && timeLeft > 60;
  const isCritical = timeLeft <= 60;

  // Suono di avviso a 5 minuti
  useEffect(() => {
    if (isWarning && !hasWarned && !isPaused) {
      setHasWarned(true);
      playWarningSound();
    }
  }, [isWarning, hasWarned, isPaused]);

  const playWarningSound = () => {
    try {
      // Suono di avviso semplice con Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Warning sound error:', error);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  const circleRadius = 42;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleStrokeDashoffset = circleCircumference - (circleCircumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center">
      {/* Circular Timer - Compatto */}
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90 w-24 h-24">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="48"
            cy="48"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleStrokeDashoffset}
            strokeLinecap="round"
            className={`transition-colors duration-500 ${
              isCritical
                ? 'text-red-500'
                : isWarning
                ? 'text-orange-500'
                : 'text-blue-500'
            }`}
            animate={{
              strokeDashoffset: circleStrokeDashoffset,
              scale: isCritical ? [1, 1.05, 1] : 1
            }}
            transition={{
              strokeDashoffset: { duration: 1, ease: 'linear' },
              scale: { duration: 0.5, repeat: isCritical ? Infinity : 0 }
            }}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock
            className={`w-4 h-4 mb-0.5 transition-colors ${
              isCritical
                ? 'text-red-500'
                : isWarning
                ? 'text-orange-500'
                : 'text-gray-600'
            }`}
          />
          <div
            className={`text-lg font-bold transition-colors ${
              isCritical
                ? 'text-red-500'
                : isWarning
                ? 'text-orange-500'
                : 'text-gray-800'
            }`}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {isWarning && !isPaused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg ${
            isCritical
              ? 'bg-red-100 text-red-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isCritical ? 'ULTIMI 60 SECONDI!' : 'Meno di 5 minuti'}
          </span>
        </motion.div>
      )}

      {/* Pause/Resume Button */}
      <button
        onClick={togglePause}
        className={`mt-3 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
          isPaused
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        {isPaused ? (
          <>
            <Play className="w-4 h-4" />
            <span>Riprendi</span>
          </>
        ) : (
          <>
            <Pause className="w-4 h-4" />
            <span>Pausa</span>
          </>
        )}
      </button>

      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-gray-500"
        >
          Timer in pausa
        </motion.div>
      )}
    </div>
  );
};

