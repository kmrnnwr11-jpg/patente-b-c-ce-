'use client';

import { useState } from 'react';
import { Bell, Send, Users, User } from 'lucide-react';

export default function NotificationsPage() {
    const [targetType, setTargetType] = useState<'all' | 'segment' | 'user'>('all');
    const [targetUserId, setTargetUserId] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    async function sendNotification() {
        if (!title || !body) {
            alert('Inserisci titolo e messaggio');
            return;
        }

        setSending(true);

        // In production, this would call a Cloud Function to send push notifications
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Notifica inviata con successo!');
            setTitle('');
            setBody('');
        } catch (error) {
            alert('Errore nell\'invio della notifica');
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifiche</h1>
                <p className="text-gray-500">Invia notifiche push agli utenti</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Send Notification */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                        <Bell className="h-5 w-5 text-purple-600" />
                        Invia Notifica Push
                    </h3>

                    <div className="space-y-4">
                        {/* Target Selection */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Destinatari</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTargetType('all')}
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${targetType === 'all'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Users className="h-4 w-4" />
                                    Tutti
                                </button>
                                <button
                                    onClick={() => setTargetType('segment')}
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${targetType === 'segment'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Segmento
                                </button>
                                <button
                                    onClick={() => setTargetType('user')}
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${targetType === 'user'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <User className="h-4 w-4" />
                                    Singolo
                                </button>
                            </div>
                        </div>

                        {targetType === 'user' && (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">User ID</label>
                                <input
                                    type="text"
                                    value={targetUserId}
                                    onChange={(e) => setTargetUserId(e.target.value)}
                                    placeholder="Inserisci UID utente"
                                    className="w-full rounded-lg border px-4 py-2"
                                />
                            </div>
                        )}

                        {targetType === 'segment' && (
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Filtri segmento:</p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" className="rounded" />
                                        Utenti Free
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" className="rounded" />
                                        Inattivi 7g+
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" className="rounded" />
                                        Premium
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" className="rounded" />
                                        Trial
                                    </label>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Titolo</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Es: Non perdere le novità!"
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Messaggio</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Es: Abbiamo aggiunto nuove domande. Torna a studiare!"
                                rows={4}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>

                        <button
                            onClick={sendNotification}
                            disabled={sending}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                        >
                            {sending ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <Send className="h-5 w-5" />
                                    Invia Notifica
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 font-semibold text-gray-900">Anteprima</h3>

                    <div className="rounded-xl bg-gray-900 p-4">
                        <div className="rounded-lg bg-white p-4 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                    <span className="text-xl">🚗</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{title || 'Titolo notifica'}</p>
                                    <p className="text-sm text-gray-600">{body || 'Messaggio della notifica...'}</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-center text-xs text-gray-400">Patente B Quiz</p>
                    </div>

                    {/* Quick Templates */}
                    <div className="mt-6">
                        <h4 className="mb-3 text-sm font-medium text-gray-700">Template Rapidi</h4>
                        <div className="space-y-2">
                            <button
                                onClick={() => { setTitle('Ti manchiamo! 😢'); setBody('Non fai quiz da una settimana. Torna a studiare per la patente!'); }}
                                className="w-full rounded-lg border p-3 text-left text-sm hover:bg-gray-50"
                            >
                                <p className="font-medium">Richiamo Utenti Inattivi</p>
                                <p className="text-gray-500">Ti manchiamo! 😢</p>
                            </button>
                            <button
                                onClick={() => { setTitle('🎉 Nuovo Quiz Disponibile!'); setBody('Abbiamo aggiunto 50 nuove domande. Provale subito!'); }}
                                className="w-full rounded-lg border p-3 text-left text-sm hover:bg-gray-50"
                            >
                                <p className="font-medium">Nuovi Contenuti</p>
                                <p className="text-gray-500">🎉 Nuovo Quiz Disponibile!</p>
                            </button>
                            <button
                                onClick={() => { setTitle('⚡ Offerta Speciale!'); setBody('Solo oggi: 30% di sconto sull\'abbonamento Premium!'); }}
                                className="w-full rounded-lg border p-3 text-left text-sm hover:bg-gray-50"
                            >
                                <p className="font-medium">Promo/Sconto</p>
                                <p className="text-gray-500">⚡ Offerta Speciale!</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
