import { createMachine, interpret } from 'xstate';

export interface Context {
  states: string[];
}

export type Event =
  | { type: 'PUBLISH' }
  | { type: 'RETIRE' }
  | { type: 'REDRAFT' };

type State =
  | { value: 'draft'; context: Context }
  | { value: 'active'; context: Context }
  | { value: 'retired'; context: Context };

interface TSTypes {
  '@@xstate/typegen': false;
  eventsCausingActions: {
    persistState: 'PUBLISH' | 'REDRAFT' | 'RETIRE' | 'xstate.stop';
  };
  matchesStates: 'active' | 'draft' | 'retired';
}

export const machine = createMachine(
  {
    schema: { context: {} as Context, events: {} as Event },
    tsTypes: {} as import('./firstMachine.typegen').Typegen0,
    id: 'instrument',
    initial: 'draft',
    // history: "deep",
    states: {
      draft: {
        on: { PUBLISH: { target: 'active' } },
        exit: ['persistState'],
      },
      active: {
        on: {
          RETIRE: { target: '#instrument.retired' },
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

const completeService = interpret(machine).start();
let completeState = completeService.send('PUBLISH');
completeState.matches('retired');
completeState.can('REDRAFT');
