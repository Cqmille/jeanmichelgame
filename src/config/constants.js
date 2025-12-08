// Configuration du jeu Jean-Michel Game V2

export const GAME_CONFIG = {
  // Durée de la partie en ms
  GAME_DURATION: 14000,

  // Points de base par tick (20ms)
  BASE_POINTS_PER_TICK: 1000,
  TICK_INTERVAL: 20,

  // Dimensions du jeu
  GAME_WIDTH: 1200,
  GAME_HEIGHT: 700,

  // Jean-Michel dimensions
  JM_WIDTH: 100,
  JM_HEIGHT: 190
};

export const DIFFICULTIES = {
  easy: {
    name: 'Facile',
    description: 'Pour les débutants',
    animationDuration: 9000,
    teleportChance: 0,
    dodgeChance: 0,
    directionChangeChance: 0.1,
    speedMultiplier: 0.7,
    powerUpFrequency: 5000
  },
  normal: {
    name: 'Normal',
    description: 'Le vrai défi',
    animationDuration: 7000,
    teleportChance: 0.15,
    dodgeChance: 0.1,
    directionChangeChance: 0.25,
    speedMultiplier: 1,
    powerUpFrequency: 7000
  },
  impossible: {
    name: 'IMPOSSIBLE',
    description: 'Tu vas souffrir...',
    animationDuration: 4000,
    teleportChance: 0.35,
    dodgeChance: 0.3,
    directionChangeChance: 0.5,
    speedMultiplier: 1.8,
    powerUpFrequency: 10000
  }
};

export const COMBO_CONFIG = {
  // Temps en ms pour maintenir le combo
  COMBO_DECAY_TIME: 500,
  // Seuils de combo pour les multiplicateurs
  THRESHOLDS: [
    { time: 500, multiplier: 1, name: '' },
    { time: 1000, multiplier: 2, name: 'x2!' },
    { time: 2000, multiplier: 3, name: 'x3!!' },
    { time: 3000, multiplier: 4, name: 'x4!!!' },
    { time: 5000, multiplier: 5, name: 'MEGA x5!!!!' }
  ]
};

export const POWER_UPS = {
  freeze: {
    name: 'FREEZE',
    duration: 2000,
    color: '#00ffff',
    description: 'Jean-Michel est gelé!'
  },
  doublePoints: {
    name: 'x2 POINTS',
    duration: 3000,
    color: '#ffff00',
    description: 'Points doublés!'
  },
  slowmo: {
    name: 'SLOW-MO',
    duration: 2500,
    color: '#ff00ff',
    description: 'Ralentissement!'
  }
};

export const ACHIEVEMENTS = [
  {
    id: 'first_100k',
    name: 'Première centaine',
    description: 'Atteindre 100 000 points',
    condition: (stats) => stats.bestScore >= 100000,
    icon: '🎯'
  },
  {
    id: 'first_500k',
    name: 'Demi-million',
    description: 'Atteindre 500 000 points',
    condition: (stats) => stats.bestScore >= 500000,
    icon: '🔥'
  },
  {
    id: 'first_million',
    name: 'Millionnaire',
    description: 'Atteindre 1 000 000 points',
    condition: (stats) => stats.bestScore >= 1000000,
    icon: '💎'
  },
  {
    id: 'combo_x3',
    name: 'Combo Master',
    description: 'Atteindre un combo x3',
    condition: (stats) => stats.bestCombo >= 3,
    icon: '⚡'
  },
  {
    id: 'combo_x5',
    name: 'Combo Legend',
    description: 'Atteindre un combo x5',
    condition: (stats) => stats.bestCombo >= 5,
    icon: '👑'
  },
  {
    id: 'play_10',
    name: 'Habitué',
    description: 'Jouer 10 parties',
    condition: (stats) => stats.gamesPlayed >= 10,
    icon: '🎮'
  },
  {
    id: 'play_50',
    name: 'Accro',
    description: 'Jouer 50 parties',
    condition: (stats) => stats.gamesPlayed >= 50,
    icon: '🏆'
  },
  {
    id: 'beat_easy',
    name: 'Échauffement',
    description: 'Terminer une partie en Facile',
    condition: (stats) => stats.completedDifficulties.includes('easy'),
    icon: '✅'
  },
  {
    id: 'beat_normal',
    name: 'Challenger',
    description: 'Terminer une partie en Normal',
    condition: (stats) => stats.completedDifficulties.includes('normal'),
    icon: '🌟'
  },
  {
    id: 'beat_impossible',
    name: 'LÉGENDAIRE',
    description: 'Terminer une partie en IMPOSSIBLE',
    condition: (stats) => stats.completedDifficulties.includes('impossible'),
    icon: '🏅'
  }
];

export const SCORE_MILESTONES = [50000, 100000, 150000, 200000, 250000, 300000, 350000];
