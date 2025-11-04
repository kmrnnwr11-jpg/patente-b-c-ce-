# 📁 PROJECT STRUCTURE - Patente B 2025

## Panoramica Completa

```
patente-b/
├── public/                          # Static assets
│   ├── vite.svg                    # Favicon
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service Worker (FASE 10)
│   ├── robots.txt                  # SEO (FASE 10)
│   └── icons/                      # PWA icons (72-512px)
│
├── src/
│   ├── components/                 # React components
│   │   ├── ui/                    # ✅ Base UI components (shadcn-style)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── landing/               # ⏳ FASE 2: Landing page
│   │   │   ├── HeroSection.tsx    # ✅
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── auth/                  # ⏳ FASE 3: Authentication
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── SocialLoginButton.tsx
│   │   │   ├── PasswordReset.tsx
│   │   │   └── EmailVerification.tsx
│   │   │
│   │   ├── dashboard/             # ⏳ FASE 3: Dashboard
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── StreakDisplay.tsx
│   │   │   ├── WeakTopicsPanel.tsx
│   │   │   └── QuickActions.tsx
│   │   │
│   │   ├── quiz/                  # ⏳ FASE 4: Quiz system
│   │   │   ├── QuizContainer.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── NavigationControls.tsx
│   │   │   ├── ErrorCounter.tsx
│   │   │   ├── AnswerButton.tsx
│   │   │   ├── ResultsScreen.tsx
│   │   │   ├── ReviewMode.tsx
│   │   │   └── QuizSaveIndicator.tsx
│   │   │
│   │   ├── study/                 # ⏳ FASE 5: Study mode
│   │   │   ├── TopicSelector.tsx
│   │   │   ├── TopicCard.tsx
│   │   │   ├── TopicQuiz.tsx
│   │   │   ├── ExplanationPanel.tsx
│   │   │   ├── BookmarkButton.tsx
│   │   │   ├── TopicProgress.tsx
│   │   │   └── FilterBar.tsx
│   │   │
│   │   ├── ai/                    # ⏳ FASE 6: AI features
│   │   │   ├── AIExplanationButton.tsx
│   │   │   ├── AIExplanationPanel.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── TranslationToggle.tsx
│   │   │   ├── QuotaDisplay.tsx
│   │   │   └── PaywallModal.tsx
│   │   │
│   │   ├── theory/                # ⏳ FASE 7: Theory
│   │   │   ├── TheoryList.tsx
│   │   │   ├── TheoryChapter.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── TheoryAudioPlayer.tsx
│   │   │   ├── ChapterQuiz.tsx
│   │   │   ├── BookmarkPanel.tsx
│   │   │   ├── NotesEditor.tsx
│   │   │   └── ProgressIndicator.tsx
│   │   │
│   │   ├── stats/                 # ⏳ FASE 8: Statistics
│   │   │   ├── StatsOverview.tsx
│   │   │   ├── ScoreChart.tsx
│   │   │   ├── TopicHeatmap.tsx
│   │   │   ├── TimeAnalysis.tsx
│   │   │   ├── ErrorAnalysis.tsx
│   │   │   ├── AchievementBadges.tsx
│   │   │   ├── StreakCalendar.tsx
│   │   │   ├── LeaderboardTable.tsx
│   │   │   └── ExportReportButton.tsx
│   │   │
│   │   ├── payment/               # ⏳ FASE 9: Payments
│   │   │   ├── PricingCards.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentSuccess.tsx
│   │   │   ├── SubscriptionManager.tsx
│   │   │   ├── InvoiceList.tsx
│   │   │   ├── CancelSubscriptionModal.tsx
│   │   │   └── UpgradePrompt.tsx
│   │   │
│   │   ├── layout/                # ✅ Layout components
│   │   │   ├── Navbar.tsx         # ✅
│   │   │   ├── Footer.tsx         # ⏳ FASE 2
│   │   │   ├── Sidebar.tsx
│   │   │   └── PageLayout.tsx
│   │   │
│   │   └── onboarding/            # ⏳ FASE 2
│   │       ├── OnboardingFlow.tsx
│   │       ├── StepRegistration.tsx
│   │       ├── StepLevelSelection.tsx
│   │       └── StepTutorial.tsx
│   │
│   ├── lib/                       # ✅ Utilities & integrations
│   │   ├── firebase.ts            # ✅ Firebase config
│   │   ├── utils.ts               # ✅ Utility functions
│   │   ├── constants.ts           # ✅ App constants
│   │   ├── claude.ts              # ⏳ FASE 6: Claude API
│   │   ├── elevenlabs.ts          # ⏳ FASE 6: ElevenLabs API
│   │   ├── stripe.ts              # ⏳ FASE 9: Stripe
│   │   ├── quota.ts               # ⏳ FASE 6: Quota management
│   │   └── subscription.ts        # ⏳ FASE 9: Subscriptions
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts             # ⏳ FASE 3
│   │   ├── useQuizTimer.ts        # ⏳ FASE 4
│   │   ├── useQuizState.ts        # ⏳ FASE 4
│   │   ├── useAutoSave.ts         # ⏳ FASE 4
│   │   ├── useQuota.ts            # ⏳ FASE 6
│   │   ├── useAudio.ts            # ⏳ FASE 6
│   │   ├── useSubscription.ts     # ⏳ FASE 9
│   │   └── useStreak.ts           # ⏳ FASE 3
│   │
│   ├── store/                     # ✅ State management (Zustand)
│   │   ├── useStore.ts            # ✅ Global store
│   │   ├── quizStore.ts           # ⏳ FASE 4
│   │   ├── userStore.ts           # ⏳ FASE 3
│   │   └── uiStore.ts             # ⏳ UI state
│   │
│   ├── types/                     # ✅ TypeScript types
│   │   ├── index.ts               # ✅ Main types
│   │   ├── api.ts                 # ⏳ API types
│   │   ├── firestore.ts           # ⏳ Firestore types
│   │   └── stripe.ts              # ⏳ Stripe types
│   │
│   ├── pages/                     # Route pages
│   │   ├── LandingPage.tsx        # ✅ Home page
│   │   ├── LoginPage.tsx          # ⏳ FASE 3
│   │   ├── RegisterPage.tsx       # ⏳ FASE 3
│   │   ├── DashboardPage.tsx      # ⏳ FASE 3
│   │   ├── ExamPage.tsx           # ⏳ FASE 4
│   │   ├── ExamResultsPage.tsx    # ⏳ FASE 4
│   │   ├── StudyPage.tsx          # ⏳ FASE 5
│   │   ├── TheoryPage.tsx         # ⏳ FASE 7
│   │   ├── StatsPage.tsx          # ⏳ FASE 8
│   │   ├── ProfilePage.tsx        # ⏳ FASE 3
│   │   ├── SettingsPage.tsx       # ⏳ FASE 3
│   │   ├── PricingPage.tsx        # ⏳ FASE 2
│   │   ├── CheckoutPage.tsx       # ⏳ FASE 9
│   │   └── BookmarksPage.tsx      # ⏳ FASE 5
│   │
│   ├── styles/                    # ✅ Global styles
│   │   ├── globals.css            # ✅ Main CSS + imports
│   │   ├── theme.css              # ✅ CSS variables
│   │   └── glassmorphism.css      # ✅ Glass effects
│   │
│   ├── data/                      # Static data
│   │   ├── questions.json         # ⏳ 7139 domande (FASE 4)
│   │   ├── argomenti.json         # ⏳ 25 argomenti metadata
│   │   └── achievements.json      # ⏳ Achievement definitions
│   │
│   ├── App.tsx                    # ✅ Main app component
│   ├── main.tsx                   # ✅ Entry point
│   └── vite-env.d.ts              # ✅ Vite types
│
├── firebase/                      # Firebase backend (optional)
│   ├── functions/                 # Cloud Functions
│   │   ├── src/
│   │   │   ├── index.ts           # ⏳ FASE 10
│   │   │   ├── quotaReset.ts      # Daily quota reset
│   │   │   ├── stripeWebhooks.ts  # Stripe webhooks
│   │   │   └── emailNotifications.ts
│   │   └── package.json
│   ├── firestore.rules            # ⏳ FASE 3: Security rules
│   └── storage.rules              # ⏳ FASE 3: Storage rules
│
├── scripts/                       # Build & utility scripts
│   ├── seedFirestore.ts           # Seed Firestore data
│   ├── generateIcons.ts           # Generate PWA icons
│   └── buildSitemap.ts            # Generate sitemap.xml
│
├── .cursorrules                   # ✅ Cursor AI rules
├── .env.example                   # ✅ Environment template
├── .gitignore                     # ✅ Git ignore
├── eslintrc.cjs                   # ✅ ESLint config
├── index.html                     # ✅ HTML entry
├── package.json                   # ✅ Dependencies
├── postcss.config.js              # ✅ PostCSS
├── tailwind.config.js             # ✅ Tailwind config
├── tsconfig.json                  # ✅ TypeScript config
├── tsconfig.node.json             # ✅ TS config for Vite
├── vite.config.ts                 # ✅ Vite config
├── README.md                      # ✅ Project README
├── SETUP_GUIDE.md                 # ✅ Setup instructions
├── ROADMAP.md                     # ✅ Development roadmap
├── FIRESTORE_STRUCTURE.md         # ✅ Database schema
└── PROJECT_STRUCTURE.md           # ✅ This file
```

---

## 📊 Status Legend

- ✅ **Completato** - File creato e funzionante
- ⏳ **TODO** - Da implementare nelle fasi successive
- 🔄 **In Progress** - Parzialmente implementato

---

## 📦 Component Organization

### UI Components (`src/components/ui/`)
Componenti base riutilizzabili seguendo lo stile shadcn/ui:
- Variants con CVA (class-variance-authority)
- Props tipizzate con TypeScript
- Accessibilità (ARIA labels, keyboard navigation)
- Theme-aware (light/dark mode)

### Feature Components
Raggruppati per feature/page:
- `landing/` - Landing page sections
- `auth/` - Authentication forms
- `dashboard/` - Dashboard widgets
- `quiz/` - Quiz functionality
- `study/` - Study mode
- `ai/` - AI features
- `theory/` - Theory reader
- `stats/` - Statistics & charts
- `payment/` - Payment & subscriptions

---

## 🗄️ Data Flow

### State Management (Zustand)

```typescript
// Global State
useStore.ts
├── user (User | null)
├── theme ('light' | 'dark')
├── aiQuotaRemaining (number)
└── translationQuotaRemaining (number)

// Quiz State
quizStore.ts
├── currentQuiz (QuizAttempt | null)
├── questions (Question[])
├── currentQuestionIndex (number)
├── timeRemaining (number)
└── answers (Map<questionId, boolean>)

// User State
userStore.ts
├── profile (User)
├── progress (UserProgress)
├── achievements (Achievement[])
└── subscriptions (Subscription)
```

### Data Persistence

```
Firestore Collections
├── users/           → useStore.user
├── quiz_attempts/   → quizStore.currentQuiz
├── user_progress/   → userStore.progress
├── ai_usage/        → useStore.aiQuotaRemaining
├── teoria/          → Static read-only
└── subscriptions/   → userStore.subscription
```

---

## 🔄 Component Lifecycle

### Quiz Flow Example

```
1. User clicks "Inizia Esame"
   └─> ExamPage.tsx renders

2. QuizContainer.tsx
   ├─> useQuizState() inizializza quiz
   ├─> Carica 30 domande random
   └─> Avvia timer (useQuizTimer)

3. Per ogni domanda:
   ├─> QuestionCard.tsx renderizza domanda
   ├─> AnswerButton.tsx cattura risposta
   ├─> Auto-save (useAutoSave) ogni 30s
   └─> Avanza alla prossima

4. Al completamento:
   ├─> Calcola score
   ├─> Salva su Firestore
   └─> Redirect a ResultsScreen.tsx

5. ResultsScreen.tsx
   ├─> Mostra score finale
   ├─> Lista errori
   └─> CTA: "Rivedi Errori" o "Nuovo Esame"
```

---

## 🎯 Import Patterns

### Absolute Imports (via @)

```typescript
// Good ✅
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { EXAM_CONFIG } from '@/lib/constants';

// Avoid ❌
import { Button } from '../../components/ui/Button';
```

### Barrel Exports

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { GlassCard } from './GlassCard';

// Usage
import { Button, Card, GlassCard } from '@/components/ui';
```

---

## 🔐 Environment Variables

```env
# Required for all phases
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Required for FASE 6 (AI)
VITE_CLAUDE_API_KEY=
VITE_ELEVENLABS_API_KEY=

# Required for FASE 9 (Payments)
VITE_STRIPE_PUBLIC_KEY=

# Optional configurations
VITE_APP_ENV=development
VITE_FREE_AI_QUOTA_DAILY=5
VITE_FREE_TRANSLATION_QUOTA_DAILY=30
VITE_PREMIUM_PRICE=4.99
```

---

## 📝 Naming Conventions

### Files
- **Components**: `PascalCase.tsx` (e.g. `QuizContainer.tsx`)
- **Utilities**: `camelCase.ts` (e.g. `utils.ts`)
- **Hooks**: `use` prefix (e.g. `useAuth.ts`)
- **Types**: `PascalCase.ts` (e.g. `User.ts`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g. `EXAM_CONFIG`)

### Components
```typescript
// Functional Component with FC type
export const ComponentName: FC<Props> = ({ prop1, prop2 }) => {
  return <div>...</div>;
};

// Props interface
interface ComponentNameProps {
  title: string;
  onClick: () => void;
}
```

### Functions
```typescript
// Event handlers: handle prefix
const handleClick = () => {};
const handleSubmit = (e: FormEvent) => {};

// Utilities: verb + noun
const formatDate = (date: Date) => {};
const calculateScore = (correct: number, total: number) => {};
```

---

## 🚀 Build & Deploy

### Development
```bash
npm run dev          # Start dev server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment (Vercel)
```bash
vercel --prod        # Deploy to production
```

---

**Struttura completa e pronta per scalare! 📁**

