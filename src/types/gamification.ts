export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'quiz' | 'study' | 'streak' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirement: {
    type: 'quiz_count' | 'correct_answers' | 'streak_days' | 'perfect_score' | 'topic_master' | 'speed_demon' | 'night_owl' | 'early_bird' | 'bookworm';
    target: number;
    current?: number;
  };
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface UserLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  perks: string[];
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'quiz' | 'accuracy' | 'speed' | 'topic';
  requirement: {
    type: string;
    target: number;
    current: number;
  };
  reward: {
    xp: number;
    coins?: number;
  };
  completed: boolean;
  expiresAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  level: number;
  rank: number;
  streak: number;
  totalQuizzes: number;
  accuracy: number;
}

export interface UserStats {
  userId: string;
  totalXP: number;
  level: number;
  quizzesCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  lastActivityDate: Date;
}

export interface SocialChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  opponentId: string;
  opponentName: string;
  topic: string;
  questionsCount: number;
  status: 'pending' | 'active' | 'completed';
  challengerScore?: number;
  opponentScore?: number;
  winnerId?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface Reward {
  type: 'xp' | 'achievement' | 'badge' | 'coins';
  value: number | string;
  message: string;
}

