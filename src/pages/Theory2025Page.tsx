import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpenCheck, Sparkles, FileText } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const highlights = [
  {
    title: 'Manuale ufficiale 2025',
    description: 'Contenuti aggiornati con tutte le nuove normative e segnali in vigore dal 2025.'
  },
  {
    title: 'Modalità studio smart',
    description: 'Struttura per capitoli, riassunti chiari e punti chiave per memorizzare rapidamente.'
  },
  {
    title: 'Multilingua & audio',
    description: 'Traduzioni assistite e lettura audio per seguire le spiegazioni anche in movimento.'
  }
];

export const Theory2025Page: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102A43] via-[#243B53] to-[#334E68] text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:border-white/40 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna indietro
        </button>

        <header className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-100">
                <Sparkles className="w-4 h-4" /> Edizione 2025
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight">
                Manuale Teoria Patente B 2025
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                Stiamo importando l&apos;intero materiale ministeriale 2025 con spiegazioni ottimizzate, esempi pratici e strumenti interattivi per studiare in modo efficiente.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
              <div className="flex items-center gap-3 text-lg font-semibold">
                <BookOpenCheck className="w-6 h-6 text-emerald-300" />
                Stato importazione
              </div>
              <p className="text-sm text-white/60">
                Dataset in fase di preparazione. Caricheremo i nuovi capitoli nelle prossime release.
              </p>
              <button
                onClick={() => navigate('/theory')}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-emerald-400"
              >
                Vai alla teoria attuale
              </button>
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {highlights.map(feature => (
            <GlassCard key={feature.title} className="h-full bg-white/5 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <FileText className="w-6 h-6 text-emerald-200" />
              </div>
              <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm text-white/70">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-xl">
          <h2 className="text-2xl font-bold">Timeline rilascio</h2>
          <p className="mt-2 text-white/70 text-sm">
            Stiamo completando l&apos;estrazione dai materiali ufficiali. Nel frattempo puoi ripassare la teoria attuale e riceverai una notifica quando i contenuti 2025 saranno disponibili.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold text-emerald-200 uppercase">Fase 1</p>
              <h3 className="mt-2 text-lg font-semibold">Import dati PDF</h3>
              <p className="mt-1 text-sm text-white/70">Conversione dei capitoli e pulizia del testo.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold text-emerald-200 uppercase">Fase 2</p>
              <h3 className="mt-2 text-lg font-semibold">Arricchimento AI</h3>
              <p className="mt-1 text-sm text-white/70">Sintesi, esempi e spiegazioni vocali multilingua.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold text-emerald-200 uppercase">Fase 3</p>
              <h3 className="mt-2 text-lg font-semibold">Rilascio beta</h3>
              <p className="mt-1 text-sm text-white/70">Accesso anticipato per gli studenti iscritti alla beta.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="rounded-xl border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Attiva notifiche
            </button>
            <button
              onClick={() => navigate('/quiz/exam')}
              className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400"
            >
              Continua ad allenarti
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Theory2025Page;


