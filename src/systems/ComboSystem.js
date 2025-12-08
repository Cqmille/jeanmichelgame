// Système de combo

import { COMBO_CONFIG } from '../config/constants.js';

export class ComboSystem {
  constructor() {
    this.isTracking = false;
    this.trackingStartTime = 0;
    this.currentMultiplier = 1;
    this.currentComboName = '';
    this.bestComboThisGame = 1;
    this.onComboChange = null;
  }

  startTracking() {
    if (!this.isTracking) {
      this.isTracking = true;
      this.trackingStartTime = Date.now();
    }
  }

  stopTracking() {
    this.isTracking = false;
    this.currentMultiplier = 1;
    this.currentComboName = '';
    this.trackingStartTime = 0;

    if (this.onComboChange) {
      this.onComboChange(1, '');
    }
  }

  update() {
    if (!this.isTracking) return;

    const trackingTime = Date.now() - this.trackingStartTime;
    let newMultiplier = 1;
    let newName = '';

    // Trouver le seuil de combo approprié
    for (const threshold of COMBO_CONFIG.THRESHOLDS) {
      if (trackingTime >= threshold.time) {
        newMultiplier = threshold.multiplier;
        newName = threshold.name;
      }
    }

    // Mettre à jour si changement
    if (newMultiplier !== this.currentMultiplier) {
      this.currentMultiplier = newMultiplier;
      this.currentComboName = newName;

      if (newMultiplier > this.bestComboThisGame) {
        this.bestComboThisGame = newMultiplier;
      }

      if (this.onComboChange) {
        this.onComboChange(newMultiplier, newName);
      }
    }
  }

  getMultiplier() {
    return this.currentMultiplier;
  }

  getComboName() {
    return this.currentComboName;
  }

  getTrackingTime() {
    if (!this.isTracking) return 0;
    return Date.now() - this.trackingStartTime;
  }

  reset() {
    this.stopTracking();
    this.bestComboThisGame = 1;
  }
}
