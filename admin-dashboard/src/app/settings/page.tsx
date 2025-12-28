'use client';

import { useState } from 'react';
import { Save, CreditCard, Clock, Gift, Users } from 'lucide-react';

export default function SettingsPage() {
    const [pricing, setPricing] = useState({
        monthly: 9.99,
        quarterly: 24.99,
        yearly: 59.99,
    });

    const [trial, setTrial] = useState({
        enabled: true,
        days: 7,
    });

    const [commissions, setCommissions] = useState({
        bronze: 15,
        silver: 20,
        gold: 25,
        platinum: 30,
    });

    const [saving, setSaving] = useState(false);

    async function saveSettings() {
        setSaving(true);
        // In production, save to Firestore
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Impostazioni salvate!');
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
                <p className="text-gray-500">Configurazione generale dell&apos;app</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pricing */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        Prezzi Abbonamenti
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Mensile (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={pricing.monthly}
                                onChange={(e) => setPricing({ ...pricing, monthly: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Trimestrale (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={pricing.quarterly}
                                onChange={(e) => setPricing({ ...pricing, quarterly: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Annuale (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={pricing.yearly}
                                onChange={(e) => setPricing({ ...pricing, yearly: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Trial Settings */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Periodo di Prova
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Trial Attivo</span>
                            <button
                                onClick={() => setTrial({ ...trial, enabled: !trial.enabled })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${trial.enabled ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${trial.enabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Durata Trial (giorni)</label>
                            <input
                                type="number"
                                value={trial.days}
                                onChange={(e) => setTrial({ ...trial, days: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Commission Rates */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                        <Gift className="h-5 w-5 text-green-600" />
                        Commissioni Promoter (%)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-orange-600">🥉 Bronze</label>
                            <input
                                type="number"
                                value={commissions.bronze}
                                onChange={(e) => setCommissions({ ...commissions, bronze: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-500">🥈 Silver</label>
                            <input
                                type="number"
                                value={commissions.silver}
                                onChange={(e) => setCommissions({ ...commissions, silver: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-yellow-600">🥇 Gold</label>
                            <input
                                type="number"
                                value={commissions.gold}
                                onChange={(e) => setCommissions({ ...commissions, gold: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-purple-600">💎 Platinum</label>
                            <input
                                type="number"
                                value={commissions.platinum}
                                onChange={(e) => setCommissions({ ...commissions, platinum: Number(e.target.value) })}
                                className="w-full rounded-lg border px-4 py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Admin Info */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                        <Users className="h-5 w-5 text-red-600" />
                        Informazioni Admin
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email Admin</span>
                            <span className="font-medium">kmrnnwr11@gmail.com</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Ruolo</span>
                            <span className="rounded bg-red-100 px-2 py-0.5 text-sm font-medium text-red-700">Super Admin</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Progetto Firebase</span>
                            <span className="font-mono text-sm">patente-b-2025</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                    {saving ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Salva Impostazioni
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
