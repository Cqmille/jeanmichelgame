// Point d'entrée - Jean-Michel Game V2

import { Game } from './Game.js';

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
});
