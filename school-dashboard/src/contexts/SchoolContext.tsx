'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { DrivingSchool, SchoolInstructor } from '@/types';

interface SchoolContextType {
    // Auth
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isFirebaseConfigured: boolean;

    // School data
    school: DrivingSchool | null;
    instructor: SchoolInstructor | null;
    schoolId: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshSchool: () => Promise<void>;

    // Permissions
    hasPermission: (permission: keyof SchoolInstructor['permissions']) => boolean;
    isOwner: boolean;
    isAdmin: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Mock data for demo mode (when Firebase is not configured)
const MOCK_SCHOOL: DrivingSchool = {
    id: 'demo-school',
    name: 'Autoscuola Demo',
    email: 'demo@autoscuola.it',
    phone: '+39 02 1234567',
    address: 'Via Roma 123',
    city: 'Milano',
    province: 'MI',
    postalCode: '20121',
    plan: 'pro',
    planStatus: 'active',
    maxStudents: 50,
    maxInstructors: 3,
    primaryColor: '#4F46E5',
    schoolCode: 'DEMO-SCHOOL-123',
    isActive: true,
    createdAt: new Date().toISOString() as any,
    updatedAt: new Date().toISOString() as any,
};

const MOCK_INSTRUCTOR: SchoolInstructor = {
    id: 'demo-instructor',
    userId: 'demo-user',
    name: 'Mario Rossi',
    email: 'mario@autoscuola.it',
    role: 'owner',
    permissions: {
        manageStudents: true,
        sendMessages: true,
        viewReports: true,
        manageInstructors: true,
        manageBilling: true,
        manageSettings: true,
    },
    isActive: true,
    createdAt: new Date().toISOString() as any,
};

export function SchoolProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [school, setSchool] = useState<DrivingSchool | null>(null);
    const [instructor, setInstructor] = useState<SchoolInstructor | null>(null);
    const [schoolId, setSchoolId] = useState<string | null>(null);

    // Load school data
    const loadSchoolData = useCallback(async (userId: string) => {
        if (!db) return;

        try {
            // Get user document to find schoolId
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (!userDoc.exists()) {
                console.error('User document not found');
                return;
            }

            const userData = userDoc.data();
            const userSchoolId = userData.schoolId;

            if (!userSchoolId) {
                console.error('User is not associated with a school');
                return;
            }

            setSchoolId(userSchoolId);

            // Get school document
            const schoolDoc = await getDoc(doc(db, 'driving_schools', userSchoolId));
            if (!schoolDoc.exists()) {
                console.error('School not found');
                return;
            }

            setSchool({
                id: schoolDoc.id,
                ...schoolDoc.data(),
            } as DrivingSchool);

            // Get instructor document
            const instructorsQuery = await getDoc(
                doc(db, 'driving_schools', userSchoolId, 'school_instructors', userId)
            );

            if (instructorsQuery.exists()) {
                setInstructor({
                    id: instructorsQuery.id,
                    ...instructorsQuery.data(),
                } as SchoolInstructor);
            }

        } catch (error) {
            console.error('Error loading school data:', error);
        }
    }, []);

    // Auth state listener or demo mode
    useEffect(() => {
        if (!isFirebaseConfigured || !auth) {
            // Demo mode - use mock data
            console.log('🎭 Demo mode - using mock data');
            setSchool(MOCK_SCHOOL);
            setInstructor(MOCK_INSTRUCTOR);
            setSchoolId('demo-school');
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                await loadSchoolData(firebaseUser.uid);
            } else {
                setSchool(null);
                setInstructor(null);
                setSchoolId(null);
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [loadSchoolData]);

    // Login
    const login = async (email: string, password: string) => {
        if (!auth) {
            throw new Error('Firebase non configurato');
        }

        setIsLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await loadSchoolData(result.user.uid);
            router.push('/');
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(getAuthErrorMessage(error.code));
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        if (!auth) return;

        try {
            await signOut(auth);
            setSchool(null);
            setInstructor(null);
            setSchoolId(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Refresh school data
    const refreshSchool = async () => {
        if (user) {
            await loadSchoolData(user.uid);
        }
    };

    // Check permission
    const hasPermission = (permission: keyof SchoolInstructor['permissions']): boolean => {
        if (!instructor) return false;
        if (instructor.role === 'owner') return true;
        return instructor.permissions[permission] ?? false;
    };

    const value: SchoolContextType = {
        user,
        isAuthenticated: !!user || !isFirebaseConfigured,
        isLoading,
        isFirebaseConfigured,
        school,
        instructor,
        schoolId,
        login,
        logout,
        refreshSchool,
        hasPermission,
        isOwner: instructor?.role === 'owner',
        isAdmin: instructor?.role === 'admin' || instructor?.role === 'owner',
    };

    return (
        <SchoolContext.Provider value={value}>
            {children}
        </SchoolContext.Provider>
    );
}

export function useSchool() {
    const context = useContext(SchoolContext);
    if (context === undefined) {
        throw new Error('useSchool must be used within a SchoolProvider');
    }
    return context;
}

// Helper: Auth error messages
function getAuthErrorMessage(code: string): string {
    const messages: Record<string, string> = {
        'auth/invalid-email': 'Email non valida',
        'auth/user-disabled': 'Account disabilitato',
        'auth/user-not-found': 'Utente non trovato',
        'auth/wrong-password': 'Password errata',
        'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
        'auth/network-request-failed': 'Errore di rete. Verifica la connessione.',
    };
    return messages[code] || 'Errore di autenticazione';
}
