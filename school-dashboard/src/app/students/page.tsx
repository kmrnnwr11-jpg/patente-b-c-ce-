'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle,
    Clock,
    AlertTriangle,
    MessageSquare,
    ChevronDown,
} from 'lucide-react';
import { formatDate, formatTimeAgo, formatPercent, getStatusColor } from '@/lib/utils';

// Mock data
const mockStudents = [
    {
        id: '1',
        name: 'Marco Bianchi',
        email: 'marco.bianchi@email.com',
        phone: '+39 333 1234567',
        enrollmentStatus: 'active',
        enrollmentDate: '2024-01-15',
        assignedInstructor: { id: '1', name: 'Luigi Verdi' },
        stats: {
            totalQuizzes: 145,
            averageScore: 82,
            lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
            daysSinceLastActivity: 0,
            simulationsPassed: 5,
            weakTopics: ['limiti velocità'],
        },
        isReadyForExam: true,
        appRegistered: true,
    },
    {
        id: '2',
        name: 'Lucia Verdi',
        email: 'lucia.verdi@email.com',
        phone: '+39 333 9876543',
        enrollmentStatus: 'active',
        enrollmentDate: '2024-01-20',
        assignedInstructor: { id: '1', name: 'Luigi Verdi' },
        stats: {
            totalQuizzes: 89,
            averageScore: 65,
            lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            daysSinceLastActivity: 3,
            simulationsPassed: 1,
            weakTopics: ['precedenze', 'segnali pericolo'],
        },
        isReadyForExam: false,
        appRegistered: true,
    },
    {
        id: '3',
        name: 'Paolo Rossi',
        email: 'paolo.rossi@email.com',
        phone: '+39 333 5555555',
        enrollmentStatus: 'active',
        enrollmentDate: '2023-12-01',
        assignedInstructor: { id: '2', name: 'Anna Neri' },
        stats: {
            totalQuizzes: 234,
            averageScore: 92,
            lastActivity: new Date(Date.now() - 1000 * 60 * 30),
            daysSinceLastActivity: 0,
            simulationsPassed: 8,
            weakTopics: [],
        },
        isReadyForExam: true,
        appRegistered: true,
    },
    {
        id: '4',
        name: 'Anna Blu',
        email: 'anna.blu@email.com',
        phone: '+39 333 7777777',
        enrollmentStatus: 'paused',
        enrollmentDate: '2024-01-10',
        assignedInstructor: null,
        stats: {
            totalQuizzes: 12,
            averageScore: 45,
            lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
            daysSinceLastActivity: 15,
            simulationsPassed: 0,
            weakTopics: ['tutti'],
        },
        isReadyForExam: false,
        appRegistered: false,
    },
];

const instructors = [
    { id: '1', name: 'Luigi Verdi' },
    { id: '2', name: 'Anna Neri' },
    { id: '3', name: 'Giuseppe Bianchi' },
];

export default function StudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState(mockStudents);
    const [filters, setFilters] = useState({
        status: 'all',
        instructor: 'all',
        readyForExam: 'all',
        search: '',
    });
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

    // Filter students
    const filteredStudents = students.filter(student => {
        if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !student.email.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
        if (filters.status !== 'all' && student.enrollmentStatus !== filters.status) {
            return false;
        }
        if (filters.instructor !== 'all' && student.assignedInstructor?.id !== filters.instructor) {
            return false;
        }
        if (filters.readyForExam === 'true' && !student.isReadyForExam) {
            return false;
        }
        if (filters.readyForExam === 'false' && student.isReadyForExam) {
            return false;
        }
        return true;
    });

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Studenti</h1>
                    <p className="text-gray-500 mt-1">
                        {filteredStudents.length} studenti trovati
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Aggiungi Studente
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cerca studente..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Tutti gli stati</option>
                        <option value="active">Attivi</option>
                        <option value="completed">Completati</option>
                        <option value="paused">In pausa</option>
                        <option value="dropped">Abbandonati</option>
                    </select>

                    {/* Instructor filter */}
                    <select
                        value={filters.instructor}
                        onChange={(e) => setFilters({ ...filters, instructor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Tutti gli istruttori</option>
                        {instructors.map(i => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                    </select>

                    {/* Ready for exam filter */}
                    <select
                        value={filters.readyForExam}
                        onChange={(e) => setFilters({ ...filters, readyForExam: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Tutti</option>
                        <option value="true">Pronti per esame</option>
                        <option value="false">Non ancora pronti</option>
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Studente
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Istruttore
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progressi
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ultima Attività
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stato
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Azioni
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/students/${student.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">
                                            {student.assignedInstructor?.name || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getProgressColor(student.stats.averageScore)}`}
                                                        style={{ width: `${student.stats.averageScore}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-medium ${getScoreColor(student.stats.averageScore)}`}>
                                                    {student.stats.averageScore}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {student.stats.totalQuizzes} quiz • {student.stats.simulationsPassed} sim. passate
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                {formatTimeAgo(student.stats.lastActivity)}
                                            </p>
                                            {student.stats.daysSinceLastActivity > 7 && (
                                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Inattivo da {student.stats.daysSinceLastActivity} giorni
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.isReadyForExam ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                <CheckCircle className="w-3 h-3" />
                                                Pronto
                                            </span>
                                        ) : (
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.enrollmentStatus)}`}>
                                                {student.enrollmentStatus === 'active' ? 'In preparazione' : student.enrollmentStatus}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedStudent(student.id);
                                            }}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-gray-500 font-medium">Nessuno studente trovato</h3>
                        <p className="text-gray-400 text-sm mt-1">
                            Prova a modificare i filtri o aggiungi nuovi studenti
                        </p>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <InviteStudentModal
                    onClose={() => setShowInviteModal(false)}
                    instructors={instructors}
                />
            )}
        </div>
    );
}

// Invite Modal Component
function InviteStudentModal({
    onClose,
    instructors
}: {
    onClose: () => void;
    instructors: { id: string; name: string }[];
}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        assignedInstructorId: '',
        expectedExamDate: '',
        sendInvite: true,
    });
    const [inviteResult, setInviteResult] = useState<{ code: string; link: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simula creazione studente
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Genera codice invito
        const code = `STU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        setInviteResult({
            code,
            link: `https://app.patentequiz.com/join/${code}`,
        });
        setIsLoading(false);
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {!inviteResult ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Aggiungi Nuovo Studente</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Mario Rossi"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="email@esempio.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Telefono
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="+39 333 1234567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Istruttore Assegnato
                                    </label>
                                    <select
                                        value={formData.assignedInstructorId}
                                        onChange={(e) => setFormData({ ...formData, assignedInstructorId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Non assegnato</option>
                                        {instructors.map(i => (
                                            <option key={i.id} value={i.id}>{i.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data Esame Prevista
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.expectedExamDate}
                                        onChange={(e) => setFormData({ ...formData, expectedExamDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="sendInvite"
                                        checked={formData.sendInvite}
                                        onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor="sendInvite" className="text-sm text-gray-700">
                                        Invia invito via email/SMS
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Creando...' : 'Aggiungi Studente'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Studente Aggiunto!</h2>

                            <div className="bg-gray-100 p-4 rounded-lg my-6">
                                <p className="text-sm text-gray-500 mb-2">Codice Invito</p>
                                <p className="text-2xl font-mono font-bold text-gray-900">{inviteResult.code}</p>
                            </div>

                            <p className="text-sm text-gray-500 mb-6">
                                Lo studente deve scaricare l'app e inserire questo codice per accedere.
                            </p>

                            <div className="flex gap-2 justify-center mb-6">
                                <button
                                    onClick={() => copyToClipboard(inviteResult.link)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    📋 Copia Link
                                </button>
                                <button
                                    onClick={() => {
                                        const message = `Ciao! Sei stato aggiunto all'Autoscuola. Scarica l'app Patente Quiz e usa questo codice: ${inviteResult.code}`;
                                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                                    }}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    💬 WhatsApp
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Chiudi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
