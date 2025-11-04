import type { LeaderboardEntry } from '@/types/gamification';
import { loadUserStats } from './achievementSystem';

// Mock leaderboard data (in produzione useremo Firebase)
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    userId: '1',
    username: 'Marco Rossi',
    avatar: '👨',
    score: 15420,
    level: 42,
    rank: 1,
    streak: 28,
    totalQuizzes: 156,
    accuracy: 92.5
  },
  {
    userId: '2',
    username: 'Laura Bianchi',
    avatar: '👩',
    score: 14850,
    level: 40,
    rank: 2,
    streak: 21,
    totalQuizzes: 142,
    accuracy: 89.3
  },
  {
    userId: '3',
    username: 'Giuseppe Verdi',
    avatar: '🧑',
    score: 13200,
    level: 38,
    rank: 3,
    streak: 15,
    totalQuizzes: 128,
    accuracy: 87.8
  },
  {
    userId: '4',
    username: 'Sofia Romano',
    avatar: '👧',
    score: 12500,
    level: 36,
    rank: 4,
    streak: 12,
    totalQuizzes: 115,
    accuracy: 91.2
  },
  {
    userId: '5',
    username: 'Alessandro Conti',
    avatar: '👦',
    score: 11800,
    level: 35,
    rank: 5,
    streak: 9,
    totalQuizzes: 108,
    accuracy: 85.6
  }
];

// Ottieni leaderboard globale
export const getGlobalLeaderboard = (limit: number = 50): LeaderboardEntry[] => {
  // In produzione: fetch da Firebase
  // const snapshot = await db.collection('leaderboard').orderBy('score', 'desc').limit(limit).get();
  
  const userStats = loadUserStats();
  const currentUser: LeaderboardEntry = {
    userId: 'local',
    username: 'Tu',
    avatar: '😊',
    score: userStats.totalXP,
    level: userStats.level,
    rank: 0, // Calcolato dopo
    streak: userStats.currentStreak,
    totalQuizzes: userStats.quizzesCompleted,
    accuracy: userStats.accuracy
  };

  // Combina mock data con utente corrente
  const allEntries = [...MOCK_LEADERBOARD, currentUser];
  
  // Ordina per score
  allEntries.sort((a, b) => b.score - a.score);
  
  // Assegna rank
  allEntries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return allEntries.slice(0, limit);
};

// Ottieni posizione utente
export const getUserRank = (): number => {
  const leaderboard = getGlobalLeaderboard();
  const userEntry = leaderboard.find(e => e.userId === 'local');
  return userEntry?.rank || 0;
};

// Ottieni top 3
export const getTopThree = (): LeaderboardEntry[] => {
  return getGlobalLeaderboard(3);
};

// Leaderboard per argomento (mock)
export const getTopicLeaderboard = (topic: string, limit: number = 20): LeaderboardEntry[] => {
  // In produzione: filtrare per topic specifico
  return getGlobalLeaderboard(limit);
};

// Leaderboard amici (mock)
export const getFriendsLeaderboard = (friendIds: string[]): LeaderboardEntry[] => {
  const leaderboard = getGlobalLeaderboard();
  return leaderboard.filter(entry => 
    friendIds.includes(entry.userId) || entry.userId === 'local'
  );
};

// Calcola score basato su stats
export const calculateScore = (stats: {
  totalXP: number;
  accuracy: number;
  streak: number;
  quizzes: number;
}): number => {
  return (
    stats.totalXP +
    (stats.accuracy * 10) +
    (stats.streak * 50) +
    (stats.quizzes * 5)
  );
};

