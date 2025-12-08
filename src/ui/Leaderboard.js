// Système de Leaderboard

export class Leaderboard {
  constructor() {
    this.scores = this.loadScores();
    this.maxEntries = 10;
    this.modalElement = null;
  }

  loadScores() {
    try {
      const saved = localStorage.getItem('jm_leaderboard');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveScores() {
    try {
      localStorage.setItem('jm_leaderboard', JSON.stringify(this.scores));
    } catch {
      // localStorage non disponible
    }
  }

  addScore(score, difficulty) {
    const entry = {
      score: score,
      difficulty: difficulty,
      date: new Date().toISOString()
    };

    this.scores.push(entry);
    this.scores.sort((a, b) => b.score - a.score);
    this.scores = this.scores.slice(0, this.maxEntries);

    this.saveScores();

    return this.scores.findIndex(s => s === entry) + 1;
  }

  getScores() {
    return this.scores;
  }

  show() {
    if (this.modalElement) {
      this.modalElement.remove();
    }

    this.modalElement = document.createElement('div');
    this.modalElement.className = 'modal-overlay';

    const difficultyNames = {
      easy: 'Facile',
      normal: 'Normal',
      impossible: 'IMPOSSIBLE'
    };

    const scoresHTML = this.scores.length > 0
      ? this.scores.map((entry, index) => `
          <div class="leaderboard-entry ${index < 3 ? 'top-' + (index + 1) : ''}">
            <span class="entry-rank">#${index + 1}</span>
            <span class="entry-score">${entry.score.toLocaleString()}</span>
            <span class="entry-difficulty ${entry.difficulty}">${difficultyNames[entry.difficulty]}</span>
            <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
          </div>
        `).join('')
      : '<div class="no-scores">Aucun score enregistré</div>';

    this.modalElement.innerHTML = `
      <div class="modal-content leaderboard-modal">
        <h2 class="modal-title">MEILLEURS SCORES</h2>
        <div class="leaderboard-list">
          ${scoresHTML}
        </div>
        <button class="btn-close-modal" id="close-leaderboard">FERMER</button>
      </div>
    `;

    document.body.appendChild(this.modalElement);

    document.getElementById('close-leaderboard').addEventListener('click', () => {
      this.hide();
    });

    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.hide();
      }
    });

    requestAnimationFrame(() => {
      this.modalElement.classList.add('visible');
    });
  }

  hide() {
    if (this.modalElement) {
      this.modalElement.classList.remove('visible');
      setTimeout(() => {
        if (this.modalElement) {
          this.modalElement.remove();
          this.modalElement = null;
        }
      }, 300);
    }
  }

  reset() {
    this.scores = [];
    this.saveScores();
  }
}
