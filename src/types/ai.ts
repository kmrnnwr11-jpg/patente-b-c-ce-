export interface AIExplanation {
  questionId: number;
  explanation: string;
  tips: string[];
  relatedTopics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  generatedAt: Date;
  cached: boolean;
}

export interface AIQuota {
  userId: string;
  tier: 'free' | 'premium' | 'unlimited';
  explanationsUsed: number;
  explanationsLimit: number;
  audioGenerationsUsed: number;
  audioGenerationsLimit: number;
  resetDate: Date;
}

export interface TTSRequest {
  text: string;
  language: 'it' | 'en';
  voice?: string;
  speed?: number;
}

export interface TTSResponse {
  audioUrl: string;
  duration: number;
  cached: boolean;
}

export type SubscriptionTier = 'free' | 'premium' | 'unlimited';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  explanationsLimit: number;
  audioLimit: number;
  popular?: boolean;
}

