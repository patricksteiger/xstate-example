import { createMachine } from 'xstate';

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

export const machine = createMachine<Context, Event, TState>(
  {
    id: 'instrument',
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
      persistState: (context: Context, event: Event) => {
        const vec: any[] = context.states;
        if (!event.type || vec.at(-1) === event.type) {
          return;
        }
        vec.push(event.type);
        console.log(context.states);
      },
    },
  }
);
