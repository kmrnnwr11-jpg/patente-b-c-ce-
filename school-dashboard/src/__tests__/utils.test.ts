import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    daysSince,
    formatCurrency,
    formatPercent,
    formatNumber,
    getInitials,
    truncate,
    capitalize,
    slugify,
    parseCSV,
    generateCSV,
    isValidEmail,
    isValidPhone,
    getStatusColor,
    getStatusLabel,
    getScoreColor,
    getScoreBadgeColor,
    getPlanColor,
} from '../lib/utils';

describe('Date Formatting', () => {
    it('formatDate returns correct format for valid date', () => {
        const date = new Date('2024-01-15');
        expect(formatDate(date)).toBe('15/01/2024');
    });

    it('formatDate returns "-" for null', () => {
        expect(formatDate(null)).toBe('-');
        expect(formatDate(undefined)).toBe('-');
    });

    it('formatTime returns correct format', () => {
        const date = new Date('2024-01-15T14:30:00');
        expect(formatTime(date)).toMatch(/14:30/);
    });

    it('formatDateTime combines date and time', () => {
        const date = new Date('2024-01-15T14:30:00');
        expect(formatDateTime(date)).toContain('15/01/2024');
        expect(formatDateTime(date)).toContain('14:30');
    });

    it('formatRelativeTime returns relative strings', () => {
        const now = new Date();
        expect(formatRelativeTime(now)).toBe('Adesso');

        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 min fa');

        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        expect(formatRelativeTime(twoHoursAgo)).toBe('2 ore fa');

        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        expect(formatRelativeTime(yesterday)).toBe('Ieri');
    });

    it('daysSince calculates correct number of days', () => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        expect(daysSince(sevenDaysAgo)).toBe(7);
        expect(daysSince(null)).toBe(null);
    });
});

describe('Number Formatting', () => {
    it('formatCurrency formats EUR correctly', () => {
        expect(formatCurrency(199)).toContain('199');
        expect(formatCurrency(199)).toContain('€');
    });

    it('formatCurrency returns "-" for null', () => {
        expect(formatCurrency(null)).toBe('-');
        expect(formatCurrency(undefined)).toBe('-');
    });

    it('formatPercent formats percentage', () => {
        expect(formatPercent(85)).toBe('85%');
        expect(formatPercent(85.5, 1)).toBe('85.5%');
    });

    it('formatNumber uses thousand separators', () => {
        expect(formatNumber(1234567)).toContain('1');
        expect(formatNumber(null)).toBe('-');
    });
});

describe('String Utilities', () => {
    it('getInitials extracts first letters', () => {
        expect(getInitials('Marco Bianchi')).toBe('MB');
        expect(getInitials('Laura')).toBe('L');
        expect(getInitials('Anna Maria Rossi')).toBe('AM');
        expect(getInitials(null)).toBe('??');
        expect(getInitials('')).toBe('??');
    });

    it('truncate shortens text', () => {
        expect(truncate('Hello World', 5)).toBe('Hello...');
        expect(truncate('Hi', 10)).toBe('Hi');
    });

    it('capitalize capitalizes first letter', () => {
        expect(capitalize('hello')).toBe('Hello');
        expect(capitalize('WORLD')).toBe('World');
        expect(capitalize('')).toBe('');
    });

    it('slugify creates URL-safe slugs', () => {
        expect(slugify('Hello World')).toBe('hello-world');
        expect(slugify('Città  di  Roma')).toBe('citta-di-roma');
        expect(slugify('Caffè & Tè')).toBe('caffe-te');
    });
});

describe('CSV Utilities', () => {
    it('parseCSV parses comma-separated values', () => {
        const csv = 'name,email,score\nMarco,marco@test.com,85\nLaura,laura@test.com,90';
        const result = parseCSV(csv);

        expect(result.headers).toEqual(['name', 'email', 'score']);
        expect(result.rows).toHaveLength(2);
        expect(result.rows[0]).toEqual(['Marco', 'marco@test.com', '85']);
    });

    it('generateCSV creates valid CSV', () => {
        const data = [
            { name: 'Marco', email: 'marco@test.com', score: 85 },
            { name: 'Laura', email: 'laura@test.com', score: 90 },
        ];
        const csv = generateCSV(data);

        expect(csv).toContain('name,email,score');
        expect(csv).toContain('"Marco"');
        expect(csv).toContain('"85"');
    });

    it('generateCSV returns empty string for empty array', () => {
        expect(generateCSV([])).toBe('');
    });
});

describe('Validation', () => {
    it('isValidEmail validates email addresses', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.it')).toBe(true);
        expect(isValidEmail('invalid')).toBe(false);
        expect(isValidEmail('invalid@')).toBe(false);
        expect(isValidEmail('@domain.com')).toBe(false);
    });

    it('isValidPhone validates Italian phone numbers', () => {
        expect(isValidPhone('+393331234567')).toBe(true);
        expect(isValidPhone('3331234567')).toBe(true);
        expect(isValidPhone('06 1234567')).toBe(true);
        expect(isValidPhone('123')).toBe(false);
    });
});

describe('Status Helpers', () => {
    it('getStatusColor returns correct Tailwind classes', () => {
        expect(getStatusColor('active')).toContain('green');
        expect(getStatusColor('completed')).toContain('blue');
        expect(getStatusColor('paused')).toContain('yellow');
        expect(getStatusColor('cancelled')).toContain('red');
        expect(getStatusColor('unknown')).toContain('gray');
    });

    it('getStatusLabel returns Italian translation', () => {
        expect(getStatusLabel('active')).toBe('Attivo');
        expect(getStatusLabel('completed')).toBe('Completato');
        expect(getStatusLabel('unknown')).toBe('unknown');
    });
});

describe('Score Helpers', () => {
    it('getScoreColor returns correct color for score ranges', () => {
        expect(getScoreColor(90)).toContain('green');
        expect(getScoreColor(70)).toContain('yellow');
        expect(getScoreColor(50)).toContain('red');
    });

    it('getScoreBadgeColor returns badge classes', () => {
        expect(getScoreBadgeColor(85)).toContain('green');
        expect(getScoreBadgeColor(65)).toContain('yellow');
        expect(getScoreBadgeColor(45)).toContain('red');
    });
});

describe('Plan Helpers', () => {
    it('getPlanColor returns correct colors for plans', () => {
        expect(getPlanColor('starter')).toContain('gray');
        expect(getPlanColor('pro')).toContain('indigo');
        expect(getPlanColor('business')).toContain('purple');
        expect(getPlanColor('enterprise')).toContain('gradient');
    });
});
