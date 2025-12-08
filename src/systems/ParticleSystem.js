// Système de particules synthwave

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    this.particles = [];
    this.clear();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Créer des particules de traînée derrière Jean-Michel
  createTrailParticles(x, y, color = '#ff00ff') {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        size: 3 + Math.random() * 5,
        color: color
      });
    }
  }

  // Particules de combo
  createComboParticles(x, y, multiplier) {
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff0080', '#00ff80'];
    const count = multiplier * 5;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = 3 + Math.random() * 3;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.015,
        size: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // Particules de power-up
  createPowerUpParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.02,
        size: 6 + Math.random() * 6,
        color: color
      });
    }
  }

  // Particules de score milestone
  createMilestoneParticles(x, y) {
    const colors = ['#ff00ff', '#00ffff', '#ffff00'];

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 6;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        decay: 0.01,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // Explosion de fin de partie
  createGameOverExplosion() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#00ff80', '#ff8000'];

    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;

      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.008,
        size: 4 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  update() {
    // Mettre à jour les particules
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.vy += 0.05; // Gravité légère

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render() {
    this.clear();

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.update();
    this.render();

    requestAnimationFrame(() => this.animate());
  }
}
