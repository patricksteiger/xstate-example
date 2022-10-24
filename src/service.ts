import { createMachine, interpret, State } from 'xstate';

export const runServiceExample = (machine: any) => {
  let currentState = machine.initialState;

  // persist initial state
  let store = JSON.stringify(currentState);

  currentState = State.create(JSON.parse(store));
  const service = interpret(machine).start(currentState);

  currentState = service.send('PUBLISH');

  store = JSON.stringify(currentState);

  currentState = State.create(JSON.parse(store));
  const otherService = interpret(machine).start(currentState);

  currentState = otherService.send('REDRAFT');

  store = JSON.stringify(currentState);

  currentState = State.create(JSON.parse(store));
  const machine2 = createMachine(
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
        persistState: (context: any, event: any) => {
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

  const sndService = interpret(machine2).start(currentState);

  currentState = sndService.send('PUBLISH');
  console.log(JSON.stringify(currentState));
  currentState = sndService.send('BETA');
  currentState = sndService.send('ACTIVATE');
  currentState = sndService.send('RETIRE');

  let s = currentState;
  while (s) {
    console.log(s.value);
    s = s.history;
  }
};
