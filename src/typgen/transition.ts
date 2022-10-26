import { State } from 'xstate';
import { Context, Event, machine } from './machine';
import { Typegen0 } from './machine.typegen';
import { UpdatedContext, UpdatedEvent, updatedMachine } from './updatedMachine';

let state = machine.initialState;
state = machine.transition(state, 'PUBLISH');
if (state.matches('active') && !state.can('PUBLISH')) {
  console.log(`State ${state.value} can't be published`);
}

state = machine.transition(state, 'PUBLISH');
if (!state.changed) {
  console.log(`State wasn't changed after wrong event`);
}

let stateStore = JSON.stringify(state);
let sndState = State.create<Context, Event>(JSON.parse(stateStore));

sndState = machine.transition(sndState, 'REDRAFT');
const arr: Typegen0['matchesStates'][] = ['active', 'draft', 'retired'];
const isMatch = arr.some(sndState.matches);
if (isMatch) {
  console.log(`State is ${sndState.value} and array is [${arr}]`);
}

sndState = machine.transition(sndState, 'PUBLISH');

stateStore = JSON.stringify(sndState);
let thdState = State.create<UpdatedContext, UpdatedEvent>(
  JSON.parse(stateStore)
);

//thdState = machine.transition(thdState, 'RETIRE');
thdState = updatedMachine.transition(thdState, 'BETA');
thdState = updatedMachine.transition(thdState, 'ACTIVATE');
thdState = updatedMachine.transition(thdState, 'RETIRE');
