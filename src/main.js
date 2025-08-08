import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();

  document.getElementById('startButton').addEventListener('click', () => game.start());
  document.getElementById('resetButton').addEventListener('click', () => game.reset());
});
