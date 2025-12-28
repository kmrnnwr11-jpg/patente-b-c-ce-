# School Dashboard

Dashboard B2B per Autoscuole - Patente Quiz Business

## Installazione

```bash
cd school-dashboard
npm install
```

## Configurazione

1. Copia `.env.example` in `.env.local`
2. Inserisci le credenziali Firebase

## Avvio

```bash
npm run dev
```

La dashboard sarà disponibile su http://localhost:3001

## Struttura

```
school-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── login/                # Login autoscuola
│   │   ├── register/             # Registrazione autoscuola
│   │   ├── students/             # Gestione studenti
│   │   ├── instructors/          # Gestione istruttori
│   │   ├── reports/              # Report e analytics
│   │   └── settings/             # Impostazioni
│   ├── components/               # Componenti riutilizzabili
│   ├── lib/                      # Utilities e Firebase
│   └── types/                    # TypeScript types
```

## Piani Disponibili

| Piano | Prezzo/mese | Studenti | Istruttori |
|-------|-------------|----------|------------|
| Starter | €49 | 30 | 1 |
| Pro | €99 | 100 | 5 |
| Enterprise | €199 | ∞ | ∞ |

## Funzionalità

- ✅ Dashboard con statistiche in tempo reale
- ✅ Gestione studenti con filtri
- ✅ Inviti studenti via codice/link
- ✅ Monitoraggio progressi
- ✅ Report performance
- ✅ Messaggi agli studenti
- ✅ Branding personalizzato (Pro+)
- ✅ Export dati (Pro+)
- ✅ API Access (Enterprise)
