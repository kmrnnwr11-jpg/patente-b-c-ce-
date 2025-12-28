'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import {
    SchoolStudent,
    SchoolDashboardStats,
    PlanUsage,
    SchoolMessage,
    StudentActivity,
} from '@/types';

// Base URL for API calls
const API_BASE = '/api/schools';

// Generic fetch hook
function useFetch<T>(fetcher: () => Promise<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetcher();
            setData(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, deps);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, isLoading, error, refetch };
}

// Hook: Dashboard stats
export function useDashboard() {
    const { schoolId, user } = useSchool();

    const fetcher = async () => {
        if (!schoolId || !user) return null;

        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/${schoolId}/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load dashboard');
        const data = await res.json();
        return data;
    };

    return useFetch(fetcher, [schoolId, user]);
}

// Hook: Students list
interface UseStudentsOptions {
    status?: string;
    instructor?: string;
    readyForExam?: boolean | null;
    search?: string;
    page?: number;
    limit?: number;
}

export function useStudents(options: UseStudentsOptions = {}) {
    const { schoolId, user } = useSchool();
    const [students, setStudents] = useState<SchoolStudent[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = useCallback(async () => {
        if (!schoolId || !user) return;

        setIsLoading(true);
        setError(null);

        try {
            const token = await user.getIdToken();
            const params = new URLSearchParams();

            if (options.status) params.set('status', options.status);
            if (options.instructor) params.set('instructor', options.instructor);
            if (options.readyForExam !== null && options.readyForExam !== undefined) {
                params.set('ready', String(options.readyForExam));
            }
            if (options.search) params.set('search', options.search);
            if (options.page) params.set('page', String(options.page));
            if (options.limit) params.set('limit', String(options.limit));

            const res = await fetch(`${API_BASE}/${schoolId}/students?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to load students');

            const data = await res.json();
            setStudents(data.students || []);
            setTotal(data.total || 0);

        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, [schoolId, user, JSON.stringify(options)]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return { students, total, isLoading, error, refetch: fetchStudents };
}

// Hook: Single student
export function useStudent(studentId: string | null) {
    const { schoolId, user } = useSchool();

    const fetcher = async () => {
        if (!schoolId || !user || !studentId) return null;

        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/${schoolId}/students/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Student not found');
        const data = await res.json();
        return data.student as SchoolStudent;
    };

    return useFetch(fetcher, [schoolId, user, studentId]);
}

// Hook: Messages
export function useMessages(page = 1, limit = 20) {
    const { schoolId, user } = useSchool();

    const fetcher = async () => {
        if (!schoolId || !user) return { messages: [], total: 0 };

        const token = await user.getIdToken();
        const res = await fetch(
            `${API_BASE}/${schoolId}/messages?page=${page}&limit=${limit}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error('Failed to load messages');
        return await res.json();
    };

    return useFetch(fetcher, [schoolId, user, page, limit]);
}

// Hook: Instructors
export function useInstructors() {
    const { schoolId, user } = useSchool();

    const fetcher = async () => {
        if (!schoolId || !user) return [];

        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/${schoolId}/instructors`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load instructors');
        const data = await res.json();
        return data.instructors || [];
    };

    return useFetch(fetcher, [schoolId, user]);
}

// Hook: Reports/Analytics
interface UseReportsOptions {
    period?: '7d' | '30d' | '90d' | 'all';
    type?: 'overview' | 'students' | 'topics';
}

export function useReports(options: UseReportsOptions = {}) {
    const { schoolId, user } = useSchool();
    const { period = '30d', type = 'overview' } = options;

    const fetcher = async () => {
        if (!schoolId || !user) return null;

        const token = await user.getIdToken();
        const res = await fetch(
            `${API_BASE}/${schoolId}/reports/${type}?period=${period}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error('Failed to load reports');
        return await res.json();
    };

    return useFetch(fetcher, [schoolId, user, period, type]);
}

// Hook: Subscription & Billing
export function useSubscription() {
    const { schoolId, user } = useSchool();

    const fetcher = async () => {
        if (!schoolId || !user) return null;

        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/${schoolId}/subscription`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load subscription');
        return await res.json();
    };

    return useFetch(fetcher, [schoolId, user]);
}

// Hook: Invoices
export function useInvoices() {
    const { schoolId, user } = useSchool();

    const fetcher = async () => {
        if (!schoolId || !user) return [];

        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/${schoolId}/invoices`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load invoices');
        const data = await res.json();
        return data.invoices || [];
    };

    return useFetch(fetcher, [schoolId, user]);
}

// Mutations
export function useStudentMutations() {
    const { schoolId, user } = useSchool();
    const [isLoading, setIsLoading] = useState(false);

    const addStudent = async (data: {
        name: string;
        email?: string;
        phone?: string;
        assignedInstructorId?: string;
        expectedExamDate?: string;
        sendInvite?: boolean;
    }) => {
        if (!schoolId || !user) throw new Error('Not authenticated');

        setIsLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE}/${schoolId}/students`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to add student');
            }

            return await res.json();
        } finally {
            setIsLoading(false);
        }
    };

    const updateStudent = async (studentId: string, data: Partial<SchoolStudent>) => {
        if (!schoolId || !user) throw new Error('Not authenticated');

        setIsLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE}/${schoolId}/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to update student');
            return await res.json();
        } finally {
            setIsLoading(false);
        }
    };

    const deleteStudent = async (studentId: string) => {
        if (!schoolId || !user) throw new Error('Not authenticated');

        setIsLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE}/${schoolId}/students/${studentId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to delete student');
            return true;
        } finally {
            setIsLoading(false);
        }
    };

    const markReady = async (studentId: string, isReady: boolean) => {
        return updateStudent(studentId, { isReadyForExam: isReady });
    };

    return { addStudent, updateStudent, deleteStudent, markReady, isLoading };
}

// Message mutations
export function useMessageMutations() {
    const { schoolId, user } = useSchool();
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (data: {
        recipientType: 'student' | 'all_students' | 'group';
        recipientId?: string;
        subject?: string;
        message: string;
        messageType?: 'info' | 'reminder' | 'alert' | 'congratulation';
    }) => {
        if (!schoolId || !user) throw new Error('Not authenticated');

        setIsLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE}/${schoolId}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to send message');
            return await res.json();
        } finally {
            setIsLoading(false);
        }
    };

    return { sendMessage, isLoading };
}
