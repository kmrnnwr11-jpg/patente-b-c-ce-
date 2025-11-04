# 🎯 GUIDA SETUP COMPLETO - Patente B 2025

## ✅ Setup Completato!

Il progetto è stato inizializzato con successo. Tutti i file di configurazione e la struttura base sono pronti.

## 📦 Prossimi Passi

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com)
2. Crea un nuovo progetto chiamato "patente-b-2025"
3. Abilita i seguenti servizi:
   - **Authentication** → Email/Password
   - **Firestore Database** → Start in test mode
   - **Storage** → Start in test mode
4. Vai su Project Settings → General → Your apps
5. Clicca su "Web app" (</>) e registra l'app
6. Copia le credenziali

### 3. Crea file .env

Crea un file `.env` nella root del progetto:

```bash
# Firebase Configuration (OBBLIGATORIO)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=patente-b-2025.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=patente-b-2025
VITE_FIREBASE_STORAGE_BUCKET=patente-b-2025.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Claude AI API (per FASE 3 - spiegazioni AI)
VITE_CLAUDE_API_KEY=sk-ant-api03-...

# ElevenLabs TTS API (opzionale - per FASE 4)
VITE_ELEVENLABS_API_KEY=your_key_here

# App Configuration (già preimpostati)
VITE_APP_ENV=development
VITE_FREE_AI_QUOTA_DAILY=5
VITE_FREE_TRANSLATION_QUOTA_DAILY=30
VITE_PREMIUM_PRICE=4.99
```

### 4. Avvia il dev server

```bash
npm run dev
```

L'app sarà disponibile su: **http://localhost:5173**

## 🎨 Cosa è Stato Creato

### ✅ Configurazione Base
- ✓ Vite + React 18 + TypeScript (strict mode)
- ✓ Tailwind CSS configurato con tema custom
- ✓ PostCSS + Autoprefixer
- ✓ ESLint configurato
- ✓ PWA setup (manifest + service worker)

### ✅ Design System
- ✓ Palette colori blu istituzionale (#3b82f6)
- ✓ Classi glassmorphism (`.glass-card`, `.glass-button`)
- ✓ Dark/Light mode support
- ✓ Animazioni fluide (fade-in, slide-up)
- ✓ CSS custom utilities (scrollbar, gradients)

### ✅ Struttura Componenti
```
src/
├── components/
│   ├── ui/              ✓ Button, Card, GlassCard, ThemeToggle
│   ├── landing/         ✓ HeroSection
│   ├── layout/          ✓ Navbar
│   ├── quiz/            (FASE 2)
│   ├── auth/            (FASE 5)
│   └── dashboard/       (future)
├── lib/                 ✓ firebase.ts, utils.ts
├── store/               ✓ useStore.ts (Zustand)
├── types/               ✓ index.ts (TypeScript types)
├── hooks/               (FASE 2+)
├── styles/              ✓ globals.css
└── pages/               ✓ LandingPage.tsx
```

### ✅ Features Implementate
- ✓ Landing page con hero section
- ✓ Navbar con logo e theme toggle
- ✓ Dark/Light mode funzionante
- ✓ Firebase setup pronto
- ✓ Zustand store configurato
- ✓ React Router configurato
- ✓ TypeScript types definiti
- ✓ PWA manifest e service worker

## 🔥 Verifica Funzionamento

Dopo `npm run dev`, dovresti vedere:

1. **Landing page** con:
   - Hero section con gradiente blu
   - 3 cards glassmorphism (Quiz, AI, Simulazioni)
   - Statistiche (7139 quiz, 25 argomenti, 100% gratuito)
   - Navbar con logo e theme toggle

2. **Theme Toggle** funzionante:
   - Clicca l'icona sole/luna nella navbar
   - Lo sfondo dovrebbe cambiare da light a dark

3. **Design Glassmorphism**:
   - Effetti blur sulle card
   - Trasparenze
   - Bordi soft con luminosità

## 🚀 FASE 2 - Quiz System (Prossimo Step)

Usa questo prompt per continuare:

```
FASE 2: Implementa il sistema Quiz Core

TASK:
1. Crea file src/data/questions.json con struttura:
   [{ id, domanda, risposta, immagine?, argomento }]
   
2. Componenti da creare:
   - QuizContainer.tsx (orchestrator)
   - QuestionCard.tsx (UI singola domanda)
   - Timer.tsx (countdown 20 minuti)
   - ProgressBar.tsx (avanzamento 1/30)
   - AnswerButton.tsx (VERO/FALSO con feedback)
   - ResultsScreen.tsx (schermata finale)

3. Hooks:
   - useQuizTimer.ts (gestione countdown)
   - useQuizState.ts (stato quiz)

4. Features:
   - Genera quiz random 30 domande
   - Timer countdown con auto-submit
   - Contatore errori (max 3)
   - Navigazione avanti/indietro
   - Calcolo score e esito PROMOSSO/BOCCIATO
   - Salvataggio attempt su Firestore

Segui design glassmorphism da .cursorrules
```

## 📚 Documentazione

- **README.md** - Overview progetto
- **.cursorrules** - Convenzioni e specifiche tecniche complete
- **SETUP_GUIDE.md** (questo file) - Guida setup

## 🐛 Troubleshooting

### Errore: "Cannot find module '@radix-ui/...'"
```bash
npm install
```

### Errore: "Firebase not initialized"
Verifica che il file `.env` sia presente e contenga tutte le variabili Firebase.

### Dark mode non funziona
Controlla che `localStorage` sia accessibile nel browser (alcune estensioni lo bloccano).

### Build fails con TypeScript errors
Verifica che `tsconfig.json` abbia `"strict": true` e risolvi gli errori tipizzazione.

## 📞 Support

Per domande specifiche sul codice, consulta:
- `.cursorrules` - Convenzioni complete
- `README.md` - Documentazione features
- File sorgenti - Tutti i componenti hanno commenti

---

## ✨ Ready to Code!

Il setup è completo. Puoi ora:

1. **Testare** la landing page: `npm run dev`
2. **Passare alla FASE 2** (Quiz System)
3. **Personalizzare** colori e design se necessario

**Buon sviluppo! 🚀**

