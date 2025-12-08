// Entité Jean-Michel avec mouvements avancés

import { GAME_CONFIG, DIFFICULTIES } from '../config/constants.js';

export class JeanMichel {
  constructor(element) {
    this.element = element;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.isHovered = false;
    this.isFrozen = false;
    this.isSlowMo = false;

    this.difficulty = DIFFICULTIES.normal;
    this.animation = null;
    this.moveInterval = null;
    this.specialMoveTimeout = null;

    this.onHoverStart = null;
    this.onHoverEnd = null;

    this.setupEvents();
  }

  setupEvents() {
    this.element.addEventListener('mouseenter', () => {
      this.isHovered = true;
      if (this.onHoverStart) this.onHoverStart();
    });

    this.element.addEventListener('mouseleave', () => {
      this.isHovered = false;
      if (this.onHoverEnd) this.onHoverEnd();
    });
  }

  setDifficulty(difficultyKey) {
    this.difficulty = DIFFICULTIES[difficultyKey];
  }

  start() {
    this.element.style.display = 'block';
    this.startAnimation();
    this.startSpecialMoves();
  }

  stop() {
    this.stopAnimation();
    this.stopSpecialMoves();
    this.isFrozen = false;
    this.isSlowMo = false;
  }

  freeze() {
    this.isFrozen = true;
    this.stopAnimation();
    this.element.style.filter = 'brightness(2) hue-rotate(180deg)';
  }

  unfreeze() {
    this.isFrozen = false;
    this.element.style.filter = '';
    this.startAnimation();
  }

  setSlowMo(active) {
    this.isSlowMo = active;
    if (this.animation) {
      // Redémarrer l'animation avec la nouvelle vitesse
      this.stopAnimation();
      this.startAnimation();
    }
  }

  startAnimation() {
    if (this.isFrozen) return;

    const duration = this.isSlowMo
      ? this.difficulty.animationDuration * 2
      : this.difficulty.animationDuration;

    const keyframes = this.generateKeyframes();

    this.animation = anime({
      targets: this.element,
      keyframes: keyframes,
      duration: duration,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
      update: (anim) => {
        this.x = this.element.offsetLeft;
        this.y = this.element.offsetTop;
      }
    });
  }

  stopAnimation() {
    if (this.animation) {
      this.animation.pause();
      this.animation = null;
    }
  }

  generateKeyframes() {
    const keyframes = [];
    const numKeyframes = 15;
    const maxX = window.innerWidth - GAME_CONFIG.JM_WIDTH - 50;
    const maxY = window.innerHeight - GAME_CONFIG.JM_HEIGHT - 100;

    for (let i = 0; i < numKeyframes; i++) {
      keyframes.push({
        translateX: Math.random() * maxX,
        translateY: Math.random() * maxY
      });
    }

    return keyframes;
  }

  startSpecialMoves() {
    this.scheduleSpecialMove();
  }

  stopSpecialMoves() {
    if (this.specialMoveTimeout) {
      clearTimeout(this.specialMoveTimeout);
      this.specialMoveTimeout = null;
    }
  }

  scheduleSpecialMove() {
    if (this.isFrozen) return;

    const baseDelay = 1000 / this.difficulty.speedMultiplier;
    const delay = baseDelay + Math.random() * baseDelay;

    this.specialMoveTimeout = setTimeout(() => {
      this.performSpecialMove();
      this.scheduleSpecialMove();
    }, delay);
  }

  performSpecialMove() {
    if (this.isFrozen || this.isSlowMo) return;

    const roll = Math.random();

    if (roll < this.difficulty.teleportChance) {
      this.teleport();
    } else if (roll < this.difficulty.teleportChance + this.difficulty.dodgeChance) {
      this.dodge();
    } else if (roll < this.difficulty.teleportChance + this.difficulty.dodgeChance + this.difficulty.directionChangeChance) {
      this.suddenDirectionChange();
    }
  }

  teleport() {
    const maxX = window.innerWidth - GAME_CONFIG.JM_WIDTH - 50;
    const maxY = window.innerHeight - GAME_CONFIG.JM_HEIGHT - 100;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    // Effet visuel de téléportation
    this.element.style.transition = 'none';
    this.element.style.opacity = '0';
    this.element.style.transform = `translate(${newX}px, ${newY}px) scale(0.5)`;

    setTimeout(() => {
      this.element.style.transition = 'opacity 0.15s, transform 0.15s';
      this.element.style.opacity = '1';
      this.element.style.transform = `translate(${newX}px, ${newY}px) scale(1)`;

      // Redémarrer l'animation depuis la nouvelle position
      this.stopAnimation();
      setTimeout(() => {
        this.element.style.transition = '';
        this.startAnimation();
      }, 150);
    }, 50);

    this.x = newX;
    this.y = newY;
  }

  dodge() {
    if (!this.animation) return;

    // Esquive rapide dans une direction aléatoire
    const dodgeDistance = 150 + Math.random() * 100;
    const angle = Math.random() * Math.PI * 2;

    const currentX = this.element.offsetLeft || 0;
    const currentY = this.element.offsetTop || 0;

    let newX = currentX + Math.cos(angle) * dodgeDistance;
    let newY = currentY + Math.sin(angle) * dodgeDistance;

    // Garder dans les limites
    const maxX = window.innerWidth - GAME_CONFIG.JM_WIDTH - 50;
    const maxY = window.innerHeight - GAME_CONFIG.JM_HEIGHT - 100;

    newX = Math.max(0, Math.min(maxX, newX));
    newY = Math.max(100, Math.min(maxY, newY));

    // Animation rapide d'esquive
    this.stopAnimation();

    anime({
      targets: this.element,
      translateX: newX,
      translateY: newY,
      duration: 150,
      easing: 'easeOutQuad',
      complete: () => {
        this.startAnimation();
      }
    });
  }

  suddenDirectionChange() {
    if (!this.animation) return;

    // Inverser la direction de l'animation
    this.animation.reverse();
  }

  getPosition() {
    const rect = this.element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height
    };
  }

  reset() {
    this.stop();
    this.element.style.transform = '';
    this.element.style.opacity = '1';
    this.element.style.filter = '';
    this.element.style.display = 'none';
    this.isHovered = false;
  }
}
