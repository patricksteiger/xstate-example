import { assign, createMachine } from 'xstate';

export interface UpdatedContext {
  states: string[];
}

export type UpdatedEvent =
  | { type: 'ACTIVATE'; value: 'test' }
  | { type: 'BETA' }
  | { type: 'PUBLISH' }
  | { type: 'RETIRE' }
  | { type: 'REDRAFT' };

export type UpdatedTState = {
  value: 'beta' | 'draft' | 'active' | 'retired';
  context: UpdatedContext;
};

const persistState = assign<UpdatedContext, UpdatedEvent>({
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

export const updatedMachine = createMachine<
  UpdatedContext,
  UpdatedEvent,
  UpdatedTState
>(
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
      persistState,
    },
  }
);
