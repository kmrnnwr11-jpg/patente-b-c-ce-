'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Users,
    UserCheck,
    GraduationCap,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    BookOpen,
    Target,
    Calendar,
    MessageSquare,
} from 'lucide-react';
import { useSchool } from '@/contexts/SchoolContext';
import { useDashboard } from '@/hooks/useSchoolData';
import { formatRelativeTime, getScoreColor, cn } from '@/lib/utils';
import { SCHOOL_PLANS } from '@/types';

export default function DashboardPage() {
    const { school, isOwner } = useSchool();
    const { data, isLoading, error } = useDashboard();

    // Mock data while loading real data
    const stats = data?.stats || {
        totalStudents: 45,
        activeStudents: 38,
        readyForExam: 12,
        completedThisMonth: 5,
        averageScore: 78,
        totalQuizzesToday: 156,
        studentsStudiedToday: 28,
    };

    const planUsage = data?.planUsage || {
        studentsUsed: 45,
        studentsLimit: school?.maxStudents || 50,
        instructorsUsed: 3,
        instructorsLimit: school?.maxInstructors || 3,
    };

    const studentsNeedingAttention = data?.studentsNeedingAttention || [
        { id: '1', name: 'Marco Bianchi', reason: 'Inattivo da 8 giorni', daysSinceActivity: 8 },
        { id: '2', name: 'Laura Verdi', reason: 'Punteggio in calo', daysSinceActivity: 3 },
        { id: '3', name: 'Giuseppe Rossi', reason: 'Inattivo da 12 giorni', daysSinceActivity: 12 },
    ];

    const readyStudents = data?.readyStudents || [
        { id: '1', name: 'Anna Neri', averageScore: 92, simulationsPassed: 5 },
        { id: '2', name: 'Paolo Gialli', averageScore: 88, simulationsPassed: 4 },
        { id: '3', name: 'Chiara Blu', averageScore: 85, simulationsPassed: 3 },
    ];

    const recentActivity = data?.recentActivity || [
        { id: '1', studentName: 'Marco Bianchi', type: 'quiz', score: 85, createdAt: new Date().toISOString() },
        { id: '2', studentName: 'Laura Verdi', type: 'simulation', score: 32, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '3', studentName: 'Anna Neri', type: 'quiz', score: 90, createdAt: new Date(Date.now() - 7200000).toISOString() },
    ];

    const planLimits = planUsage.studentsLimit === -1 ? 100 : planUsage.studentsLimit;
    const usagePercent = Math.min((planUsage.studentsUsed / planLimits) * 100, 100);

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Welcome Message */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Bentornato{school ? ` in ${school.name}` : ''}! 👋
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Ecco cosa sta succedendo oggi nella tua autoscuola.
                    </p>
                </div>
                <Link
                    href="/students?action=add"
                    className="btn btn-primary hidden sm:inline-flex"
                >
                    <Plus className="w-4 h-4" />
                    Aggiungi Studente
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Studenti Attivi"
                    value={stats.activeStudents}
                    subtitle={`/${stats.totalStudents} totali`}
                    icon={Users}
                    color="indigo"
                    href="/students"
                />
                <StatCard
                    title="Pronti per Esame"
                    value={stats.readyForExam}
                    subtitle="studenti"
                    icon={GraduationCap}
                    color="green"
                    href="/students?filter=ready"
                />
                <StatCard
                    title="Media Punteggio"
                    value={`${stats.averageScore}%`}
                    subtitle="ultimo mese"
                    icon={Target}
                    color="blue"
                    trend={+5}
                />
                <StatCard
                    title="Quiz Oggi"
                    value={stats.totalQuizzesToday}
                    subtitle={`da ${stats.studentsStudiedToday} studenti`}
                    icon={BookOpen}
                    color="purple"
                />
            </div>

            {/* Plan Usage (for owners) */}
            {isOwner && (
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">Utilizzo Piano</h3>
                            <p className="text-sm text-gray-500">
                                Piano {school?.plan ? SCHOOL_PLANS[school.plan as keyof typeof SCHOOL_PLANS]?.name : 'Pro'}
                            </p>
                        </div>
                        <Link href="/settings/billing" className="text-sm text-indigo-600 hover:underline">
                            Gestisci Piano →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Students usage */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Studenti</span>
                                <span className="font-medium">
                                    {planUsage.studentsUsed} / {planUsage.studentsLimit === -1 ? '∞' : planUsage.studentsLimit}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all',
                                        usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-indigo-500'
                                    )}
                                    style={{ width: `${usagePercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Instructors usage */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Istruttori</span>
                                <span className="font-medium">
                                    {planUsage.instructorsUsed} / {planUsage.instructorsLimit === -1 ? '∞' : planUsage.instructorsLimit}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full transition-all"
                                    style={{
                                        width: `${planUsage.instructorsLimit === -1 ? 30 : (planUsage.instructorsUsed / planUsage.instructorsLimit) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students Needing Attention */}
                <div className="card">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h3 className="font-semibold text-gray-900">Richiedono Attenzione</h3>
                        </div>
                        <span className="badge badge-warning">{studentsNeedingAttention.length}</span>
                    </div>

                    {studentsNeedingAttention.length > 0 ? (
                        <div className="divide-y">
                            {studentsNeedingAttention.map((student) => (
                                <Link
                                    key={student.id}
                                    href={`/students/${student.id}`}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50"
                                >
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900">{student.name}</p>
                                        <p className="text-sm text-gray-500">{student.reason}</p>
                                    </div>
                                    <button className="text-sm text-indigo-600 hover:underline whitespace-nowrap">
                                        Contatta
                                    </button>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                            <p>Tutti gli studenti sono in pari!</p>
                        </div>
                    )}
                </div>

                {/* Ready for Exam */}
                <div className="card">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-green-500" />
                            <h3 className="font-semibold text-gray-900">Pronti per l'Esame</h3>
                        </div>
                        <span className="badge badge-success">{readyStudents.length}</span>
                    </div>

                    {readyStudents.length > 0 ? (
                        <div className="divide-y">
                            {readyStudents.map((student) => (
                                <Link
                                    key={student.id}
                                    href={`/students/${student.id}`}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-50"
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900">{student.name}</p>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className={getScoreColor(student.averageScore)}>
                                                Media: {student.averageScore}%
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-500">
                                                {student.simulationsPassed} sim. passate
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p>Nessuno studente pronto</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Attività Recente</h3>
                    <Link href="/reports" className="text-sm text-indigo-600 hover:underline">
                        Vedi Report →
                    </Link>
                </div>

                <div className="divide-y">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-4">
                            <div className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center',
                                activity.type === 'quiz' ? 'bg-blue-100' : 'bg-purple-100'
                            )}>
                                {activity.type === 'quiz' ? (
                                    <BookOpen className={cn('w-5 h-5', activity.type === 'quiz' ? 'text-blue-600' : 'text-purple-600')} />
                                ) : (
                                    <Target className="w-5 h-5 text-purple-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm">
                                    <span className="font-medium text-gray-900">{activity.studentName}</span>
                                    <span className="text-gray-500">
                                        {' '}ha completato {activity.type === 'quiz' ? 'un quiz' : 'una simulazione'}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    {formatRelativeTime(activity.createdAt)}
                                </p>
                            </div>
                            <div className={cn(
                                'text-sm font-medium',
                                activity.type === 'simulation'
                                    ? activity.score <= 4 ? 'text-green-600' : 'text-red-600'
                                    : getScoreColor(activity.score)
                            )}>
                                {activity.type === 'simulation'
                                    ? `${activity.score} errori`
                                    : `${activity.score}%`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction
                    icon={Users}
                    label="Aggiungi Studente"
                    href="/students?action=add"
                    color="indigo"
                />
                <QuickAction
                    icon={MessageSquare}
                    label="Invia Messaggio"
                    href="/messages?action=compose"
                    color="green"
                />
                <QuickAction
                    icon={Calendar}
                    label="Report Settimanale"
                    href="/reports?period=7d"
                    color="blue"
                />
                <QuickAction
                    icon={GraduationCap}
                    label="Studenti Pronti"
                    href="/students?filter=ready"
                    color="purple"
                />
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
    href,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color: 'indigo' | 'green' | 'blue' | 'purple';
    trend?: number;
    href?: string;
}) {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    const content = (
        <div className="card card-hover p-5">
            <div className="flex items-start justify-between">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[color])}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend !== undefined && (
                    <span className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full',
                        trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <p className="text-sm font-medium text-gray-700 mt-2">{title}</p>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}

// Quick Action Component
function QuickAction({
    icon: Icon,
    label,
    href,
    color,
}: {
    icon: any;
    label: string;
    href: string;
    color: 'indigo' | 'green' | 'blue' | 'purple';
}) {
    const colorClasses = {
        indigo: 'hover:border-indigo-300 hover:bg-indigo-50',
        green: 'hover:border-green-300 hover:bg-green-50',
        blue: 'hover:border-blue-300 hover:bg-blue-50',
        purple: 'hover:border-purple-300 hover:bg-purple-50',
    };

    const iconColors = {
        indigo: 'text-indigo-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
    };

    return (
        <Link
            href={href}
            className={cn(
                'flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl transition-all',
                colorClasses[color]
            )}
        >
            <Icon className={cn('w-6 h-6', iconColors[color])} />
            <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
        </Link>
    );
}
