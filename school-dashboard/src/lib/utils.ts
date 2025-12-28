import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format date
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd/MM/yyyy', { locale: it });
}

// Format date with time
export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd/MM/yyyy HH:mm', { locale: it });
}

// Format relative time
export function formatTimeAgo(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true, locale: it });
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency,
    }).format(amount);
}

// Format percentage
export function formatPercent(value: number): string {
    return `${Math.round(value)}%`;
}

// Generate school code
export function generateSchoolCode(name: string): string {
    const prefix = name
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 4);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
}

// Generate student invite code
export function generateInviteCode(): string {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `STU-${random}`;
}

// Get initials
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Days since date
export function daysSince(date: string | Date): number {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Get plan limits
export function getPlanLimits(plan: string) {
    const limits: Record<string, { students: number; instructors: number }> = {
        starter: { students: 30, instructors: 1 },
        pro: { students: 100, instructors: 5 },
        enterprise: { students: -1, instructors: -1 },
    };
    return limits[plan] || limits.starter;
}

// Get plan price
export function getPlanPrice(plan: string, cycle: 'monthly' | 'yearly'): number {
    const prices: Record<string, { monthly: number; yearly: number }> = {
        starter: { monthly: 49, yearly: 490 },
        pro: { monthly: 99, yearly: 990 },
        enterprise: { monthly: 199, yearly: 1990 },
    };
    return prices[plan]?.[cycle] || 0;
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

// Share via WhatsApp
export function shareWhatsApp(message: string, phone?: string): void {
    const encoded = encodeURIComponent(message);
    const url = phone
        ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
}

// Get trend color
export function getTrendColor(trend: 'improving' | 'stable' | 'declining'): string {
    const colors: Record<string, string> = {
        improving: 'text-green-600',
        stable: 'text-yellow-600',
        declining: 'text-red-600',
    };
    return colors[trend] || 'text-gray-600';
}

// Get status badge color
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        paused: 'bg-yellow-100 text-yellow-800',
        dropped: 'bg-red-100 text-red-800',
        trial: 'bg-purple-100 text-purple-800',
        expired: 'bg-gray-100 text-gray-800',
        past_due: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}
