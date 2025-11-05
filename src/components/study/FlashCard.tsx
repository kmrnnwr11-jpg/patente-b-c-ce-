import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';

interface FlashCardProps {
  front: string;
  back: string;
  image?: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  showActions?: boolean;
}

export const FlashCard: FC<FlashCardProps> = ({
  front,
  back,
  image,
  onCorrect,
  onIncorrect,
  showActions = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = () => {
    onCorrect();
    setIsFlipped(false);
  };

  const handleIncorrect = () => {
    onIncorrect();
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <motion.div
        className="relative w-full h-96 cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Fronte */}
          <div
            className="absolute w-full h-full bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-8 flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
            }}
          >
            {image && (
              <div className="w-40 h-40 mb-6 flex items-center justify-center">
                <img
                  src={image}
                  alt={front}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              {front}
            </h2>
            <p className="text-gray-500 text-sm">Clicca per girare</p>
          </div>

          {/* Retro */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl border-2 border-blue-300 p-8 flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-white text-lg leading-relaxed text-center">
              {back}
            </p>
            <p className="text-white/70 text-sm mt-6">Clicca per girare</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Actions */}
      {showActions && isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mt-8 justify-center"
        >
          <button
            onClick={handleIncorrect}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <X className="w-5 h-5" />
            Non lo sapevo
          </button>
          <button
            onClick={handleCorrect}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Check className="w-5 h-5" />
            Lo sapevo!
          </button>
        </motion.div>
      )}

      {/* Hint per flip */}
      {!isFlipped && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Clicca sulla carta per vedere la risposta</span>
          </div>
        </div>
      )}
    </div>
  );
};

