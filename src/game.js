import { AudioManager } from './audio.js';
import { animateJeanMichel } from './animation.js';

const SCORE_STEP = 1000;
const SCORE_INTERVAL_MS = 20;

export class Game {
  constructor() {
    this.duration = 7000;
    this.score = 0;
    this.isRunning = false;
    this.audio = new AudioManager();
    this.scoreTimer = null;
    this.animation = null;
  }

  init() {
    const jeanMichel = document.getElementById('jeanmichel');
    jeanMichel.addEventListener('mouseenter', () => {
      this.scoreTimer = setInterval(() => this.addScore(), SCORE_INTERVAL_MS);
    });
    jeanMichel.addEventListener('mouseleave', () => {
      clearInterval(this.scoreTimer);
    });
  }

  start() {
    if (this.isRunning) return;
    this.resetScore();
    this.isRunning = true;
    this.audio.play('letzGo');
    this.audio.play('loop');
    this.animation = animateJeanMichel(this.duration);
    setTimeout(() => this.end(), this.duration * 2);
  }

  addScore() {
    if (!this.isRunning) return;
    this.score += SCORE_STEP;
    document.getElementById('top').textContent = this.score;
    this.checkScoreAlerts();
  }

  resetScore() {
    this.score = 0;
    document.getElementById('top').textContent = this.score;
  }

  checkScoreAlerts() {
    const alerts = {
      50000: 'woo',
      100000: 'hii',
      150000: 'woo',
      200000: 'legati',
      250000: 'woo',
      300000: 'drr',
      350000: 'woo'
    };
    const sound = alerts[this.score] || 'hit';
    this.audio.play(sound);
  }

  end() {
    this.isRunning = false;
    this.audio.play('gta');
    this.audio.stop('loop');
    alert(`Your final score is ${this.score}`);
  }

  reset() {
    this.isRunning = false;
    clearInterval(this.scoreTimer);
    if (this.animation) {
      this.animation.pause();
    }
    this.audio.stop('loop');
    this.resetScore();
  }
}
