// HUD (Heads-Up Display) du jeu

export class HUD {
  constructor() {
    this.element = null;
    this.scoreElement = null;
    this.timerElement = null;
    this.comboElement = null;
    this.powerUpElement = null;
    this.difficultyElement = null;
    this.milestoneElement = null;
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'hud';
    this.element.className = 'hud hidden';

    this.element.innerHTML = `
      <div class="hud-top">
        <div class="hud-left">
          <div class="hud-difficulty" id="hud-difficulty">NORMAL</div>
          <div class="hud-timer" id="hud-timer">14.00</div>
        </div>
        <div class="hud-center">
          <div class="hud-score">
            <span class="score-label">SCORE</span>
            <span class="score-value" id="hud-score">0</span>
          </div>
          <div class="hud-combo hidden" id="hud-combo">x1</div>
        </div>
        <div class="hud-right">
          <div class="hud-powerup hidden" id="hud-powerup"></div>
        </div>
      </div>
      <div class="hud-milestone hidden" id="hud-milestone"></div>
    `;

    document.body.appendChild(this.element);

    this.scoreElement = document.getElementById('hud-score');
    this.timerElement = document.getElementById('hud-timer');
    this.comboElement = document.getElementById('hud-combo');
    this.powerUpElement = document.getElementById('hud-powerup');
    this.difficultyElement = document.getElementById('hud-difficulty');
    this.milestoneElement = document.getElementById('hud-milestone');
  }

  show() {
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }

  reset() {
    this.updateScore(0);
    this.updateTimer(14000);
    this.updateCombo(1, '');
    this.hidePowerUp();
  }

  updateScore(score) {
    this.scoreElement.textContent = score.toLocaleString();

    // Animation de pulse
    this.scoreElement.classList.remove('pulse');
    void this.scoreElement.offsetWidth; // Force reflow
    this.scoreElement.classList.add('pulse');
  }

  updateTimer(remainingMs) {
    const seconds = (remainingMs / 1000).toFixed(2);
    this.timerElement.textContent = seconds;

    // Changer de couleur si temps faible
    if (remainingMs < 3000) {
      this.timerElement.classList.add('critical');
    } else {
      this.timerElement.classList.remove('critical');
    }
  }

  updateCombo(multiplier, name) {
    if (multiplier > 1) {
      this.comboElement.textContent = name || `x${multiplier}`;
      this.comboElement.classList.remove('hidden');
      this.comboElement.classList.add('active');

      // Animation selon le niveau de combo
      this.comboElement.className = 'hud-combo active';
      if (multiplier >= 5) {
        this.comboElement.classList.add('mega');
      } else if (multiplier >= 3) {
        this.comboElement.classList.add('super');
      }
    } else {
      this.comboElement.classList.remove('active');
      this.comboElement.classList.add('hidden');
    }
  }

  updateDifficulty(difficulty, isTraining) {
    const names = {
      easy: 'FACILE',
      normal: 'NORMAL',
      impossible: 'IMPOSSIBLE'
    };

    let text = names[difficulty] || difficulty.toUpperCase();
    if (isTraining) {
      text += ' - ENTRAÎNEMENT';
    }

    this.difficultyElement.textContent = text;
    this.difficultyElement.className = `hud-difficulty ${difficulty}`;

    if (isTraining) {
      this.timerElement.textContent = '∞';
      this.timerElement.classList.add('training');
    } else {
      this.timerElement.classList.remove('training');
    }
  }

  showPowerUp(name, color) {
    this.powerUpElement.textContent = name;
    this.powerUpElement.style.backgroundColor = color;
    this.powerUpElement.style.boxShadow = `0 0 20px ${color}`;
    this.powerUpElement.classList.remove('hidden');
    this.powerUpElement.classList.add('active');
  }

  hidePowerUp() {
    this.powerUpElement.classList.remove('active');
    this.powerUpElement.classList.add('hidden');
  }

  showMilestone(score) {
    this.milestoneElement.textContent = `${(score / 1000)}K !`;
    this.milestoneElement.classList.remove('hidden');
    this.milestoneElement.classList.add('show');

    setTimeout(() => {
      this.milestoneElement.classList.remove('show');
      this.milestoneElement.classList.add('hidden');
    }, 1500);
  }
}
