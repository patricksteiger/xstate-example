import { State } from 'xstate';

export const runMachineExample = (machine: any) => {
  let currentState = machine.initialState;
  console.log(currentState.nextEvents);
  if (currentState.matches('draft')) {
    console.log('state matched draft');
  }
  if (currentState.can('PUBLISH')) {
    console.log('you can publish');
  }

  let store = JSON.stringify(currentState);

  currentState = State.create(JSON.parse(store));

  currentState = machine.transition(currentState, { type: 'PUBLISH' });
  console.log(currentState.value);

  store = JSON.stringify(currentState);
  currentState = State.create(JSON.parse(store));

  currentState = machine.transition(currentState, { type: 'RETIRE' });
  console.log(currentState.value);
  console.log(currentState.context.states);
};
