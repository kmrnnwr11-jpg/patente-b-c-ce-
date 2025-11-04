import type { Achievement, UserStats } from '@/types/gamification';

const STORAGE_KEY = 'patente_achievements';
const STATS_KEY = 'patente_user_stats';

// Definizione achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Quiz Achievements
  {
    id: 'first_quiz',
    name: 'Primo Passo',
    description: 'Completa il tuo primo quiz',
    icon: '🎯',
    category: 'quiz',
    rarity: 'common',
    xpReward: 50,
    requirement: { type: 'quiz_count', target: 1 },
    isUnlocked: false
  },
  {
    id: 'quiz_master_10',
    name: 'Apprendista',
    description: 'Completa 10 quiz',
    icon: '📚',
    category: 'quiz',
    rarity: 'common',
    xpReward: 100,
    requirement: { type: 'quiz_count', target: 10 },
    isUnlocked: false
  },
  {
    id: 'quiz_master_50',
    name: 'Studente Dedicato',
    description: 'Completa 50 quiz',
    icon: '🎓',
    category: 'quiz',
    rarity: 'rare',
    xpReward: 500,
    requirement: { type: 'quiz_count', target: 50 },
    isUnlocked: false
  },
  {
    id: 'quiz_master_100',
    name: 'Maestro dei Quiz',
    description: 'Completa 100 quiz',
    icon: '👑',
    category: 'quiz',
    rarity: 'epic',
    xpReward: 1000,
    requirement: { type: 'quiz_count', target: 100 },
    isUnlocked: false
  },
  
  // Accuracy Achievements
  {
    id: 'perfect_score',
    name: 'Perfezione',
    description: 'Ottieni 30/30 in un esame',
    icon: '💯',
    category: 'quiz',
    rarity: 'rare',
    xpReward: 300,
    requirement: { type: 'perfect_score', target: 1 },
    isUnlocked: false
  },
  {
    id: 'accuracy_master',
    name: 'Precisione Assoluta',
    description: 'Raggiungi 90% di accuratezza totale',
    icon: '🎯',
    category: 'quiz',
    rarity: 'epic',
    xpReward: 800,
    requirement: { type: 'correct_answers', target: 90 },
    isUnlocked: false
  },
  
  // Streak Achievements
  {
    id: 'streak_3',
    name: 'Costanza',
    description: 'Studia per 3 giorni consecutivi',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpReward: 150,
    requirement: { type: 'streak_days', target: 3 },
    isUnlocked: false
  },
  {
    id: 'streak_7',
    name: 'Settimana Perfetta',
    description: 'Studia per 7 giorni consecutivi',
    icon: '⭐',
    category: 'streak',
    rarity: 'rare',
    xpReward: 400,
    requirement: { type: 'streak_days', target: 7 },
    isUnlocked: false
  },
  {
    id: 'streak_30',
    name: 'Dedizione Totale',
    description: 'Studia per 30 giorni consecutivi',
    icon: '🏆',
    category: 'streak',
    rarity: 'legendary',
    xpReward: 2000,
    requirement: { type: 'streak_days', target: 30 },
    isUnlocked: false
  },
  
  // Special Achievements
  {
    id: 'speed_demon',
    name: 'Velocista',
    description: 'Completa un quiz in meno di 10 minuti',
    icon: '⚡',
    category: 'special',
    rarity: 'rare',
    xpReward: 250,
    requirement: { type: 'speed_demon', target: 1 },
    isUnlocked: false
  },
  {
    id: 'night_owl',
    name: 'Gufo Notturno',
    description: 'Completa un quiz dopo mezzanotte',
    icon: '🦉',
    category: 'special',
    rarity: 'common',
    xpReward: 100,
    requirement: { type: 'night_owl', target: 1 },
    isUnlocked: false
  },
  {
    id: 'early_bird',
    name: 'Mattiniero',
    description: 'Completa un quiz prima delle 7:00',
    icon: '🐦',
    category: 'special',
    rarity: 'common',
    xpReward: 100,
    requirement: { type: 'early_bird', target: 1 },
    isUnlocked: false
  },
  {
    id: 'bookworm',
    name: 'Topo di Biblioteca',
    description: 'Leggi 10 capitoli di teoria',
    icon: '📖',
    category: 'study',
    rarity: 'rare',
    xpReward: 300,
    requirement: { type: 'bookworm', target: 10 },
    isUnlocked: false
  }
];

// Carica achievements
export const loadAchievements = (): Achievement[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((a: any) => ({
        ...a,
        unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
      }));
    }
  } catch (error) {
    console.error('Errore caricamento achievements:', error);
  }
  return ACHIEVEMENTS;
};

// Salva achievements
const saveAchievements = (achievements: Achievement[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error('Errore salvataggio achievements:', error);
  }
};

// Carica stats utente
export const loadUserStats = (): UserStats => {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastActivityDate: new Date(parsed.lastActivityDate)
      };
    }
  } catch (error) {
    console.error('Errore caricamento stats:', error);
  }
  
  return {
    userId: 'local',
    totalXP: 0,
    level: 1,
    quizzesCompleted: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    accuracy: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    lastActivityDate: new Date()
  };
};

// Salva stats
export const saveUserStats = (stats: UserStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Errore salvataggio stats:', error);
  }
};

// Calcola livello da XP
export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// XP necessario per livello successivo
export const xpForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};

// Controlla e sblocca achievements
export const checkAchievements = (stats: UserStats): Achievement[] => {
  const achievements = loadAchievements();
  const newlyUnlocked: Achievement[] = [];

  achievements.forEach(achievement => {
    if (achievement.isUnlocked) return;

    let shouldUnlock = false;

    switch (achievement.requirement.type) {
      case 'quiz_count':
        shouldUnlock = stats.quizzesCompleted >= achievement.requirement.target;
        break;
      case 'correct_answers':
        shouldUnlock = stats.accuracy >= achievement.requirement.target;
        break;
      case 'streak_days':
        shouldUnlock = stats.currentStreak >= achievement.requirement.target;
        break;
      case 'perfect_score':
        // Questo viene controllato direttamente dopo un quiz
        break;
    }

    if (shouldUnlock) {
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date();
      stats.totalXP += achievement.xpReward;
      stats.achievements.push(achievement.id);
      newlyUnlocked.push(achievement);
    }
  });

  if (newlyUnlocked.length > 0) {
    saveAchievements(achievements);
    saveUserStats(stats);
  }

  return newlyUnlocked;
};

// Aggiorna stats dopo un quiz
export const updateStatsAfterQuiz = (
  correctCount: number,
  totalQuestions: number,
  durationSeconds: number
): Achievement[] => {
  const stats = loadUserStats();
  
  // Aggiorna contatori
  stats.quizzesCompleted++;
  stats.correctAnswers += correctCount;
  stats.totalAnswers += totalQuestions;
  stats.accuracy = (stats.correctAnswers / stats.totalAnswers) * 100;
  
  // Aggiorna streak
  const today = new Date().toDateString();
  const lastActivity = stats.lastActivityDate.toDateString();
  
  if (today !== lastActivity) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActivity === yesterday.toDateString()) {
      stats.currentStreak++;
    } else {
      stats.currentStreak = 1;
    }
    
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
  }
  
  stats.lastActivityDate = new Date();
  
  // Controlla achievements speciali
  const achievements = loadAchievements();
  const newlyUnlocked: Achievement[] = [];
  
  // Perfect score
  if (correctCount === totalQuestions && totalQuestions === 30) {
    const perfectAchievement = achievements.find(a => a.id === 'perfect_score');
    if (perfectAchievement && !perfectAchievement.isUnlocked) {
      perfectAchievement.isUnlocked = true;
      perfectAchievement.unlockedAt = new Date();
      stats.totalXP += perfectAchievement.xpReward;
      stats.achievements.push(perfectAchievement.id);
      newlyUnlocked.push(perfectAchievement);
    }
  }
  
  // Speed demon (< 10 minuti)
  if (durationSeconds < 600) {
    const speedAchievement = achievements.find(a => a.id === 'speed_demon');
    if (speedAchievement && !speedAchievement.isUnlocked) {
      speedAchievement.isUnlocked = true;
      speedAchievement.unlockedAt = new Date();
      stats.totalXP += speedAchievement.xpReward;
      stats.achievements.push(speedAchievement.id);
      newlyUnlocked.push(speedAchievement);
    }
  }
  
  // Night owl / Early bird
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) {
    const nightOwl = achievements.find(a => a.id === 'night_owl');
    if (nightOwl && !nightOwl.isUnlocked) {
      nightOwl.isUnlocked = true;
      nightOwl.unlockedAt = new Date();
      stats.totalXP += nightOwl.xpReward;
      stats.achievements.push(nightOwl.id);
      newlyUnlocked.push(nightOwl);
    }
  } else if (hour >= 5 && hour < 7) {
    const earlyBird = achievements.find(a => a.id === 'early_bird');
    if (earlyBird && !earlyBird.isUnlocked) {
      earlyBird.isUnlocked = true;
      earlyBird.unlockedAt = new Date();
      stats.totalXP += earlyBird.xpReward;
      stats.achievements.push(earlyBird.id);
      newlyUnlocked.push(earlyBird);
    }
  }
  
  // Aggiorna livello
  stats.level = calculateLevel(stats.totalXP);
  
  // Salva
  saveAchievements(achievements);
  saveUserStats(stats);
  
  // Controlla altri achievements
  const moreUnlocked = checkAchievements(stats);
  
  return [...newlyUnlocked, ...moreUnlocked];
};

// Reset achievements (per testing)
export const resetAchievements = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
};

