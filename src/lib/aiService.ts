import type { AIExplanation, AIQuota } from '@/types/ai';
import type { QuizQuestion } from '@/types/quiz';

const AI_CACHE_KEY = 'patente_ai_cache';
const QUOTA_KEY = 'patente_ai_quota';

// Limiti per tier
const TIER_LIMITS = {
  free: {
    explanations: 5,
    audio: 10
  },
  premium: {
    explanations: 100,
    audio: 200
  },
  unlimited: {
    explanations: Infinity,
    audio: Infinity
  }
};

// Mock AI explanations (in produzione useremo Claude API)
const generateMockExplanation = (question: QuizQuestion): AIExplanation => {
  const isCorrectTrue = question.risposta === true;
  
  return {
    questionId: question.id,
    explanation: isCorrectTrue
      ? `La risposta corretta è VERO. ${question.domanda} - Questa affermazione è corretta secondo il codice della strada italiano. È importante ricordare questo concetto per l'esame.`
      : `La risposta corretta è FALSO. ${question.domanda} - Questa affermazione non è corretta. Fai attenzione a non confonderla con situazioni simili.`,
    tips: [
      'Leggi attentamente la domanda',
      'Fai attenzione alle parole chiave',
      'Ricorda le eccezioni alla regola',
      'Visualizza la situazione nella pratica'
    ],
    relatedTopics: [question.argomento],
    difficulty: question.difficulty || 'medium',
    generatedAt: new Date(),
    cached: false
  };
};

// Carica cache delle spiegazioni
const loadCache = (): Map<number, AIExplanation> => {
  try {
    const cached = localStorage.getItem(AI_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const map = new Map<number, AIExplanation>();
      Object.entries(parsed).forEach(([key, value]: [string, any]) => {
        map.set(Number(key), {
          ...value,
          generatedAt: new Date(value.generatedAt),
          cached: true
        });
      });
      return map;
    }
  } catch (error) {
    console.error('Errore caricamento cache AI:', error);
  }
  return new Map();
};

// Salva cache
const saveCache = (cache: Map<number, AIExplanation>) => {
  try {
    const obj = Object.fromEntries(cache);
    localStorage.setItem(AI_CACHE_KEY, JSON.stringify(obj));
  } catch (error) {
    console.error('Errore salvataggio cache AI:', error);
  }
};

// Carica quota utente
export const loadQuota = (): AIQuota => {
  try {
    const saved = localStorage.getItem(QUOTA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const resetDate = new Date(parsed.resetDate);
      
      // Reset se è passato un mese
      if (resetDate < new Date()) {
        return createNewQuota(parsed.tier);
      }
      
      return {
        ...parsed,
        resetDate
      };
    }
  } catch (error) {
    console.error('Errore caricamento quota:', error);
  }
  return createNewQuota('free');
};

// Crea nuova quota
const createNewQuota = (tier: 'free' | 'premium' | 'unlimited'): AIQuota => {
  const limits = TIER_LIMITS[tier];
  const resetDate = new Date();
  resetDate.setMonth(resetDate.getMonth() + 1);
  
  return {
    userId: 'local', // In produzione useremo l'ID utente reale
    tier,
    explanationsUsed: 0,
    explanationsLimit: limits.explanations,
    audioGenerationsUsed: 0,
    audioGenerationsLimit: limits.audio,
    resetDate
  };
};

// Salva quota
const saveQuota = (quota: AIQuota) => {
  try {
    localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
  } catch (error) {
    console.error('Errore salvataggio quota:', error);
  }
};

// Ottieni spiegazione AI
export const getAIExplanation = async (question: QuizQuestion): Promise<AIExplanation | null> => {
  // Controlla quota
  const quota = loadQuota();
  if (quota.explanationsUsed >= quota.explanationsLimit) {
    throw new Error('QUOTA_EXCEEDED');
  }

  // Controlla cache
  const cache = loadCache();
  const cached = cache.get(question.id);
  if (cached) {
    return cached;
  }

  // TODO: In produzione, chiamare Claude API
  // const response = await fetch('/api/ai/explain', {
  //   method: 'POST',
  //   body: JSON.stringify({ question })
  // });

  // Per ora usiamo mock
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simula latenza
  const explanation = generateMockExplanation(question);

  // Salva in cache
  cache.set(question.id, explanation);
  saveCache(cache);

  // Aggiorna quota
  quota.explanationsUsed++;
  saveQuota(quota);

  return explanation;
};

// Controlla se può usare AI
export const canUseAI = (): { allowed: boolean; remaining: number } => {
  const quota = loadQuota();
  const remaining = quota.explanationsLimit - quota.explanationsUsed;
  return {
    allowed: remaining > 0,
    remaining
  };
};

// Upgrade tier
export const upgradeTier = (newTier: 'premium' | 'unlimited') => {
  const quota = loadQuota();
  const limits = TIER_LIMITS[newTier];
  
  quota.tier = newTier;
  quota.explanationsLimit = limits.explanations;
  quota.audioGenerationsLimit = limits.audio;
  
  saveQuota(quota);
};

// Reset quota (per testing)
export const resetQuota = () => {
  localStorage.removeItem(QUOTA_KEY);
};

// Genera audio (mock per ora)
export const generateAudio = async (text: string): Promise<string> => {
  const quota = loadQuota();
  
  if (quota.audioGenerationsUsed >= quota.audioGenerationsLimit) {
    throw new Error('AUDIO_QUOTA_EXCEEDED');
  }

  // TODO: In produzione, chiamare ElevenLabs API
  // const response = await fetch('/api/tts/generate', {
  //   method: 'POST',
  //   body: JSON.stringify({ text, language: 'it' })
  // });

  // Per ora usiamo Web Speech API
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'it-IT';
  window.speechSynthesis.speak(utterance);

  // Aggiorna quota
  quota.audioGenerationsUsed++;
  saveQuota(quota);

  return 'mock-audio-url';
};

