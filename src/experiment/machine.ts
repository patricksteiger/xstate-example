import { StateMachine } from './state.machine';

export type State = 'draft' | 'active' | 'retired';
export type Event = 'publish' | 'redraft' | 'retire';
export type Transition = { from: State; cause: Event; to: State };

const transitions: Transition[] = [
  { from: 'draft', cause: 'publish', to: 'active' },
  { from: 'active', cause: 'retire', to: 'retired' },
  { from: 'active', cause: 'redraft', to: 'draft' },
];

export const machine = new StateMachine<State, Event>(['draft'], transitions);
