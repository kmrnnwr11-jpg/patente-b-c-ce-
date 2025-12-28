'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// Fade in animation
export function FadeIn({
    children,
    delay = 0,
    duration = 300,
    className,
}: {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={cn(
                'transition-all',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                className
            )}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {children}
        </div>
    );
}

// Slide in animation
export function SlideIn({
    children,
    direction = 'left',
    delay = 0,
    duration = 300,
    className,
}: {
    children: ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    delay?: number;
    duration?: number;
    className?: string;
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const transforms = {
        left: 'translate-x-[-20px]',
        right: 'translate-x-[20px]',
        up: 'translate-y-[-20px]',
        down: 'translate-y-[20px]',
    };

    return (
        <div
            className={cn(
                'transition-all',
                isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${transforms[direction]}`,
                className
            )}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {children}
        </div>
    );
}

// Scale animation
export function ScaleIn({
    children,
    delay = 0,
    duration = 300,
    className,
}: {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={cn(
                'transition-all',
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
                className
            )}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {children}
        </div>
    );
}

// Stagger children animation
export function StaggerChildren({
    children,
    staggerDelay = 100,
    initialDelay = 0,
    className,
}: {
    children: ReactNode[];
    staggerDelay?: number;
    initialDelay?: number;
    className?: string;
}) {
    return (
        <div className={className}>
            {children.map((child, index) => (
                <FadeIn key={index} delay={initialDelay + index * staggerDelay}>
                    {child}
                </FadeIn>
            ))}
        </div>
    );
}

// Intersection observer animation
export function AnimateOnScroll({
    children,
    className,
    threshold = 0.1,
    rootMargin = '0px',
}: {
    children: ReactNode;
    className?: string;
    threshold?: number;
    rootMargin?: string;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-500',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                className
            )}
        >
            {children}
        </div>
    );
}

// Number counter animation
export function CountUp({
    end,
    start = 0,
    duration = 1000,
    suffix = '',
    prefix = '',
    className,
}: {
    end: number;
    start?: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}) {
    const [count, setCount] = useState(start);
    const countRef = useRef(start);

    useEffect(() => {
        const startTime = Date.now();
        const diff = end - start;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            countRef.current = start + diff * easeOut;
            setCount(Math.round(countRef.current));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, start, duration]);

    return (
        <span className={className}>
            {prefix}{count.toLocaleString('it-IT')}{suffix}
        </span>
    );
}

// Progress bar animation
export function AnimatedProgress({
    value,
    max = 100,
    className,
    barClassName,
    showLabel = true,
    duration = 500,
}: {
    value: number;
    max?: number;
    className?: string;
    barClassName?: string;
    showLabel?: boolean;
    duration?: number;
}) {
    const [width, setWidth] = useState(0);
    const percent = Math.min((value / max) * 100, 100);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(percent), 100);
        return () => clearTimeout(timer);
    }, [percent]);

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{value}</span>
                    <span className="text-gray-400">/ {max}</span>
                </div>
            )}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all ease-out',
                        barClassName || 'bg-indigo-600'
                    )}
                    style={{
                        width: `${width}%`,
                        transitionDuration: `${duration}ms`,
                    }}
                />
            </div>
        </div>
    );
}

// Pulse animation for notifications
export function Pulse({
    children,
    isActive = true,
    className,
}: {
    children: ReactNode;
    isActive?: boolean;
    className?: string;
}) {
    return (
        <div className={cn('relative', className)}>
            {children}
            {isActive && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
            )}
        </div>
    );
}

// Shimmer effect
export function Shimmer({
    className,
}: {
    className?: string;
}) {
    return (
        <div
            className={cn(
                'relative overflow-hidden bg-gray-200 rounded',
                className
            )}
        >
            <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                }}
            />
        </div>
    );
}

// Success checkmark animation
export function SuccessCheck({
    size = 64,
    className,
}: {
    size?: number;
    className?: string;
}) {
    return (
        <div
            className={cn('relative', className)}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 52 52"
                className="w-full h-full"
            >
                <circle
                    className="stroke-green-500 fill-none animate-[circle_0.6s_ease-in-out]"
                    cx="26"
                    cy="26"
                    r="24"
                    strokeWidth="3"
                    strokeDasharray="166"
                    strokeDashoffset="166"
                    style={{
                        animation: 'circle 0.6s ease-in-out forwards',
                    }}
                />
                <path
                    className="stroke-green-500 fill-none"
                    d="M14 27l7 7 16-16"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="48"
                    strokeDashoffset="48"
                    style={{
                        animation: 'check 0.3s ease-in-out 0.6s forwards',
                    }}
                />
            </svg>
            <style>{`
        @keyframes circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes check {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
        </div>
    );
}
