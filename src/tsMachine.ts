import { createMachine, interpret } from 'xstate';

export interface Context {
  states: string[];
}

export type Event =
  | { type: 'ACTIVATE'; value: 'test' }
  | { type: 'BETA' }
  | { type: 'PUBLISH' }
  | { type: 'RETIRE' }
  | { type: 'REDRAFT' };

type State = {
  value: 'beta' | 'draft' | 'active' | 'retired';
  context: Context;
};

export const machine2 = createMachine<Context, Event, State>(
  {
    id: 'instrument2',
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
            target: '#instrument2.retired',
            actions: ['persistState'],
          },
          REDRAFT: { target: 'draft', actions: ['persistState'] },
          BETA: { target: 'beta', actions: ['persistState'] },
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
        vec.push(event);
        console.log(context.states);
      },
    },
  }
);

const service = interpret(machine2).start();
const state = service.send('ACTIVATE');
console.log(state.matches('active'));
