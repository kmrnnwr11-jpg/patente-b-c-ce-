# 🚀 ROADMAP SVILUPPO - PATENTE B 2025

## 📊 ARCHITETTURA PROGETTO

### Stack Tecnologico
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Glassmorphism
- **UI Components**: Shadcn/ui + Lucide Icons
- **State Management**: Zustand
- **Backend**: Firebase (Auth + Firestore + Storage)
- **AI Audio**: ElevenLabs API
- **AI Spiegazioni**: Claude API (Anthropic)
- **Hosting**: Vercel/Netlify (PWA)

---

## 🗄️ FIRESTORE COLLECTIONS STRUCTURE

### users/
```typescript
{
  userId: string (document ID)
  email: string
  displayName: string
  plan: 'free' | 'premium'
  aiExplanationsLeft: number // 5/giorno free
  translationsLeft: number // 30/giorno free
  createdAt: timestamp
  lastActiveAt: timestamp
  premiumExpiresAt?: timestamp
  streak: number
}
```

### quiz_attempts/
```typescript
{
  attemptId: string (document ID)
  userId: string
  startedAt: timestamp
  completedAt: timestamp
  questions: array[30] // { id, domanda, risposta, userAnswer, correct }
  score: number
  errors: number
  timeElapsed: number // in secondi
  mode: 'exam' | 'practice'
  passed: boolean
}
```

### user_progress/
```typescript
{
  userId: string (document ID)
  totalAttempts: number
  passedExams: number
  weakArguments: array // top 5 argomenti con più errori
  studyProgress: { [argomento]: percentage }
  lastStudiedTopics: array
  bookmarkedQuestions: array[questionId]
  totalQuestionsAnswered: number
}
```

### ai_usage/
```typescript
{
  userId: string (document ID)
  explanationsUsedToday: number
  translationsUsedToday: number
  lastResetDate: timestamp // reset giornaliero
  totalExplanationsUsed: number
  totalTranslationsUsed: number
}
```

### teoria/
```typescript
{
  topicId: string (document ID)
  title: string
  argomento: string
  content: string // markdown
  images: array[url]
  audioUrl: string // ElevenLabs generato
  order: number
  duration: number // tempo lettura stimato
}
```

### ai_explanations_cache/
```typescript
{
  questionId: string (document ID)
  explanation: string // Claude response
  cachedAt: timestamp
  usageCount: number // riuso cache per risparmiare API
}
```

---

## 📱 10 FASI DI SVILUPPO

### ✅ **FASE 1: Design System & Brand Identity** (2-3 giorni)

**Status**: ✅ COMPLETATA

**Deliverables**:
- ✅ Color palette blu istituzionale + accent
- ✅ Typography (Inter/Roboto)
- ✅ Glassmorphism components library
- ✅ Icon set (Lucide React)
- ✅ Dark/Light mode tokens

**Files Creati**:
- ✅ `src/styles/globals.css`
- ✅ `src/styles/theme.css`
- ✅ `src/styles/glassmorphism.css`
- ✅ `src/components/ui/GlassCard.tsx`
- ✅ `src/components/ui/Button.tsx`
- ✅ `src/components/ui/ThemeToggle.tsx`

---

### ⏳ **FASE 2: Landing Page & Onboarding** (2 giorni)

**Status**: 🔄 IN PROGRESS (Hero completata)

**Deliverables**:
- ✅ Hero section moderna con glassmorphism
- ⏳ Feature showcase dettagliato
- ⏳ Pricing plans (Free vs Premium)
- ⏳ Testimonials section
- ⏳ Onboarding flow (3 step: registrazione, scelta livello, tutorial)
- ⏳ Footer con link utili

**Components da Creare**:
```
components/landing/
  - HeroSection.tsx ✅
  - FeaturesSection.tsx ⏳
  - PricingSection.tsx ⏳
  - TestimonialsSection.tsx ⏳
  - CTASection.tsx ⏳
  - Footer.tsx ⏳
components/onboarding/
  - OnboardingFlow.tsx ⏳
  - StepRegistration.tsx ⏳
  - StepLevelSelection.tsx ⏳
  - StepTutorial.tsx ⏳
```

**Features**:
- Hero animata con statistiche real-time
- Features con icone Lucide e glassmorphism
- Pricing comparison table
- Social proof con testimonials
- Onboarding interattivo 3-step

---

### 📋 **FASE 3: Autenticazione & Dashboard** (3 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- Login/Register con Firebase Auth
- Social login (Google)
- Dashboard utente con statistiche
- Progress cards (% completamento argomenti)
- Streak tracking (giorni consecutivi)
- Profile management

**Components da Creare**:
```
components/auth/
  - LoginForm.tsx
  - RegisterForm.tsx
  - SocialLoginButton.tsx
  - PasswordReset.tsx
  - EmailVerification.tsx
components/dashboard/
  - DashboardLayout.tsx
  - StatCard.tsx
  - ProgressChart.tsx (Chart.js/Recharts)
  - RecentActivity.tsx
  - StreakDisplay.tsx
  - WeakTopicsPanel.tsx
  - QuickActions.tsx
```

**Features**:
- Autenticazione Firebase (email/password + Google)
- Persistenza sessione
- Dashboard con:
  - Statistiche globali (tentativi, punteggio medio, esami passati)
  - Grafico progresso ultimi 7 giorni
  - Top 5 argomenti deboli
  - Streak counter con badge
  - Quick actions (Nuovo esame, Studio, Teoria)
- Profile editing con avatar upload

---

### 📝 **FASE 4: Sistema Quiz Core** (4-5 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- Timer 20 minuti con countdown visibile
- 30 domande Vero/Falso con UI card-based
- Progress bar (domande 1/30)
- Navigazione avanti/indietro
- Error counter (max 3)
- Auto-save ogni 30 secondi
- Resume quiz interrotti
- Riepilogo finale con correzione

**Components da Creare**:
```
components/quiz/
  - QuizContainer.tsx (orchestrator)
  - QuestionCard.tsx (UI domanda + immagine)
  - Timer.tsx (countdown MM:SS)
  - ProgressBar.tsx (1/30 visual)
  - NavigationControls.tsx (prev/next)
  - ErrorCounter.tsx (0/3 errors)
  - AnswerButton.tsx (VERO/FALSO)
  - ResultsScreen.tsx (score, tempo, esito)
  - ReviewMode.tsx (revisione errori)
  - QuizSaveIndicator.tsx (auto-save status)
hooks/
  - useQuizTimer.ts
  - useQuizState.ts
  - useAutoSave.ts
```

**Features**:
- **Modalità Esame**:
  - 30 domande random
  - Timer 20 minuti
  - Max 3 errori per passare
  - Submit automatico allo scadere
  - Nessuna spiegazione durante quiz
- **Auto-save**: salva stato ogni 30 secondi
- **Resume**: riprendi quiz interrotto
- **Results Screen**:
  - Score finale (es. 27/30)
  - Tempo impiegato
  - Esito: PROMOSSO/BOCCIATO
  - Lista domande sbagliate con correzione
  - Bottone "Rivedi Errori"
- **Shuffle**: domande random ad ogni tentativo
- **Immagini**: lazy loading per performance

---

### 📚 **FASE 5: Modalità Studio per Argomenti** (3 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- 25 argomenti ministeriali organizzati
- Quiz illimitati per argomento
- Nessun timer (modalità rilassata)
- Spiegazione immediata dopo risposta
- Bookmark domande difficili
- Progress tracking per argomento

**Components da Creare**:
```
components/study/
  - TopicSelector.tsx (grid 25 argomenti)
  - TopicCard.tsx (con % progresso)
  - TopicQuiz.tsx (quiz senza timer)
  - ExplanationPanel.tsx (spiegazione immediata)
  - BookmarkButton.tsx (salva domanda)
  - TopicProgress.tsx (statistiche argomento)
  - FilterBar.tsx (filtra per difficoltà/status)
```

**Features**:
- **Topic Selector**:
  - 25 card argomenti con:
    - Titolo argomento
    - Icona Lucide
    - % completamento
    - Numero domande completate/totali
    - Badge difficoltà
- **Study Quiz**:
  - Nessun limite di tempo
  - Feedback immediato (CORRETTO/SBAGLIATO)
  - Spiegazione dopo ogni risposta
  - Bottone "Bookmark" per salvare domande
  - Contatore domande fatte
- **Bookmarks**: lista domande salvate per ripasso
- **Progress**: track % completamento per argomento

---

### 🤖 **FASE 6: AI Spiegazioni (Claude) + Audio (ElevenLabs)** (4 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- Bottone "Spiega con AI" su ogni domanda
- Spiegazione contestuale da Claude API
- Limite 5 spiegazioni/giorno (free)
- Audio text-to-speech multilingua
- Traduzione domande (30/giorno free)
- Quota display real-time

**Components da Creare**:
```
components/ai/
  - AIExplanationButton.tsx
  - AIExplanationPanel.tsx (Claude response)
  - AudioPlayer.tsx (ElevenLabs audio)
  - TranslationToggle.tsx (dropdown lingue)
  - QuotaDisplay.tsx (5/5 spiegazioni)
  - PaywallModal.tsx (upgrade premium)
lib/
  - claude.ts (API Claude integration)
  - elevenlabs.ts (API ElevenLabs)
  - quota.ts (gestione limiti)
```

**Features**:
- **AI Spiegazioni**:
  - Bottone "🤖 Spiega con AI" sotto ogni domanda
  - Claude genera spiegazione (max 2-3 frasi)
  - Prompt: "Sei un istruttore di scuola guida. Spiega in italiano semplice perché la risposta è [VERO/FALSO]"
  - Cache in Firestore per riuso
  - Quota: 5 free/giorno, unlimited premium
- **Audio Multilingua**:
  - Play button per ascoltare domanda
  - ElevenLabs TTS
  - Lingue: IT, EN, FR, DE, ES, AR, ZH, RO
  - Controlli: play/pause, speed (0.75x, 1x, 1.25x)
- **Traduzione**:
  - Dropdown lingue nella navbar
  - Traduce domanda on-the-fly
  - Quota: 30 traduzioni/giorno free
- **Quota Management**:
  - Display "5/5 spiegazioni oggi"
  - Reset automatico giornaliero (Firebase Cloud Function)
  - Paywall modal al limite

---

### 📖 **FASE 7: Teoria Interattiva** (3 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- 25 capitoli teoria (uno per argomento)
- Contenuto markdown con immagini
- Audio narrato (ElevenLabs)
- Progress tracking lettura
- Quiz rapido fine capitolo
- Segnalibri e note

**Components da Creare**:
```
components/theory/
  - TheoryList.tsx (lista 25 capitoli)
  - TheoryChapter.tsx (reader)
  - MarkdownRenderer.tsx (markdown con syntax highlight)
  - TheoryAudioPlayer.tsx
  - ChapterQuiz.tsx (5 domande rapide)
  - BookmarkPanel.tsx
  - NotesEditor.tsx
  - ProgressIndicator.tsx (scroll progress)
```

**Features**:
- **Theory Reader**:
  - Markdown formattato con Tailwind typography
  - Immagini embedded responsive
  - Audio narrato (play/pause)
  - Progress bar scroll
  - Estimated reading time
- **Chapter Quiz**:
  - 5 domande fine capitolo
  - Verifica comprensione
  - Nessun timer
  - Feedback immediato
- **Notes**: utente può aggiungere note personali
- **Bookmarks**: salva capitoli da rileggere

---

### 📊 **FASE 8: Statistiche Avanzate & Gamification** (3 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- Dashboard statistiche dettagliate
- Grafici progresso (Chart.js/Recharts)
- Leaderboard (optional)
- Achievement system
- Streak tracking
- Export PDF report

**Components da Creare**:
```
components/stats/
  - StatsOverview.tsx
  - ScoreChart.tsx (ultimi 30 giorni)
  - TopicHeatmap.tsx (argomenti più/meno studiati)
  - TimeAnalysis.tsx (tempo medio per domanda)
  - ErrorAnalysis.tsx (tipologie errori)
  - AchievementBadges.tsx
  - StreakCalendar.tsx
  - LeaderboardTable.tsx
  - ExportReportButton.tsx
```

**Features**:
- **Grafici**:
  - Score history (line chart)
  - Topic distribution (bar chart)
  - Success rate (pie chart)
  - Study time (area chart)
- **Achievements**:
  - "Primo Esame Superato" 🏆
  - "10 Esami Consecutivi" 🔥
  - "Studioso (7 giorni di fila)" 📚
  - "Perfezionista (30/30)" ⭐
  - Badge visuali con animazioni
- **Leaderboard**: top utenti della settimana
- **Export PDF**: report statistiche personalizzato

---

### 💳 **FASE 9: Monetizzazione & Payment** (4 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- Paywall per features premium
- Stripe integration
- Pricing page
- Subscription management
- Invoice generation
- Cancel/Pause subscription

**Components da Creare**:
```
components/payment/
  - PricingCards.tsx
  - CheckoutForm.tsx (Stripe Elements)
  - PaymentSuccess.tsx
  - SubscriptionManager.tsx
  - InvoiceList.tsx
  - CancelSubscriptionModal.tsx
  - UpgradePrompt.tsx
lib/
  - stripe.ts (Stripe client)
  - subscription.ts (gestione piani)
```

**Features**:
- **Pricing**:
  - Free: 5 AI/giorno, 30 traduzioni, ads
  - Premium €4.99/mese:
    - AI unlimited
    - Traduzioni unlimited
    - Statistiche avanzate
    - Audio multilingua unlimited
    - No ads
    - Export PDF report
- **Checkout**:
  - Stripe Elements integration
  - Card payment
  - 3D Secure
  - Success/Error handling
- **Subscription Management**:
  - View current plan
  - Upgrade/Downgrade
  - Cancel (with feedback survey)
  - Invoices download
- **Paywall**:
  - Block AI dopo 5 spiegazioni
  - Modal upgrade con benefits
  - Timer countdown "Reset in 12h 34m"

---

### 🚀 **FASE 10: PWA, SEO & Deploy** (3 giorni)

**Status**: ⏳ TODO

**Deliverables**:
- PWA ottimizzata (Service Worker)
- SEO meta tags
- Open Graph tags
- Sitemap.xml
- robots.txt
- Lighthouse 90+ score
- Deploy Vercel/Netlify
- Firebase Cloud Functions (quota reset)

**Tasks**:
- **PWA**:
  - Manifest.json completo (8 icon sizes)
  - Service Worker caching strategy
  - Offline mode per quiz cached
  - Install prompt
  - Push notifications (optional)
- **SEO**:
  - Meta tags dinamici (React Helmet)
  - Open Graph per social sharing
  - Sitemap.xml generation
  - robots.txt
  - Structured data (JSON-LD)
- **Performance**:
  - Code splitting (React.lazy)
  - Image optimization (WebP + lazy load)
  - Bundle analysis
  - Lighthouse audit
  - Target: Performance 90+, Accessibility 95+
- **Deploy**:
  - Vercel deployment
  - Environment variables setup
  - Domain custom (optional)
  - Firebase Cloud Functions:
    - Daily quota reset (scheduled)
    - Email notifications
    - Stripe webhooks

**Files**:
```
public/
  - manifest.json ✅
  - sw.js ⏳
  - robots.txt ⏳
  - sitemap.xml ⏳
  - icons/ (72, 96, 128, 144, 152, 192, 384, 512) ⏳
```

---

## 📈 TIMELINE STIMATO

| Fase | Durata | Status |
|------|--------|--------|
| ✅ FASE 1: Design System | 2-3 giorni | COMPLETATA |
| 🔄 FASE 2: Landing & Onboarding | 2 giorni | IN PROGRESS |
| ⏳ FASE 3: Auth & Dashboard | 3 giorni | TODO |
| ⏳ FASE 4: Quiz Core | 4-5 giorni | TODO |
| ⏳ FASE 5: Studio Argomenti | 3 giorni | TODO |
| ⏳ FASE 6: AI + Audio | 4 giorni | TODO |
| ⏳ FASE 7: Teoria | 3 giorni | TODO |
| ⏳ FASE 8: Statistiche | 3 giorni | TODO |
| ⏳ FASE 9: Payment | 4 giorni | TODO |
| ⏳ FASE 10: PWA & Deploy | 3 giorni | TODO |
| **TOTALE** | **31-33 giorni** | **~5-6 settimane** |

---

## 🎯 MVP (Minimum Viable Product)

Per un lancio rapido, le fasi prioritarie sono:

**MVP Core (2-3 settimane)**:
1. ✅ FASE 1: Design System
2. FASE 2: Landing Page
3. FASE 3: Auth & Dashboard base
4. FASE 4: Quiz Core (modalità esame)
5. FASE 10: Deploy

**Post-MVP (3-4 settimane)**:
6. FASE 5: Studio Argomenti
7. FASE 6: AI Spiegazioni
8. FASE 7: Teoria
9. FASE 8: Statistiche
10. FASE 9: Monetizzazione

---

## 📞 PROSSIMI STEP

### Immediati (Questa Settimana):
1. ✅ Setup base completato
2. ⏳ Completare FASE 2 (Landing page completa)
3. ⏳ Iniziare FASE 3 (Auth Firebase)
4. ⏳ Creare file `src/data/questions.json` con 7139 domande

### Settimana 2:
5. FASE 4: Sistema Quiz Core
6. Testing funzionalità quiz

### Settimana 3:
7. FASE 5: Studio per argomenti
8. FASE 6: Integrazioni AI

### Settimana 4-5:
9. FASE 7-8-9: Features avanzate
10. Testing completo

### Settimana 6:
11. FASE 10: PWA e Deploy
12. Launch! 🚀

---

**Pronto per iniziare FASE 2! 💪**

