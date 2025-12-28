'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    CreditCard,
    Check,
    AlertTriangle,
    Download,
    FileText,
    Zap,
    Users,
    Shield,
    ArrowRight,
    Calendar,
    ChevronDown,
} from 'lucide-react';
import { SCHOOL_PLANS } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

type Plan = 'starter' | 'pro' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';

// Mock data
const mockSubscription = {
    id: 'sub_123',
    plan: 'pro' as Plan,
    billingCycle: 'yearly' as BillingCycle,
    amount: 990,
    status: 'active',
    currentPeriodStart: '2024-01-01',
    currentPeriodEnd: '2024-12-31',
    cancelAtPeriodEnd: false,
    extraStudents: 5,
    extraStudentsCost: 7.5,
};

const mockInvoices = [
    { id: 'inv_1', number: 'INV-2024-001', amount: 990, status: 'paid', issuedAt: '2024-01-01', pdfUrl: '#' },
    { id: 'inv_2', number: 'INV-2023-012', amount: 99, status: 'paid', issuedAt: '2023-12-01', pdfUrl: '#' },
    { id: 'inv_3', number: 'INV-2023-011', amount: 99, status: 'paid', issuedAt: '2023-11-01', pdfUrl: '#' },
];

const mockPaymentMethod = {
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expMonth: 12,
    expYear: 2025,
};

export default function BillingPage() {
    const [subscription] = useState(mockSubscription);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const currentPlan = SCHOOL_PLANS[subscription.plan];
    const daysRemaining = Math.ceil(
        (new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/settings" className="hover:text-gray-700">Impostazioni</Link>
                <span>/</span>
                <span className="text-gray-900">Abbonamento e Fatturazione</span>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Abbonamento e Fatturazione</h1>
                <p className="text-gray-500 mt-1">Gestisci il tuo piano e i pagamenti</p>
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                Piano Attivo
                            </span>
                            {subscription.cancelAtPeriodEnd && (
                                <span className="px-3 py-1 bg-red-500/30 rounded-full text-sm font-medium">
                                    In cancellazione
                                </span>
                            )}
                        </div>

                        <h2 className="text-3xl font-bold mb-2">{currentPlan.name}</h2>

                        <p className="text-indigo-200 mb-4">
                            {formatCurrency(subscription.amount)} / {subscription.billingCycle === 'monthly' ? 'mese' : 'anno'}
                            {subscription.extraStudents > 0 && (
                                <span className="text-sm ml-2">
                                    + {formatCurrency(subscription.extraStudentsCost)}/mese studenti extra
                                </span>
                            )}
                        </p>

                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Rinnovo: {formatDate(subscription.currentPeriodEnd)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                <span>{daysRemaining} giorni rimanenti</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setShowPlanModal(true)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
                        >
                            <Zap className="w-5 h-5" />
                            Cambia Piano
                        </button>
                        {!subscription.cancelAtPeriodEnd && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="text-sm text-indigo-200 hover:text-white"
                            >
                                Annulla abbonamento
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Plan Features & Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Features */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Il tuo Piano Include</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {currentPlan.maxStudents === -1 ? 'Studenti illimitati' : `Fino a ${currentPlan.maxStudents} studenti`}
                                </p>
                                <p className="text-sm text-gray-500">Aggiungi studenti extra a €{currentPlan.extraStudentCost}/mese</p>
                            </div>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {currentPlan.maxInstructors === -1 ? 'Istruttori illimitati' : `${currentPlan.maxInstructors} istruttori`}
                                </p>
                            </div>
                        </li>
                        {currentPlan.features.customLogo && (
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-4 h-4 text-purple-600" />
                                </div>
                                <p className="font-medium text-gray-900">Logo personalizzato nell'app</p>
                            </li>
                        )}
                        {currentPlan.features.advancedReports && (
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-4 h-4 text-orange-600" />
                                </div>
                                <p className="font-medium text-gray-900">Report avanzati e analytics</p>
                            </li>
                        )}
                        {currentPlan.features.apiAccess && (
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-4 h-4 text-cyan-600" />
                                </div>
                                <p className="font-medium text-gray-900">Accesso API</p>
                            </li>
                        )}
                        {currentPlan.features.prioritySupport && (
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-4 h-4 text-pink-600" />
                                </div>
                                <p className="font-medium text-gray-900">Supporto prioritario</p>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Usage */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Utilizzo Attuale</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600">Studenti</span>
                                <span className="font-medium text-gray-900">
                                    45 / {currentPlan.maxStudents === -1 ? '∞' : currentPlan.maxStudents}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-indigo-600 h-3 rounded-full"
                                    style={{ width: currentPlan.maxStudents === -1 ? '20%' : `${(45 / currentPlan.maxStudents) * 100}%` }}
                                />
                            </div>
                            {subscription.extraStudents > 0 && (
                                <p className="text-sm text-orange-600 mt-2">
                                    +{subscription.extraStudents} studenti extra ({formatCurrency(subscription.extraStudentsCost)}/mese)
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600">Istruttori</span>
                                <span className="font-medium text-gray-900">
                                    3 / {currentPlan.maxInstructors === -1 ? '∞' : currentPlan.maxInstructors}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-green-500 h-3 rounded-full"
                                    style={{ width: currentPlan.maxInstructors === -1 ? '30%' : `${(3 / currentPlan.maxInstructors) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Metodo di Pagamento</h3>
                    <button className="text-indigo-600 text-sm font-medium hover:underline">
                        Modifica
                    </button>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold uppercase">
                        {mockPaymentMethod.brand}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">•••• •••• •••• {mockPaymentMethod.last4}</p>
                        <p className="text-sm text-gray-500">Scade {mockPaymentMethod.expMonth}/{mockPaymentMethod.expYear}</p>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Storico Fatture</h3>
                </div>
                <div className="divide-y">
                    {mockInvoices.map((invoice) => (
                        <div key={invoice.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{invoice.number}</p>
                                    <p className="text-sm text-gray-500">{formatDate(invoice.issuedAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${invoice.status === 'paid'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {invoice.status === 'paid' ? 'Pagata' : 'In attesa'}
                                </span>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Download className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Change Plan Modal */}
            {showPlanModal && (
                <ChangePlanModal
                    currentPlan={subscription.plan}
                    currentCycle={subscription.billingCycle}
                    onClose={() => setShowPlanModal(false)}
                />
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <CancelSubscriptionModal onClose={() => setShowCancelModal(false)} />
            )}
        </div>
    );
}

function ChangePlanModal({
    currentPlan,
    currentCycle,
    onClose,
}: {
    currentPlan: Plan;
    currentCycle: BillingCycle;
    onClose: () => void;
}) {
    const [selectedPlan, setSelectedPlan] = useState<Plan>(currentPlan);
    const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(currentCycle);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePlan = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        onClose();
    };

    const getPrice = (plan: Plan, cycle: BillingCycle) => {
        return cycle === 'monthly'
            ? SCHOOL_PLANS[plan].monthlyPrice
            : SCHOOL_PLANS[plan].yearlyPrice;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Cambia Piano</h2>
                    <p className="text-gray-500 mb-6">Scegli il piano più adatto alla tua autoscuola</p>

                    {/* Billing toggle */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-lg p-1 flex">
                            <button
                                onClick={() => setSelectedCycle('monthly')}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedCycle === 'monthly'
                                        ? 'bg-white shadow text-gray-900'
                                        : 'text-gray-500'
                                    }`}
                            >
                                Mensile
                            </button>
                            <button
                                onClick={() => setSelectedCycle('yearly')}
                                className={`px-4 py-2 rounded-lg transition-colors ${selectedCycle === 'yearly'
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {(['starter', 'pro', 'enterprise'] as Plan[]).map((plan) => {
                            const planData = SCHOOL_PLANS[plan];
                            const isSelected = selectedPlan === plan;
                            const isCurrent = currentPlan === plan && currentCycle === selectedCycle;

                            return (
                                <div
                                    key={plan}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`
                    border-2 rounded-xl p-5 cursor-pointer transition-all
                    ${isSelected
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'}
                  `}
                                >
                                    {isCurrent && (
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                            Piano attuale
                                        </span>
                                    )}

                                    <h3 className="text-lg font-bold text-gray-900 mt-2">{planData.name}</h3>

                                    <div className="mt-3 mb-4">
                                        <span className="text-2xl font-bold text-gray-900">
                                            €{getPrice(plan, selectedCycle)}
                                        </span>
                                        <span className="text-gray-500">
                                            /{selectedCycle === 'monthly' ? 'mese' : 'anno'}
                                        </span>
                                    </div>

                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            {planData.maxStudents === -1 ? 'Illimitati' : planData.maxStudents} studenti
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" />
                                            {planData.maxInstructors === -1 ? 'Illimitati' : planData.maxInstructors} istruttori
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={handleChangePlan}
                            disabled={isLoading || (selectedPlan === currentPlan && selectedCycle === currentCycle)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Conferma Cambio
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CancelSubscriptionModal({ onClose }: { onClose: () => void }) {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleCancel = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setConfirmed(true);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="p-6">
                    {!confirmed ? (
                        <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                                Conferma Cancellazione
                            </h2>

                            <p className="text-gray-500 text-center mb-6">
                                Sei sicuro di voler cancellare il tuo abbonamento? Potrai continuare a usare il servizio fino alla fine del periodo di fatturazione.
                            </p>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-yellow-800">
                                    <strong>Attenzione:</strong> Cancellando l'abbonamento, i tuoi studenti perderanno l'accesso Premium gratuito.
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Perché stai cancellando? (opzionale)
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Aiutaci a migliorare..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
                                >
                                    Ripensaci
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Cancellazione...' : 'Cancella Abbonamento'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Abbonamento Cancellato</h2>
                            <p className="text-gray-500 mb-6">
                                Potrai continuare a usare il servizio fino al 31/12/2024.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
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
