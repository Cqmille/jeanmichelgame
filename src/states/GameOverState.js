// État de fin de partie

import { State } from './StateMachine.js';

export class GameOverState extends State {
  constructor(game) {
    super(game);
    this.gameOverElement = null;
  }

  enter(params = {}) {
    this.showGameOver(params);
  }

  exit() {
    this.hideGameOver();
  }

  showGameOver(params) {
    const { score, difficulty, isTraining, stats } = params;

    if (this.gameOverElement) {
      this.gameOverElement.remove();
    }

    this.gameOverElement = document.createElement('div');
    this.gameOverElement.id = 'game-over';
    this.gameOverElement.className = 'gameover-container';

    const difficultyName = this.game.getDifficultyConfig(difficulty).name;
    const isNewRecord = score > this.game.statsManager.getGlobalStats().bestScore;

    this.gameOverElement.innerHTML = `
      <div class="gameover-content">
        <h1 class="gameover-title ${isTraining ? 'training' : ''}">
          ${isTraining ? 'ENTRAÎNEMENT TERMINÉ' : 'FIN DE PARTIE'}
        </h1>

        ${isNewRecord && !isTraining ? '<div class="new-record">NOUVEAU RECORD!</div>' : ''}

        <div class="score-display">
          <div class="score-label">SCORE FINAL</div>
          <div class="score-value" id="final-score">0</div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Difficulté</span>
            <span class="stat-value">${difficultyName}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Meilleur Combo</span>
            <span class="stat-value">x${stats.bestCombo}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Temps sur cible</span>
            <span class="stat-value">${(stats.timeOnTarget / 1000).toFixed(1)}s</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Power-ups</span>
            <span class="stat-value">${stats.powerUpsCollected}</span>
          </div>
        </div>

        <div class="gameover-buttons">
          <button id="btn-replay" class="btn-menu btn-primary">
            REJOUER
          </button>
          <button id="btn-menu" class="btn-menu btn-secondary">
            MENU
          </button>
        </div>

        <div class="share-section">
          <button id="btn-share" class="btn-share" disabled>
            PARTAGER (bientôt)
          </button>
        </div>

        <div class="gameover-achievements" id="new-achievements"></div>
      </div>
    `;

    document.body.appendChild(this.gameOverElement);

    // Animation du score
    this.animateScore(score);

    // Afficher les nouveaux achievements
    this.showNewAchievements();

    // Setup des boutons
    this.setupEventListeners(difficulty, isTraining);

    // Animation d'entrée
    requestAnimationFrame(() => {
      this.gameOverElement.classList.add('visible');
    });
  }

  animateScore(finalScore) {
    const scoreElement = document.getElementById('final-score');
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.floor(finalScore * eased);

      scoreElement.textContent = currentScore.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  showNewAchievements() {
    const container = document.getElementById('new-achievements');
    const achievements = this.game.achievementSystem.getAll().filter(a => a.unlocked);

    // On montre seulement les derniers débloqués (pour cette session)
    // Pour simplifier, on ne montre rien ici, les achievements sont notifiés en temps réel
  }

  setupEventListeners(difficulty, isTraining) {
    document.getElementById('btn-replay').addEventListener('click', () => {
      this.game.audioManager.play('letzGo');
      this.stateMachine.setState('play', {
        difficulty: difficulty,
        isTraining: isTraining
      });
    });

    document.getElementById('btn-menu').addEventListener('click', () => {
      this.game.audioManager.play('hit');
      this.stateMachine.setState('menu');
    });
  }

  hideGameOver() {
    if (this.gameOverElement) {
      this.gameOverElement.classList.remove('visible');
      setTimeout(() => {
        if (this.gameOverElement) {
          this.gameOverElement.remove();
          this.gameOverElement = null;
        }
      }, 300);
    }
  }
}
