import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SchoolProvider, useSchool } from '../contexts/SchoolContext';

// Mock Firebase
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((auth, callback) => {
        callback(null);
        return () => { };
    }),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(),
    getDoc: vi.fn(),
}));

vi.mock('@/lib/firebase', () => ({
    auth: {},
    db: {},
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
    })),
}));

// Test component that uses the context
function TestComponent() {
    const { isAuthenticated, isLoading, school } = useSchool();

    return (
        <div>
            <span data-testid="loading">{isLoading ? 'loading' : 'loaded'}</span>
            <span data-testid="auth">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</span>
            <span data-testid="school">{school?.name || 'no-school'}</span>
        </div>
    );
}

describe('SchoolContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('provides default values when no user is logged in', async () => {
        render(
            <SchoolProvider>
                <TestComponent />
            </SchoolProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
        });

        expect(screen.getByTestId('auth')).toHaveTextContent('not-authenticated');
        expect(screen.getByTestId('school')).toHaveTextContent('no-school');
    });

    it('throws error when useSchool is used outside provider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useSchool must be used within a SchoolProvider');

        consoleError.mockRestore();
    });
});
