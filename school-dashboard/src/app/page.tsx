'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    CheckCircle,
    TrendingUp,
    FileText,
    Plus,
    Copy,
    AlertTriangle,
    Clock,
    ChevronRight,
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { formatTimeAgo, formatPercent, copyToClipboard } from '@/lib/utils';

export default function SchoolDashboard() {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data - in produzione verrebbe da Firestore
    const [dashboardData, setDashboardData] = useState({
        school: {
            name: 'Autoscuola Roma Centro',
            schoolCode: 'AUTO-ROMA-A1B2C3',
            plan: 'pro',
            planStatus: 'active',
        },
        stats: {
            totalStudents: 45,
            activeStudents: 42,
            readyForExam: 12,
            completedThisMonth: 5,
            averageScore: 78.5,
            totalQuizzesToday: 156,
            studentsStudiedToday: 28,
        },
        planUsage: {
            studentsUsed: 45,
            studentsLimit: 100,
            instructorsUsed: 3,
            instructorsLimit: 5,
        },
        studentsNeedingAttention: [
            { id: '1', name: 'Marco Bianchi', reason: 'Inattivo da 10 giorni' },
            { id: '2', name: 'Lucia Verdi', reason: 'Punteggio in calo (65%)' },
        ],
        readyStudents: [
            { id: '3', name: 'Paolo Rossi', averageScore: 92, simulationsPassed: 5 },
            { id: '4', name: 'Anna Neri', averageScore: 88, simulationsPassed: 4 },
            { id: '5', name: 'Giuseppe Blu', averageScore: 85, simulationsPassed: 3 },
        ],
        recentActivity: [
            { id: '1', studentName: 'Marco B.', description: 'ha completato una simulazione (28/40)', type: 'simulation', createdAt: new Date(Date.now() - 1000 * 60 * 15) },
            { id: '2', studentName: 'Lucia V.', description: 'ha studiato "Segnali di Pericolo"', type: 'study', createdAt: new Date(Date.now() - 1000 * 60 * 45) },
            { id: '3', studentName: 'Paolo R.', description: 'ha superato la simulazione! ✓', type: 'success', createdAt: new Date(Date.now() - 1000 * 60 * 120) },
            { id: '4', studentName: 'Anna N.', description: 'ha completato 15 quiz (93%)', type: 'quiz', createdAt: new Date(Date.now() - 1000 * 60 * 180) },
        ],
    });

    useEffect(() => {
        // Simula caricamento
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    const handleCopyCode = async () => {
        await copyToClipboard(dashboardData.school.schoolCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'simulation': return '📝';
            case 'study': return '📚';
            case 'success': return '🎉';
            case 'quiz': return '✅';
            default: return '📊';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{dashboardData.school.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500">Codice Scuola:</span>
                        <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm">
                            {dashboardData.school.schoolCode}
                        </code>
                        <button
                            onClick={handleCopyCode}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copia codice"
                        >
                            <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-gray-400'}`} />
                        </button>
                        {copied && <span className="text-green-600 text-sm">Copiato!</span>}
                    </div>
                </div>
                <button
                    onClick={() => router.push('/students/invite')}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Invita Studenti
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer card-hover"
                    onClick={() => router.push('/students')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Studenti Attivi</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {dashboardData.stats.activeStudents}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {dashboardData.planUsage.studentsUsed}/{dashboardData.planUsage.studentsLimit} del piano
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer card-hover"
                    onClick={() => router.push('/students?ready=true')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pronti per Esame</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">
                                {dashboardData.stats.readyForExam}
                            </p>
                            <p className="text-xs text-green-500 mt-1">
                                +{dashboardData.stats.completedThisMonth} questo mese
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Media Punteggio</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {formatPercent(dashboardData.stats.averageScore)}
                            </p>
                            <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +2.5% vs settimana scorsa
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Quiz Oggi</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {dashboardData.stats.totalQuizzesToday}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {dashboardData.stats.studentsStudiedToday} studenti attivi
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert - Students needing attention */}
            {dashboardData.studentsNeedingAttention.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-orange-800">Studenti che Richiedono Attenzione</h3>
                    </div>
                    <div className="space-y-2">
                        {dashboardData.studentsNeedingAttention.map(student => (
                            <div
                                key={student.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{student.name}</p>
                                    <p className="text-sm text-orange-600">{student.reason}</p>
                                </div>
                                <button
                                    onClick={() => router.push(`/students/${student.id}`)}
                                    className="px-3 py-1 text-sm border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50"
                                >
                                    Vedi
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Two columns: Ready for exam + Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ready for Exam */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            🎯 Pronti per l'Esame
                        </h3>
                        <button
                            onClick={() => router.push('/students?ready=true')}
                            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                        >
                            Vedi tutti <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-4">
                        {dashboardData.readyStudents.length === 0 ? (
                            <p className="text-gray-500 text-center py-6">
                                Nessuno studente è ancora pronto per l'esame
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {dashboardData.readyStudents.map(student => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() => router.push(`/students/${student.id}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Media: {student.averageScore}% • {student.simulationsPassed} sim. passate
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            ✓ Pronto
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            📊 Attività Recente
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="space-y-4">
                            {dashboardData.recentActivity.map(activity => (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="text-xl">{getActivityIcon(activity.type)}</div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-medium">{activity.studentName}</span>
                                            {' '}{activity.description}
                                        </p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(activity.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Usage Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-semibold text-lg">Piano {dashboardData.school.plan.toUpperCase()}</h3>
                        <p className="text-indigo-200 text-sm mt-1">
                            {dashboardData.planUsage.studentsUsed}/{dashboardData.planUsage.studentsLimit} studenti •
                            {dashboardData.planUsage.instructorsUsed}/{dashboardData.planUsage.instructorsLimit} istruttori
                        </p>
                        <div className="w-full bg-indigo-400/30 rounded-full h-2 mt-3 max-w-xs">
                            <div
                                className="bg-white rounded-full h-2"
                                style={{
                                    width: `${(dashboardData.planUsage.studentsUsed / dashboardData.planUsage.studentsLimit) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/settings/billing')}
                        className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                    >
                        Gestisci Piano
                    </button>
                </div>
            </div>
        </div>
    );
}
