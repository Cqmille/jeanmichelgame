import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();

  const menu = document.getElementById('menu');
  const gameUI = document.getElementById('gameUI');

  document.getElementById('startButton').addEventListener('click', () => {
    menu.classList.add('hidden');
    gameUI.classList.remove('hidden');
    game.start();
  });

  document
    .getElementById('resetButton')
    .addEventListener('click', () => game.reset());
});
