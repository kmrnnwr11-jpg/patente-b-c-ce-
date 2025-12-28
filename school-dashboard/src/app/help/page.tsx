'use client';

import { useState } from 'react';
import {
    Search,
    BookOpen,
    HelpCircle,
    MessageSquare,
    Phone,
    Mail,
    Video,
    FileText,
    ChevronRight,
    ChevronDown,
    ExternalLink,
    Zap,
    Users,
    Settings,
    CreditCard,
} from 'lucide-react';

const FAQ_CATEGORIES = [
    {
        id: 'getting-started',
        title: 'Primi Passi',
        icon: Zap,
        questions: [
            {
                q: 'Come funziona il codice autoscuola?',
                a: 'Ogni autoscuola ha un codice univoco (es: AUTO-ROMA-A1B2C3). Gli studenti inseriscono questo codice nell\'app per iscriversi alla tua autoscuola e ottenere automaticamente l\'accesso Premium gratuito. Il codice è visibile nella dashboard sotto Impostazioni > Generale.',
            },
            {
                q: 'Come invito i miei studenti?',
                a: 'Puoi invitare gli studenti in tre modi: 1) Condividendo il codice della tua autoscuola, 2) Creando inviti personalizzati dalla sezione Studenti, 3) Usando l\'invito multiplo per aggiungere molti studenti contemporaneamente via CSV.',
            },
            {
                q: 'Quanto dura il periodo di prova?',
                a: 'Il periodo di prova dura 14 giorni. Durante questo tempo hai accesso a tutte le funzionalità del piano scelto. Non ti verrà addebitato nulla fino al termine del trial.',
            },
        ],
    },
    {
        id: 'students',
        title: 'Gestione Studenti',
        icon: Users,
        questions: [
            {
                q: 'Posso vedere cosa studiano gli studenti?',
                a: 'Sì! Dalla dashboard puoi vedere le statistiche in tempo reale: quiz completati, punteggio medio, argomenti studiati, tempo di studio e molto altro. Puoi anche vedere quali studenti sono pronti per l\'esame.',
            },
            {
                q: 'Come funziona il limite di studenti?',
                a: 'Ogni piano ha un numero massimo di studenti attivi. Se raggiungi il limite, puoi aggiungere studenti extra a un costo aggiuntivo oppure fare l\'upgrade a un piano superiore. Gli studenti "completati" non contano nel limite.',
            },
            {
                q: 'Posso assegnare studenti a istruttori specifici?',
                a: 'Sì, puoi assegnare ogni studente a un istruttore. Questo permette agli istruttori di filtrare e vedere solo i loro studenti dalla dashboard.',
            },
        ],
    },
    {
        id: 'billing',
        title: 'Abbonamento e Pagamenti',
        icon: CreditCard,
        questions: [
            {
                q: 'Come funziona la fatturazione?',
                a: 'Puoi scegliere fatturazione mensile o annuale. La fattura viene emessa automaticamente all\'inizio di ogni ciclo di fatturazione e inviata all\'email di fatturazione impostata.',
            },
            {
                q: 'Posso cambiare piano?',
                a: 'Sì, puoi fare upgrade o downgrade in qualsiasi momento. Se fai upgrade, la differenza viene calcolata pro-rata. Se fai downgrade, il nuovo prezzo si applica dal prossimo ciclo.',
            },
            {
                q: 'Cosa succede se cancello l\'abbonamento?',
                a: 'Se cancelli, puoi continuare a usare il servizio fino alla fine del periodo già pagato. I tuoi studenti manterranno l\'accesso Premium fino a quella data.',
            },
        ],
    },
    {
        id: 'settings',
        title: 'Impostazioni',
        icon: Settings,
        questions: [
            {
                q: 'Come personalizzo il logo nell\'app?',
                a: 'Vai in Impostazioni > Branding e carica il logo della tua autoscuola. Il logo apparirà nell\'app degli studenti iscritti alla tua autoscuola. Questa funzione è disponibile dal piano Pro.',
            },
            {
                q: 'Posso cambiare il codice autoscuola?',
                a: 'Il codice autoscuola è generato automaticamente e non può essere modificato. Questo garantisce unicità e previene conflitti.',
            },
            {
                q: 'Come aggiungo altri amministratori?',
                a: 'Vai in Istruttori e aggiungi un nuovo membro con ruolo "Admin". Gli admin hanno accesso a quasi tutte le funzionalità tranne la fatturazione.',
            },
        ],
    },
];

const GUIDES = [
    {
        title: 'Guida Completa per Iniziare',
        description: 'Tutto quello che devi sapere per configurare la tua autoscuola',
        icon: BookOpen,
        link: '#',
    },
    {
        title: 'Video Tutorial Dashboard',
        description: 'Scopri tutte le funzionalità della dashboard in 10 minuti',
        icon: Video,
        link: '#',
    },
    {
        title: 'Best Practice Report',
        description: 'Come sfruttare al meglio i report per monitorare gli studenti',
        icon: FileText,
        link: '#',
    },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

    const filteredCategories = FAQ_CATEGORIES.map(category => ({
        ...category,
        questions: category.questions.filter(
            q =>
                q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(category => category.questions.length > 0 || !searchQuery);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900">Centro Assistenza</h1>
                <p className="text-gray-500 mt-2">
                    Trova risposte alle tue domande o contattaci direttamente
                </p>

                {/* Search */}
                <div className="relative mt-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cerca nelle FAQ..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Quick Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-gray-900">Chat dal Vivo</p>
                        <p className="text-sm text-gray-500">Risposta in &lt; 5 min</p>
                    </div>
                </button>

                <a href="mailto:support@patentequiz.com" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-500">support@patentequiz.com</p>
                    </div>
                </a>

                <a href="tel:+390612345678" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-gray-900">Telefono</p>
                        <p className="text-sm text-gray-500">+39 06 1234567</p>
                    </div>
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQ */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Domande Frequenti</h2>

                    {filteredCategories.map((category) => {
                        const CategoryIcon = category.icon;
                        const isExpanded = expandedCategory === category.id;

                        return (
                            <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <CategoryIcon className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">{category.title}</span>
                                        <span className="text-sm text-gray-500">({category.questions.length} domande)</span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="border-t divide-y">
                                        {category.questions.map((item, index) => {
                                            const questionId = `${category.id}-${index}`;
                                            const isQuestionExpanded = expandedQuestion === questionId;

                                            return (
                                                <div key={index}>
                                                    <button
                                                        onClick={() => setExpandedQuestion(isQuestionExpanded ? null : questionId)}
                                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                                                    >
                                                        <span className="text-gray-900">{item.q}</span>
                                                        {isQuestionExpanded ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        )}
                                                    </button>
                                                    {isQuestionExpanded && (
                                                        <div className="px-4 pb-4 text-gray-600 bg-gray-50">
                                                            {item.a}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Guides */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Guide e Tutorial</h2>
                        <div className="space-y-3">
                            {GUIDES.map((guide, index) => {
                                const GuideIcon = guide.icon;
                                return (
                                    <a
                                        key={index}
                                        href={guide.link}
                                        className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GuideIcon className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{guide.title}</p>
                                            <p className="text-sm text-gray-500">{guide.description}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Support Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                        <HelpCircle className="w-10 h-10 mb-4 opacity-80" />
                        <h3 className="text-lg font-bold">Hai bisogno di altro aiuto?</h3>
                        <p className="text-indigo-100 text-sm mt-2">
                            Il nostro team di supporto è sempre pronto ad aiutarti. Contattaci e ti risponderemo il prima possibile.
                        </p>
                        <button className="mt-4 w-full py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                            Contatta il Supporto
                        </button>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-600">Tutti i sistemi operativi</span>
                        </div>
                        <a href="#" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">
                            Verifica stato servizi →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
