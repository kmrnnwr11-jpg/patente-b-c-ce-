import { cn } from '@/lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full font-medium',
                size === 'sm' && 'px-2 py-0.5 text-xs',
                size === 'md' && 'px-3 py-1 text-sm',
                variant === 'default' && 'bg-gray-100 text-gray-700',
                variant === 'success' && 'bg-green-100 text-green-700',
                variant === 'warning' && 'bg-yellow-100 text-yellow-700',
                variant === 'danger' && 'bg-red-100 text-red-700',
                variant === 'info' && 'bg-blue-100 text-blue-700'
            )}
        >
            {children}
        </span>
    );
}

export function SubscriptionBadge({ status, plan }: { status: string; plan?: string }) {
    const getVariant = () => {
        switch (status) {
            case 'active':
                return 'success';
            case 'trial':
                return 'info';
            case 'expired':
            case 'cancelled':
                return 'warning';
            case 'free':
            default:
                return 'default';
        }
    };

    const getLabel = () => {
        switch (status) {
            case 'active':
                return plan ? `Premium ${plan}` : 'Premium';
            case 'trial':
                return 'Trial';
            case 'expired':
                return 'Scaduto';
            case 'cancelled':
                return 'Cancellato';
            case 'free':
            default:
                return 'Free';
        }
    };

    return <Badge variant={getVariant()}>{getLabel()}</Badge>;
}
