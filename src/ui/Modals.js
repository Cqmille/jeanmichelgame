// Modals pour Achievements et Stats

export class ModalsManager {
  constructor(game) {
    this.game = game;
    this.currentModal = null;
  }

  showAchievements() {
    const achievements = this.game.achievementSystem.getAll();

    const achievementsHTML = achievements.map(a => `
      <div class="achievement-item ${a.unlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-icon">${a.unlocked ? a.icon : '🔒'}</span>
        <div class="achievement-info">
          <span class="achievement-name">${a.name}</span>
          <span class="achievement-desc">${a.description}</span>
        </div>
      </div>
    `).join('');

    this.showModal(`
      <h2 class="modal-title">SUCCÈS</h2>
      <p class="modal-subtitle">${this.game.achievementSystem.getUnlockedCount()} / ${this.game.achievementSystem.getTotalCount()} débloqués</p>
      <div class="achievements-list">
        ${achievementsHTML}
      </div>
    `);
  }

  showStats() {
    const stats = this.game.statsManager.getGlobalStats();
    const accuracy = this.game.statsManager.getAccuracy();

    this.showModal(`
      <h2 class="modal-title">STATISTIQUES</h2>
      <div class="stats-list">
        <div class="stat-row">
          <span class="stat-name">Parties jouées</span>
          <span class="stat-val">${stats.gamesPlayed}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Meilleur score</span>
          <span class="stat-val">${stats.bestScore.toLocaleString()}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Score total</span>
          <span class="stat-val">${stats.totalScore.toLocaleString()}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Meilleur combo</span>
          <span class="stat-val">x${stats.bestCombo}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Temps total sur cible</span>
          <span class="stat-val">${(stats.totalTimeOnTarget / 1000).toFixed(1)}s</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Précision moyenne</span>
          <span class="stat-val">${accuracy}%</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Power-ups collectés</span>
          <span class="stat-val">${stats.totalPowerUpsCollected}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">Difficultés complétées</span>
          <span class="stat-val">${stats.completedDifficulties.length}/3</span>
        </div>
      </div>
    `);
  }

  showAchievementUnlock(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-notif-content">
        <span class="achievement-notif-icon">${achievement.icon}</span>
        <div class="achievement-notif-text">
          <span class="notif-label">SUCCÈS DÉBLOQUÉ!</span>
          <span class="notif-name">${achievement.name}</span>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  showModal(content) {
    this.hideModal();

    this.currentModal = document.createElement('div');
    this.currentModal.className = 'modal-overlay';

    this.currentModal.innerHTML = `
      <div class="modal-content">
        ${content}
        <button class="btn-close-modal" id="close-modal">FERMER</button>
      </div>
    `;

    document.body.appendChild(this.currentModal);

    document.getElementById('close-modal').addEventListener('click', () => {
      this.hideModal();
    });

    this.currentModal.addEventListener('click', (e) => {
      if (e.target === this.currentModal) {
        this.hideModal();
      }
    });

    requestAnimationFrame(() => {
      this.currentModal.classList.add('visible');
    });
  }

  hideModal() {
    if (this.currentModal) {
      this.currentModal.classList.remove('visible');
      setTimeout(() => {
        if (this.currentModal) {
          this.currentModal.remove();
          this.currentModal = null;
        }
      }, 300);
    }
  }
}
