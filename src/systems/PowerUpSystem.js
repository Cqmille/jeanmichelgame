// Système de Power-ups

import { POWER_UPS } from '../config/constants.js';

export class PowerUpSystem {
  constructor(game) {
    this.game = game;
    this.activePowerUp = null;
    this.powerUpElement = null;
    this.powerUpTimeout = null;
    this.activeEffectTimeout = null;
    this.spawnInterval = null;
  }

  init(container) {
    // Créer l'élément power-up
    this.powerUpElement = document.createElement('div');
    this.powerUpElement.id = 'powerup';
    this.powerUpElement.className = 'powerup hidden';
    container.appendChild(this.powerUpElement);
  }

  startSpawning(frequency) {
    this.stopSpawning();

    // Premier spawn après un délai
    this.powerUpTimeout = setTimeout(() => {
      this.spawnPowerUp();

      // Spawns réguliers
      this.spawnInterval = setInterval(() => {
        if (!this.activePowerUp) {
          this.spawnPowerUp();
        }
      }, frequency);
    }, frequency / 2);
  }

  stopSpawning() {
    if (this.powerUpTimeout) {
      clearTimeout(this.powerUpTimeout);
      this.powerUpTimeout = null;
    }
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
      this.spawnInterval = null;
    }
    if (this.activeEffectTimeout) {
      clearTimeout(this.activeEffectTimeout);
      this.activeEffectTimeout = null;
    }
    this.hidePowerUp();
  }

  spawnPowerUp() {
    const powerUpTypes = Object.keys(POWER_UPS);
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    const powerUp = POWER_UPS[randomType];

    // Position aléatoire
    const x = 100 + Math.random() * (window.innerWidth - 200);
    const y = 100 + Math.random() * (window.innerHeight - 300);

    this.powerUpElement.textContent = powerUp.name;
    this.powerUpElement.style.left = x + 'px';
    this.powerUpElement.style.top = y + 'px';
    this.powerUpElement.style.backgroundColor = powerUp.color;
    this.powerUpElement.style.boxShadow = `0 0 20px ${powerUp.color}, 0 0 40px ${powerUp.color}`;
    this.powerUpElement.dataset.type = randomType;
    this.powerUpElement.classList.remove('hidden');

    // Disparaît après 4 secondes si non collecté
    setTimeout(() => {
      if (this.powerUpElement && !this.powerUpElement.classList.contains('hidden')) {
        this.hidePowerUp();
      }
    }, 4000);
  }

  hidePowerUp() {
    if (this.powerUpElement) {
      this.powerUpElement.classList.add('hidden');
    }
  }

  checkCollection(mouseX, mouseY) {
    if (!this.powerUpElement || this.powerUpElement.classList.contains('hidden')) {
      return null;
    }

    const rect = this.powerUpElement.getBoundingClientRect();

    if (mouseX >= rect.left && mouseX <= rect.right &&
        mouseY >= rect.top && mouseY <= rect.bottom) {

      const type = this.powerUpElement.dataset.type;
      this.collectPowerUp(type);
      return type;
    }

    return null;
  }

  collectPowerUp(type) {
    const powerUp = POWER_UPS[type];
    this.activePowerUp = type;
    this.hidePowerUp();

    // Appliquer l'effet
    this.game.applyPowerUp(type, powerUp);

    // Fin de l'effet après la durée
    this.activeEffectTimeout = setTimeout(() => {
      this.game.removePowerUp(type);
      this.activePowerUp = null;
    }, powerUp.duration);
  }

  getActivePowerUp() {
    return this.activePowerUp;
  }

  destroy() {
    this.stopSpawning();
    if (this.powerUpElement && this.powerUpElement.parentNode) {
      this.powerUpElement.parentNode.removeChild(this.powerUpElement);
    }
  }
}
