import { FC } from 'react';
import { Check, X, Sparkles, Crown } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  highlighted: boolean;
  icon: any;
  buttonText: string;
  buttonColor: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: '0€',
    period: 'per sempre',
    description: 'Perfetto per iniziare a studiare',
    icon: Sparkles,
    highlighted: false,
    buttonText: 'Inizia Gratis',
    buttonColor: 'from-blue-500 to-cyan-500',
    features: [
      { text: '7139 quiz ministeriali', included: true },
      { text: 'Simulazioni esame illimitate', included: true },
      { text: 'Quiz per argomento', included: true },
      { text: 'Teoria completa 25 capitoli', included: true },
      { text: 'Statistiche base', included: true },
      { text: 'Spiegazioni AI (5 al giorno)', included: false },
      { text: 'Audio multilingua', included: false },
      { text: 'Ripasso intelligente', included: false },
      { text: 'Modalità offline', included: false },
      { text: 'Supporto prioritario', included: false }
    ]
  },
  {
    name: 'Premium',
    price: '9,99€',
    period: 'una tantum',
    description: 'Tutto quello che serve per superare l\'esame',
    icon: Crown,
    highlighted: true,
    buttonText: 'Diventa Premium',
    buttonColor: 'from-yellow-400 to-orange-500',
    features: [
      { text: '7139 quiz ministeriali', included: true },
      { text: 'Simulazioni esame illimitate', included: true },
      { text: 'Quiz per argomento', included: true },
      { text: 'Teoria completa 25 capitoli', included: true },
      { text: 'Statistiche avanzate', included: true },
      { text: 'Spiegazioni AI illimitate', included: true },
      { text: 'Audio multilingua (10 lingue)', included: true },
      { text: 'Ripasso intelligente personalizzato', included: true },
      { text: 'Modalità offline completa', included: true },
      { text: 'Supporto prioritario 24/7', included: true }
    ]
  }
];

export const PricingSection: FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Scegli il piano perfetto
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              per te
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mt-6">
            Inizia gratis e passa a Premium quando vuoi. 
            Nessun abbonamento, paghi una sola volta.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <GlassCard
                key={plan.name}
                className={`
                  relative
                  ${plan.highlighted ? 'ring-2 ring-yellow-400 scale-105' : ''}
                  hover:scale-105 transition-all duration-300
                `}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Premium Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                      🔥 PIÙ POPOLARE
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`
                    w-20 h-20 mx-auto mb-4 rounded-2xl
                    bg-gradient-to-br ${plan.buttonColor}
                    flex items-center justify-center
                    shadow-lg
                  `}>
                    <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-white/70 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-white/60">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" strokeWidth={3} />
                      ) : (
                        <X className="w-5 h-5 text-red-400/50 flex-shrink-0 mt-0.5" strokeWidth={3} />
                      )}
                      <span className={`
                        ${feature.included ? 'text-white' : 'text-white/40 line-through'}
                      `}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`
                  w-full py-4 rounded-2xl font-bold text-lg
                  bg-gradient-to-r ${plan.buttonColor}
                  ${plan.highlighted ? 'text-gray-900' : 'text-white'}
                  hover:scale-105 hover:shadow-2xl
                  transition-all duration-300
                `}>
                  {plan.buttonText}
                </button>
              </GlassCard>
            );
          })}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <GlassCard className="inline-block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" strokeWidth={3} />
              </div>
              <div className="text-left">
                <p className="text-white font-bold">
                  Garanzia soddisfatti o rimborsati
                </p>
                <p className="text-white/70 text-sm">
                  Se non superi l'esame, ti rimborsiamo il 100%
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

