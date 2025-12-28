'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { School, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { SCHOOL_PLANS } from '@/types';

type Plan = 'starter' | 'pro' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';

export default function RegisterSchoolPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Piano
        plan: 'pro' as Plan,
        billingCycle: 'yearly' as BillingCycle,

        // Step 2: Info autoscuola
        name: '',
        businessName: '',
        vatNumber: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',

        // Step 3: Account owner
        ownerName: '',
        ownerEmail: '',
        ownerPassword: '',
        ownerPasswordConfirm: '',
    });

    const handleSubmit = async () => {
        setIsLoading(true);

        // Simula registrazione
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Redirect a dashboard
        router.push('/');
    };

    const getPrice = (plan: Plan, cycle: BillingCycle) => {
        return cycle === 'monthly'
            ? SCHOOL_PLANS[plan].monthlyPrice
            : SCHOOL_PLANS[plan].yearlyPrice;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <School className="w-10 h-10 text-white" />
                        <h1 className="text-3xl font-bold text-white">Patente Quiz Business</h1>
                    </div>
                    <p className="text-indigo-200">
                        La soluzione completa per la tua autoscuola
                    </p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step >= s ? 'bg-white text-indigo-900' : 'bg-indigo-700 text-indigo-300'}
              `}>
                                {step > s ? <Check className="w-5 h-5" /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-white' : 'bg-indigo-700'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Step 1: Scegli Piano */}
                    {step === 1 && (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Scegli il tuo piano</h2>
                            <p className="text-gray-500 mb-6">14 giorni di prova gratuita, nessuna carta richiesta</p>

                            {/* Billing toggle */}
                            <div className="flex justify-center mb-8">
                                <div className="bg-gray-100 rounded-lg p-1 flex">
                                    <button
                                        onClick={() => setFormData({ ...formData, billingCycle: 'monthly' })}
                                        className={`px-4 py-2 rounded-lg transition-colors ${formData.billingCycle === 'monthly'
                                                ? 'bg-white shadow text-gray-900'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        Mensile
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, billingCycle: 'yearly' })}
                                        className={`px-4 py-2 rounded-lg transition-colors ${formData.billingCycle === 'yearly'
                                                ? 'bg-white shadow text-gray-900'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        Annuale
                                        <span className="ml-2 text-green-600 text-sm font-medium">-17%</span>
                                    </button>
                                </div>
                            </div>

                            {/* Plans */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(['starter', 'pro', 'enterprise'] as Plan[]).map((plan) => {
                                    const planData = SCHOOL_PLANS[plan];
                                    const isSelected = formData.plan === plan;
                                    const price = getPrice(plan, formData.billingCycle);

                                    return (
                                        <div
                                            key={plan}
                                            onClick={() => setFormData({ ...formData, plan })}
                                            className={`
                        border-2 rounded-xl p-6 cursor-pointer transition-all
                        ${isSelected
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300'}
                        ${plan === 'pro' ? 'ring-2 ring-indigo-200' : ''}
                      `}
                                        >
                                            {plan === 'pro' && (
                                                <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                                                    PIÙ POPOLARE
                                                </div>
                                            )}

                                            <h3 className="text-xl font-bold text-gray-900">{planData.name}</h3>

                                            <div className="mt-4 mb-4">
                                                <span className="text-3xl font-bold text-gray-900">€{price}</span>
                                                <span className="text-gray-500">
                                                    /{formData.billingCycle === 'monthly' ? 'mese' : 'anno'}
                                                </span>
                                            </div>

                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    <span>
                                                        {planData.maxStudents === -1 ? 'Studenti illimitati' : `Max ${planData.maxStudents} studenti`}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    <span>
                                                        {planData.maxInstructors === -1 ? 'Istruttori illimitati' : `${planData.maxInstructors} istruttori`}
                                                    </span>
                                                </li>
                                                {planData.features.customLogo && (
                                                    <li className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        <span>Logo personalizzato</span>
                                                    </li>
                                                )}
                                                {planData.features.advancedReports && (
                                                    <li className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        <span>Report avanzati</span>
                                                    </li>
                                                )}
                                                {planData.features.apiAccess && (
                                                    <li className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        <span>Accesso API</span>
                                                    </li>
                                                )}
                                                {planData.features.prioritySupport && (
                                                    <li className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        <span>Supporto dedicato</span>
                                                    </li>
                                                )}
                                            </ul>

                                            {isSelected && (
                                                <div className="mt-4 text-center">
                                                    <span className="text-indigo-600 font-medium">✓ Selezionato</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Continua
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Info Autoscuola */}
                    {step === 2 && (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Informazioni Autoscuola</h2>
                            <p className="text-gray-500 mb-6">Inserisci i dati della tua autoscuola</p>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome Autoscuola *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Autoscuola Roma Centro"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ragione Sociale
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Autoscuola Roma Centro SRL"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Partita IVA
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.vatNumber}
                                            onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="IT12345678901"
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
                                            placeholder="+39 06 1234567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Aziendale *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="info@autoscuolaroma.it"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Indirizzo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Via Roma 123"
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Città
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Roma"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Provincia
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.province}
                                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="RM"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CAP
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="00100"
                                            maxLength={5}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Indietro
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.name || !formData.email}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continua
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Account Owner */}
                    {step === 3 && (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Crea il tuo account</h2>
                            <p className="text-gray-500 mb-6">Account amministratore per gestire l'autoscuola</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Mario Rossi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.ownerEmail}
                                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="mario@autoscuolaroma.it"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.ownerPassword}
                                        onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Minimo 8 caratteri"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Conferma Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.ownerPasswordConfirm}
                                        onChange={(e) => setFormData({ ...formData, ownerPasswordConfirm: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ripeti la password"
                                    />
                                </div>

                                {/* Summary */}
                                <div className="bg-gray-50 rounded-xl p-4 mt-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Riepilogo</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Piano</span>
                                            <span className="font-medium">{SCHOOL_PLANS[formData.plan].name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Fatturazione</span>
                                            <span className="font-medium">
                                                {formData.billingCycle === 'monthly' ? 'Mensile' : 'Annuale'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Autoscuola</span>
                                            <span className="font-medium">{formData.name || '-'}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between text-lg">
                                            <span className="font-medium text-gray-900">Totale dopo prova</span>
                                            <span className="font-bold text-indigo-600">
                                                €{getPrice(formData.plan, formData.billingCycle)}
                                                /{formData.billingCycle === 'monthly' ? 'mese' : 'anno'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            14 giorni di prova gratuita. Nessun addebito oggi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex items-center gap-2 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Indietro
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !formData.ownerName || !formData.ownerEmail || !formData.ownerPassword}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            Inizia la Prova Gratuita
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-indigo-200">
                        Hai già un account?{' '}
                        <Link href="/login" className="text-white font-medium hover:underline">
                            Accedi
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
