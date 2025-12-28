import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency,
    }).format(amount);
}

export function daysSince(date: string | Date): number {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function openWhatsApp(phone: string, message?: string): void {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = message
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${cleanPhone}`;
    window.open(url, '_blank');
}

export function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
}
