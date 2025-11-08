// Constants - Patente B 2025

// App Configuration
export const APP_NAME = 'Patente B 2025';
export const APP_DESCRIPTION = 'App per la preparazione all\'esame della Patente B italiana';
export const APP_VERSION = '1.0.0';

// Exam Configuration
export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 30,
  TIME_LIMIT_MINUTES: 20,
  TIME_LIMIT_SECONDS: 20 * 60, // 1200 seconds
  MAX_ERRORS_TO_PASS: 3,
  MIN_SCORE_TO_PASS: 27, // 30 - 3 errors
} as const;

// Study Configuration
export const STUDY_CONFIG = {
  TOTAL_ARGOMENTI: 25,
  QUESTIONS_PER_ARGOMENTO_MIN: 200,
  QUESTIONS_PER_ARGOMENTO_MAX: 400,
} as const;

// Quota Configuration
export const QUOTA_CONFIG = {
  FREE_AI_EXPLANATIONS_DAILY: Number(import.meta.env.VITE_FREE_AI_QUOTA_DAILY) || 5,
  FREE_TRANSLATIONS_DAILY: Number(import.meta.env.VITE_FREE_TRANSLATION_QUOTA_DAILY) || 30,
  PREMIUM_UNLIMITED: 999999,
} as const;

// Premium Configuration
export const PREMIUM_CONFIG = {
  PRICE_EUR: Number(import.meta.env.VITE_PREMIUM_PRICE) || 4.99,
  CURRENCY: 'EUR',
  BILLING_INTERVAL: 'month',
} as const;

// 25 Argomenti Ministeriali
export const ARGOMENTI = [
  'Definizioni stradali e di traffico',
  'Segnali di pericolo',
  'Segnali di divieto',
  'Segnali di obbligo',
  'Segnali di precedenza',
  'Segnaletica orizzontale',
  'Segnalazioni semaforiche e degli agenti del traffico',
  'Segnali di indicazione',
  'Pannelli integrativi dei segnali',
  'Pericolo e intralcio alla circolazione',
  'Limiti di velocità',
  'Distanza di sicurezza',
  'Norme sulla precedenza',
  'Norme sul sorpasso',
  'Fermata, sosta e partenza dei veicoli',
  'Trasporto di persone',
  'Carico dei veicoli',
  'Uso delle luci',
  'Spie e simboli',
  'Patenti di guida',
  'Documenti di circolazione',
  'Uso delle cinture di sicurezza e dei caschi protettivi',
  'Incidenti stradali e comportamenti in caso di incidente',
  'Elementi del veicolo',
  'Comportamenti per prevenire incidenti stradali',
] as const;

// Supported Languages
export const LANGUAGES = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  // Nuove lingue per traduzione parola-per-parola
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
] as const;

// Achievement IDs
export const ACHIEVEMENTS = {
  FIRST_EXAM_PASSED: 'first_exam_passed',
  STREAK_7_DAYS: 'streak_7_days',
  STREAK_30_DAYS: 'streak_30_days',
  PERFECTIONIST_30_30: 'perfectionist_30_30',
  TEN_EXAMS_PASSED: 'ten_exams_passed',
  ALL_TOPICS_COMPLETED: 'all_topics_completed',
  SPEED_DEMON: 'speed_demon', // Completa esame in < 10 minuti
  BOOKWORM: 'bookworm', // Leggi tutti i capitoli teoria
  AI_ENTHUSIAST: 'ai_enthusiast', // Usa 100 spiegazioni AI
} as const;

// Achievement Metadata
export const ACHIEVEMENT_META = {
  [ACHIEVEMENTS.FIRST_EXAM_PASSED]: {
    title: 'Primo Esame Superato',
    description: 'Hai superato il tuo primo esame simulato!',
    icon: '🏆',
    points: 100,
  },
  [ACHIEVEMENTS.STREAK_7_DAYS]: {
    title: 'Studioso',
    description: 'Hai studiato per 7 giorni consecutivi',
    icon: '📚',
    points: 50,
  },
  [ACHIEVEMENTS.STREAK_30_DAYS]: {
    title: 'Dedizione Totale',
    description: 'Hai studiato per 30 giorni consecutivi',
    icon: '🔥',
    points: 200,
  },
  [ACHIEVEMENTS.PERFECTIONIST_30_30]: {
    title: 'Perfezionista',
    description: 'Hai fatto 30/30 in un esame!',
    icon: '⭐',
    points: 150,
  },
  [ACHIEVEMENTS.TEN_EXAMS_PASSED]: {
    title: 'Maestro della Strada',
    description: 'Hai superato 10 esami consecutivi',
    icon: '🚗',
    points: 250,
  },
  [ACHIEVEMENTS.ALL_TOPICS_COMPLETED]: {
    title: 'Esperto Completo',
    description: 'Hai completato tutti i 25 argomenti',
    icon: '🎓',
    points: 500,
  },
  [ACHIEVEMENTS.SPEED_DEMON]: {
    title: 'Veloce Come il Vento',
    description: 'Hai completato un esame in meno di 10 minuti',
    icon: '⚡',
    points: 100,
  },
  [ACHIEVEMENTS.BOOKWORM]: {
    title: 'Divoratore di Libri',
    description: 'Hai letto tutti i capitoli di teoria',
    icon: '📖',
    points: 300,
  },
  [ACHIEVEMENTS.AI_ENTHUSIAST]: {
    title: 'Amante dell\'AI',
    description: 'Hai usato 100 spiegazioni AI',
    icon: '🤖',
    points: 200,
  },
} as const;

// Auto-save Configuration
export const AUTOSAVE_CONFIG = {
  INTERVAL_SECONDS: 30,
  DEBOUNCE_MS: 1000,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  CLAUDE: 'https://api.anthropic.com/v1/messages',
  ELEVENLABS: 'https://api.elevenlabs.io/v1/text-to-speech',
} as const;

// Local Storage Keys (use with caution - prefer Firestore)
export const STORAGE_KEYS = {
  THEME: 'patente-b-theme',
  LANGUAGE: 'patente-b-language',
  ONBOARDING_COMPLETED: 'patente-b-onboarding',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EXAM: '/exam',
  EXAM_START: '/exam/start',
  EXAM_RESULTS: '/exam/results/:attemptId',
  STUDY: '/study',
  STUDY_TOPIC: '/study/:argomento',
  THEORY: '/theory',
  THEORY_CHAPTER: '/theory/:topicId',
  STATS: '/stats',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PRICING: '/pricing',
  CHECKOUT: '/checkout',
  BOOKMARKS: '/bookmarks',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Si è verificato un errore. Riprova.',
  NETWORK: 'Errore di connessione. Controlla la tua connessione internet.',
  AUTH_FAILED: 'Autenticazione fallita. Controlla email e password.',
  QUOTA_EXCEEDED: 'Hai esaurito la quota giornaliera. Upgrade a Premium per accesso illimitato.',
  EXAM_NOT_FOUND: 'Esame non trovato.',
  PAYMENT_FAILED: 'Pagamento fallito. Riprova o usa un altro metodo.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  EXAM_SAVED: 'Esame salvato con successo!',
  PROFILE_UPDATED: 'Profilo aggiornato!',
  SUBSCRIPTION_ACTIVATED: 'Abbonamento Premium attivato! 🎉',
  BOOKMARK_ADDED: 'Domanda salvata nei segnalibri',
  BOOKMARK_REMOVED: 'Domanda rimossa dai segnalibri',
} as const;

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  QUIZ_ATTEMPTS: 'quiz_attempts',
  USER_PROGRESS: 'user_progress',
  AI_USAGE: 'ai_usage',
  TEORIA: 'teoria',
  AI_EXPLANATIONS_CACHE: 'ai_explanations_cache',
  SUBSCRIPTIONS: 'subscriptions',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  NEUTRAL: '#6b7280',
} as const;

// Export all as default
export default {
  APP_NAME,
  APP_DESCRIPTION,
  APP_VERSION,
  EXAM_CONFIG,
  STUDY_CONFIG,
  QUOTA_CONFIG,
  PREMIUM_CONFIG,
  ARGOMENTI,
  LANGUAGES,
  ACHIEVEMENTS,
  ACHIEVEMENT_META,
  AUTOSAVE_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COLLECTIONS,
  CHART_COLORS,
};

