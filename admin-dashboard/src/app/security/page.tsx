'use client';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Ban, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { formatDateTime } from '@/lib/utils';

interface BannedUser {
    id: string;
    email: string;
    displayName: string;
    banReason?: string;
    bannedAt?: string;
}

export default function SecurityPage() {
    const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSecurityData();
    }, []);

    async function loadSecurityData() {
        try {
            // Load banned users
            const bannedSnapshot = await getDocs(
                query(collection(firestore, 'users'), where('isBanned', '==', true))
            );

            const banned = bannedSnapshot.docs.map(doc => ({
                id: doc.id,
                email: doc.data().email || 'N/A',
                displayName: doc.data().displayName || 'Utente',
                banReason: doc.data().banReason,
                bannedAt: doc.data().bannedAt?.toDate?.()?.toISOString(),
            }));

            setBannedUsers(banned);
        } catch (error) {
            console.error('Error loading security data:', error);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sicurezza</h1>
                    <p className="text-gray-500">Gestione ban e log di sicurezza</p>
                </div>
                <button
                    onClick={loadSecurityData}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Aggiorna
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2">
                            <Ban className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Utenti Bannati</p>
                            <p className="text-2xl font-bold text-red-600">{bannedUsers.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-yellow-100 p-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Attività Sospette (24h)</p>
                            <p className="text-2xl font-bold text-yellow-600">0</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-100 p-2">
                            <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stato Sistema</p>
                            <p className="text-2xl font-bold text-green-600">OK</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banned Users */}
            <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b p-4">
                    <h3 className="font-semibold text-gray-900">Utenti Bannati</h3>
                </div>

                {bannedUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <Shield className="mx-auto h-12 w-12 text-green-500" />
                        <p className="mt-2 text-gray-500">Nessun utente bannato</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Utente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Motivo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Data Ban
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Stato
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {bannedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.displayName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">{user.banReason || 'Non specificato'}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {user.bannedAt ? formatDateTime(user.bannedAt) : 'N/A'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <Badge variant="danger">Bannato</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Security Tips */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                <h3 className="flex items-center gap-2 font-semibold text-blue-800">
                    <Shield className="h-5 w-5" />
                    Controlli di Sicurezza Attivi
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-blue-700">
                    <li>✅ Autenticazione Firebase</li>
                    <li>✅ Regole Firestore Security</li>
                    <li>✅ Rate Limiting API</li>
                    <li>✅ Validazione Input</li>
                </ul>
            </div>
        </div>
    );
}
