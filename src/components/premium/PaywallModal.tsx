import { FC } from 'react';
import { X, Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import type { SubscriptionPlan } from '@/types/ai';

interface PaywallModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string) => void;
  reason?: string;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: '€',
    interval: 'month',
    explanationsLimit: 5,
    audioLimit: 10,
    features: [
      '5 spiegazioni AI al mese',
      '10 audio text-to-speech',
      'Quiz illimitati',
      'Teoria completa',
      'Statistiche base'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: '€',
    interval: 'month',
    explanationsLimit: 100,
    audioLimit: 200,
    popular: true,
    features: [
      '100 spiegazioni AI al mese',
      '200 audio text-to-speech',
      'Quiz illimitati',
      'Teoria completa',
      'Statistiche avanzate',
      'Smart Review System',
      'Download offline',
      'Nessuna pubblicità'
    ]
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 19.99,
    currency: '€',
    interval: 'month',
    explanationsLimit: Infinity,
    audioLimit: Infinity,
    features: [
      '∞ Spiegazioni AI illimitate',
      '∞ Audio text-to-speech illimitato',
      'Quiz illimitati',
      'Teoria completa',
      'Statistiche avanzate',
      'Smart Review System',
      'Download offline',
      'Nessuna pubblicità',
      'Supporto prioritario',
      'Accesso anticipato a nuove features'
    ]
  }
];

export const PaywallModal: FC<PaywallModalProps> = ({
  isVisible,
  onClose,
  onSelectPlan,
  reason
}) => {
  if (!isVisible) return null;

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Sparkles className="w-6 h-6" />;
      case 'premium':
        return <Zap className="w-6 h-6" />;
      case 'unlimited':
        return <Crown className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-6xl my-8">
        <GlassCard className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Header */}
          <div className="text-center pt-8 pb-6 px-6">
            <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full mb-4">
              <Crown className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Passa a Premium
            </h2>
            {reason && (
              <p className="text-white/80 text-lg mb-2">
                {reason}
              </p>
            )}
            <p className="text-white/70">
              Scegli il piano perfetto per te e supera l'esame al primo colpo
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 scale-105'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                      PIÙ POPOLARE
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  plan.id === 'free' ? 'bg-blue-500/20 text-blue-400' :
                  plan.id === 'premium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {getPlanIcon(plan.id)}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold text-white">Gratis</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        {plan.currency}{plan.price}
                      </span>
                      <span className="text-white/70">/{plan.interval === 'month' ? 'mese' : 'anno'}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/90">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  disabled={plan.id === 'free'}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                      : plan.id === 'free'
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {plan.id === 'free' ? 'Piano Attuale' : 'Scegli ' + plan.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <p className="text-white/60 text-sm">
              💳 Pagamento sicuro • 🔒 Cancellazione in qualsiasi momento • ✅ Garanzia soddisfatti o rimborsati 30 giorni
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

