import { FC } from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  onClick
}) => {
  return (
    <GlassCard 
      className={`
        group hover:scale-105 transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-2xl 
          bg-gradient-to-br ${color}
          flex items-center justify-center
          group-hover:scale-110 group-hover:rotate-3
          transition-all duration-300
          shadow-lg
        `}>
          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

        {trend && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-lg
            ${trend.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
          `}>
            <svg 
              className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-sm font-bold">
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="text-white/70 text-sm mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-white mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-white/60 text-xs">
            {subtitle}
          </p>
        )}
      </div>
    </GlassCard>
  );
};

