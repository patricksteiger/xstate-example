import { StateMachine } from './state.machine';

export type UpdatedState = 'draft' | 'active' | 'retired' | 'beta';
export type UpdatedEvent =
  | 'publish'
  | 'redraft'
  | 'retire'
  | 'beta'
  | 'activate';
export type UpdatedTransition = {
  from: UpdatedState;
  cause: UpdatedEvent;
  to: UpdatedState;
};

const transitions: UpdatedTransition[] = [
  { from: 'draft', cause: 'publish', to: 'active' },
  { from: 'active', cause: 'retire', to: 'retired' },
  { from: 'active', cause: 'redraft', to: 'draft' },
  { from: 'active', cause: 'beta', to: 'beta' },
  { from: 'beta', cause: 'activate', to: 'active' },
];

export const updatedMachine = new StateMachine<UpdatedState, UpdatedEvent>(
  ['draft'],
  transitions
);
