'use client';

import { useEffect, useState } from 'react';
import { Star, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { StatCard } from '@/components/common/StatCard';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Subscription {
    id: string;
    userId: string;
    userEmail: string;
    plan: string;
    status: string;
    amount: number;
    startedAt: string;
    expiresAt: string;
    paymentMethod: string;
    promoCode?: string;
}

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadSubscriptions();
    }, []);

    async function loadSubscriptions() {
        try {
            // Get all premium users
            const usersSnapshot = await getDocs(
                query(collection(firestore, 'users'), where('isPremium', '==', true))
            );

            const subs: Subscription[] = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                userId: doc.id,
                userEmail: doc.data().email || 'N/A',
                plan: doc.data().subscriptionPlan || 'monthly',
                status: doc.data().subscriptionStatus || 'active',
                amount: doc.data().subscriptionPlan === 'yearly' ? 59.99 : doc.data().subscriptionPlan === 'quarterly' ? 24.99 : 9.99,
                startedAt: doc.data().subscriptionStart?.toDate?.()?.toISOString() || doc.data().createdAt?.toDate?.()?.toISOString(),
                expiresAt: doc.data().subscriptionEnd?.toDate?.()?.toISOString() || '',
                paymentMethod: 'Stripe',
                promoCode: doc.data().usedPromoCode,
            }));

            setSubscriptions(subs);
        } catch (error) {
            console.error('Error loading subscriptions:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredSubs = filter === 'all'
        ? subscriptions
        : subscriptions.filter(s => s.plan === filter);

    const stats = {
        total: subscriptions.length,
        monthly: subscriptions.filter(s => s.plan === 'monthly').length,
        quarterly: subscriptions.filter(s => s.plan === 'quarterly').length,
        yearly: subscriptions.filter(s => s.plan === 'yearly').length,
        mrr: subscriptions.reduce((sum, s) => {
            if (s.plan === 'yearly') return sum + (59.99 / 12);
            if (s.plan === 'quarterly') return sum + (24.99 / 3);
            return sum + 9.99;
        }, 0),
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Abbonamenti</h1>
                    <p className="text-gray-500">{stats.total} abbonamenti attivi</p>
                </div>
                <button
                    onClick={loadSubscriptions}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Aggiorna
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <StatCard
                    title="Totale Abbonati"
                    value={stats.total}
                    icon={Star}
                    iconColor="text-yellow-600"
                    bgColor="bg-yellow-50"
                />
                <StatCard
                    title="MRR (Stima)"
                    value={formatCurrency(stats.mrr)}
                    icon={CreditCard}
                    iconColor="text-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    title="Mensili"
                    value={stats.monthly}
                    change={`€${(stats.monthly * 9.99).toFixed(2)}/mese`}
                    icon={CreditCard}
                />
                <StatCard
                    title="Annuali"
                    value={stats.yearly}
                    change={`€${(stats.yearly * 59.99).toFixed(2)}/anno`}
                    icon={CreditCard}
                />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'monthly', 'quarterly', 'yearly'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${filter === f
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {f === 'all' ? 'Tutti' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Subscriptions Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Utente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Piano
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Importo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Scadenza
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Promo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Stato
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredSubs.map((sub) => (
                            <tr key={sub.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <p className="font-medium text-gray-900">{sub.userEmail}</p>
                                    <p className="text-xs text-gray-500">ID: {sub.userId.substring(0, 10)}...</p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <Badge variant="info">
                                        {sub.plan === 'monthly' ? 'Mensile' : sub.plan === 'quarterly' ? 'Trimestrale' : 'Annuale'}
                                    </Badge>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <p className="font-medium text-green-600">{formatCurrency(sub.amount)}</p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {sub.expiresAt ? formatDate(sub.expiresAt) : 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {sub.promoCode ? (
                                        <code className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                                            {sub.promoCode}
                                        </code>
                                    ) : (
                                        <span className="text-xs text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <Badge variant="success">Attivo</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
