'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Users,
    Shield,
    Edit,
    Trash2,
    Check,
    X,
    BarChart3,
    Clock,
    User,
    MessageSquare,
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

// Mock instructor data
const mockInstructors = [
    {
        id: '1',
        name: 'Luigi Verdi',
        email: 'luigi.verdi@autoscuola.it',
        phone: '+39 333 1234567',
        role: 'owner',
        isActive: true,
        joinedAt: '2024-01-01',
        studentsCount: 25,
        lastActive: '2024-12-28T10:30:00',
        stats: {
            totalStudents: 45,
            activeStudents: 25,
            passedExam: 38,
            averageScore: 82,
        },
        permissions: {
            viewStudents: true,
            manageStudents: true,
            viewReports: true,
            exportData: true,
            manageInstructors: true,
            billing: true,
        },
        assignedStudents: [
            { id: '1', name: 'Marco Bianchi', status: 'active', averageScore: 85 },
            { id: '2', name: 'Laura Verdi', status: 'ready', averageScore: 92 },
            { id: '3', name: 'Paolo Rossi', status: 'active', averageScore: 78 },
        ],
    },
    {
        id: '2',
        name: 'Anna Neri',
        email: 'anna.neri@autoscuola.it',
        phone: '+39 333 9876543',
        role: 'admin',
        isActive: true,
        joinedAt: '2024-01-15',
        studentsCount: 12,
        lastActive: '2024-12-28T09:15:00',
        stats: {
            totalStudents: 28,
            activeStudents: 12,
            passedExam: 25,
            averageScore: 79,
        },
        permissions: {
            viewStudents: true,
            manageStudents: true,
            viewReports: true,
            exportData: true,
            manageInstructors: false,
            billing: false,
        },
        assignedStudents: [
            { id: '4', name: 'Giulia Gialli', status: 'active', averageScore: 81 },
            { id: '5', name: 'Francesco Blu', status: 'paused', averageScore: 65 },
        ],
    },
    {
        id: '3',
        name: 'Giuseppe Bianchi',
        email: 'giuseppe.bianchi@autoscuola.it',
        phone: '+39 333 5555555',
        role: 'instructor',
        isActive: true,
        joinedAt: '2024-02-01',
        studentsCount: 8,
        lastActive: '2024-12-27T16:45:00',
        stats: {
            totalStudents: 15,
            activeStudents: 8,
            passedExam: 12,
            averageScore: 76,
        },
        permissions: {
            viewStudents: true,
            manageStudents: false,
            viewReports: true,
            exportData: false,
            manageInstructors: false,
            billing: false,
        },
        assignedStudents: [
            { id: '6', name: 'Chiara Neri', status: 'active', averageScore: 88 },
        ],
    },
];

const roleLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    owner: { label: 'Proprietario', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    admin: { label: 'Amministratore', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    instructor: { label: 'Istruttore', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

const permissionLabels: Record<string, string> = {
    viewStudents: 'Visualizza studenti',
    manageStudents: 'Gestisci studenti',
    viewReports: 'Visualizza report',
    exportData: 'Esporta dati',
    manageInstructors: 'Gestisci istruttori',
    billing: 'Fatturazione',
};

export default function InstructorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [instructor, setInstructor] = useState<typeof mockInstructors[0] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const found = mockInstructors.find(i => i.id === params.id);
            setInstructor(found || null);
            setIsLoading(false);
        }, 500);
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Istruttore non trovato</h2>
                <p className="text-gray-500 mb-4">L'istruttore richiesto non esiste.</p>
                <Link
                    href="/instructors"
                    className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Torna alla lista istruttori
                </Link>
            </div>
        );
    }

    const roleInfo = roleLabels[instructor.role];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Back button */}
            <Link
                href="/instructors"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="w-4 h-4" />
                Torna agli Istruttori
            </Link>

            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        {instructor.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{instructor.name}</h1>
                            <span className={cn(
                                'px-3 py-1 rounded-full text-sm font-medium',
                                roleInfo.bgColor,
                                roleInfo.color
                            )}>
                                {roleInfo.label}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {instructor.email}
                            </div>
                            {instructor.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {instructor.phone}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                Entrato il {formatDate(instructor.joinedAt)}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <MessageSquare className="w-4 h-4" />
                            Messaggio
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <Edit className="w-4 h-4" />
                            Modifica
                        </button>
                        {instructor.role !== 'owner' && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                Rimuovi
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Studenti Attivi"
                    value={instructor.stats.activeStudents}
                    color="indigo"
                />
                <StatCard
                    icon={User}
                    label="Totale Studenti"
                    value={instructor.stats.totalStudents}
                    color="blue"
                />
                <StatCard
                    icon={Check}
                    label="Promossi"
                    value={instructor.stats.passedExam}
                    color="green"
                />
                <StatCard
                    icon={BarChart3}
                    label="Media Punteggio"
                    value={`${instructor.stats.averageScore}%`}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Permissions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            Permessi
                        </h2>
                        {instructor.role !== 'owner' && (
                            <button className="text-sm text-indigo-600 hover:underline">
                                Modifica
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {Object.entries(instructor.permissions).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <span className="text-gray-600">{permissionLabels[key]}</span>
                                {value ? (
                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                        <Check className="w-4 h-4" /> Abilitato
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                                        <X className="w-4 h-4" /> Disabilitato
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assigned Students */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            Studenti Assegnati ({instructor.assignedStudents.length})
                        </h2>
                        <Link href="/students" className="text-sm text-indigo-600 hover:underline">
                            Vedi tutti
                        </Link>
                    </div>

                    {instructor.assignedStudents.length > 0 ? (
                        <div className="space-y-3">
                            {instructor.assignedStudents.map((student) => (
                                <Link
                                    key={student.id}
                                    href={`/students/${student.id}`}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                                        {student.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{student.name}</p>
                                        <p className={cn(
                                            'text-xs font-medium',
                                            student.status === 'ready' ? 'text-green-600' :
                                                student.status === 'paused' ? 'text-yellow-600' : 'text-gray-500'
                                        )}>
                                            {student.status === 'ready' ? 'Pronto per esame' :
                                                student.status === 'paused' ? 'In pausa' : 'Attivo'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            'font-medium',
                                            student.averageScore >= 80 ? 'text-green-600' :
                                                student.averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                        )}>
                                            {student.averageScore}%
                                        </p>
                                        <p className="text-xs text-gray-500">Media</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p>Nessuno studente assegnato</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Attività Recente
                </h2>
                <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>Nessuna attività recente da mostrare</p>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Rimuovi Istruttore</h2>
                        <p className="text-gray-600 mb-6">
                            Sei sicuro di voler rimuovere <strong>{instructor.name}</strong> dalla tua autoscuola?
                            Gli studenti assegnati verranno scollegati.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    router.push('/instructors');
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Rimuovi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: any;
    label: string;
    value: string | number;
    color: 'indigo' | 'blue' | 'green' | 'purple';
}) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', colors[color])}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}
