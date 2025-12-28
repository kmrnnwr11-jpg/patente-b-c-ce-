'use client';

import { useState } from 'react';
import {
    MessageSquare,
    Send,
    Users,
    User,
    Clock,
    Check,
    CheckCheck,
    Search,
    Filter,
    Bell,
    Star,
    AlertTriangle,
    Info,
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

// Mock data
const mockMessages = [
    {
        id: '1',
        recipientType: 'all_students',
        recipientName: 'Tutti gli studenti',
        subject: 'Promemoria Simulazione',
        message: 'Ricordate di completare almeno una simulazione prima di venerdì! 📚',
        messageType: 'reminder',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        readCount: 35,
        totalRecipients: 45,
    },
    {
        id: '2',
        recipientType: 'student',
        recipientName: 'Marco Bianchi',
        subject: 'Complimenti!',
        message: 'Ottimo lavoro Marco! Hai superato l\'obiettivo del 80%. Sei quasi pronto per l\'esame! 🎉',
        messageType: 'congratulation',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        readCount: 1,
        totalRecipients: 1,
    },
    {
        id: '3',
        recipientType: 'student',
        recipientName: 'Lucia Verdi',
        subject: 'Studio Consigliato',
        message: 'Ciao Lucia, ti consiglio di ripassare gli argomenti sulle precedenze prima della prossima lezione.',
        messageType: 'info',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        readCount: 1,
        totalRecipients: 1,
    },
    {
        id: '4',
        recipientType: 'all_students',
        recipientName: 'Tutti gli studenti',
        subject: 'Avviso Importante',
        message: 'La sede rimarrà chiusa il 31 dicembre. Buone feste a tutti! 🎄',
        messageType: 'alert',
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
        readCount: 42,
        totalRecipients: 45,
    },
];

const mockStudents = [
    { id: '1', name: 'Marco Bianchi' },
    { id: '2', name: 'Lucia Verdi' },
    { id: '3', name: 'Paolo Rossi' },
    { id: '4', name: 'Anna Neri' },
];

const messageTypeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    info: { icon: <Info className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
    reminder: { icon: <Bell className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-600' },
    alert: { icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-red-100 text-red-600' },
    congratulation: { icon: <Star className="w-4 h-4" />, color: 'bg-green-100 text-green-600' },
};

export default function MessagesPage() {
    const [messages, setMessages] = useState(mockMessages);
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [filter, setFilter] = useState('all');

    const filteredMessages = messages.filter(m => {
        if (filter === 'all') return true;
        return m.messageType === filter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Messaggi</h1>
                    <p className="text-gray-500 mt-1">Comunica con i tuoi studenti</p>
                </div>
                <button
                    onClick={() => setShowComposeModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Send className="w-5 h-5" />
                    Nuovo Messaggio
                </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={() => setShowComposeModal(true)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Messaggio a Tutti</p>
                            <p className="text-sm text-gray-500">45 studenti</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setShowComposeModal(true)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Promemoria Studio</p>
                            <p className="text-sm text-gray-500">Studenti inattivi</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setShowComposeModal(true)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Congratulazioni</p>
                            <p className="text-sm text-gray-500">Top performers</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setShowComposeModal(true)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Avviso Urgente</p>
                            <p className="text-sm text-gray-500">Notifica importante</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cerca messaggi..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Tutti i tipi</option>
                        <option value="info">Informativi</option>
                        <option value="reminder">Promemoria</option>
                        <option value="alert">Avvisi</option>
                        <option value="congratulation">Congratulazioni</option>
                    </select>
                </div>

                {/* Messages */}
                <div className="divide-y">
                    {filteredMessages.map((message) => (
                        <div key={message.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${messageTypeIcons[message.messageType].color}`}>
                                    {messageTypeIcons[message.messageType].icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900">{message.subject}</h4>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            {message.recipientType === 'all_students' ? (
                                                <Users className="w-3 h-3" />
                                            ) : (
                                                <User className="w-3 h-3" />
                                            )}
                                            {message.recipientName}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTimeAgo(message.sentAt)}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            {message.readCount === message.totalRecipients ? (
                                                <CheckCheck className="w-3 h-3 text-blue-500" />
                                            ) : (
                                                <Check className="w-3 h-3" />
                                            )}
                                            {message.readCount}/{message.totalRecipients} letto
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMessages.length === 0 && (
                    <div className="p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nessun messaggio trovato</p>
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            {showComposeModal && (
                <ComposeMessageModal
                    students={mockStudents}
                    onClose={() => setShowComposeModal(false)}
                />
            )}
        </div>
    );
}

function ComposeMessageModal({
    students,
    onClose
}: {
    students: { id: string; name: string }[];
    onClose: () => void;
}) {
    const [formData, setFormData] = useState({
        recipientType: 'all_students',
        recipientId: '',
        subject: '',
        message: '',
        messageType: 'info',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSent(true);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {!sent ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Nuovo Messaggio</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Destinatario
                                    </label>
                                    <select
                                        value={formData.recipientType}
                                        onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="all_students">Tutti gli studenti</option>
                                        <option value="student">Studente specifico</option>
                                    </select>
                                </div>

                                {formData.recipientType === 'student' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Seleziona Studente
                                        </label>
                                        <select
                                            value={formData.recipientId}
                                            onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Scegli...</option>
                                            {students.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo Messaggio
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { value: 'info', label: '📘 Info', color: 'border-blue-300 bg-blue-50' },
                                            { value: 'reminder', label: '🔔 Promemoria', color: 'border-yellow-300 bg-yellow-50' },
                                            { value: 'alert', label: '⚠️ Avviso', color: 'border-red-300 bg-red-50' },
                                            { value: 'congratulation', label: '🎉 Complimenti', color: 'border-green-300 bg-green-50' },
                                        ].map(type => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, messageType: type.value })}
                                                className={`p-3 border-2 rounded-lg text-sm text-center transition-all ${formData.messageType === type.value
                                                        ? type.color
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Oggetto
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Oggetto del messaggio"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Messaggio *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Scrivi il tuo messaggio..."
                                    />
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
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Invio...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Invia
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Messaggio Inviato!</h2>
                            <p className="text-gray-500 mb-6">
                                Il messaggio è stato inviato con successo.
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
