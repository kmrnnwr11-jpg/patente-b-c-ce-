'use client';

import { useEffect, useState } from 'react';
import { Plus, Copy, Banknote, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { formatDate, formatCurrency, copyToClipboard } from '@/lib/utils';

interface Promoter {
    id: string;
    userId: string;
    email: string;
    referralCode: string;
    isActive: boolean;
    level: string;
    commissionRate: number;
    totalReferrals: number;
    activeSubscriptions: number;
    totalEarnings: number;
    pendingPayout: number;
    paidEarnings: number;
    socialLinks?: {
        tiktok?: string;
        instagram?: string;
    };
    createdAt: string;
}

export default function PromotersPage() {
    const [promoters, setPromoters] = useState<Promoter[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedPromoter, setSelectedPromoter] = useState<Promoter | null>(null);
    const [newPromoter, setNewPromoter] = useState({
        userId: '',
        email: '',
        referralCode: '',
        tiktok: '',
        instagram: '',
    });
    const [payoutAmount, setPayoutAmount] = useState(0);

    useEffect(() => {
        loadPromoters();
    }, []);

    async function loadPromoters() {
        try {
            const snapshot = await getDocs(
                query(collection(firestore, 'creators'), orderBy('createdAt', 'desc'))
            );

            const loaded = snapshot.docs.map(doc => ({
                id: doc.id,
                userId: doc.data().userId || '',
                email: doc.data().email || 'N/A',
                referralCode: doc.data().referralCode || 'N/A',
                isActive: doc.data().isActive !== false,
                level: doc.data().level || 'bronze',
                commissionRate: doc.data().commissionRate || 0.15,
                totalReferrals: doc.data().totalReferrals || 0,
                activeSubscriptions: doc.data().activeSubscriptions || 0,
                totalEarnings: doc.data().totalEarnings || 0,
                pendingPayout: doc.data().pendingPayout || 0,
                paidEarnings: doc.data().paidEarnings || 0,
                socialLinks: doc.data().socialLinks,
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }));

            setPromoters(loaded);
        } catch (error) {
            console.error('Error loading promoters:', error);
        } finally {
            setLoading(false);
        }
    }

    async function createPromoter() {
        if (!newPromoter.userId || !newPromoter.referralCode) {
            alert('Inserisci User ID e Codice Referral');
            return;
        }

        try {
            await addDoc(collection(firestore, 'creators'), {
                userId: newPromoter.userId,
                email: newPromoter.email,
                referralCode: newPromoter.referralCode.toUpperCase(),
                isActive: true,
                level: 'bronze',
                commissionRate: 0.15,
                totalReferrals: 0,
                activeSubscriptions: 0,
                totalEarnings: 0,
                pendingPayout: 0,
                paidEarnings: 0,
                socialLinks: {
                    tiktok: newPromoter.tiktok,
                    instagram: newPromoter.instagram,
                },
                createdAt: serverTimestamp(),
            });

            // Update user role to creator
            if (newPromoter.userId) {
                await updateDoc(doc(firestore, 'users', newPromoter.userId), { role: 'creator' });
            }

            setShowCreateModal(false);
            setNewPromoter({ userId: '', email: '', referralCode: '', tiktok: '', instagram: '' });
            loadPromoters();
        } catch (error) {
            console.error('Error creating promoter:', error);
        }
    }

    async function processPayout() {
        if (!selectedPromoter || payoutAmount <= 0) return;

        try {
            await updateDoc(doc(firestore, 'creators', selectedPromoter.id), {
                pendingPayout: selectedPromoter.pendingPayout - payoutAmount,
                paidEarnings: selectedPromoter.paidEarnings + payoutAmount,
            });

            // Add payout record
            await addDoc(collection(firestore, 'payouts'), {
                promoterId: selectedPromoter.id,
                amount: payoutAmount,
                status: 'completed',
                createdAt: serverTimestamp(),
            });

            setShowPayoutModal(false);
            setPayoutAmount(0);
            loadPromoters();
        } catch (error) {
            console.error('Error processing payout:', error);
        }
    }

    function getLevelColor(level: string) {
        switch (level) {
            case 'platinum': return 'bg-purple-100 text-purple-700';
            case 'gold': return 'bg-yellow-100 text-yellow-700';
            case 'silver': return 'bg-gray-100 text-gray-700';
            default: return 'bg-orange-100 text-orange-700';
        }
    }

    const totalPending = promoters.reduce((sum, p) => sum + p.pendingPayout, 0);

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
                    <h1 className="text-2xl font-bold text-gray-900">Gestione Promoter</h1>
                    <p className="text-gray-500">{promoters.length} promoter • {formatCurrency(totalPending)} in attesa</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadPromoters}
                        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                    >
                        <Plus className="h-4 w-4" />
                        Nuovo Promoter
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl border bg-white p-4">
                    <p className="text-sm text-gray-500">Totale Promoter</p>
                    <p className="text-2xl font-bold text-gray-900">{promoters.length}</p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                    <p className="text-sm text-gray-500">Referral Totali</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {promoters.reduce((sum, p) => sum + p.totalReferrals, 0)}
                    </p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                    <p className="text-sm text-gray-500">Guadagni Totali</p>
                    <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(promoters.reduce((sum, p) => sum + p.totalEarnings, 0))}
                    </p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                    <p className="text-sm text-gray-500">Da Pagare</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalPending)}</p>
                </div>
            </div>

            {/* Promoters Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Promoter
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Codice
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Livello
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Referral
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Guadagni
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Pending
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Azioni
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {promoters.map((promoter) => (
                            <tr key={promoter.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{promoter.email}</p>
                                        {promoter.socialLinks?.tiktok && (
                                            <p className="text-xs text-gray-500">TikTok: @{promoter.socialLinks.tiktok}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <code className="rounded bg-purple-100 px-2 py-1 font-mono text-sm font-semibold text-purple-700">
                                            {promoter.referralCode}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(`https://patenteapp.com/ref/${promoter.referralCode}`)}
                                            className="rounded p-1 hover:bg-gray-100"
                                        >
                                            <Copy className="h-4 w-4 text-gray-400" />
                                        </button>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${getLevelColor(promoter.level)}`}>
                                        {promoter.level}
                                    </span>
                                    <p className="text-xs text-gray-500">{(promoter.commissionRate * 100).toFixed(0)}% comm.</p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <p className="font-medium text-gray-900">{promoter.totalReferrals}</p>
                                    <p className="text-xs text-gray-500">{promoter.activeSubscriptions} attivi</p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <p className="font-medium text-green-600">{formatCurrency(promoter.totalEarnings)}</p>
                                    <p className="text-xs text-gray-500">{formatCurrency(promoter.paidEarnings)} pagati</p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <p className={`font-bold ${promoter.pendingPayout > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                                        {formatCurrency(promoter.pendingPayout)}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {promoter.pendingPayout > 0 && (
                                        <button
                                            onClick={() => { setSelectedPromoter(promoter); setPayoutAmount(promoter.pendingPayout); setShowPayoutModal(true); }}
                                            className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            <Banknote className="h-4 w-4" />
                                            Paga
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            <Modal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Aggiungi Nuovo Promoter"
            >
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">User UID (Firebase)</label>
                        <input
                            type="text"
                            value={newPromoter.userId}
                            onChange={(e) => setNewPromoter({ ...newPromoter, userId: e.target.value })}
                            placeholder="Es: abc123xyz..."
                            className="w-full rounded-lg border px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={newPromoter.email}
                            onChange={(e) => setNewPromoter({ ...newPromoter, email: e.target.value })}
                            placeholder="email@esempio.com"
                            className="w-full rounded-lg border px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Codice Referral</label>
                        <input
                            type="text"
                            value={newPromoter.referralCode}
                            onChange={(e) => setNewPromoter({ ...newPromoter, referralCode: e.target.value.toUpperCase() })}
                            placeholder="ES: MARIO_LIVE"
                            className="w-full rounded-lg border px-4 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">TikTok (opzionale)</label>
                            <input
                                type="text"
                                value={newPromoter.tiktok}
                                onChange={(e) => setNewPromoter({ ...newPromoter, tiktok: e.target.value })}
                                placeholder="@username"
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Instagram (opzionale)</label>
                            <input
                                type="text"
                                value={newPromoter.instagram}
                                onChange={(e) => setNewPromoter({ ...newPromoter, instagram: e.target.value })}
                                placeholder="@username"
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={createPromoter}
                            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
                        >
                            Aggiungi Promoter
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Payout Modal */}
            <Modal
                open={showPayoutModal}
                onClose={() => setShowPayoutModal(false)}
                title={`Paga ${selectedPromoter?.email}`}
            >
                {selectedPromoter && (
                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Commissioni in attesa</p>
                            <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedPromoter.pendingPayout)}</p>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Importo da Pagare</label>
                            <input
                                type="number"
                                step="0.01"
                                value={payoutAmount}
                                onChange={(e) => setPayoutAmount(Number(e.target.value))}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                onClick={() => setShowPayoutModal(false)}
                                className="flex-1 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={processPayout}
                                className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                            >
                                Conferma Pagamento
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
