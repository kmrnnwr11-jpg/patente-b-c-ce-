'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Building2,
    User,
    CreditCard,
    Check,
    ArrowRight,
    ArrowLeft,
    Star,
    Users,
    BarChart3,
    MessageSquare,
    Shield,
    Zap,
} from 'lucide-react';
import { SCHOOL_PLANS } from '@/types';

type Step = 'plan' | 'school' | 'owner' | 'payment';
type BillingCycle = 'monthly' | 'yearly';

const STEPS: { id: Step; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'plan', title: 'Piano', icon: Star },
    { id: 'school', title: 'Autoscuola', icon: Building2 },
    { id: 'owner', title: 'Account', icon: User },
    { id: 'payment', title: 'Pagamento', icon: CreditCard },
];

export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>('plan');
    const [isLoading, setIsLoading] = useState(false);

    // Form data
    const [selectedPlan, setSelectedPlan] = useState<string>('pro');
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
    const [schoolData, setSchoolData] = useState({
        name: '',
        businessName: '',
        vatNumber: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
    });
    const [ownerData, setOwnerData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

    const goToStep = (step: Step) => {
        setCurrentStep(step);
    };

    const nextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < STEPS.length) {
            setCurrentStep(STEPS[nextIndex].id);
        }
    };

    const prevStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(STEPS[prevIndex].id);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        // Simula registrazione
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Redirect to dashboard
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">PQ</span>
                        </div>
                        <span className="font-bold text-xl">Patente Quiz Business</span>
                    </Link>
                    <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600">
                        Hai già un account? Accedi
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;
                            const StepIcon = step.icon;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <button
                                        onClick={() => isCompleted && goToStep(step.id)}
                                        disabled={!isCompleted}
                                        className={`
                      flex items-center gap-3 p-3 rounded-lg transition-colors
                      ${isActive ? 'bg-indigo-100 text-indigo-700' : ''}
                      ${isCompleted ? 'cursor-pointer hover:bg-gray-100' : ''}
                    `}
                                    >
                                        <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isActive ? 'bg-indigo-600 text-white' : ''}
                      ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                    `}>
                                            {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                                        </div>
                                        <span className={`font-medium hidden sm:block ${isActive ? 'text-indigo-700' : 'text-gray-600'}`}>
                                            {step.title}
                                        </span>
                                    </button>
                                    {index < STEPS.length - 1 && (
                                        <div className={`flex-1 h-1 mx-4 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Step 1: Plan Selection */}
                    {currentStep === 'plan' && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Scegli il tuo Piano</h2>
                                <p className="text-gray-500 mt-2">Tutti i piani includono 14 giorni di prova gratuita</p>
                            </div>

                            {/* Billing Toggle */}
                            <div className="flex justify-center">
                                <div className="bg-gray-100 rounded-lg p-1 flex">
                                    <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`px-6 py-2 rounded-lg transition-colors ${billingCycle === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                                            }`}
                                    >
                                        Mensile
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('yearly')}
                                        className={`px-6 py-2 rounded-lg transition-colors ${billingCycle === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                                            }`}
                                    >
                                        Annuale
                                        <span className="ml-2 text-green-600 text-sm font-medium">-17%</span>
                                    </button>
                                </div>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(SCHOOL_PLANS).map(([planId, plan]) => {
                                    const isSelected = selectedPlan === planId;
                                    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

                                    return (
                                        <div
                                            key={planId}
                                            onClick={() => setSelectedPlan(planId)}
                                            className={`
                        relative border-2 rounded-xl p-5 cursor-pointer transition-all
                        ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
                        ${'popular' in plan && plan.popular ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}
                      `}
                                        >
                                            {'popular' in plan && plan.popular && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                                                    Più Scelto
                                                </div>
                                            )}

                                            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>

                                            <div className="mt-4">
                                                <span className="text-3xl font-bold text-gray-900">€{price}</span>
                                                <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mese' : 'anno'}</span>
                                            </div>

                                            {'pricePerStudent' in plan && plan.pricePerStudent > 0 && (
                                                <p className="text-sm text-green-600 mt-1">
                                                    €{plan.pricePerStudent}/studente
                                                </p>
                                            )}

                                            <ul className="mt-4 space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-indigo-600" />
                                                    {plan.maxStudents === -1 ? 'Studenti illimitati' : `${plan.maxStudents} studenti`}
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-indigo-600" />
                                                    {plan.maxInstructors === -1 ? 'Istruttori illimitati' : `${plan.maxInstructors} istruttori`}
                                                </li>
                                                {plan.features.customLogo && (
                                                    <li className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        Logo personalizzato
                                                    </li>
                                                )}
                                                {plan.features.advancedReports && (
                                                    <li className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        Report avanzati
                                                    </li>
                                                )}
                                                {plan.features.apiAccess && (
                                                    <li className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-600" />
                                                        Accesso API
                                                    </li>
                                                )}
                                            </ul>

                                            {isSelected && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Continua
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: School Info */}
                    {currentStep === 'school' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Dati Autoscuola</h2>
                                <p className="text-gray-500 mt-2">Inserisci le informazioni della tua autoscuola</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Autoscuola *
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.name}
                                        onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Autoscuola Roma Centro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ragione Sociale
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.businessName}
                                        onChange={(e) => setSchoolData({ ...schoolData, businessName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Autoscuola Roma Centro SRL"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Partita IVA
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.vatNumber}
                                        onChange={(e) => setSchoolData({ ...schoolData, vatNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="IT12345678901"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Autoscuola *
                                    </label>
                                    <input
                                        type="email"
                                        value={schoolData.email}
                                        onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="info@autoscuola.it"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefono
                                    </label>
                                    <input
                                        type="tel"
                                        value={schoolData.phone}
                                        onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="+39 06 1234567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Indirizzo
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.address}
                                        onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Via Roma 123"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Città *
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolData.city}
                                        onChange={(e) => setSchoolData({ ...schoolData, city: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Roma"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Provincia
                                        </label>
                                        <input
                                            type="text"
                                            value={schoolData.province}
                                            onChange={(e) => setSchoolData({ ...schoolData, province: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="RM"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CAP
                                        </label>
                                        <input
                                            type="text"
                                            value={schoolData.postalCode}
                                            onChange={(e) => setSchoolData({ ...schoolData, postalCode: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="00100"
                                            maxLength={5}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Indietro
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!schoolData.name || !schoolData.email || !schoolData.city}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Continua
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Owner Account */}
                    {currentStep === 'owner' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Crea il tuo Account</h2>
                                <p className="text-gray-500 mt-2">Questo sarà l'account amministratore principale</p>
                            </div>

                            <div className="max-w-md mx-auto space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={ownerData.name}
                                        onChange={(e) => setOwnerData({ ...ownerData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Mario Rossi"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={ownerData.email}
                                        onChange={(e) => setOwnerData({ ...ownerData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="mario@autoscuola.it"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={ownerData.password}
                                        onChange={(e) => setOwnerData({ ...ownerData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Minimo 8 caratteri"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Conferma Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={ownerData.confirmPassword}
                                        onChange={(e) => setOwnerData({ ...ownerData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ripeti password"
                                    />
                                    {ownerData.confirmPassword && ownerData.password !== ownerData.confirmPassword && (
                                        <p className="text-sm text-red-600 mt-1">Le password non coincidono</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Indietro
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={
                                        !ownerData.name ||
                                        !ownerData.email ||
                                        !ownerData.password ||
                                        ownerData.password !== ownerData.confirmPassword
                                    }
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Continua
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment/Confirmation */}
                    {currentStep === 'payment' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Conferma e Inizia</h2>
                                <p className="text-gray-500 mt-2">14 giorni di prova gratuita, nessun addebito ora</p>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                <h3 className="font-semibold text-gray-900">Riepilogo</h3>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Autoscuola</span>
                                    <span className="font-medium">{schoolData.name}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Piano</span>
                                    <span className="font-medium">{SCHOOL_PLANS[selectedPlan as keyof typeof SCHOOL_PLANS].name}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Fatturazione</span>
                                    <span className="font-medium">{billingCycle === 'monthly' ? 'Mensile' : 'Annuale'}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-600">Amministratore</span>
                                    <span className="font-medium">{ownerData.email}</span>
                                </div>

                                <div className="flex justify-between py-4 text-lg">
                                    <span className="font-semibold">Totale dopo il trial</span>
                                    <span className="font-bold text-indigo-600">
                                        €{billingCycle === 'monthly'
                                            ? SCHOOL_PLANS[selectedPlan as keyof typeof SCHOOL_PLANS].monthlyPrice
                                            : SCHOOL_PLANS[selectedPlan as keyof typeof SCHOOL_PLANS].yearlyPrice}
                                        /{billingCycle === 'monthly' ? 'mese' : 'anno'}
                                    </span>
                                </div>
                            </div>

                            {/* Trial Banner */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-800">14 Giorni Gratis</h4>
                                    <p className="text-green-700 text-sm mt-1">
                                        Non ti verrà addebitato nulla oggi. Dopo il periodo di prova potrai decidere se continuare.
                                        Puoi cancellare in qualsiasi momento.
                                    </p>
                                </div>
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-3">
                                <input type="checkbox" className="w-4 h-4 mt-1 text-indigo-600 rounded" />
                                <span className="text-sm text-gray-600">
                                    Accetto i <Link href="/terms" className="text-indigo-600 hover:underline">Termini di Servizio</Link> e
                                    la <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                                </span>
                            </label>

                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Indietro
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creazione in corso...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5" />
                                            Inizia la Prova Gratuita
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Benefits */}
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Sicuro e Affidabile</p>
                        <p className="text-xs text-gray-500">Dati protetti e criptati</p>
                    </div>
                    <div>
                        <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Studenti Illimitati</p>
                        <p className="text-xs text-gray-500">Con piano Enterprise</p>
                    </div>
                    <div>
                        <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Report Dettagliati</p>
                        <p className="text-xs text-gray-500">Monitora i progressi</p>
                    </div>
                    <div>
                        <MessageSquare className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Supporto Dedicato</p>
                        <p className="text-xs text-gray-500">Sempre disponibile</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
