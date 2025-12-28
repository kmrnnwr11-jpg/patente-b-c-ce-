'use client';

import { cn } from '@/lib/utils';

// Full page loading spinner
export function PageLoader() {
    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                    <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75 text-indigo-600"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
                <p className="text-gray-500">Caricamento...</p>
            </div>
        </div>
    );
}

// Inline spinner
export function Spinner({
    size = 'md',
    className
}: {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <svg
            className={cn('animate-spin text-indigo-600', sizeClasses[size], className)}
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

// Skeleton loaders
export function Skeleton({
    className,
    rounded = 'md',
}: {
    className?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}) {
    const roundedClasses = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    return (
        <div
            className={cn(
                'bg-gray-200 animate-pulse',
                roundedClasses[rounded],
                className
            )}
        />
    );
}

// Card skeleton
export function CardSkeleton() {
    return (
        <div className="card p-5 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12" rounded="lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-20 w-full" />
        </div>
    );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-4 flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="p-4 flex gap-4 border-t border-gray-100">
                    <Skeleton className="w-10 h-10" rounded="full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

// Stats skeleton
export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-5 space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="w-12 h-12" rounded="lg" />
                        <Skeleton className="w-12 h-6" rounded="full" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ))}
        </div>
    );
}

// List skeleton
export function ListSkeleton({ items = 3 }: { items?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="w-10 h-10" rounded="full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="w-20 h-8" rounded="lg" />
                </div>
            ))}
        </div>
    );
}

// Chart skeleton
export function ChartSkeleton() {
    return (
        <div className="card p-5">
            <div className="flex justify-between mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-32" rounded="lg" />
            </div>
            <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between gap-2 p-4">
                    {[30, 50, 70, 45, 80, 60, 75, 55, 85, 40, 65, 70].map((h, i) => (
                        <Skeleton
                            key={i}
                            className="flex-1"
                            style={{ height: `${h}%` }}
                            rounded="sm"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Content loader with message
export function ContentLoader({
    message = 'Caricamento...',
    className,
}: {
    message?: string;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col items-center justify-center p-8', className)}>
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-500">{message}</p>
        </div>
    );
}

// Button loader
export function ButtonLoader({ className }: { className?: string }) {
    return (
        <Spinner size="sm" className={cn('text-current', className)} />
    );
}

// Page section loader
export function SectionLoader({ title }: { title?: string }) {
    return (
        <div className="space-y-4">
            {title && <Skeleton className="h-6 w-48" />}
            <div className="card p-5">
                <ContentLoader />
            </div>
        </div>
    );
}
