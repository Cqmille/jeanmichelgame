// Classe principale du jeu Jean-Michel Game V2

import { StateMachine } from './states/StateMachine.js';
import { MenuState } from './states/MenuState.js';
import { PlayState } from './states/PlayState.js';
import { GameOverState } from './states/GameOverState.js';

import { AudioManager } from './systems/AudioManager.js';
import { ComboSystem } from './systems/ComboSystem.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { PowerUpSystem } from './systems/PowerUpSystem.js';
import { AchievementSystem } from './systems/AchievementSystem.js';
import { StatsManager } from './systems/StatsManager.js';

import { JeanMichel } from './entities/JeanMichel.js';

import { HUD } from './ui/HUD.js';
import { Leaderboard } from './ui/Leaderboard.js';
import { ModalsManager } from './ui/Modals.js';

import { DIFFICULTIES } from './config/constants.js';

export class Game {
  constructor() {
    this.stateMachine = new StateMachine();

    // Systèmes
    this.audioManager = new AudioManager();
    this.comboSystem = new ComboSystem();
    this.achievementSystem = new AchievementSystem();
    this.statsManager = new StatsManager();

    // Ces systèmes seront initialisés après le DOM
    this.particleSystem = null;
    this.powerUpSystem = null;
    this.jeanMichel = null;

    // UI
    this.hud = new HUD();
    this.leaderboard = new Leaderboard();
    this.modals = new ModalsManager(this);

    // États
    this.playState = null;
  }

  init() {
    // Créer le canvas pour les particules
    this.createCanvas();

    // Initialiser Jean-Michel
    const jmElement = document.getElementById('jeanmichel');
    this.jeanMichel = new JeanMichel(jmElement);

    // Initialiser les systèmes
    this.particleSystem = new ParticleSystem(document.getElementById('particle-canvas'));
    this.powerUpSystem = new PowerUpSystem(this);
    this.powerUpSystem.init(document.getElementById('game-container'));

    // Initialiser le HUD
    this.hud.init();

    // Configurer les callbacks
    this.setupCallbacks();

    // Configurer les états
    this.setupStates();

    // Démarrer sur le menu
    this.stateMachine.setState('menu');
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('game-container').appendChild(canvas);

    // Resize handler
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  setupCallbacks() {
    // Callback pour les achievements
    this.achievementSystem.onAchievementUnlock = (achievement) => {
      this.modals.showAchievementUnlock(achievement);
      this.audioManager.play('woo');
    };
  }

  setupStates() {
    const menuState = new MenuState(this);
    this.playState = new PlayState(this);
    const gameOverState = new GameOverState(this);

    this.stateMachine.addState('menu', menuState);
    this.stateMachine.addState('play', this.playState);
    this.stateMachine.addState('gameover', gameOverState);
  }

  // Méthodes utilitaires appelées par les systèmes

  getDifficultyConfig(difficulty) {
    return DIFFICULTIES[difficulty] || DIFFICULTIES.normal;
  }

  applyPowerUp(type, powerUp) {
    if (this.playState) {
      this.playState.applyPowerUp(type, powerUp);
    }
  }

  removePowerUp(type) {
    if (this.playState) {
      this.playState.removePowerUp(type);
    }
  }

  showLeaderboard() {
    this.leaderboard.show();
  }

  showAchievements() {
    this.modals.showAchievements();
  }

  showStats() {
    this.modals.showStats();
  }
}
