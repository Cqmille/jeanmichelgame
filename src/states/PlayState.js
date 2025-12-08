// État de jeu

import { State } from './StateMachine.js';
import { GAME_CONFIG, SCORE_MILESTONES, POWER_UPS } from '../config/constants.js';

export class PlayState extends State {
  constructor(game) {
    super(game);
    this.score = 0;
    this.difficulty = 'normal';
    this.isTraining = false;
    this.isRunning = false;
    this.scoreInterval = null;
    this.gameTimeout = null;
    this.startTime = 0;
    this.milestoneIndex = 0;
    this.pointsMultiplier = 1;
    this.lastMousePos = { x: 0, y: 0 };
  }

  enter(params = {}) {
    this.difficulty = params.difficulty || 'normal';
    this.isTraining = params.isTraining || false;

    this.reset();
    this.game.hud.show();
    this.game.hud.updateDifficulty(this.difficulty, this.isTraining);
    this.game.jeanMichel.setDifficulty(this.difficulty);

    // Afficher le message de démarrage
    this.showStartMessage();
  }

  showStartMessage() {
    const message = document.createElement('div');
    message.className = 'start-message';
    message.innerHTML = `
      <div class="start-text">VISE JEAN-MICHEL<br>AVEC LA SOURIS !!!</div>
    `;
    document.body.appendChild(message);

    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => {
        message.remove();
        this.startGame();
      }, 500);
    }, 1500);
  }

  startGame() {
    this.isRunning = true;
    this.startTime = Date.now();

    // Démarrer la musique
    this.game.audioManager.play('loop');

    // Démarrer Jean-Michel
    this.game.jeanMichel.start();

    // Démarrer les particules
    this.game.particleSystem.start();

    // Démarrer les power-ups
    const diffConfig = this.game.getDifficultyConfig(this.difficulty);
    this.game.powerUpSystem.startSpawning(diffConfig.powerUpFrequency);

    // Démarrer le comptage des points
    this.startScoring();

    // Démarrer le timer (sauf en mode entraînement)
    if (!this.isTraining) {
      this.gameTimeout = setTimeout(() => {
        this.endGame();
      }, GAME_CONFIG.GAME_DURATION);
    }

    // Stats
    this.game.statsManager.startGame(this.difficulty);

    // Écouter les mouvements de souris pour les power-ups
    this.mouseMoveHandler = (e) => {
      this.lastMousePos = { x: e.clientX, y: e.clientY };
      const collected = this.game.powerUpSystem.checkCollection(e.clientX, e.clientY);
      if (collected) {
        this.game.statsManager.collectPowerUp();
      }
    };
    document.addEventListener('mousemove', this.mouseMoveHandler);

    // Écouter Escape pour quitter
    this.keyHandler = (e) => {
      if (e.key === 'Escape') {
        this.exitToMenu();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  startScoring() {
    this.scoreInterval = setInterval(() => {
      if (this.game.jeanMichel.isHovered && this.isRunning) {
        const comboMultiplier = this.game.comboSystem.getMultiplier();
        const points = GAME_CONFIG.BASE_POINTS_PER_TICK * this.pointsMultiplier * comboMultiplier;
        this.score += points;

        this.game.hud.updateScore(this.score);
        this.game.statsManager.updateScore(this.score);
        this.game.statsManager.addTimeOnTarget(GAME_CONFIG.TICK_INTERVAL);

        // Vérifier les milestones
        this.checkMilestones();

        // Créer des particules de traînée
        const pos = this.game.jeanMichel.getPosition();
        this.game.particleSystem.createTrailParticles(pos.centerX, pos.centerY);
      }

      // Mettre à jour le combo
      this.game.comboSystem.update();

      // Mettre à jour le timer
      if (!this.isTraining) {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, GAME_CONFIG.GAME_DURATION - elapsed);
        this.game.hud.updateTimer(remaining);
      }
    }, GAME_CONFIG.TICK_INTERVAL);

    // Event handlers pour le combo
    this.game.jeanMichel.onHoverStart = () => {
      this.game.comboSystem.startTracking();
    };

    this.game.jeanMichel.onHoverEnd = () => {
      this.game.comboSystem.stopTracking();
    };

    // Callback quand le combo change
    this.game.comboSystem.onComboChange = (multiplier, name) => {
      this.game.hud.updateCombo(multiplier, name);
      this.game.statsManager.updateCombo(multiplier);

      if (multiplier > 1) {
        const pos = this.game.jeanMichel.getPosition();
        this.game.particleSystem.createComboParticles(pos.centerX, pos.centerY, multiplier);
        this.game.audioManager.play('hit');
      }
    };
  }

  checkMilestones() {
    while (this.milestoneIndex < SCORE_MILESTONES.length &&
           this.score >= SCORE_MILESTONES[this.milestoneIndex]) {
      this.game.audioManager.playRandomMilestone();

      const pos = this.game.jeanMichel.getPosition();
      this.game.particleSystem.createMilestoneParticles(pos.centerX, pos.centerY);

      this.game.hud.showMilestone(SCORE_MILESTONES[this.milestoneIndex]);
      this.milestoneIndex++;
    }
  }

  endGame() {
    this.isRunning = false;

    // Arrêter tout
    clearInterval(this.scoreInterval);
    clearTimeout(this.gameTimeout);
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('keydown', this.keyHandler);

    this.game.jeanMichel.stop();
    this.game.powerUpSystem.stopSpawning();
    this.game.comboSystem.reset();
    this.game.audioManager.stop('loop');
    this.game.audioManager.play('gta');

    // Explosion de particules
    this.game.particleSystem.createGameOverExplosion();

    // Finaliser les stats
    const finalStats = this.game.statsManager.endGame();

    // Vérifier les achievements
    this.game.achievementSystem.checkAchievements(finalStats);

    // Ajouter au leaderboard
    this.game.leaderboard.addScore(this.score, this.difficulty);

    // Passer à l'écran de game over
    setTimeout(() => {
      this.stateMachine.setState('gameover', {
        score: this.score,
        difficulty: this.difficulty,
        isTraining: this.isTraining,
        stats: this.game.statsManager.getCurrentGameStats()
      });
    }, 1000);
  }

  exitToMenu() {
    this.isRunning = false;

    clearInterval(this.scoreInterval);
    clearTimeout(this.gameTimeout);
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('keydown', this.keyHandler);

    this.game.jeanMichel.reset();
    this.game.powerUpSystem.stopSpawning();
    this.game.comboSystem.reset();
    this.game.particleSystem.stop();
    this.game.audioManager.stopAll();
    this.game.hud.hide();

    this.stateMachine.setState('menu');
  }

  exit() {
    this.game.hud.hide();
    this.game.particleSystem.stop();
  }

  reset() {
    this.score = 0;
    this.milestoneIndex = 0;
    this.pointsMultiplier = 1;
    this.game.comboSystem.reset();
    this.game.hud.reset();
  }

  // Appelé par le PowerUpSystem
  applyPowerUp(type, powerUp) {
    this.game.hud.showPowerUp(powerUp.name, powerUp.color);

    const pos = this.game.jeanMichel.getPosition();
    this.game.particleSystem.createPowerUpParticles(pos.centerX, pos.centerY, powerUp.color);
    this.game.audioManager.play('woo');

    switch (type) {
      case 'freeze':
        this.game.jeanMichel.freeze();
        break;
      case 'doublePoints':
        this.pointsMultiplier = 2;
        break;
      case 'slowmo':
        this.game.jeanMichel.setSlowMo(true);
        break;
    }
  }

  removePowerUp(type) {
    this.game.hud.hidePowerUp();

    switch (type) {
      case 'freeze':
        this.game.jeanMichel.unfreeze();
        break;
      case 'doublePoints':
        this.pointsMultiplier = 1;
        break;
      case 'slowmo':
        this.game.jeanMichel.setSlowMo(false);
        break;
    }
  }
}
