import { FC, useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import type { Achievement } from '@/types/gamification';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animazione entrata
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto-close dopo 5 secondi
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  const rarityBorder = {
    common: 'border-gray-500/50',
    rare: 'border-blue-500/50',
    epic: 'border-purple-500/50',
    legendary: 'border-yellow-500/50'
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`
        bg-gradient-to-br ${rarityColors[achievement.rarity]}
        backdrop-blur-xl rounded-2xl p-4 shadow-2xl border-2 ${rarityBorder[achievement.rarity]}
        min-w-[320px] max-w-md animate-bounce-in
      `}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-4xl animate-pulse">
            {achievement.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <h4 className="font-bold text-white text-lg">
                  Achievement Sbloccato!
                </h4>
              </div>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <h5 className="font-semibold text-white mb-1">
              {achievement.name}
            </h5>
            <p className="text-white/90 text-sm mb-2">
              {achievement.description}
            </p>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-medium">
                {achievement.rarity.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 bg-yellow-500/30 rounded-full text-xs text-yellow-200 font-bold">
                +{achievement.xpReward} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

