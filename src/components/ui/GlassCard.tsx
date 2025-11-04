import { FC, ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong';
  style?: CSSProperties;
  onClick?: () => void;
}

export const GlassCard: FC<GlassCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  style,
  onClick
}) => {
  return (
    <div
      className={cn(
        variant === 'strong' ? 'glass-card-strong' : 'glass-card',
        'p-6',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

