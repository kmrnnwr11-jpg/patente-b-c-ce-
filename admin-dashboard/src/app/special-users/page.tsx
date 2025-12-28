'use client';

import { useEffect, useState } from 'react';
import {
    Plus,
    MoreHorizontal,
    MessageCircle,
    Send,
    Pause,
    Play,
    Trash2,
    CheckCircle,
    Clock,
    RefreshCw,
    Edit,
    Star
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { formatDate, openWhatsApp, copyToClipboard } from '@/lib/utils';

const USER_TYPES = {
    influencer: { icon: '🎬', label: 'Influencer', color: 'purple' },
    friend: { icon: '👫', label: 'Amico', color: 'blue' },
    family: { icon: '👨‍👩‍👧', label: 'Famiglia', color: 'green' },
    tester: { icon: '🧪', label: 'Tester', color: 'orange' },
    staff: { icon: '👔', label: 'Staff', color: 'indigo' },
    vip: { icon: '⭐', label: 'VIP', color: 'yellow' },
};

interface SpecialUser {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    type: keyof typeof USER_TYPES;
    isActive: boolean;
    validUntil?: string;
    userId?: string;
    userLinked: boolean;
    details?: {
        platform?: string;
        username?: string;
        followers?: number;
        promoCode?: string;
        relationship?: string;
        agreement?: string;
    };
    notes?: string;
    createdAt: string;
}

export default function SpecialUsersPage() {
    const [specialUsers, setSpecialUsers] = useState<SpecialUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState<SpecialUser | null>(null);
    const [typeFilter, setTypeFilter] = useState('all');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        type: 'friend' as keyof typeof USER_TYPES,
        validUntil: '',
        notes: '',
        platform: 'tiktok',
        username: '',
        followers: '',
        promoCode: '',
        relationship: '',
        agreement: '',
    });

    useEffect(() => {
        loadSpecialUsers();
    }, []);

    async function loadSpecialUsers() {
        try {
            const snapshot = await getDocs(
                query(collection(firestore, 'special_users'), orderBy('createdAt', 'desc'))
            );

            const users: SpecialUser[] = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name || 'N/A',
                email: doc.data().email,
                phoneNumber: doc.data().phoneNumber,
                type: doc.data().type || 'vip',
                isActive: doc.data().isActive !== false,
                validUntil: doc.data().validUntil?.toDate?.()?.toISOString(),
                userId: doc.data().userId,
                userLinked: !!doc.data().userId,
                details: doc.data().details || {},
                notes: doc.data().notes,
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }));

            setSpecialUsers(users);
        } catch (error) {
            console.error('Error loading special users:', error);
        } finally {
            setLoading(false);
        }
    }

    async function createSpecialUser() {
        if (!formData.name || (!formData.email && !formData.phoneNumber)) {
            alert('Inserisci nome e almeno email o telefono');
            return;
        }

        try {
            const details: any = {};

            if (formData.type === 'influencer') {
                details.platform = formData.platform;
                details.username = formData.username;
                details.followers = formData.followers ? Number(formData.followers) : null;
                details.promoCode = formData.promoCode;
                details.agreement = formData.agreement;
            } else if (formData.type === 'friend' || formData.type === 'family') {
                details.relationship = formData.relationship;
            }

            await addDoc(collection(firestore, 'special_users'), {
                name: formData.name,
                email: formData.email || null,
                phoneNumber: formData.phoneNumber || null,
                type: formData.type,
                isActive: true,
                validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
                details,
                notes: formData.notes,
                userId: null,
                createdAt: serverTimestamp(),
            });

            resetForm();
            setShowCreateModal(false);
            loadSpecialUsers();
        } catch (error) {
            console.error('Error creating special user:', error);
            alert('Errore nella creazione');
        }
    }

    async function updateSpecialUser() {
        if (!editingUser) return;

        try {
            const details: any = {};

            if (formData.type === 'influencer') {
                details.platform = formData.platform;
                details.username = formData.username;
                details.followers = formData.followers ? Number(formData.followers) : null;
                details.promoCode = formData.promoCode;
                details.agreement = formData.agreement;
            } else if (formData.type === 'friend' || formData.type === 'family') {
                details.relationship = formData.relationship;
            }

            await updateDoc(doc(firestore, 'special_users', editingUser.id), {
                name: formData.name,
                email: formData.email || null,
                phoneNumber: formData.phoneNumber || null,
                type: formData.type,
                validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
                details,
                notes: formData.notes,
            });

            resetForm();
            setEditingUser(null);
            setShowCreateModal(false);
            loadSpecialUsers();
        } catch (error) {
            console.error('Error updating special user:', error);
        }
    }

    async function toggleActive(user: SpecialUser) {
        await updateDoc(doc(firestore, 'special_users', user.id), { isActive: !user.isActive });
        setSpecialUsers(specialUsers.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    }

    async function deleteSpecialUser(id: string) {
        if (confirm('Sei sicuro di voler rimuovere questo utente speciale?')) {
            await deleteDoc(doc(firestore, 'special_users', id));
            setSpecialUsers(specialUsers.filter(u => u.id !== id));
        }
    }

    function resetForm() {
        setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            type: 'friend',
            validUntil: '',
            notes: '',
            platform: 'tiktok',
            username: '',
            followers: '',
            promoCode: '',
            relationship: '',
            agreement: '',
        });
    }

    function openEditModal(user: SpecialUser) {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            type: user.type,
            validUntil: user.validUntil ? user.validUntil.split('T')[0] : '',
            notes: user.notes || '',
            platform: user.details?.platform || 'tiktok',
            username: user.details?.username || '',
            followers: user.details?.followers?.toString() || '',
            promoCode: user.details?.promoCode || '',
            relationship: user.details?.relationship || '',
            agreement: user.details?.agreement || '',
        });
        setShowCreateModal(true);
    }

    const filteredUsers = typeFilter === 'all'
        ? specialUsers
        : specialUsers.filter(u => u.type === typeFilter);

    const stats = {
        total: specialUsers.length,
        byType: Object.keys(USER_TYPES).reduce((acc, type) => {
            acc[type] = specialUsers.filter(u => u.type === type).length;
            return acc;
        }, {} as Record<string, number>),
        notLinked: specialUsers.filter(u => !u.userLinked).length,
        active: specialUsers.filter(u => u.isActive).length,
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
                    <h1 className="text-2xl font-bold text-gray-900">Utenti Speciali</h1>
                    <p className="text-gray-500">Gestisci influencer, amici, parenti e altri utenti con accesso gratuito</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadSpecialUsers}
                        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => { resetForm(); setEditingUser(null); setShowCreateModal(true); }}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                    >
                        <Plus className="h-4 w-4" />
                        Aggiungi Utente Speciale
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                {Object.entries(USER_TYPES).map(([type, config]) => (
                    <button
                        key={type}
                        onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
                        className={`rounded-xl border p-4 text-left transition-all ${typeFilter === type
                                ? 'border-purple-300 bg-purple-50 ring-2 ring-purple-500'
                                : 'bg-white hover:border-gray-300'
                            }`}
                    >
                        <span className="text-2xl">{config.icon}</span>
                        <p className="mt-2 text-2xl font-bold">{stats.byType[type] || 0}</p>
                        <p className="text-sm text-gray-500">{config.label}</p>
                    </button>
                ))}
            </div>

            {/* Alert for not registered */}
            {stats.notLinked > 0 && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <div>
                            <p className="font-medium text-orange-800">
                                {stats.notLinked} utenti non ancora registrati
                            </p>
                            <p className="text-sm text-orange-600">
                                Questi utenti sono stati aggiunti ma non hanno ancora creato un account nell&apos;app.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Utente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Contatto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Account App
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Scadenza
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
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        {user.details?.username && (
                                            <p className="text-sm text-gray-500">{user.details.username}</p>
                                        )}
                                        {user.details?.relationship && (
                                            <p className="text-sm text-gray-500">{user.details.relationship}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium bg-${USER_TYPES[user.type].color}-100 text-${USER_TYPES[user.type].color}-700`}>
                                        {USER_TYPES[user.type].icon} {USER_TYPES[user.type].label}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        {user.email && <p className="text-sm">{user.email}</p>}
                                        {user.phoneNumber && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{user.phoneNumber}</span>
                                                <button
                                                    onClick={() => openWhatsApp(user.phoneNumber!)}
                                                    className="rounded p-1 hover:bg-green-50"
                                                >
                                                    <MessageCircle className="h-4 w-4 text-green-500" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.userLinked ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-sm">Registrato</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-orange-600">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-sm">Non registrato</span>
                                        </div>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {user.validUntil ? (
                                        <span className="text-sm">{formatDate(user.validUntil)}</span>
                                    ) : (
                                        <span className="text-sm text-green-600">♾️ Illimitato</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <Badge variant={user.isActive ? 'success' : 'danger'}>
                                        {user.isActive ? 'Attivo' : 'Disattivato'}
                                    </Badge>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="rounded p-1.5 hover:bg-gray-100"
                                            title="Modifica"
                                        >
                                            <Edit className="h-4 w-4 text-gray-500" />
                                        </button>
                                        {user.phoneNumber && (
                                            <button
                                                onClick={() => openWhatsApp(user.phoneNumber!)}
                                                className="rounded p-1.5 hover:bg-green-50"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle className="h-4 w-4 text-green-500" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => toggleActive(user)}
                                            className="rounded p-1.5 hover:bg-gray-100"
                                            title={user.isActive ? 'Disattiva' : 'Attiva'}
                                        >
                                            {user.isActive ? (
                                                <Pause className="h-4 w-4 text-orange-500" />
                                            ) : (
                                                <Play className="h-4 w-4 text-green-500" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => deleteSpecialUser(user.id)}
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

                {filteredUsers.length === 0 && (
                    <div className="py-12 text-center">
                        <Star className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-gray-500">Nessun utente speciale trovato</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                open={showCreateModal}
                onClose={() => { setShowCreateModal(false); setEditingUser(null); resetForm(); }}
                title={editingUser ? 'Modifica Utente Speciale' : 'Aggiungi Utente Speciale'}
                size="lg"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Questa persona avrà accesso Premium GRATUITO all&apos;app.
                    </p>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Nome *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Mario Rossi"
                            className="w-full rounded-lg border px-4 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="mario@email.com"
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Telefono</label>
                            <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="+393331234567"
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">
                        Inserisci almeno email o telefono. Quando si registra con questi dati, avrà automaticamente Premium gratis.
                    </p>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Tipo *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as keyof typeof USER_TYPES })}
                            className="w-full rounded-lg border px-4 py-2"
                        >
                            {Object.entries(USER_TYPES).map(([type, config]) => (
                                <option key={type} value={type}>
                                    {config.icon} {config.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Influencer Details */}
                    {formData.type === 'influencer' && (
                        <div className="rounded-lg bg-purple-50 p-4 space-y-3">
                            <p className="font-medium text-purple-800">Dettagli Influencer</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">Piattaforma</label>
                                    <select
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                        className="w-full rounded-lg border px-3 py-2"
                                    >
                                        <option value="tiktok">TikTok</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="facebook">Facebook</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="@mario_patente"
                                        className="w-full rounded-lg border px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">Follower</label>
                                    <input
                                        type="number"
                                        value={formData.followers}
                                        onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                                        placeholder="50000"
                                        className="w-full rounded-lg border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-700">Codice Promo</label>
                                    <input
                                        type="text"
                                        value={formData.promoCode}
                                        onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
                                        placeholder="MARIO_LIVE"
                                        className="w-full rounded-lg border px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-gray-700">Accordo</label>
                                <textarea
                                    value={formData.agreement}
                                    onChange={(e) => setFormData({ ...formData, agreement: e.target.value })}
                                    placeholder="Es: 2 video al mese..."
                                    rows={2}
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                            </div>
                        </div>
                    )}

                    {/* Friend/Family Details */}
                    {(formData.type === 'friend' || formData.type === 'family') && (
                        <div className="rounded-lg bg-blue-50 p-4">
                            <label className="mb-1 block text-sm font-medium text-blue-800">Relazione</label>
                            <input
                                type="text"
                                value={formData.relationship}
                                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                placeholder={formData.type === 'family' ? 'Es: Cugino, Zio...' : 'Es: Amico università...'}
                                className="w-full rounded-lg border px-3 py-2"
                            />
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Scadenza</label>
                        <input
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                            className="w-full rounded-lg border px-4 py-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">Lascia vuoto per accesso illimitato</p>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Perché questa persona ha accesso gratuito..."
                            rows={2}
                            className="w-full rounded-lg border px-4 py-2"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={() => { setShowCreateModal(false); setEditingUser(null); resetForm(); }}
                            className="flex-1 rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={editingUser ? updateSpecialUser : createSpecialUser}
                            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
                        >
                            {editingUser ? 'Salva Modifiche' : 'Aggiungi'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
