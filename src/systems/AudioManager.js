// Gestionnaire audio avancé avec contrôle de volume

export class AudioManager {
  constructor() {
    this.sounds = {};
    this.musicVolume = 0.7;
    this.sfxVolume = 0.8;
    this.musicMuted = false;
    this.sfxMuted = false;

    // Catégorisation des sons
    this.musicTracks = ['loop'];
    this.sfxTracks = ['letzGo', 'woo', 'hii', 'gama', 'legati', 'drr', 'hit', 'gta'];

    this.loadSounds();
  }

  loadSounds() {
    const soundFiles = {
      letzGo: 'public/audio/letzgo.mp3',
      woo: 'public/audio/woo.mp3',
      hii: 'public/audio/hii.mp3',
      gama: 'public/audio/gama.mp3',
      legati: 'public/audio/legati.mp3',
      drr: 'public/audio/drr.mp3',
      hit: 'public/audio/hit.mp3',
      loop: 'public/audio/loop.mp3',
      gta: 'public/audio/gta.mp3'
    };

    for (const [name, path] of Object.entries(soundFiles)) {
      const audio = new Audio(path);
      audio.preload = 'auto';

      // Loop pour la musique
      if (this.musicTracks.includes(name)) {
        audio.loop = true;
      }

      this.sounds[name] = audio;
    }

    this.updateAllVolumes();
  }

  play(name) {
    const sound = this.sounds[name];
    if (!sound) return;

    const isMusic = this.musicTracks.includes(name);

    // Vérifier si muté
    if (isMusic && this.musicMuted) return;
    if (!isMusic && this.sfxMuted) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  stop(name) {
    const sound = this.sounds[name];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  stopAll() {
    for (const sound of Object.values(this.sounds)) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  toggleMusicMute() {
    this.musicMuted = !this.musicMuted;
    this.updateAllVolumes();
    return this.musicMuted;
  }

  toggleSfxMute() {
    this.sfxMuted = !this.sfxMuted;
    return this.sfxMuted;
  }

  updateAllVolumes() {
    for (const [name, sound] of Object.entries(this.sounds)) {
      if (this.musicTracks.includes(name)) {
        sound.volume = this.musicMuted ? 0 : this.musicVolume;
      } else {
        sound.volume = this.sfxMuted ? 0 : this.sfxVolume;
      }
    }
  }

  // Jouer un son aléatoire de milestone
  playRandomMilestone() {
    const milestoneSounds = ['woo', 'hii', 'gama', 'legati', 'drr'];
    const randomSound = milestoneSounds[Math.floor(Math.random() * milestoneSounds.length)];
    this.play(randomSound);
  }
}
