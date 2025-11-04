# 🗄️ FIRESTORE DATABASE STRUCTURE

## Collections Overview

```
patente-b-2025/
├── users/
├── quiz_attempts/
├── user_progress/
├── ai_usage/
├── teoria/
├── ai_explanations_cache/
└── subscriptions/
```

---

## 📄 Detailed Schemas

### 1. `users/` Collection

**Document ID**: `{userId}` (Firebase Auth UID)

```typescript
interface User {
  // Identity
  userId: string;              // Firebase Auth UID
  email: string;               // Email utente
  displayName: string | null;  // Nome visualizzato
  photoURL: string | null;     // Avatar URL
  
  // Subscription
  plan: 'free' | 'premium';    // Piano corrente
  premiumExpiresAt: Timestamp | null; // Scadenza premium
  stripeCustomerId: string | null;    // Stripe customer ID
  
  // Daily Quotas (reset giornaliero)
  aiExplanationsLeft: number;   // Default: 5 per free
  translationsLeft: number;     // Default: 30 per free
  lastQuotaReset: Timestamp;    // Ultimo reset quota
  
  // Engagement
  streak: number;               // Giorni consecutivi studio
  lastActiveAt: Timestamp;      // Ultimo accesso
  createdAt: Timestamp;         // Registrazione
  
  // Settings
  preferences: {
    theme: 'light' | 'dark';
    language: 'it' | 'en' | 'fr' | 'de' | 'es' | 'ar' | 'zh' | 'ro';
    audioEnabled: boolean;
    notificationsEnabled: boolean;
  };
}
```

**Indexes**:
- `plan` (for analytics)
- `lastActiveAt` (for retention metrics)

**Example Document**:
```json
{
  "userId": "abc123",
  "email": "mario.rossi@example.com",
  "displayName": "Mario Rossi",
  "photoURL": null,
  "plan": "free",
  "premiumExpiresAt": null,
  "stripeCustomerId": null,
  "aiExplanationsLeft": 3,
  "translationsLeft": 25,
  "lastQuotaReset": "2025-10-31T00:00:00Z",
  "streak": 5,
  "lastActiveAt": "2025-10-31T14:30:00Z",
  "createdAt": "2025-10-25T10:00:00Z",
  "preferences": {
    "theme": "dark",
    "language": "it",
    "audioEnabled": true,
    "notificationsEnabled": false
  }
}
```

---

### 2. `quiz_attempts/` Collection

**Document ID**: Auto-generated

```typescript
interface QuizAttempt {
  // References
  attemptId: string;           // Document ID
  userId: string;              // Reference to user
  
  // Timing
  startedAt: Timestamp;        // Inizio quiz
  completedAt: Timestamp | null; // Fine quiz
  timeElapsed: number;         // Secondi impiegati
  
  // Configuration
  mode: 'exam' | 'practice';   // Modalità
  argomento: string | null;    // Se practice mode
  
  // Questions & Answers
  questions: QuestionAttempt[]; // Array 30 domande
  
  // Results
  score: number;               // Domande corrette
  errors: number;              // Domande sbagliate
  passed: boolean;             // true se errors <= 3
  
  // State
  resumed: boolean;            // Quiz ripreso
  autoSaved: boolean;          // Auto-save attivo
}

interface QuestionAttempt {
  questionId: number;          // ID domanda da questions.json
  domanda: string;             // Testo domanda
  correctAnswer: boolean;      // Risposta corretta (VERO/FALSO)
  userAnswer: boolean | null;  // Risposta utente
  answeredAt: Timestamp | null; // Quando risposto
  timeSpent: number;           // Secondi su questa domanda
  correct: boolean;            // true se userAnswer === correctAnswer
  immagine: string | null;     // URL immagine se presente
  argomento: string;           // Argomento domanda
}
```

**Indexes**:
- `userId` + `completedAt` (for user history)
- `mode` + `passed` (for analytics)

**Example Document**:
```json
{
  "attemptId": "attempt_001",
  "userId": "abc123",
  "startedAt": "2025-10-31T14:00:00Z",
  "completedAt": "2025-10-31T14:18:30Z",
  "timeElapsed": 1110,
  "mode": "exam",
  "argomento": null,
  "questions": [
    {
      "questionId": 1234,
      "domanda": "Il segnale raffigurato vieta la svolta a destra?",
      "correctAnswer": true,
      "userAnswer": true,
      "answeredAt": "2025-10-31T14:01:20Z",
      "timeSpent": 25,
      "correct": true,
      "immagine": "https://storage.googleapis.com/.../segnale_1234.jpg",
      "argomento": "Segnali di divieto"
    }
  ],
  "score": 28,
  "errors": 2,
  "passed": true,
  "resumed": false,
  "autoSaved": true
}
```

---

### 3. `user_progress/` Collection

**Document ID**: `{userId}`

```typescript
interface UserProgress {
  userId: string;
  
  // Overall Stats
  totalAttempts: number;           // Totale tentativi
  totalExamAttempts: number;       // Tentativi modalità esame
  passedExams: number;             // Esami superati
  totalQuestionsAnswered: number;  // Domande totali risposte
  averageScore: number;            // Media punteggio (%)
  
  // Topic Progress (25 argomenti)
  studyProgress: {
    [argomento: string]: {
      questionsAnswered: number;   // Domande fatte
      correctAnswers: number;      // Domande corrette
      percentage: number;          // % correttezza
      lastStudied: Timestamp;      // Ultimo studio
    };
  };
  
  // Weak Areas
  weakArguments: Array<{
    argomento: string;
    errorRate: number;             // % errori
    questionsAnswered: number;
  }>;
  
  // Recent Activity
  lastStudiedTopics: string[];     // Ultimi 5 argomenti studiati
  
  // Bookmarks
  bookmarkedQuestions: number[];   // Array di questionId
  
  // Achievements
  achievements: string[];          // Array di achievement IDs
  
  // Updated
  lastUpdated: Timestamp;
}
```

**Example Document**:
```json
{
  "userId": "abc123",
  "totalAttempts": 15,
  "totalExamAttempts": 10,
  "passedExams": 8,
  "totalQuestionsAnswered": 450,
  "averageScore": 86.5,
  "studyProgress": {
    "Segnali di divieto": {
      "questionsAnswered": 50,
      "correctAnswers": 45,
      "percentage": 90,
      "lastStudied": "2025-10-31T14:00:00Z"
    }
  },
  "weakArguments": [
    {
      "argomento": "Limiti di velocità",
      "errorRate": 35,
      "questionsAnswered": 40
    }
  ],
  "lastStudiedTopics": [
    "Segnali di divieto",
    "Precedenza",
    "Parcheggio"
  ],
  "bookmarkedQuestions": [123, 456, 789],
  "achievements": [
    "first_exam_passed",
    "streak_7_days",
    "perfectionist_30_30"
  ],
  "lastUpdated": "2025-10-31T14:30:00Z"
}
```

---

### 4. `ai_usage/` Collection

**Document ID**: `{userId}`

```typescript
interface AIUsage {
  userId: string;
  
  // Daily Counters (reset at midnight UTC)
  explanationsUsedToday: number;   // Spiegazioni AI oggi
  translationsUsedToday: number;   // Traduzioni oggi
  lastResetDate: Timestamp;        // Ultimo reset (midnight)
  
  // Historical Totals
  totalExplanationsUsed: number;   // Totale lifetime
  totalTranslationsUsed: number;   // Totale lifetime
  
  // Last Usage
  lastExplanationAt: Timestamp | null;
  lastTranslationAt: Timestamp | null;
  
  // Cached Explanations Used
  cachedExplanationsUsed: number;  // Quante volte ha usato cache
}
```

**Cloud Function**: Reset giornaliero
```javascript
// Scheduled function (Firebase Cloud Functions)
exports.resetDailyQuotas = functions.pubsub
  .schedule('0 0 * * *') // Every day at midnight UTC
  .timeZone('Europe/Rome')
  .onRun(async (context) => {
    const usersSnapshot = await db.collection('ai_usage').get();
    const batch = db.batch();
    
    usersSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        explanationsUsedToday: 0,
        translationsUsedToday: 0,
        lastResetDate: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log('Daily quotas reset for all users');
  });
```

---

### 5. `teoria/` Collection

**Document ID**: Auto-generated or `{topicId}`

```typescript
interface TeoriaChapter {
  topicId: string;
  
  // Content
  title: string;                   // Titolo capitolo
  argomento: string;               // Argomento (1 dei 25)
  content: string;                 // Markdown content
  images: string[];                // Array URLs immagini
  
  // Audio
  audioUrl: string | null;         // ElevenLabs generated audio
  audioLanguages: {
    [lang: string]: string;        // { 'it': 'url', 'en': 'url' }
  };
  
  // Metadata
  order: number;                   // Ordine visualizzazione (1-25)
  duration: number;                // Tempo lettura stimato (minuti)
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Quick Quiz
  quickQuiz: Array<{
    questionId: number;
    domanda: string;
    risposta: boolean;
  }>;
  
  // Stats
  readCount: number;               // Quante volte letto
  averageReadTime: number;         // Tempo medio lettura
  
  // Updated
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Example Document**:
```json
{
  "topicId": "topic_01",
  "title": "Segnali di Pericolo",
  "argomento": "Segnali di pericolo",
  "content": "# Segnali di Pericolo\n\nI segnali di pericolo...",
  "images": [
    "https://storage.googleapis.com/.../signal_danger_1.jpg"
  ],
  "audioUrl": "https://storage.googleapis.com/.../audio_it.mp3",
  "audioLanguages": {
    "it": "https://storage.googleapis.com/.../audio_it.mp3",
    "en": "https://storage.googleapis.com/.../audio_en.mp3"
  },
  "order": 1,
  "duration": 12,
  "difficulty": "medium",
  "quickQuiz": [
    {
      "questionId": 123,
      "domanda": "Il triangolo rosso indica...",
      "risposta": true
    }
  ],
  "readCount": 1250,
  "averageReadTime": 10,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-10-15T12:00:00Z"
}
```

---

### 6. `ai_explanations_cache/` Collection

**Document ID**: `{questionId}`

```typescript
interface AIExplanationCache {
  questionId: number;              // ID domanda
  
  // Cached Explanation
  explanation: string;             // Claude API response
  language: 'it';                  // Lingua spiegazione
  
  // Metadata
  cachedAt: Timestamp;             // Quando cachata
  usageCount: number;              // Quante volte riusata
  lastUsedAt: Timestamp;           // Ultimo uso
  
  // Quality
  rating: number | null;           // User rating (1-5)
  reportedIssue: boolean;          // Segnalata come errata
}
```

**Purpose**: Ridurre costi API Claude riusando spiegazioni già generate.

**Example Document**:
```json
{
  "questionId": 1234,
  "explanation": "La risposta è VERO perché il segnale di divieto di svolta indica che non è consentito svoltare in quella direzione. Questo segnale è obbligatorio e va rispettato.",
  "language": "it",
  "cachedAt": "2025-10-20T10:00:00Z",
  "usageCount": 45,
  "lastUsedAt": "2025-10-31T14:25:00Z",
  "rating": 4.5,
  "reportedIssue": false
}
```

---

### 7. `subscriptions/` Collection

**Document ID**: `{userId}`

```typescript
interface Subscription {
  userId: string;
  
  // Stripe
  stripeCustomerId: string;        // Stripe customer ID
  stripeSubscriptionId: string;    // Stripe subscription ID
  stripePriceId: string;           // Price ID (€4.99/month)
  
  // Status
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  
  // History
  createdAt: Timestamp;
  canceledAt: Timestamp | null;
  
  // Invoices
  lastInvoiceId: string | null;
  lastInvoiceStatus: string | null;
}
```

---

## 🔐 Security Rules

### Firestore Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users: read own data, write own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quiz Attempts: read/write own attempts
    match /quiz_attempts/{attemptId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // User Progress: read/write own progress
    match /user_progress/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // AI Usage: read/write own usage
    match /ai_usage/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Teoria: read all, write admin only
    match /teoria/{topicId} {
      allow read: if true; // Public read
      allow write: if false; // Admin only (via Cloud Functions)
    }
    
    // AI Cache: read all (for reuse), write admin only
    match /ai_explanations_cache/{questionId} {
      allow read: if request.auth != null;
      allow write: if false; // Cloud Function only
    }
    
    // Subscriptions: read own, write via Stripe webhook only
    match /subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Stripe webhook only
    }
  }
}
```

---

## 📊 Indexes Required

```javascript
// Composite Indexes (create in Firebase Console)

// quiz_attempts
- Collection: quiz_attempts
  Fields: userId (Ascending), completedAt (Descending)

// quiz_attempts (for leaderboard)
- Collection: quiz_attempts
  Fields: mode (Ascending), passed (Ascending), score (Descending)

// users (for analytics)
- Collection: users
  Fields: plan (Ascending), lastActiveAt (Descending)
```

---

## 🚀 Initial Data Setup

### Seed Data Script

```typescript
// scripts/seedFirestore.ts
import { db } from './firebase';
import questionsData from './data/questions.json';

async function seedTeoria() {
  const teoriaData = [
    {
      topicId: 'topic_01',
      title: 'Segnali di Pericolo',
      argomento: 'Segnali di pericolo',
      content: '# Segnali di Pericolo...',
      order: 1,
      difficulty: 'medium'
    },
    // ... altri 24 capitoli
  ];
  
  for (const chapter of teoriaData) {
    await db.collection('teoria').doc(chapter.topicId).set({
      ...chapter,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

seedTeoria().then(() => console.log('Teoria seeded!'));
```

---

**Database structure pronta per implementazione! 🗄️**

