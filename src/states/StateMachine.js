// State Machine pour gérer les états du jeu

export class StateMachine {
  constructor() {
    this.states = {};
    this.currentState = null;
    this.previousState = null;
  }

  addState(name, state) {
    this.states[name] = state;
    state.stateMachine = this;
  }

  setState(name, params = {}) {
    if (!this.states[name]) {
      console.error(`State "${name}" not found`);
      return;
    }

    // Exit current state
    if (this.currentState) {
      this.currentState.exit();
      this.previousState = this.currentState;
    }

    // Enter new state
    this.currentState = this.states[name];
    this.currentState.enter(params);
  }

  update(deltaTime) {
    if (this.currentState && this.currentState.update) {
      this.currentState.update(deltaTime);
    }
  }

  getCurrentStateName() {
    for (const [name, state] of Object.entries(this.states)) {
      if (state === this.currentState) return name;
    }
    return null;
  }
}

// Classe de base pour les états
export class State {
  constructor(game) {
    this.game = game;
    this.stateMachine = null;
  }

  enter(params) {}
  exit() {}
  update(deltaTime) {}
}
