export class StateMachine<S, E> {
  constructor(
    private history: S[],
    private readonly transitions: { from: S; cause: E; to: S }[]
  ) {
    if (!this.history || this.history.length === 0) {
      throw new Error('history must not be empty');
    }
  }

  transition(event: E): boolean {
    const state = this.getState();
    const transition = this.transitions.find(
      (x) => x.from === state && x.cause === event
    );
    if (transition === undefined) {
      return false;
    }
    this.history.push(transition.to);
    return true;
  }

  getState(): S {
    const state = this.history.at(-1);
    if (!state) {
      throw new Error('history must not be empty');
    }
    return state;
  }

  matches(state: S): boolean {
    return this.getState() === state;
  }

  can(event: E): boolean {
    const state = this.getState();
    return this.transitions.some((t) => t.from === state && t.cause === event);
  }

  matchesSome(states: S[]): boolean {
    const state = this.getState();
    return states.some((s) => s === state);
  }

  getHistory(): S[] {
    return [...this.history];
  }

  parseHistory(history: any): void {
    if (!history || !Array.isArray(history)) {
      throw new Error('History needs to be an array');
    }
    history = history as S[];
    for (const state of history) {
      if (!(state instanceof String) && typeof state !== 'string') {
        throw new Error('History must only contain strings');
      }
    }
    const currentState = history.at(-1);
    if (!currentState) {
      throw new Error('History must not be empty');
    }
    for (const t of this.transitions) {
      if (t.from === currentState || t.to === currentState) {
        this.history = history;
        return;
      }
    }
    throw new Error(
      `Given history with current state '${currentState}' is incompatible with SM`
    );
  }
}
