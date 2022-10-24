import { createMachine } from 'xstate';

export interface UpdatedContext {
  states: string[];
}

export type UpdatedEvent =
  | { type: 'ACTIVATE' }
  | { type: 'BETA' }
  | { type: 'PUBLISH' }
  | { type: 'RETIRE' }
  | { type: 'REDRAFT' };

export const updatedMachine = createMachine(
  {
    id: 'instrument2',
    schema: { events: {} as UpdatedEvent, context: {} as UpdatedContext },
    tsTypes: {} as import('./updatedMachine.typegen').Typegen0,
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
      persistState: (context, event) => {
        const vec: string[] = context.states;
        if (!event.type || vec.at(-1) === event.type) {
          return;
        }
        vec.push(event.type);
        console.log(context.states);
      },
    },
  }
);
