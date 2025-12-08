// Système d'achievements

import { ACHIEVEMENTS } from '../config/constants.js';

export class AchievementSystem {
  constructor() {
    this.unlockedAchievements = this.loadUnlocked();
    this.onAchievementUnlock = null;
  }

  loadUnlocked() {
    try {
      const saved = localStorage.getItem('jm_achievements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveUnlocked() {
    try {
      localStorage.setItem('jm_achievements', JSON.stringify(this.unlockedAchievements));
    } catch {
      // localStorage non disponible
    }
  }

  checkAchievements(stats) {
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!this.unlockedAchievements.includes(achievement.id)) {
        if (achievement.condition(stats)) {
          this.unlockedAchievements.push(achievement.id);
          newlyUnlocked.push(achievement);
        }
      }
    }

    if (newlyUnlocked.length > 0) {
      this.saveUnlocked();

      // Notifier les nouveaux achievements
      for (const achievement of newlyUnlocked) {
        if (this.onAchievementUnlock) {
          this.onAchievementUnlock(achievement);
        }
      }
    }

    return newlyUnlocked;
  }

  isUnlocked(achievementId) {
    return this.unlockedAchievements.includes(achievementId);
  }

  getAll() {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: this.unlockedAchievements.includes(a.id)
    }));
  }

  getUnlockedCount() {
    return this.unlockedAchievements.length;
  }

  getTotalCount() {
    return ACHIEVEMENTS.length;
  }

  reset() {
    this.unlockedAchievements = [];
    this.saveUnlocked();
  }
}
