/**
 * Utility functions per School Dashboard
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format date
export function formatDate(
    date: Date | string | null | undefined,
    options: Intl.DateTimeFormatOptions = {}
): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...options,
    });
}

// Format time
export function formatTime(date: Date | string | null | undefined): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Format datetime
export function formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    return `${formatDate(d)} ${formatTime(d)}`;
}

// Relative time (e.g., "2 ore fa")
export function formatRelativeTime(date: Date | string | null | undefined): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Adesso';
    if (minutes < 60) return `${minutes} min fa`;
    if (hours < 24) return `${hours} ore fa`;
    if (days === 1) return 'Ieri';
    if (days < 7) return `${days} giorni fa`;
    if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
    if (days < 365) return `${Math.floor(days / 30)} mesi fa`;
    return `${Math.floor(days / 365)} anni fa`;
}

// Alias for compatibility
export const formatTimeAgo = formatRelativeTime;

// Days since date
export function daysSince(date: Date | string | null | undefined): number | null {
    if (!date) return null;

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return null;

    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Format currency
export function formatCurrency(
    amount: number | null | undefined,
    currency = 'EUR'
): string {
    if (amount === null || amount === undefined) return '-';

    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency,
    }).format(amount);
}

// Format percentage
export function formatPercent(
    value: number | null | undefined,
    decimals = 0
): string {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(decimals)}%`;
}

// Format number with thousand separators
export function formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('it-IT').format(value);
}

// Get initials from name
export function getInitials(name: string | null | undefined): string {
    if (!name) return '??';

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('');
}

// Truncate text
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

// Capitalize first letter
export function capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Slugify text
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Parse CSV
export function parseCSV(csv: string): {
    headers: string[];
    rows: string[][];
} {
    const lines = csv.trim().split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    );

    return { headers, rows };
}

// Generate CSV from data
export function generateCSV(data: Record<string, any>[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
        headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
}

// Validate email
export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone (Italian format)
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\s|-|\(|\)/g, '');
    const re = /^(\+39)?[0-9]{9,11}$/;
    return re.test(cleaned);
}

// Format phone number
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('39')) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

export function getContrastColor(hex: string): 'black' | 'white' {
    const rgb = hexToRgb(hex);
    if (!rgb) return 'black';

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? 'black' : 'white';
}

// Status helpers
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        active: 'bg-green-100 text-green-700',
        completed: 'bg-blue-100 text-blue-700',
        paused: 'bg-yellow-100 text-yellow-700',
        cancelled: 'bg-red-100 text-red-700',
        failed: 'bg-red-100 text-red-700',
        pending: 'bg-gray-100 text-gray-700',
        trial: 'bg-purple-100 text-purple-700',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        active: 'Attivo',
        completed: 'Completato',
        paused: 'In pausa',
        cancelled: 'Annullato',
        failed: 'Fallito',
        pending: 'In attesa',
        trial: 'Prova',
    };
    return labels[status.toLowerCase()] || status;
}

// Score helpers
export function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
}

export function getScoreBadgeColor(score: number): string {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
}

// Trend color helper
export function getTrendColor(trend: number): string {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
}

// Plan helpers
export function getPlanColor(plan: string): string {
    const colors: Record<string, string> = {
        starter: 'bg-gray-100 text-gray-700',
        pro: 'bg-indigo-100 text-indigo-700',
        business: 'bg-purple-100 text-purple-700',
        enterprise: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    };
    return colors[plan.toLowerCase()] || 'bg-gray-100 text-gray-700';
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textarea);
        return result;
    }
}

// Download file
export function downloadFile(content: string, filename: string, type = 'text/plain'): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Open WhatsApp
export function openWhatsApp(phone: string, message?: string): void {
    const cleaned = phone.replace(/\D/g, '');
    const base = 'https://wa.me/';
    const url = message
        ? `${base}${cleaned}?text=${encodeURIComponent(message)}`
        : `${base}${cleaned}`;
    window.open(url, '_blank');
}

// Open email
export function openEmail(email: string, subject?: string, body?: string): void {
    let url = `mailto:${email}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (params.length) url += `?${params.join('&')}`;
    window.location.href = url;
}
