import Link from 'next/link';
import {
    Users,
    BarChart3,
    Shield,
    Zap,
    CheckCircle,
    ArrowRight,
    Star,
    Play,
    MessageCircle,
    Phone,
    Building2,
    ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">PQ</span>
                            </div>
                            <span className="font-bold text-xl">Patente Quiz Business</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-gray-600 hover:text-indigo-600">Funzionalità</a>
                            <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Prezzi</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600">Testimonianze</a>
                            <a href="#faq" className="text-gray-600 hover:text-indigo-600">FAQ</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-gray-600 hover:text-indigo-600">
                                Accedi
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Prova Gratis
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Zap className="w-4 h-4" />
                                La soluzione #1 per autoscuole in Italia
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Fai crescere la tua <span className="text-indigo-600">autoscuola</span> con la tecnologia
                            </h1>

                            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                                Dashboard completa per monitorare i progressi degli studenti,
                                aumentare il tasso di successo agli esami e distinguerti dalla concorrenza.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30"
                                >
                                    Inizia la Prova Gratuita
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 transition-all">
                                    <Play className="w-5 h-5" />
                                    Guarda il Video
                                </button>
                            </div>

                            <div className="mt-8 flex items-center gap-6">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white"
                                        />
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600">500+ autoscuole soddisfatte</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform">
                                <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                                    <div className="text-center">
                                        <Building2 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                                        <p className="text-gray-500">Dashboard Preview</p>
                                    </div>
                                </div>
                            </div>
                            {/* Floating stats */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                                <p className="text-sm text-gray-500">Tasso Successo</p>
                                <p className="text-3xl font-bold text-green-600">+23%</p>
                            </div>
                            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4">
                                <p className="text-sm text-gray-500">Studenti Attivi</p>
                                <p className="text-3xl font-bold text-indigo-600">1,247</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logos */}
            <section className="py-12 border-y border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-gray-500 mb-8">Usato da oltre 500 autoscuole in tutta Italia</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
                        {['Milano', 'Roma', 'Napoli', 'Torino', 'Firenze'].map((city) => (
                            <div key={city} className="text-2xl font-bold text-gray-400">
                                Autoscuola {city}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Tutto quello che serve per gestire la tua autoscuola
                        </h2>
                        <p className="mt-4 text-xl text-gray-600">
                            Una piattaforma completa per istruttori e studenti
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: 'Gestione Studenti',
                                description: 'Monitora i progressi di ogni studente in tempo reale. Vedi chi studia, chi è pronto per l\'esame e chi ha bisogno di aiuto.',
                                color: 'indigo',
                            },
                            {
                                icon: BarChart3,
                                title: 'Report e Analytics',
                                description: 'Dashboard con grafici chiari. Identifica gli argomenti più difficili e migliora i risultati della tua autoscuola.',
                                color: 'green',
                            },
                            {
                                icon: MessageCircle,
                                title: 'Comunicazione Diretta',
                                description: 'Invia messaggi e promemoria agli studenti direttamente dall\'app. Congratulati per i progressi o suggerisci più studio.',
                                color: 'blue',
                            },
                            {
                                icon: Shield,
                                title: 'Premium Incluso',
                                description: 'I tuoi studenti ricevono l\'accesso Premium GRATIS. Tu risparmi, loro studiano meglio.',
                                color: 'purple',
                            },
                            {
                                icon: Building2,
                                title: 'Logo Personalizzato',
                                description: 'Il tuo brand nell\'app. Gli studenti vedono il logo della tua autoscuola mentre studiano.',
                                color: 'orange',
                            },
                            {
                                icon: Zap,
                                title: 'Facile da Usare',
                                description: 'Interfaccia semplice e intuitiva. Inizia in 5 minuti, senza formazione necessaria.',
                                color: 'pink',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                                    <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Prezzi Trasparenti
                        </h2>
                        <p className="mt-4 text-xl text-gray-600">
                            Risparmia fino all'83% rispetto agli abbonamenti singoli
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Starter', price: 99, students: 20, instructors: 1, popular: false },
                            { name: 'Pro', price: 199, students: 50, instructors: 3, popular: true },
                            { name: 'Business', price: 349, students: 100, instructors: 10, popular: false },
                            { name: 'Enterprise', price: 599, students: -1, instructors: -1, popular: false },
                        ].map((plan) => (
                            <div
                                key={plan.name}
                                className={`
                  relative bg-white rounded-2xl p-8 border-2 transition-all
                  ${plan.popular ? 'border-indigo-600 shadow-xl scale-105' : 'border-gray-100'}
                `}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Più Scelto
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>

                                <div className="mt-4 mb-6">
                                    <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                                    <span className="text-gray-500">/mese</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        {plan.students === -1 ? 'Studenti illimitati' : `${plan.students} studenti`}
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        {plan.instructors === -1 ? 'Istruttori illimitati' : `${plan.instructors} istruttori`}
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Dashboard completa
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        14 giorni di prova
                                    </li>
                                </ul>

                                <Link
                                    href="/register"
                                    className={`
                    block text-center py-3 rounded-xl font-medium transition-colors
                    ${plan.popular
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }
                  `}
                                >
                                    Inizia Gratis
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Cosa dicono i nostri clienti
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Mario Rossi',
                                role: 'Autoscuola Roma Centro',
                                quote: 'Da quando usiamo Patente Quiz Business, il tasso di successo ai quiz è aumentato del 25%. Gli studenti arrivano molto più preparati.',
                            },
                            {
                                name: 'Laura Bianchi',
                                role: 'Autoscuola Milano Nord',
                                quote: 'La dashboard è fantastica. Posso vedere subito chi sta studiando e chi ha bisogno di una spinta in più. Risparmio ore di lavoro.',
                            },
                            {
                                name: 'Giuseppe Verdi',
                                role: 'Autoscuola Napoli Est',
                                quote: 'I genitori apprezzano che possiamo monitorare i progressi. Ci distingue dalla concorrenza e attira più iscrizioni.',
                            },
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100">
                                <div className="flex items-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((j) => (
                                        <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Domande Frequenti
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Come funziona la prova gratuita?',
                                a: 'Hai 14 giorni per provare tutte le funzionalità senza impegno. Non ti chiediamo la carta di credito. Alla fine del trial decidi se continuare.',
                            },
                            {
                                q: 'Gli studenti devono pagare qualcosa?',
                                a: 'No! Gli studenti iscritti alla tua autoscuola ottengono l\'accesso Premium completamente gratuito. Paghi solo tu l\'abbonamento.',
                            },
                            {
                                q: 'Posso cambiare piano in qualsiasi momento?',
                                a: 'Sì, puoi fare upgrade o downgrade quando vuoi. Il cambio sarà effettivo dal prossimo ciclo di fatturazione.',
                            },
                            {
                                q: 'Come si iscrivono gli studenti?',
                                a: 'Ricevi un codice univoco per la tua autoscuola (es: AUTOSCUOLA-ROMA-123). Gli studenti lo inseriscono nell\'app e sono subito collegati.',
                            },
                        ].map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-white rounded-xl border border-gray-100 overflow-hidden"
                            >
                                <summary className="flex items-center justify-between p-6 cursor-pointer">
                                    <span className="font-medium text-gray-900">{faq.q}</span>
                                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-gray-600">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 bg-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Pronto a modernizzare la tua autoscuola?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Inizia la prova gratuita di 14 giorni. Nessun impegno, nessuna carta di credito.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                        >
                            Inizia Gratis
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="tel:+390612345678"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            Parla con noi
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 bg-gray-900 text-gray-400">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PQ</span>
                                </div>
                                <span className="font-bold text-white">Patente Quiz Business</span>
                            </div>
                            <p className="text-sm">
                                La piattaforma #1 per autoscuole moderne.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Prodotto</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="hover:text-white">Funzionalità</a></li>
                                <li><a href="#pricing" className="hover:text-white">Prezzi</a></li>
                                <li><Link href="/help" className="hover:text-white">Supporto</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Azienda</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Chi Siamo</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Lavora con noi</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Legale</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                                <li><a href="#" className="hover:text-white">Termini</a></li>
                                <li><a href="#" className="hover:text-white">Cookie</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-sm text-center">
                        © 2024 Patente Quiz Business. Tutti i diritti riservati.
                    </div>
                </div>
            </footer>
        </div>
    );
}
