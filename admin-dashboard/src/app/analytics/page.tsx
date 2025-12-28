'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, CreditCard, FileText } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { formatCurrency, daysSince } from '@/lib/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface Stats {
    totalUsers: number;
    premiumUsers: number;
    freeUsers: number;
    newUsersLast7Days: number;
    conversionRate: number;
    estimatedMRR: number;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        premiumUsers: 0,
        freeUsers: 0,
        newUsersLast7Days: 0,
        conversionRate: 0,
        estimatedMRR: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const usersSnapshot = await getDocs(collection(firestore, 'users'));
            const users = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
            }));

            const premiumUsers = users.filter((u: any) => u.isPremium);
            const freeUsers = users.filter((u: any) => !u.isPremium);
            const newUsersLast7Days = users.filter((u: any) =>
                daysSince(u.createdAt) <= 7
            ).length;

            const conversionRate = users.length > 0
                ? (premiumUsers.length / users.length) * 100
                : 0;

            // Estimate MRR based on premium users (assuming average €9.99/month)
            const estimatedMRR = premiumUsers.length * 9.99;

            setStats({
                totalUsers: users.length,
                premiumUsers: premiumUsers.length,
                freeUsers: freeUsers.length,
                newUsersLast7Days,
                conversionRate,
                estimatedMRR,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    }

    // Sample data for charts
    const userGrowthData = [
        { name: 'Lun', users: 45 },
        { name: 'Mar', users: 52 },
        { name: 'Mer', users: 48 },
        { name: 'Gio', users: 61 },
        { name: 'Ven', users: 55 },
        { name: 'Sab', users: 40 },
        { name: 'Dom', users: 38 },
    ];

    const subscriptionData = [
        { name: 'Mensile', value: Math.round(stats.premiumUsers * 0.6), color: '#8B5CF6' },
        { name: 'Trimestrale', value: Math.round(stats.premiumUsers * 0.25), color: '#06B6D4' },
        { name: 'Annuale', value: Math.round(stats.premiumUsers * 0.15), color: '#10B981' },
    ];

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
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500">Statistiche dettagliate dell&apos;app</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Utenti Totali"
                    value={stats.totalUsers}
                    change={`+${stats.newUsersLast7Days} questa settimana`}
                    changeType="positive"
                    icon={Users}
                    iconColor="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    title="Utenti Premium"
                    value={stats.premiumUsers}
                    change={`${stats.conversionRate.toFixed(1)}% conversion`}
                    changeType="positive"
                    icon={CreditCard}
                    iconColor="text-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    title="MRR Stimato"
                    value={formatCurrency(stats.estimatedMRR)}
                    icon={TrendingUp}
                    iconColor="text-yellow-600"
                    bgColor="bg-yellow-50"
                />
                <StatCard
                    title="Utenti Free"
                    value={stats.freeUsers}
                    change="Da convertire"
                    changeType="neutral"
                    icon={Users}
                    iconColor="text-gray-600"
                    bgColor="bg-gray-50"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* User Growth Chart */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-semibold text-gray-900">Nuovi Utenti (Ultima Settimana)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#8B5CF6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subscription Breakdown */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-semibold text-gray-900">Distribuzione Abbonamenti</h3>
                    <div className="flex items-center gap-8">
                        <div className="h-48 w-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subscriptionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {subscriptionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                            {subscriptionData.map((item) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-gray-600">{item.name}</span>
                                    <span className="font-semibold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Metriche Chiave</h3>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    <div>
                        <p className="text-sm text-gray-500">Conversion Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.conversionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">ARPU (Stima)</p>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(stats.totalUsers > 0 ? stats.estimatedMRR / stats.totalUsers : 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">LTV (Stima)</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(9.99 * 6)}</p>
                        <p className="text-xs text-gray-400">~6 mesi media</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">ARR (Stima)</p>
                        <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.estimatedMRR * 12)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
