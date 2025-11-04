import { FC } from 'react';
import { Star, Quote } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Testimonial {
  name: string;
  age: number;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  exam: string;
  errors: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Marco Rossi',
    age: 19,
    location: 'Milano',
    avatar: '👨‍🎓',
    rating: 5,
    exam: 'Promosso al 1° tentativo',
    errors: 2,
    text: 'Grazie a questa app ho superato l\'esame con solo 2 errori! Le spiegazioni AI mi hanno aiutato a capire i concetti difficili. Consigliatissima!'
  },
  {
    name: 'Sofia Bianchi',
    age: 18,
    location: 'Roma',
    avatar: '👩‍🎓',
    rating: 5,
    exam: 'Promossa al 1° tentativo',
    errors: 1,
    text: 'App fantastica! Ho studiato solo 2 settimane e ho fatto 1 solo errore all\'esame. Le simulazioni sono identiche a quelle reali.'
  },
  {
    name: 'Luca Ferrari',
    age: 22,
    location: 'Torino',
    avatar: '🧑‍💼',
    rating: 5,
    exam: 'Promosso al 1° tentativo',
    errors: 0,
    text: 'Zero errori all\'esame! La funzione di ripasso errori è stata fondamentale. Ogni euro speso per il Premium ne è valso la pena.'
  },
  {
    name: 'Giulia Romano',
    age: 20,
    location: 'Napoli',
    avatar: '👩‍💻',
    rating: 5,
    exam: 'Promossa al 1° tentativo',
    errors: 3,
    text: 'Avevo paura di non farcela, ma con questa app mi sono sentita preparatissima. Le statistiche mi hanno aiutato a capire dove migliorare.'
  },
  {
    name: 'Alessandro Conti',
    age: 21,
    location: 'Firenze',
    avatar: '👨‍🔧',
    rating: 5,
    exam: 'Promosso al 1° tentativo',
    errors: 2,
    text: 'La teoria spiegata in modo semplice e i quiz per argomento sono perfetti. Ho studiato in metro con il telefono e ho passato l\'esame!'
  },
  {
    name: 'Chiara Marino',
    age: 19,
    location: 'Bologna',
    avatar: '👩‍🎨',
    rating: 5,
    exam: 'Promossa al 1° tentativo',
    errors: 1,
    text: 'Migliore app per la patente! L\'audio in italiano mi ha aiutato tantissimo a memorizzare. Super consigliata a tutti!'
  }
];

export const TestimonialsSection: FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cosa dicono i nostri
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              studenti
            </span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mt-6">
            Oltre 50.000 studenti hanno superato l'esame con noi. 
            Leggi le loro storie di successo.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">94%</div>
              <div className="text-white/70">Tasso di successo</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-white/70">Studenti promossi</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">4.9/5</div>
              <div className="text-white/70">Rating medio</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <GlassCard
              key={testimonial.name}
              className="hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-yellow-400/30 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-white/90 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Exam Result Badge */}
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                <span className="text-green-400 font-bold text-sm">
                  ✓ {testimonial.exam}
                </span>
              </div>
              <div className="text-white/60 text-sm mb-4">
                Errori all'esame: {testimonial.errors}/30
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-bold">
                    {testimonial.name}
                  </div>
                  <div className="text-white/60 text-sm">
                    {testimonial.age} anni • {testimonial.location}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-white/80 text-lg mb-6">
            Unisciti a loro e supera l'esame al primo tentativo
          </p>
          <button className="
            px-10 py-5 
            bg-gradient-to-r from-yellow-400 to-orange-500
            text-gray-900 font-bold text-lg rounded-2xl
            hover:scale-105 hover:shadow-2xl
            transition-all duration-300
          ">
            Inizia Gratis Ora
          </button>
        </div>
      </div>
    </section>
  );
};

