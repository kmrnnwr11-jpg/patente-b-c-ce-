'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    CreditCard,
    Banknote,
    FileText,
    TrendingUp,
    Clock,
    AlertTriangle,
    Ticket,
} from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { formatDate, formatCurrency, daysSince } from '@/lib/utils';
import Link from 'next/link';

interface Stats {
    totalUsers: number;
    premiumUsers: number;
    freeUsers: number;
    activeCreators: number;
    totalQuizToday: number;
    revenueMonth: number;
    pendingPayouts: number;
    inactiveUsers: number;
}

interface RecentUser {
    id: string;
    displayName: string;
    email: string;
    createdAt: string;
    isPremium: boolean;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        premiumUsers: 0,
        freeUsers: 0,
        activeCreators: 0,
        totalQuizToday: 0,
        revenueMonth: 0,
        pendingPayouts: 0,
        inactiveUsers: 0,
    });
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            // Load users
            const usersSnapshot = await getDocs(collection(firestore, 'users'));
            const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const premiumUsers = users.filter((u: any) => u.isPremium === true);
            const freeUsers = users.filter((u: any) => !u.isPremium);

            // Count inactive users (no activity in 7+ days)
            const inactiveUsers = users.filter((u: any) => {
                if (!u.lastActiveAt) return true;
                return daysSince(u.lastActiveAt) > 7;
            });

            // Load creators
            const creatorsSnapshot = await getDocs(
                query(collection(firestore, 'creators'), where('isActive', '==', true))
            );

            // Calculate pending payouts
            let pendingPayouts = 0;
            creatorsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                pendingPayouts += data.pendingPayout || 0;
            });

            // Recent users
            const recentUsersSnapshot = await getDocs(
                query(collection(firestore, 'users'), orderBy('createdAt', 'desc'), limit(5))
            );
            const recent = recentUsersSnapshot.docs.map(doc => ({
                id: doc.id,
                displayName: doc.data().displayName || 'Utente',
                email: doc.data().email || 'N/A',
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                isPremium: doc.data().isPremium || false,
            }));

            setStats({
                totalUsers: users.length,
                premiumUsers: premiumUsers.length,
                freeUsers: freeUsers.length,
                activeCreators: creatorsSnapshot.size,
                totalQuizToday: 0, // Would need quiz_sessions collection
                revenueMonth: premiumUsers.length * 9.99, // Estimated
                pendingPayouts,
                inactiveUsers: inactiveUsers.length,
            });
            setRecentUsers(recent);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Panoramica dell&apos;app Patente B Quiz</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Utenti Totali"
                    value={stats.totalUsers.toLocaleString()}
                    change={`${stats.premiumUsers} premium`}
                    changeType="positive"
                    icon={Users}
                    iconColor="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    title="Abbonamenti Attivi"
                    value={stats.premiumUsers.toLocaleString()}
                    change={`${((stats.premiumUsers / (stats.totalUsers || 1)) * 100).toFixed(1)}% conversion`}
                    changeType="positive"
                    icon={CreditCard}
                    iconColor="text-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    title="Revenue Mese (stima)"
                    value={formatCurrency(stats.revenueMonth)}
                    icon={Banknote}
                    iconColor="text-yellow-600"
                    bgColor="bg-yellow-50"
                />
                <StatCard
                    title="Creator Attivi"
                    value={stats.activeCreators}
                    icon={Ticket}
                    iconColor="text-purple-600"
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Inactive Users */}
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-orange-800">Utenti Inattivi</h3>
                            <p className="text-sm text-orange-600">Non fanno quiz da 7+ giorni</p>
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-orange-700">{stats.inactiveUsers}</p>
                    <Link
                        href="/users?inactive=7"
                        className="mt-4 inline-block text-sm font-medium text-orange-700 hover:underline"
                    >
                        Vedi Lista →
                    </Link>
                </div>

                {/* Pending Payouts */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                            <Banknote className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-800">Pagamenti in Attesa</h3>
                            <p className="text-sm text-blue-600">Commissioni promoter</p>
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-blue-700">{formatCurrency(stats.pendingPayouts)}</p>
                    <Link
                        href="/promoters"
                        className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline"
                    >
                        Gestisci Pagamenti →
                    </Link>
                </div>

                {/* Free Users */}
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-purple-800">Utenti Free</h3>
                            <p className="text-sm text-purple-600">Da convertire a premium</p>
                        </div>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-purple-700">{stats.freeUsers}</p>
                    <Link
                        href="/notifications"
                        className="mt-4 inline-block text-sm font-medium text-purple-700 hover:underline"
                    >
                        Invia Promo →
                    </Link>
                </div>
            </div>

            {/* Recent Users & Quick Actions */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Users */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Ultimi Utenti Registrati</h3>
                        <Link href="/users" className="text-sm text-purple-600 hover:underline">
                            Vedi tutti
                        </Link>
                    </div>
                    <div className="mt-4 space-y-3">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-600">
                                        {user.displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.displayName}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={user.isPremium ? 'success' : 'default'}>
                                        {user.isPremium ? 'Premium' : 'Free'}
                                    </Badge>
                                    <p className="mt-1 text-xs text-gray-400">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900">Azioni Rapide</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <Link
                            href="/promo-codes"
                            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-300 hover:bg-purple-50"
                        >
                            <Ticket className="h-6 w-6 text-purple-600" />
                            <div>
                                <p className="font-medium text-gray-900">Crea Promo Code</p>
                                <p className="text-xs text-gray-500">Nuovo codice sconto</p>
                            </div>
                        </Link>
                        <Link
                            href="/promoters"
                            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-green-300 hover:bg-green-50"
                        >
                            <Users className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="font-medium text-gray-900">Aggiungi Promoter</p>
                                <p className="text-xs text-gray-500">Nuovo affiliato</p>
                            </div>
                        </Link>
                        <Link
                            href="/notifications"
                            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                        >
                            <FileText className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="font-medium text-gray-900">Invia Notifica</p>
                                <p className="text-xs text-gray-500">Push a tutti</p>
                            </div>
                        </Link>
                        <Link
                            href="/analytics"
                            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-yellow-300 hover:bg-yellow-50"
                        >
                            <TrendingUp className="h-6 w-6 text-yellow-600" />
                            <div>
                                <p className="font-medium text-gray-900">Analytics</p>
                                <p className="text-xs text-gray-500">Statistiche dettagliate</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
