export class AudioManager {
  constructor() {
    this.sounds = {
      letzGo: new Audio('public/audio/letzgo.mp3'),
      woo: new Audio('public/audio/woo.mp3'),
      hii: new Audio('public/audio/hii.mp3'),
      gama: new Audio('public/audio/gama.mp3'),
      legati: new Audio('public/audio/legati.mp3'),
      drr: new Audio('public/audio/drr.mp3'),
      hit: new Audio('public/audio/hit.mp3'),
      loop: new Audio('public/audio/loop.mp3'),
      gta: new Audio('public/audio/gta.mp3')
    };
  }

  play(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  stop(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }
}
