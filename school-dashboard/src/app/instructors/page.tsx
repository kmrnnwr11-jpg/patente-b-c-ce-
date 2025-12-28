'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    MoreHorizontal,
    Mail,
    Phone,
    Shield,
    UserCog,
    User,
    Clock,
    Check,
    X,
    Send,
} from 'lucide-react';

// Mock data
const mockInstructors = [
    {
        id: '1',
        name: 'Luigi Verdi',
        email: 'luigi.verdi@autoscuola.it',
        phone: '+39 333 1234567',
        role: 'owner',
        isActive: true,
        joinedAt: '2024-01-01',
        studentsCount: 25,
        permissions: {
            viewStudents: true,
            manageStudents: true,
            viewReports: true,
            exportData: true,
            manageInstructors: true,
            billing: true,
        },
    },
    {
        id: '2',
        name: 'Anna Neri',
        email: 'anna.neri@autoscuola.it',
        phone: '+39 333 9876543',
        role: 'admin',
        isActive: true,
        joinedAt: '2024-01-15',
        studentsCount: 12,
        permissions: {
            viewStudents: true,
            manageStudents: true,
            viewReports: true,
            exportData: true,
            manageInstructors: false,
            billing: false,
        },
    },
    {
        id: '3',
        name: 'Giuseppe Bianchi',
        email: 'giuseppe.bianchi@autoscuola.it',
        phone: '+39 333 5555555',
        role: 'instructor',
        isActive: true,
        joinedAt: '2024-02-01',
        studentsCount: 8,
        permissions: {
            viewStudents: true,
            manageStudents: false,
            viewReports: true,
            exportData: false,
            manageInstructors: false,
            billing: false,
        },
    },
    {
        id: '4',
        name: 'Maria Rossi',
        email: 'maria.rossi@email.com',
        phone: null,
        role: 'instructor',
        isActive: false,
        invitedAt: '2024-02-10',
        joinedAt: null,
        studentsCount: 0,
        permissions: {
            viewStudents: true,
            manageStudents: false,
            viewReports: true,
            exportData: false,
            manageInstructors: false,
            billing: false,
        },
    },
];

const roleLabels: Record<string, { label: string; color: string }> = {
    owner: { label: 'Proprietario', color: 'bg-purple-100 text-purple-700' },
    admin: { label: 'Amministratore', color: 'bg-blue-100 text-blue-700' },
    instructor: { label: 'Istruttore', color: 'bg-gray-100 text-gray-700' },
};

export default function InstructorsPage() {
    const router = useRouter();
    const [instructors, setInstructors] = useState(mockInstructors);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState<string | null>(null);

    const planLimit = 5; // Pro plan limit
    const currentCount = instructors.filter(i => i.isActive).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Istruttori</h1>
                    <p className="text-gray-500 mt-1">
                        {currentCount}/{planLimit} istruttori attivi
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    disabled={currentCount >= planLimit}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-5 h-5" />
                    Invita Istruttore
                </button>
            </div>

            {/* Plan usage warning */}
            {currentCount >= planLimit - 1 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                        <p className="font-medium text-yellow-800">
                            {currentCount >= planLimit
                                ? 'Limite istruttori raggiunto'
                                : 'Quasi al limite degli istruttori'}
                        </p>
                        <p className="text-sm text-yellow-600">
                            Passa al piano Enterprise per istruttori illimitati.
                        </p>
                    </div>
                    <button className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                        Upgrade
                    </button>
                </div>
            )}

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instructors.map((instructor) => (
                    <div
                        key={instructor.id}
                        onClick={() => instructor.isActive && router.push(`/instructors/${instructor.id}`)}
                        className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${instructor.isActive
                                ? 'border-gray-100 hover:border-indigo-200 hover:shadow-md cursor-pointer'
                                : 'border-dashed border-gray-300'
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${instructor.isActive ? 'bg-indigo-100' : 'bg-gray-100'
                                    }`}>
                                    <span className={`text-lg font-bold ${instructor.isActive ? 'text-indigo-600' : 'text-gray-400'
                                        }`}>
                                        {instructor.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <h3 className={`font-medium ${instructor.isActive ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                        {instructor.name}
                                    </h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleLabels[instructor.role].color}`}>
                                        {roleLabels[instructor.role].label}
                                    </span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{instructor.email}</span>
                            </div>
                            {instructor.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">{instructor.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        {instructor.isActive ? (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {instructor.studentsCount} studenti
                                    </span>
                                </div>
                                <span className="flex items-center gap-1 text-green-600 text-sm">
                                    <Check className="w-4 h-4" />
                                    Attivo
                                </span>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-orange-600 mb-3">
                                    <Clock className="w-4 h-4" />
                                    Invito in attesa
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100">
                                        <Send className="w-4 h-4" />
                                        Reinvia
                                    </button>
                                    <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Permissions Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Ruoli e Permessi</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="pb-3">Permesso</th>
                                <th className="pb-3 text-center">Proprietario</th>
                                <th className="pb-3 text-center">Amministratore</th>
                                <th className="pb-3 text-center">Istruttore</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="py-3">Visualizza studenti</td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-3">Gestisci studenti</td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-3">Visualizza report</td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-3">Esporta dati</td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-3">Gestisci istruttori</td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                                <td className="py-3 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-3">Fatturazione</td>
                                <td className="py-3 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                <td className="py-3 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                                <td className="py-3 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <InviteInstructorModal onClose={() => setShowInviteModal(false)} />
            )}
        </div>
    );
}

function InviteInstructorModal({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'instructor',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setInviteSent(true);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                    {!inviteSent ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Invita Istruttore</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefono
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ruolo
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="instructor">Istruttore</option>
                                        <option value="admin">Amministratore</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Invio...' : 'Invia Invito'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Invito Inviato!</h2>
                            <p className="text-gray-500 mb-6">
                                {formData.name} riceverà un'email con le istruzioni per accedere.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Chiudi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
