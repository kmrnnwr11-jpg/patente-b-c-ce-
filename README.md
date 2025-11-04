# 🚗 Patente B 2.0

App moderna e multilingua per la preparazione all'esame della Patente B italiana.

![Patente B 2.0](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6.svg)

---

## ✨ Features Principali

### 🌍 **Traduzione Intelligente Parola per Parola**
- Click su qualsiasi parola per traduzione istantanea
- 10+ lingue supportate simultaneamente
- Cache intelligente per prestazioni ottimali
- Pronuncia audio per ogni lingua

### 🔊 **Audio Multilingua Avanzato**
- Text-to-Speech in 10+ lingue
- Velocità regolabile (0.5x - 2.0x)
- Download audio per uso offline
- Controlli intuitivi (Play/Pause/Mute)

### ⏱️ **Timer Circolare Professionale**
- Countdown 20 minuti con animazioni SVG
- Warning visivo ultimi 5 minuti
- Alert critico ultimi 60 secondi
- Suono di avviso automatico

### 🤖 **AI Spiegazioni**
- Claude AI spiega ogni risposta in modo semplice
- Riferimenti normativi (Codice della Strada)
- Tips per ricordare le regole
- Analisi errori comuni

### 📚 **7139 Quiz Ministeriali**
- Tutti i quiz ufficiali aggiornati 2025
- Simulazione esame reale (30 domande, 20 minuti)
- Quiz per argomento (25 categorie)
- Statistiche dettagliate

### 📱 **PWA (Progressive Web App)**
- Installabile come app nativa
- Funziona offline
- Notifiche push
- Aggiornamenti automatici

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI Library
- **TypeScript 5.3.3** - Type Safety
- **Vite 5.0.11** - Build Tool
- **Tailwind CSS 3.4.1** - Styling
- **Framer Motion 10.16.16** - Animations

### Backend & Services
- **Firebase** - Authentication, Firestore, Storage
- **Claude AI** - Spiegazioni intelligenti (Anthropic)
- **Google Translate API** - Traduzioni
- **ElevenLabs** - Text-to-Speech naturale (opzionale)

### State Management
- **Zustand 4.4.7** - Global State
- **React Router 6.21.1** - Navigation

### UI Components
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Shadcn/ui** - Component library

---

## 🚀 Quick Start

### 1. Clona il Repository
```bash
git clone https://github.com/tuo-username/patente-b-2.0.git
cd patente-b-2.0
```

### 2. Installa Dipendenze
```bash
npm install
```

### 3. Configura Environment Variables
Crea un file `.env` nella root:
```bash
cp .env.example .env
```

Poi modifica `.env` con le tue API keys:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_ANTHROPIC_API_KEY=sk-ant-xxx
VITE_GOOGLE_TRANSLATE_API_KEY=xxx
```

### 4. Avvia Development Server
```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

### 5. Build per Produzione
```bash
npm run build
npm run preview
```

---

## 📁 Struttura Progetto

```
patente-b-2.0/
├── public/
│   ├── images/
│   │   └── quiz/              # 7139 immagini quiz
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── translation/       # 🆕 Sistema traduzione 2.0
│   │   │   ├── WordTranslationModal.tsx
│   │   │   ├── ClickableText.tsx
│   │   │   └── LanguageSelector.tsx
│   │   ├── audio/             # 🆕 Audio player avanzato
│   │   │   └── AdvancedAudioPlayer.tsx
│   │   ├── quiz/              # 🆕 Timer circolare
│   │   │   ├── AdvancedTimer.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── QuizResults.tsx
│   │   ├── ai/
│   │   │   └── AIExplanationPanel.tsx
│   │   ├── dashboard/
│   │   ├── theory/
│   │   └── ui/
│   ├── pages/
│   │   ├── QuizPage20.tsx     # 🆕 Nuova esperienza quiz
│   │   ├── DashboardHome.tsx
│   │   ├── TheoryPage.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── translationCache.ts # 🆕 Cache traduzioni
│   │   ├── firebase.ts
│   │   ├── aiService.ts
│   │   └── quizLoader.ts
│   ├── hooks/
│   ├── contexts/
│   ├── types/
│   └── styles/
├── PATENTE_B_2.0_README.md
├── IMPLEMENTAZIONE_COMPLETATA.md
└── package.json
```

---

## 🌐 Lingue Supportate

| Lingua | Emoji | Codice |
|--------|-------|--------|
| Italiano | 🇮🇹 | `it` |
| English | 🇬🇧 | `en` |
| العربية | 🇸🇦 | `ar` |
| اردو | 🇵🇰 | `ur` |
| हिंदी | 🇮🇳 | `hi` |
| ਪੰਜਾਬੀ | 🏴 | `pa` |
| Français | 🇫🇷 | `fr` |
| Deutsch | 🇩🇪 | `de` |
| Español | 🇪🇸 | `es` |
| 中文 | 🇨🇳 | `zh` |
| Română | 🇷🇴 | `ro` |

---

## 📊 Statistiche

- **Quiz Ministeriali**: 7.139
- **Immagini**: 413
- **Argomenti Teoria**: 25
- **Componenti React**: 60+
- **Linee di Codice**: ~15.000
- **Test Coverage**: In sviluppo

---

## 🎯 Roadmap

### ✅ Completato (v2.0)
- [x] Sistema traduzione parola per parola
- [x] Audio multilingua avanzato
- [x] Timer circolare con warning
- [x] UI/UX moderna con Framer Motion
- [x] Cache intelligente traduzioni
- [x] PWA completa

### 🔄 In Sviluppo (v2.1)
- [ ] Grafiche 3D con Three.js
- [ ] Integrazione ElevenLabs completa
- [ ] Social sharing risultati
- [ ] Multiplayer quiz challenges
- [ ] Dark mode avanzato

### 🎯 Futuro (v3.0)
- [ ] App mobile nativa (React Native)
- [ ] AI tutor personalizzato
- [ ] Realtà aumentata per segnali
- [ ] Gamification avanzata

---

## 🔧 Scripts Disponibili

```bash
# Development
npm run dev              # Avvia dev server

# Build
npm run build            # Build per produzione
npm run preview          # Preview build locale

# Quality
npm run lint             # Lint TypeScript/React
npm run type-check       # Type checking

# Import
npm run import-quiz      # Importa nuovi quiz
```

---

## 🐛 Troubleshooting

### L'app non si avvia
```bash
# Pulisci e reinstalla
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Errori di build
```bash
# Verifica TypeScript
npm run type-check

# Build pulita
rm -rf dist
npm run build
```

### Audio non funziona
- Verifica permessi audio del browser
- Su iOS, il primo play richiede interazione utente
- Controlla console per errori Web Speech API

---

## 📄 License

© 2025 Patente B 2.0. All rights reserved.

Questo progetto è privato e non può essere redistribuito senza autorizzazione.

---

## 🤝 Contributing

Questo è un progetto privato. Per suggerimenti o bug, contatta direttamente lo sviluppatore.

---

## 📞 Support

Per domande o assistenza:
- 📧 Email: support@patenteB2025.it
- 📱 WhatsApp: [Link]
- 💬 Discord: [Server]

---

## 🙏 Credits

**Developed by**: [Il Tuo Nome]  
**Powered by**: Claude AI, Firebase, React  
**Design**: Custom UI/UX con Tailwind CSS  

---

## ⭐ Features Highlight

### 🆕 Novità Versione 2.0

1. **Traduzione Click-to-Translate**
   - Ogni parola è cliccabile
   - Modal moderno con 4 lingue simultanee
   - Audio pronuncia integrato

2. **Audio Player Avanzato**
   - 10+ lingue supportate
   - Velocità regolabile
   - Download per offline

3. **Timer Professionale**
   - Animazione SVG fluida
   - Warning progressivi
   - Suono automatico

4. **Performance Ottimizzate**
   - Cache traduzioni (70% risparmio API)
   - Lazy loading componenti
   - Bundle ottimizzato

---

<div align="center">

**Made with ❤️ in Italy** 🇮🇹

**[🌐 Website](#) • [📱 Demo](#) • [📖 Docs](#)**

</div>
