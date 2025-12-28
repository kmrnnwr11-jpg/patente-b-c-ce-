'use client';

import { useEffect, useState } from 'react';
import { Plus, Copy, ToggleLeft, ToggleRight, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { formatDate, copyToClipboard } from '@/lib/utils';

interface PromoCode {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    maxUses?: number;
    usedCount: number;
    isActive: boolean;
    description?: string;
    validUntil?: string;
    createdAt: string;
}

export default function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCode, setNewCode] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: 20,
        maxUses: '',
        description: '',
    });

    useEffect(() => {
        loadPromoCodes();
    }, []);

    async function loadPromoCodes() {
        try {
            const snapshot = await getDocs(
                query(collection(firestore, 'promocodes'), orderBy('createdAt', 'desc'))
            );

            const codes = snapshot.docs.map(doc => ({
                id: doc.id,
                code: doc.data().code || 'N/A',
                discountType: doc.data().discountType || 'percentage',
                discountValue: doc.data().discountValue || 0,
                maxUses: doc.data().maxUses,
                usedCount: doc.data().usedCount || 0,
                isActive: doc.data().isActive !== false,
                description: doc.data().description,
                validUntil: doc.data().validUntil?.toDate?.()?.toISOString(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }));

            setPromoCodes(codes);
        } catch (error) {
            console.error('Error loading promo codes:', error);
        } finally {
            setLoading(false);
        }
    }

    async function createPromoCode() {
        if (!newCode.code) {
            alert('Inserisci un codice');
            return;
        }

        try {
            await addDoc(collection(firestore, 'promocodes'), {
                code: newCode.code.toUpperCase(),
                discountType: newCode.discountType,
                discountValue: Number(newCode.discountValue),
                maxUses: newCode.maxUses ? Number(newCode.maxUses) : null,
                usedCount: 0,
                isActive: true,
                description: newCode.description,
                createdAt: serverTimestamp(),
            });

            setShowCreateModal(false);
            setNewCode({ code: '', discountType: 'percentage', discountValue: 20, maxUses: '', description: '' });
            loadPromoCodes();
        } catch (error) {
            console.error('Error creating promo code:', error);
        }
    }

    async function toggleActive(promo: PromoCode) {
        await updateDoc(doc(firestore, 'promocodes', promo.id), { isActive: !promo.isActive });
        setPromoCodes(promoCodes.map(p => p.id === promo.id ? { ...p, isActive: !p.isActive } : p));
    }

    async function deletePromo(id: string) {
        if (confirm('Sei sicuro di voler eliminare questo codice promo?')) {
            await deleteDoc(doc(firestore, 'promocodes', id));
            setPromoCodes(promoCodes.filter(p => p.id !== id));
        }
    }

    function generateRandomCode() {
        const code = 'PROMO' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setNewCode({ ...newCode, code });
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
                    <p className="text-gray-500">{promoCodes.length} codici totali</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadPromoCodes}
                        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                    >
                        <Plus className="h-4 w-4" />
                        Nuovo Codice
                    </button>
                </div>
            </div>

            {/* Promo Codes Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Codice
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Sconto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Utilizzi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Stato
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Creato
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Azioni
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {promoCodes.map((promo) => (
                            <tr key={promo.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <code className="rounded bg-purple-100 px-2 py-1 font-mono text-sm font-semibold text-purple-700">
                                            {promo.code}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(promo.code)}
                                            className="rounded p-1 hover:bg-gray-100"
                                        >
                                            <Copy className="h-4 w-4 text-gray-400" />
                                        </button>
                                    </div>
                                    {promo.description && (
                                        <p className="mt-1 text-xs text-gray-500">{promo.description}</p>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="text-lg font-bold text-green-600">
                                        {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `€${promo.discountValue}`}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {promo.discountType === 'percentage' ? 'Percentuale' : promo.discountType === 'fixed_amount' ? 'Fisso' : 'Giorni gratis'}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="font-medium">{promo.usedCount}</span>
                                    {promo.maxUses && (
                                        <span className="text-gray-500">/{promo.maxUses}</span>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        {promo.maxUses ? `${promo.maxUses - promo.usedCount} rimanenti` : 'Illimitati'}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <Badge variant={promo.isActive ? 'success' : 'danger'}>
                                        {promo.isActive ? 'Attivo' : 'Disattivato'}
                                    </Badge>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {formatDate(promo.createdAt)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleActive(promo)}
                                            className="rounded p-1.5 hover:bg-gray-100"
                                            title={promo.isActive ? 'Disattiva' : 'Attiva'}
                                        >
                                            {promo.isActive ? (
                                                <ToggleRight className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <ToggleLeft className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => deletePromo(promo.id)}
                                            className="rounded p-1.5 hover:bg-red-50"
                                            title="Elimina"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </button>
                                    </div>
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
                title="Crea Nuovo Promo Code"
            >
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Codice</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCode.code}
                                onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase() })}
                                placeholder="ES: SUMMER2024"
                                className="flex-1 rounded-lg border px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            <button
                                onClick={generateRandomCode}
                                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                            >
                                Genera
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo Sconto</label>
                            <select
                                value={newCode.discountType}
                                onChange={(e) => setNewCode({ ...newCode, discountType: e.target.value })}
                                className="w-full rounded-lg border px-4 py-2"
                            >
                                <option value="percentage">Percentuale (%)</option>
                                <option value="fixed_amount">Importo Fisso (€)</option>
                                <option value="days_free">Giorni Gratis</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Valore</label>
                            <input
                                type="number"
                                value={newCode.discountValue}
                                onChange={(e) => setNewCode({ ...newCode, discountValue: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Max Utilizzi (vuoto = illimitati)</label>
                        <input
                            type="number"
                            value={newCode.maxUses}
                            onChange={(e) => setNewCode({ ...newCode, maxUses: e.target.value })}
                            placeholder="Es: 100"
                            className="w-full rounded-lg border px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Descrizione (opzionale)</label>
                        <input
                            type="text"
                            value={newCode.description}
                            onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                            placeholder="Es: Sconto estate 2024"
                            className="w-full rounded-lg border px-4 py-2"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="flex-1 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={createPromoCode}
                            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
                        >
                            Crea Codice
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
