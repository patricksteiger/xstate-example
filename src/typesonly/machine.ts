import { assign, createMachine } from 'xstate';

export interface Context {
  states: string[];
}

export type Event =
  | { type: 'ACTIVATE'; value: 'test' }
  | { type: 'PUBLISH' }
  | { type: 'RETIRE' }
  | { type: 'REDRAFT' };

export type TState = {
  value: 'draft' | 'active' | 'retired';
  context: Context;
};

export enum States {
  ACTIVE = 'active',
  DRAFT = 'draft',
  RETIRED = 'retired',
}

const persistState = assign<Context, Event>({
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

export const machine = createMachine<Context, Event, TState>(
  {
    id: 'instrument',
    //schema: { events: {} as Event, context: {} as Context },
    initial: 'draft',
    // history: 'deep',
    states: {
      draft: {
        on: { PUBLISH: { target: 'active', actions: ['persistState'] } },
      },
      beta: {
        on: { ACTIVATE: { target: 'active', actions: ['persistState'] } },
      },
      active: {
        on: {
          RETIRE: {
            target: '#instrument.retired',
            actions: ['persistState'],
          },
          REDRAFT: { target: 'draft', actions: ['persistState'] },
        },
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
