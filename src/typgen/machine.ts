import { assign, createMachine } from 'xstate';
import { Typegen0 } from './machine.typegen';

export interface Context {
  states: string[];
}

export type Event =
  | { type: 'PUBLISH' }
  | { type: 'RETIRE' }
  | { type: 'REDRAFT' };

export type TState = Typegen0['matchesStates'];

const persistState = assign<Context, Event | { type: 'xstate.stop' }>({
  states: (context, event) => {
    const vec: string[] = [...context.states];
    /*if (!event.type || vec.at(-1) === event.type) {
      console.log(`Warning: nothing was added at event ${event.type}`);
      return vec;
    }*/
    vec.push(event.type);
    console.log(vec);
    return vec;
  },
});

export enum States {
  ACTIVE = 'active',
  DRAFT = 'draft',
  RETIRED = 'retired',
}

export const machine = createMachine(
  {
    schema: {
      context: {} as Context,
      events: {} as Event,
    },
    tsTypes: {} as import('./machine.typegen').Typegen0,
    id: 'instrument',
    initial: 'draft',
    history: 'deep',
    states: {
      draft: {
        on: { PUBLISH: { target: 'active' } },
        exit: ['persistState'],
      },
      active: {
        on: {
          RETIRE: { target: 'retired' },
          REDRAFT: { target: 'draft' },
        },
        exit: ['persistState'],
      },
      retired: { type: 'final' },
    },
    predictableActionArguments: true,
    context: {
      states: [],
    },
  },
  {
    actions: {
      persistState,
    },
  }
);
