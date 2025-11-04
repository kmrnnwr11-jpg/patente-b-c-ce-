# ⚡ QUICK START - Patente B 2025

## 🎯 Setup in 5 Minuti

### 1️⃣ Installa Dipendenze
```bash
cd "/Users/kmrnnwr/patente b"
npm install
```

### 2️⃣ Configura Firebase
1. Vai su https://console.firebase.google.com
2. Crea progetto "patente-b-2025"
3. Abilita: **Authentication**, **Firestore**, **Storage**
4. Copia credenziali e crea `.env`:

```bash
# Copia template
cp .env.example .env

# Modifica .env con le tue credenziali Firebase
```

### 3️⃣ Avvia Dev Server
```bash
npm run dev
```

Apri: **http://localhost:5173**

---

## 📁 File Principali

### Configurazione
- `vite.config.ts` - Build config + PWA
- `tailwind.config.js` - Tema custom blu + glassmorphism
- `tsconfig.json` - TypeScript strict mode
- `.env` - API keys (da creare)

### Styling
- `src/styles/globals.css` - Main CSS
- `src/styles/theme.css` - CSS variables
- `src/styles/glassmorphism.css` - Glass effects

### Code
- `src/App.tsx` - Router principale
- `src/main.tsx` - Entry point
- `src/store/useStore.ts` - Zustand state
- `src/lib/firebase.ts` - Firebase config
- `src/lib/constants.ts` - App constants

### Componenti Pronti
- `src/components/ui/` - Button, Card, GlassCard, ThemeToggle
- `src/components/landing/HeroSection.tsx` - Hero section
- `src/components/layout/Navbar.tsx` - Navbar

---

## 🗺️ Roadmap 10 Fasi

| Fase | Descrizione | Status | File Chiave |
|------|-------------|--------|-------------|
| **1** | Design System | ✅ FATTO | `src/styles/*.css`, `components/ui/` |
| **2** | Landing Page | 🔄 50% | `components/landing/` |
| **3** | Auth & Dashboard | ⏳ TODO | `components/auth/`, `components/dashboard/` |
| **4** | Quiz System | ⏳ TODO | `components/quiz/`, `hooks/useQuiz*.ts` |
| **5** | Studio Argomenti | ⏳ TODO | `components/study/` |
| **6** | AI + Audio | ⏳ TODO | `components/ai/`, `lib/claude.ts` |
| **7** | Teoria | ⏳ TODO | `components/theory/` |
| **8** | Statistiche | ⏳ TODO | `components/stats/` |
| **9** | Payments | ⏳ TODO | `components/payment/`, `lib/stripe.ts` |
| **10** | PWA & Deploy | ⏳ TODO | `public/sw.js`, deployment |

**Dettagli**: Vedi `ROADMAP.md`

---

## 🎨 Design System Quick Reference

### Colori
```css
/* Primary (Blu istituzionale) */
--primary-500: #3b82f6
--primary-600: #2563eb
--primary-700: #1d4ed8

/* Success */
--success-500: #10b981

/* Error */
--error-500: #ef4444

/* Warning */
--warning-500: #f59e0b
```

### Classi Glassmorphism
```tsx
<div className="glass-card">       // Light blur
<div className="glass-card-strong"> // Heavy blur
<button className="glass-button">  // Button glass
<input className="glass-input">    // Input glass
```

### Componenti UI
```tsx
import { Button, Card, GlassCard, ThemeToggle } from '@/components/ui';

<Button variant="default">Click me</Button>
<Button variant="glass">Glass style</Button>
<Button variant="outline">Outline</Button>

<GlassCard variant="default">Content</GlassCard>
<GlassCard variant="strong">Heavy blur</GlassCard>
```

---

## 🔥 Comandi Utili

```bash
# Development
npm run dev          # Avvia dev server
npm run build        # Build produzione
npm run preview      # Preview build

# Linting
npm run lint         # ESLint check

# Database
# (Creare script seedFirestore.ts per popolare Firestore)
```

---

## 📚 Documentazione

### Setup & Guida
- `README.md` - Overview progetto
- `SETUP_GUIDE.md` - Setup dettagliato
- `QUICK_START.md` - Questo file (quick start)

### Architettura
- `ROADMAP.md` - Piano sviluppo 10 fasi
- `FIRESTORE_STRUCTURE.md` - Schema database
- `PROJECT_STRUCTURE.md` - Struttura cartelle
- `.cursorrules` - Convenzioni codice

---

## 🚀 Prossimi Step

### FASE 2 (Landing Page Completa)
```bash
# Da implementare:
src/components/landing/
  - FeaturesSection.tsx
  - PricingSection.tsx
  - TestimonialsSection.tsx
  - Footer.tsx
```

**Prompt per Cursor**:
```
FASE 2: Completa la landing page

Crea:
1. FeaturesSection.tsx - 6 features con icone Lucide
2. PricingSection.tsx - Comparison Free vs Premium (€4.99/mese)
3. TestimonialsSection.tsx - 3 recensioni utenti fake
4. Footer.tsx - Links, social, copyright

Usa glassmorphism style da .cursorrules
```

### FASE 3 (Autenticazione)
Dopo aver completato FASE 2, usa questo prompt:
```
FASE 3: Implementa autenticazione Firebase

Crea:
1. LoginForm.tsx - Email/password login
2. RegisterForm.tsx - Registrazione con validation
3. SocialLoginButton.tsx - Google OAuth
4. Dashboard base con statistiche mock

Setup Firebase Auth e crea primi documenti Firestore
```

### FASE 4 (Quiz System)
```
FASE 4: Implementa sistema quiz

Requisiti:
1. Crea src/data/questions.json con struttura:
   [{ id, domanda, risposta, immagine?, argomento }]
   (puoi iniziare con 100 domande mock, poi espandere)

2. QuizContainer.tsx con:
   - Timer 20 minuti
   - 30 domande random
   - Navigazione prev/next
   - Error counter (max 3)
   - Auto-save ogni 30s

3. ResultsScreen.tsx con score e revisione

Segui EXAM_CONFIG in src/lib/constants.ts
```

---

## 🐛 Troubleshooting

### Problema: Firebase non inizializzato
**Soluzione**: Verifica che `.env` contenga tutte le variabili `VITE_FIREBASE_*`

### Problema: Dark mode non funziona
**Soluzione**: Controlla che `localStorage` sia accessibile (disabilita estensioni che lo bloccano)

### Problema: Build error TypeScript
**Soluzione**: Esegui `npm run lint` e fixa errori tipo

### Problema: Tailwind classi non funzionano
**Soluzione**: Riavvia dev server (`Ctrl+C` poi `npm run dev`)

---

## 💡 Tips

### 1. Usa Absolute Imports
```typescript
// ✅ Good
import { Button } from '@/components/ui/Button';

// ❌ Avoid
import { Button } from '../../components/ui/Button';
```

### 2. TypeScript Strict Mode
Tutti i file devono passare TypeScript strict check. No `any` types!

### 3. Glassmorphism Everywhere
Usa classi `.glass-*` per mantenere coerenza design.

### 4. Mobile-First
Design responsive da mobile a desktop.

### 5. Firestore > localStorage
Per persistenza dati, usa sempre Firestore (non localStorage).

---

## 📞 Supporto

### Documenti da consultare:
1. `.cursorrules` - Convenzioni complete
2. `ROADMAP.md` - Piano dettagliato
3. `FIRESTORE_STRUCTURE.md` - Schema database
4. `src/lib/constants.ts` - Costanti app

### Prompt utili per Cursor:
- "Implementa FASE X seguendo ROADMAP.md"
- "Crea componente Y seguendo .cursorrules"
- "Fix linter errors"
- "Review UI design system"

---

## ✅ Checklist Pre-Development

Prima di iniziare FASE 2+, verifica:

- [ ] `npm install` completato senza errori
- [ ] `.env` creato con Firebase credentials
- [ ] `npm run dev` funziona e mostra landing page
- [ ] Dark mode toggle funzionante
- [ ] No errori TypeScript (`npm run lint`)
- [ ] Hero section visibile con glassmorphism
- [ ] Firebase console aperta con progetto creato

**Se tutto ✅ → Sei pronto per FASE 2! 🚀**

---

**Happy Coding! 💻**

