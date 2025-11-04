# 🚗 Patente B 2025 - App Preparazione Esame

Progressive Web App moderna per la preparazione all'esame della Patente B italiana.

## ✨ Features

- 📝 **7139 Quiz Ministeriali** - Tutti i quiz ufficiali aggiornati 2025
- 🤖 **Spiegazioni AI** - Claude AI spiega ogni domanda in modo semplice
- 🎯 **Simulazioni Esame** - 30 domande, 20 minuti, max 3 errori (come l'esame reale)
- 📚 **Teoria Interattiva** - 25 capitoli con immagini e spiegazioni
- 🔊 **Audio Multilingua** - Text-to-speech in 8 lingue (ElevenLabs)
- 📊 **Statistiche Avanzate** - Track del tuo progresso
- 🌓 **Dark Mode** - Design moderno glassmorphism
- 📱 **PWA** - Installabile e funziona offline

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Firestore + Auth + Storage)
- **State**: Zustand
- **AI**: Claude API (Anthropic)
- **TTS**: ElevenLabs API
- **PWA**: Workbox + Service Worker

## 🚀 Quick Start

### 1. Installa dipendenze

```bash
npm install
```

### 2. Configura variabili ambiente

Copia `.env.example` in `.env` e inserisci le tue API keys:

```bash
cp .env.example .env
```

Modifica `.env` con:
- Firebase config (da Firebase Console)
- Claude API key (da Anthropic)
- ElevenLabs API key (opzionale per TTS)

### 3. Avvia dev server

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

### 4. Build per produzione

```bash
npm run build
```

I file ottimizzati saranno in `dist/`

## 📁 Struttura Progetto

```
src/
├── components/
│   ├── landing/        # Landing page components
│   ├── auth/           # Login, Register
│   ├── quiz/           # Sistema quiz
│   ├── ui/             # Componenti base (shadcn)
│   └── layout/         # Navbar, Footer
├── lib/                # Firebase, utils
├── hooks/              # Custom hooks
├── store/              # Zustand state
├── types/              # TypeScript types
├── styles/             # CSS globali
└── pages/              # Route pages
```

## 🎨 Design System

### Colori
- **Primary**: `#3b82f6` (blu istituzionale)
- **Success**: `#10b981`
- **Error**: `#ef4444`
- **Warning**: `#f59e0b`

### Glassmorphism Style
Tutti i componenti usano lo stile glassmorphism con:
- `backdrop-blur-md` per blur effect
- `bg-white/10` per trasparenza
- `border border-white/20` per bordi soft
- `rounded-2xl` per angoli arrotondati

## 💰 Monetizzazione

### Free Tier
- ✅ 7139 quiz completi
- ✅ Simulazioni esame
- ✅ 5 spiegazioni AI/giorno
- ✅ 30 traduzioni/giorno
- ✅ Teoria base

### Premium (€4.99/mese)
- 🚀 Spiegazioni AI unlimited
- 🚀 Traduzioni unlimited
- 🚀 Statistiche avanzate
- 🚀 Senza pubblicità
- 🚀 Audio multilingua

## 🔥 Firebase Setup

1. Crea progetto su [Firebase Console](https://console.firebase.google.com)
2. Abilita:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage**
3. Copia config in `.env`

## 📦 Dipendenze Principali

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.21.1",
  "zustand": "^4.4.7",
  "firebase": "^10.7.2",
  "lucide-react": "^0.303.0",
  "tailwindcss": "^3.4.1"
}
```

## 🧪 Testing

### Checklist Pre-Deploy
- [ ] Build senza errori TypeScript
- [ ] Lighthouse score 90+
- [ ] Dark mode funzionante
- [ ] PWA installabile
- [ ] Quiz timer accurato
- [ ] Paywall blocca features premium
- [ ] Responsive mobile/tablet/desktop

## 📱 PWA Installation

L'app può essere installata su:
- **Android**: Chrome → Menu → "Installa app"
- **iOS**: Safari → Share → "Aggiungi a Home"
- **Desktop**: Chrome → Icona installa nella barra URL

## 🤝 Contributing

Questo è un progetto personale. Per bug o suggerimenti, apri una Issue.

## 📄 License

© 2025 Patente B App. All rights reserved.

## 🆘 Support

Per domande o problemi:
- 📧 Email: support@patenteB2025.it
- 💬 Discord: [Link]

---

**Made with ❤️ and Claude AI**

