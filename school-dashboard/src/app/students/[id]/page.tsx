'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    Award,
    Target,
    MessageSquare,
    MoreHorizontal,
    CheckCircle,
    AlertTriangle,
    BookOpen,
    Brain,
    FileText,
    Flag,
    Edit,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
} from 'recharts';
import { formatDate, formatTimeAgo, getStatusColor, getTrendColor } from '@/lib/utils';

// Mock data for student
const mockStudent = {
    id: '1',
    name: 'Marco Bianchi',
    email: 'marco.bianchi@email.com',
    phone: '+39 333 1234567',
    enrollmentDate: '2024-01-15',
    expectedExamDate: '2024-03-15',
    assignedInstructor: { id: '1', name: 'Luigi Verdi' },
    enrollmentStatus: 'active',
    isReadyForExam: true,
    flaggedForReview: false,
    instructorNotes: 'Studente molto motivato, studia regolarmente.',
    stats: {
        totalQuizzes: 145,
        averageScore: 82,
        lastActivity: '2024-01-28T14:30:00Z',
        daysSinceLastActivity: 0,
        simulationsPassed: 5,
        simulationsFailed: 2,
        studyTimeHours: 24.5,
        trend: 'improving' as const,
        estimatedPassProbability: 85,
        strongTopics: ['Segnali stradali', 'Definizioni', 'Norme sulla circolazione'],
        weakTopics: ['Limiti di velocità', 'Precedenze'],
    },
};

const mockScoreHistory = [
    { date: '1 Gen', score: 68 },
    { date: '8 Gen', score: 72 },
    { date: '15 Gen', score: 75 },
    { date: '22 Gen', score: 78 },
    { date: '25 Gen', score: 82 },
    { date: '28 Gen', score: 85 },
];

const mockTopicsData = [
    { topic: 'Segnali', score: 92, fullMark: 100 },
    { topic: 'Precedenze', score: 65, fullMark: 100 },
    { topic: 'Velocità', score: 58, fullMark: 100 },
    { topic: 'Sicurezza', score: 78, fullMark: 100 },
    { topic: 'Norme', score: 88, fullMark: 100 },
    { topic: 'Veicolo', score: 75, fullMark: 100 },
];

const mockRecentActivity = [
    { id: '1', type: 'simulation_passed', score: 38, date: '2024-01-28T14:30:00Z' },
    { id: '2', type: 'quiz_completed', score: 85, topic: 'Segnali', date: '2024-01-28T10:15:00Z' },
    { id: '3', type: 'quiz_completed', score: 72, topic: 'Precedenze', date: '2024-01-27T18:45:00Z' },
    { id: '4', type: 'simulation_failed', score: 30, date: '2024-01-27T16:00:00Z' },
    { id: '5', type: 'quiz_completed', score: 90, topic: 'Norme', date: '2024-01-26T14:20:00Z' },
];

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [student] = useState(mockStudent);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const TrendIcon = student.stats.trend === 'improving' ? TrendingUp
        : student.stats.trend === 'declining' ? TrendingDown : Minus;

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/students" className="hover:text-gray-700 flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Studenti
                </Link>
                <span>/</span>
                <span className="text-gray-900">{student.name}</span>
            </div>

            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-indigo-600">
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                                {student.isReadyForExam && (
                                    <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <CheckCircle className="w-4 h-4" />
                                        Pronto per Esame
                                    </span>
                                )}
                                {student.flaggedForReview && (
                                    <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <Flag className="w-4 h-4" />
                                        Da Rivedere
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {student.email}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {student.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    Istruttore: {student.assignedInstructor.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="text-gray-500">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Iscritto dal {formatDate(student.enrollmentDate)}
                                </span>
                                {student.expectedExamDate && (
                                    <span className="text-indigo-600 font-medium">
                                        <Target className="w-4 h-4 inline mr-1" />
                                        Esame previsto: {formatDate(student.expectedExamDate)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowMessageModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Invia Messaggio
                        </button>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <Edit className="w-5 h-5" />
                            Modifica
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Punteggio Medio</p>
                            <p className="text-3xl font-bold text-gray-900">{student.stats.averageScore}%</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTrendColor(student.stats.trend)}`}>
                            <TrendIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {student.stats.trend === 'improving' && 'In miglioramento'}
                        {student.stats.trend === 'stable' && 'Stabile'}
                        {student.stats.trend === 'declining' && 'In calo'}
                    </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Quiz Completati</p>
                            <p className="text-3xl font-bold text-gray-900">{student.stats.totalQuizzes}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {student.stats.studyTimeHours}h totali di studio
                    </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Simulazioni</p>
                            <p className="text-3xl font-bold text-gray-900">
                                <span className="text-green-600">{student.stats.simulationsPassed}</span>
                                <span className="text-gray-300 mx-1">/</span>
                                <span className="text-red-600">{student.stats.simulationsFailed}</span>
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Award className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {Math.round((student.stats.simulationsPassed / (student.stats.simulationsPassed + student.stats.simulationsFailed)) * 100)}% pass rate
                    </p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Prob. Superamento</p>
                            <p className="text-3xl font-bold text-gray-900">{student.stats.estimatedPassProbability}%</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Brain className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ Pronto per l'esame
                    </p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Trend */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Andamento Punteggi</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockScoreHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} domain={[50, 100]} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#10B981"
                                    fill="#10B981"
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Topics Radar */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Competenze per Argomento</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={mockTopicsData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11 }} />
                                <Radar
                                    name="Punteggio"
                                    dataKey="score"
                                    stroke="#6366F1"
                                    fill="#6366F1"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Topics Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strong Topics */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Punti di Forza
                    </h3>
                    <div className="space-y-3">
                        {student.stats.strongTopics.map((topic, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-medium text-gray-900">{topic}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weak Topics */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        Argomenti da Migliorare
                    </h3>
                    <div className="space-y-3">
                        {student.stats.weakTopics.map((topic, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">{topic}</span>
                                </div>
                                <button className="text-sm text-orange-600 hover:underline">
                                    Consiglia esercizi
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        Attività Recente
                    </h3>
                    <div className="space-y-3">
                        {mockRecentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'simulation_passed' ? 'bg-green-100' :
                                        activity.type === 'simulation_failed' ? 'bg-red-100' : 'bg-blue-100'
                                    }`}>
                                    {activity.type === 'simulation_passed' && <Award className="w-5 h-5 text-green-600" />}
                                    {activity.type === 'simulation_failed' && <Award className="w-5 h-5 text-red-600" />}
                                    {activity.type === 'quiz_completed' && <BookOpen className="w-5 h-5 text-blue-600" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {activity.type === 'simulation_passed' && `Simulazione superata (${activity.score}/40)`}
                                        {activity.type === 'simulation_failed' && `Simulazione non superata (${activity.score}/40)`}
                                        {activity.type === 'quiz_completed' && `Quiz ${activity.topic} - ${activity.score}%`}
                                    </p>
                                    <p className="text-sm text-gray-500">{formatTimeAgo(new Date(activity.date))}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructor Notes */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Note Istruttore
                        </span>
                        <button className="text-sm text-indigo-600 hover:underline">Modifica</button>
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg min-h-[150px]">
                        {student.instructorNotes ? (
                            <p className="text-gray-700">{student.instructorNotes}</p>
                        ) : (
                            <p className="text-gray-400 italic">Nessuna nota</p>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-2">Azioni Rapide</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                {student.isReadyForExam ? 'Rimuovi "Pronto"' : 'Segna Pronto'}
                            </button>
                            <button className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                {student.flaggedForReview ? 'Rimuovi Flag' : 'Segnala da Rivedere'}
                            </button>
                            <button className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                Cambia Istruttore
                            </button>
                            <button className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                                Invia Promemoria
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
