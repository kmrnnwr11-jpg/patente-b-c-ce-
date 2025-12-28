'use client';

import { useState } from 'react';
import {
    Settings,
    Building,
    Palette,
    Bell,
    Shield,
    Save,
    Upload,
    Copy,
    Check,
    Eye,
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [schoolData, setSchoolData] = useState({
        name: 'Autoscuola Roma Centro',
        businessName: 'Autoscuola Roma Centro SRL',
        vatNumber: 'IT12345678901',
        email: 'info@autoscuolaroma.it',
        phone: '+39 06 1234567',
        address: 'Via Roma 123',
        city: 'Roma',
        province: 'RM',
        postalCode: '00100',
        schoolCode: 'AUTO-ROMA-A1B2C3',
    });

    const [branding, setBranding] = useState({
        primaryColor: '#4F46E5',
        logoUrl: '',
    });

    const [notifications, setNotifications] = useState({
        emailNewStudent: true,
        emailExamReady: true,
        emailWeeklyReport: true,
        emailInactiveStudents: true,
    });

    const handleCopyCode = async () => {
        await copyToClipboard(schoolData.schoolCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
    };

    const tabs = [
        { id: 'general', label: 'Generale', icon: Building },
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'notifications', label: 'Notifiche', icon: Bell },
        { id: 'security', label: 'Sicurezza', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
                <p className="text-gray-500 mt-1">Gestisci le impostazioni della tua autoscuola</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-100">
                    <nav className="flex -mb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            {/* School Code */}
                            <div className="bg-indigo-50 rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Codice Autoscuola</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Condividi questo codice con i tuoi studenti
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <code className="text-2xl font-mono font-bold text-indigo-600">
                                                {schoolData.schoolCode}
                                            </code>
                                            <button
                                                onClick={handleCopyCode}
                                                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                                            >
                                                {copied ? (
                                                    <Check className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-indigo-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm">
                                            {/* QR Code placeholder */}
                                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                                QR Code
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* School Info Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome Autoscuola
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.name}
                                        onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ragione Sociale
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.businessName}
                                        onChange={(e) => setSchoolData({ ...schoolData, businessName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Partita IVA
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.vatNumber}
                                        onChange={(e) => setSchoolData({ ...schoolData, vatNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={schoolData.email}
                                        onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefono
                                    </label>
                                    <input
                                        type="tel"
                                        value={schoolData.phone}
                                        onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Indirizzo
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.address}
                                        onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Città
                                        </label>
                                        <input
                                            type="text"
                                            value={schoolData.city}
                                            onChange={(e) => setSchoolData({ ...schoolData, city: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prov.
                                        </label>
                                        <input
                                            type="text"
                                            value={schoolData.province}
                                            onChange={(e) => setSchoolData({ ...schoolData, province: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CAP
                                        </label>
                                        <input
                                            type="text"
                                            value={schoolData.postalCode}
                                            onChange={(e) => setSchoolData({ ...schoolData, postalCode: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            maxLength={5}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Branding Tab */}
                    {activeTab === 'branding' && (
                        <div className="space-y-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <p className="text-sm text-yellow-800">
                                    💡 <strong>Piano Pro richiesto:</strong> Il branding personalizzato è disponibile solo con il piano Pro o Enterprise.
                                </p>
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Logo Autoscuola
                                </label>
                                <div className="flex items-start gap-6">
                                    <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                        {branding.logoUrl ? (
                                            <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                                        ) : (
                                            <Upload className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                            Carica Logo
                                        </button>
                                        <p className="text-sm text-gray-500 mt-2">
                                            PNG, JPG fino a 2MB. <br />
                                            Dimensioni consigliate: 512x512px
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Primary Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Colore Primario
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={branding.primaryColor}
                                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                        className="w-16 h-16 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={branding.primaryColor}
                                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                                        placeholder="#4F46E5"
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Anteprima nell'App
                                </label>
                                <div className="bg-gray-100 rounded-xl p-6">
                                    <div
                                        className="rounded-xl p-4 text-white"
                                        style={{ backgroundColor: branding.primaryColor }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {branding.logoUrl ? (
                                                <img src={branding.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg bg-white" />
                                            ) : (
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                    <Building className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold">{schoolData.name}</p>
                                                <p className="text-sm opacity-80">Accesso Premium Incluso</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <p className="text-gray-600">
                                Scegli quali notifiche email ricevere
                            </p>

                            <div className="space-y-4">
                                {[
                                    { key: 'emailNewStudent', label: 'Nuovo studente iscritto', description: 'Quando uno studente usa il codice autoscuola' },
                                    { key: 'emailExamReady', label: 'Studente pronto per esame', description: 'Quando uno studente raggiunge l\'obiettivo' },
                                    { key: 'emailWeeklyReport', label: 'Report settimanale', description: 'Riepilogo delle attività ogni lunedì' },
                                    { key: 'emailInactiveStudents', label: 'Studenti inattivi', description: 'Quando uno studente è inattivo da 7+ giorni' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.key as keyof typeof notifications]}
                                                onChange={(e) => setNotifications({
                                                    ...notifications,
                                                    [item.key]: e.target.checked
                                                })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Cambia Password</h3>
                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Password Attuale
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nuova Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Conferma Nuova Password
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                        Aggiorna Password
                                    </button>
                                </div>
                            </div>

                            <hr />

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Sessioni Attive</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Eye className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Questo dispositivo</p>
                                                <p className="text-sm text-gray-500">Chrome su macOS • Roma, IT</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-green-600 font-medium">Attivo ora</span>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div>
                                <h3 className="font-semibold text-red-600 mb-4">Zona Pericolosa</h3>
                                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                                    Elimina Account Autoscuola
                                </button>
                                <p className="text-sm text-gray-500 mt-2">
                                    Questa azione è irreversibile e comporterà la perdita di tutti i dati.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-6 border-t mt-6">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Salvataggio...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Salva Modifiche
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
