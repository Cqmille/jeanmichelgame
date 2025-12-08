// État du menu principal

import { State } from './StateMachine.js';
import { DIFFICULTIES } from '../config/constants.js';

export class MenuState extends State {
  constructor(game) {
    super(game);
    this.menuElement = null;
    this.selectedDifficulty = 'normal';
  }

  enter() {
    this.createMenu();
    this.game.audioManager.stop('loop');
  }

  exit() {
    this.hideMenu();
  }

  createMenu() {
    if (this.menuElement) {
      this.menuElement.classList.remove('hidden');
      return;
    }

    this.menuElement = document.createElement('div');
    this.menuElement.id = 'main-menu';
    this.menuElement.className = 'menu-container';

    this.menuElement.innerHTML = `
      <div class="menu-content">
        <h1 class="game-title">JEAN-MICHEL<br>GAME</h1>
        <p class="game-subtitle">V2.0 - SYNTHWAVE EDITION</p>

        <div class="menu-section">
          <h3>DIFFICULTÉ</h3>
          <div class="difficulty-buttons">
            ${Object.entries(DIFFICULTIES).map(([key, diff]) => `
              <button class="btn-difficulty ${key === this.selectedDifficulty ? 'selected' : ''}"
                      data-difficulty="${key}">
                <span class="diff-name">${diff.name}</span>
                <span class="diff-desc">${diff.description}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="menu-buttons">
          <button id="btn-start" class="btn-menu btn-primary">
            JOUER
          </button>
          <button id="btn-training" class="btn-menu btn-secondary">
            ENTRAÎNEMENT
          </button>
        </div>

        <div class="menu-buttons-row">
          <button id="btn-leaderboard" class="btn-menu btn-small">
            SCORES
          </button>
          <button id="btn-achievements" class="btn-menu btn-small">
            SUCCÈS (${this.game.achievementSystem.getUnlockedCount()}/${this.game.achievementSystem.getTotalCount()})
          </button>
          <button id="btn-stats" class="btn-menu btn-small">
            STATS
          </button>
        </div>

        <div class="menu-section audio-controls">
          <h3>AUDIO</h3>
          <div class="volume-control">
            <label>Musique</label>
            <input type="range" id="music-volume" min="0" max="100" value="${this.game.audioManager.musicVolume * 100}">
            <button id="btn-mute-music" class="btn-mute ${this.game.audioManager.musicMuted ? 'muted' : ''}">
              ${this.game.audioManager.musicMuted ? '🔇' : '🎵'}
            </button>
          </div>
          <div class="volume-control">
            <label>Effets</label>
            <input type="range" id="sfx-volume" min="0" max="100" value="${this.game.audioManager.sfxVolume * 100}">
            <button id="btn-mute-sfx" class="btn-mute ${this.game.audioManager.sfxMuted ? 'muted' : ''}">
              ${this.game.audioManager.sfxMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.menuElement);
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Sélection de difficulté
    this.menuElement.querySelectorAll('.btn-difficulty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const difficulty = e.currentTarget.dataset.difficulty;
        this.selectedDifficulty = difficulty;

        this.menuElement.querySelectorAll('.btn-difficulty').forEach(b => b.classList.remove('selected'));
        e.currentTarget.classList.add('selected');

        this.game.audioManager.play('hit');
      });
    });

    // Bouton Jouer
    document.getElementById('btn-start').addEventListener('click', () => {
      this.game.audioManager.play('letzGo');
      this.stateMachine.setState('play', {
        difficulty: this.selectedDifficulty,
        isTraining: false
      });
    });

    // Bouton Entraînement
    document.getElementById('btn-training').addEventListener('click', () => {
      this.game.audioManager.play('letzGo');
      this.stateMachine.setState('play', {
        difficulty: this.selectedDifficulty,
        isTraining: true
      });
    });

    // Bouton Leaderboard
    document.getElementById('btn-leaderboard').addEventListener('click', () => {
      this.game.showLeaderboard();
      this.game.audioManager.play('hit');
    });

    // Bouton Achievements
    document.getElementById('btn-achievements').addEventListener('click', () => {
      this.game.showAchievements();
      this.game.audioManager.play('hit');
    });

    // Bouton Stats
    document.getElementById('btn-stats').addEventListener('click', () => {
      this.game.showStats();
      this.game.audioManager.play('hit');
    });

    // Contrôle volume musique
    document.getElementById('music-volume').addEventListener('input', (e) => {
      this.game.audioManager.setMusicVolume(e.target.value / 100);
    });

    // Contrôle volume effets
    document.getElementById('sfx-volume').addEventListener('input', (e) => {
      this.game.audioManager.setSfxVolume(e.target.value / 100);
    });

    // Mute musique
    document.getElementById('btn-mute-music').addEventListener('click', (e) => {
      const muted = this.game.audioManager.toggleMusicMute();
      e.currentTarget.textContent = muted ? '🔇' : '🎵';
      e.currentTarget.classList.toggle('muted', muted);
    });

    // Mute effets
    document.getElementById('btn-mute-sfx').addEventListener('click', (e) => {
      const muted = this.game.audioManager.toggleSfxMute();
      e.currentTarget.textContent = muted ? '🔇' : '🔊';
      e.currentTarget.classList.toggle('muted', muted);
    });
  }

  hideMenu() {
    if (this.menuElement) {
      this.menuElement.classList.add('hidden');
    }
  }

  updateAchievementCount() {
    const btn = document.getElementById('btn-achievements');
    if (btn) {
      btn.textContent = `SUCCÈS (${this.game.achievementSystem.getUnlockedCount()}/${this.game.achievementSystem.getTotalCount()})`;
    }
  }
}
