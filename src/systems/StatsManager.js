// Gestionnaire de statistiques

export class StatsManager {
  constructor() {
    this.stats = this.loadStats();
    this.currentGameStats = this.createEmptyGameStats();
  }

  createEmptyGameStats() {
    return {
      score: 0,
      bestCombo: 1,
      timeOnTarget: 0,
      powerUpsCollected: 0,
      difficulty: null
    };
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('jm_stats');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // localStorage non disponible
    }

    return {
      bestScore: 0,
      bestCombo: 1,
      totalScore: 0,
      totalTimeOnTarget: 0,
      totalPowerUpsCollected: 0,
      gamesPlayed: 0,
      completedDifficulties: []
    };
  }

  saveStats() {
    try {
      localStorage.setItem('jm_stats', JSON.stringify(this.stats));
    } catch {
      // localStorage non disponible
    }
  }

  startGame(difficulty) {
    this.currentGameStats = this.createEmptyGameStats();
    this.currentGameStats.difficulty = difficulty;
  }

  updateScore(score) {
    this.currentGameStats.score = score;
  }

  updateCombo(combo) {
    if (combo > this.currentGameStats.bestCombo) {
      this.currentGameStats.bestCombo = combo;
    }
  }

  addTimeOnTarget(ms) {
    this.currentGameStats.timeOnTarget += ms;
  }

  collectPowerUp() {
    this.currentGameStats.powerUpsCollected++;
  }

  endGame() {
    const game = this.currentGameStats;

    // Mettre à jour les stats globales
    this.stats.gamesPlayed++;
    this.stats.totalScore += game.score;
    this.stats.totalTimeOnTarget += game.timeOnTarget;
    this.stats.totalPowerUpsCollected += game.powerUpsCollected;

    if (game.score > this.stats.bestScore) {
      this.stats.bestScore = game.score;
    }

    if (game.bestCombo > this.stats.bestCombo) {
      this.stats.bestCombo = game.bestCombo;
    }

    // Ajouter la difficulté complétée
    if (game.difficulty && !this.stats.completedDifficulties.includes(game.difficulty)) {
      this.stats.completedDifficulties.push(game.difficulty);
    }

    this.saveStats();

    return this.stats;
  }

  getCurrentGameStats() {
    return this.currentGameStats;
  }

  getGlobalStats() {
    return this.stats;
  }

  getAccuracy() {
    // Précision basée sur le temps sur cible vs temps total de jeu
    if (this.stats.gamesPlayed === 0) return 0;
    const totalGameTime = this.stats.gamesPlayed * 14000; // 14 sec par partie
    return Math.round((this.stats.totalTimeOnTarget / totalGameTime) * 100);
  }

  reset() {
    this.stats = {
      bestScore: 0,
      bestCombo: 1,
      totalScore: 0,
      totalTimeOnTarget: 0,
      totalPowerUpsCollected: 0,
      gamesPlayed: 0,
      completedDifficulties: []
    };
    this.saveStats();
  }
}
