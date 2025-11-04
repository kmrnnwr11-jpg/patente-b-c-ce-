import { FC, useEffect, useState, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number; // in secondi (es. 1200 per 20 minuti)
  onTimeUp: () => void;
  isPaused?: boolean;
  warningThreshold?: number; // secondi per warning (default 300 = 5 min)
  variant?: 'floating' | 'inline';
  className?: string;
}

export const Timer: FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  isPaused = false,
  warningThreshold = 300,
  variant = 'floating',
  className
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  // Formatta il tempo in MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calcola la percentuale di tempo rimanente
  const percentage = (timeLeft / duration) * 100;

  useEffect(() => {
    if (isPaused) return;

    // Check se è tempo di warning
    if (timeLeft <= warningThreshold && !isWarning) {
      setIsWarning(true);
    }

    // Check se il tempo è scaduto
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp, warningThreshold, isWarning]);

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-1.5 rounded-full border shadow-md backdrop-blur-lg transition-colors',
          isWarning
            ? 'bg-red-500/20 border-red-500/40 text-red-200'
            : 'bg-white/10 border-white/20 text-white',
          className
        )}
      >
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isWarning ? 'bg-red-500/30' : 'bg-blue-500/30'
          )}
        >
          {isWarning ? (
            <AlertTriangle className="w-4 h-4 text-red-300" strokeWidth={2.5} />
          ) : (
            <Clock className="w-4 h-4 text-blue-200" strokeWidth={2.5} />
          )}
        </div>

        <div className="flex flex-col min-w-[60px]">
          <span
            className={cn(
              'text-base font-bold tabular-nums leading-none',
              isWarning ? 'text-red-100' : 'text-white'
            )}
          >
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-white/60 mt-0.5">
            Timer
          </span>
        </div>

        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              isWarning
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed top-2 right-2 z-50 backdrop-blur-xl rounded-xl p-2.5 border transition-all duration-300 shadow-lg',
        isWarning ? 'bg-red-500/20 border-red-500/50 animate-pulse' : 'bg-white/10 border-white/20',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* Icon */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isWarning 
            ? 'bg-red-500/30' 
            : 'bg-blue-500/30'
          }
        `}>
          {isWarning ? (
            <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={2.5} />
          ) : (
            <Clock className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
          )}
        </div>

        {/* Time Display */}
        <div className="flex flex-col">
          <p className={`
            text-lg font-bold tabular-nums leading-none
            ${isWarning ? 'text-red-400' : 'text-white'}
          `}>
            {formatTime(timeLeft)}
          </p>
          {isWarning && (
            <p className="text-red-400 text-[10px] mt-0.5 leading-none">
              ⚠️ Ultimi {Math.floor(warningThreshold / 60)} min
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar - più sottile */}
      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`
            h-full rounded-full transition-all duration-1000
            ${isWarning 
              ? 'bg-gradient-to-r from-red-500 to-orange-500' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Paused Indicator */}
      {isPaused && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <p className="text-white text-sm font-bold">⏸ PAUSA</p>
        </div>
      )}
    </div>
  );
};

