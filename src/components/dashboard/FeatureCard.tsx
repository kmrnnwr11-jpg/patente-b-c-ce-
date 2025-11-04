import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  color: string;
  onClick: () => void;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  color,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${color}
        backdrop-blur-md rounded-3xl p-6
        border border-white/20
        flex flex-col items-center justify-center gap-3
        min-h-[140px]
        hover:scale-105 hover:brightness-110
        active:scale-95
        transition-all duration-300
        group
      `}
    >
      <Icon 
        className="w-12 h-12 text-green-200 group-hover:scale-110 transition-transform" 
        strokeWidth={1.5}
      />
      <span className="text-white text-center font-medium text-sm leading-tight">
        {title}
      </span>
    </button>
  );
};

