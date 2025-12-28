'use client';

import { useEffect, useState } from 'react';
import {
    Search,
    MoreHorizontal,
    Eye,
    Phone,
    MessageCircle,
    Star,
    Ban,
    Trash2,
    Copy,
    CheckCircle,
    XCircle,
    RefreshCw
} from 'lucide-react';
import { Badge, SubscriptionBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { formatDate, daysSince, openWhatsApp, copyToClipboard, getInitials } from '@/lib/utils';
import Link from 'next/link';

interface User {
    id: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: string;
    role: string;
    isPremium: boolean;
    subscriptionStatus?: string;
    subscriptionPlan?: string;
    lastActiveAt?: string;
    lastQuizAt?: string;
    totalQuizCompleted?: number;
    isBanned?: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [subscriptionFilter, setSubscriptionFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, search, statusFilter, subscriptionFilter]);

    async function loadUsers() {
        try {
            const snapshot = await getDocs(
                query(collection(firestore, 'users'), orderBy('createdAt', 'desc'))
            );

            const loadedUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                email: doc.data().email || 'N/A',
                displayName: doc.data().displayName || 'Utente',
                phoneNumber: doc.data().phoneNumber,
                photoURL: doc.data().photoURL,
                role: doc.data().role || 'user',
                isPremium: doc.data().isPremium || false,
                subscriptionStatus: doc.data().subscriptionStatus || 'free',
                subscriptionPlan: doc.data().subscriptionPlan,
                lastActiveAt: doc.data().lastActiveAt?.toDate?.()?.toISOString(),
                lastQuizAt: doc.data().lastQuizAt?.toDate?.()?.toISOString(),
                totalQuizCompleted: doc.data().totalQuizCompleted || 0,
                isBanned: doc.data().isBanned || false,
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }));

            setUsers(loadedUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    }

    function filterUsers() {
        let result = [...users];

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(u =>
                u.email.toLowerCase().includes(searchLower) ||
                u.displayName.toLowerCase().includes(searchLower) ||
                u.phoneNumber?.includes(search)
            );
        }

        // Status filter
        if (statusFilter === 'active') {
            result = result.filter(u => !u.isBanned);
        } else if (statusFilter === 'banned') {
            result = result.filter(u => u.isBanned);
        }

        // Subscription filter
        if (subscriptionFilter === 'premium') {
            result = result.filter(u => u.isPremium);
        } else if (subscriptionFilter === 'free') {
            result = result.filter(u => !u.isPremium);
        }

        setFilteredUsers(result);
    }

    async function togglePremium(user: User) {
        const newPremium = !user.isPremium;
        await updateDoc(doc(firestore, 'users', user.id), { isPremium: newPremium });
        setUsers(users.map(u => u.id === user.id ? { ...u, isPremium: newPremium } : u));
    }

    async function toggleBan(user: User) {
        const newBanned = !user.isBanned;
        await updateDoc(doc(firestore, 'users', user.id), { isBanned: newBanned });
        setUsers(users.map(u => u.id === user.id ? { ...u, isBanned: newBanned } : u));
    }

    async function deleteUser(userId: string) {
        if (confirm('Sei sicuro di voler eliminare questo utente? Questa azione è irreversibile.')) {
            await deleteDoc(doc(firestore, 'users', userId));
            setUsers(users.filter(u => u.id !== userId));
        }
    }

    async function setRole(user: User, role: string) {
        await updateDoc(doc(firestore, 'users', user.id), { role });
        setUsers(users.map(u => u.id === user.id ? { ...u, role } : u));
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestione Utenti</h1>
                    <p className="text-gray-500">{filteredUsers.length} utenti trovati</p>
                </div>
                <button
                    onClick={loadUsers}
                    className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Aggiorna
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cerca per email, nome..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="all">Tutti gli stati</option>
                        <option value="active">Attivi</option>
                        <option value="banned">Bannati</option>
                    </select>

                    {/* Subscription Filter */}
                    <select
                        value={subscriptionFilter}
                        onChange={(e) => setSubscriptionFilter(e.target.value)}
                        className="rounded-lg border px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="all">Tutti gli abbonamenti</option>
                        <option value="premium">Premium</option>
                        <option value="free">Free</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Utente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Contatto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Abbonamento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Quiz
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Stato
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Azioni
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-600">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full" />
                                            ) : (
                                                getInitials(user.displayName)
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{user.displayName}</p>
                                                {user.role === 'admin' && (
                                                    <Badge variant="danger">ADMIN</Badge>
                                                )}
                                                {user.role === 'creator' && (
                                                    <Badge variant="info">CREATOR</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.phoneNumber ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">{user.phoneNumber}</span>
                                            <button
                                                onClick={() => copyToClipboard(user.phoneNumber!)}
                                                className="rounded p-1 hover:bg-gray-100"
                                                title="Copia"
                                            >
                                                <Copy className="h-4 w-4 text-gray-400" />
                                            </button>
                                            <button
                                                onClick={() => openWhatsApp(user.phoneNumber!)}
                                                className="rounded p-1 hover:bg-green-50"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle className="h-4 w-4 text-green-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <SubscriptionBadge
                                        status={user.isPremium ? 'active' : 'free'}
                                        plan={user.subscriptionPlan}
                                    />
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{user.totalQuizCompleted || 0}</p>
                                        <p className="text-xs text-gray-500">
                                            {user.lastQuizAt
                                                ? `${daysSince(user.lastQuizAt)} giorni fa`
                                                : 'Mai'
                                            }
                                        </p>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.isBanned ? (
                                        <Badge variant="danger">Bannato</Badge>
                                    ) : (
                                        <Badge variant="success">Attivo</Badge>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="relative">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                                                className="rounded p-1.5 hover:bg-gray-100"
                                                title="Dettagli"
                                            >
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button
                                                onClick={() => togglePremium(user)}
                                                className={`rounded p-1.5 ${user.isPremium ? 'hover:bg-yellow-50' : 'hover:bg-gray-100'}`}
                                                title={user.isPremium ? 'Rimuovi Premium' : 'Rendi Premium'}
                                            >
                                                <Star className={`h-4 w-4 ${user.isPremium ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                                            </button>
                                            <button
                                                onClick={() => toggleBan(user)}
                                                className={`rounded p-1.5 ${user.isBanned ? 'hover:bg-green-50' : 'hover:bg-red-50'}`}
                                                title={user.isBanned ? 'Rimuovi Ban' : 'Banna'}
                                            >
                                                <Ban className={`h-4 w-4 ${user.isBanned ? 'text-green-500' : 'text-red-400'}`} />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="rounded p-1.5 hover:bg-red-50"
                                                title="Elimina"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal */}
            <Modal
                open={showUserModal}
                onClose={() => setShowUserModal(false)}
                title="Dettagli Utente"
                size="lg"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                                {getInitials(selectedUser.displayName)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedUser.displayName}</h3>
                                <p className="text-gray-500">{selectedUser.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                            <div>
                                <p className="text-sm text-gray-500">UID</p>
                                <p className="font-mono text-sm">{selectedUser.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ruolo</p>
                                <p className="font-medium">{selectedUser.role}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Premium</p>
                                <p className="font-medium">{selectedUser.isPremium ? 'Sì' : 'No'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Quiz Completati</p>
                                <p className="font-medium">{selectedUser.totalQuizCompleted || 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Registrato</p>
                                <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ultimo Accesso</p>
                                <p className="font-medium">
                                    {selectedUser.lastActiveAt ? formatDate(selectedUser.lastActiveAt) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => togglePremium(selectedUser)}
                                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${selectedUser.isPremium
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                    }`}
                            >
                                {selectedUser.isPremium ? 'Rimuovi Premium' : 'Rendi Premium'}
                            </button>
                            <button
                                onClick={() => setRole(selectedUser, selectedUser.role === 'admin' ? 'user' : 'admin')}
                                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                                {selectedUser.role === 'admin' ? 'Rimuovi Admin' : 'Rendi Admin'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
