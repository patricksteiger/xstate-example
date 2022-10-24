import { interpret, State } from 'xstate';
import { Context, Event, machine, TState } from './machine';
import {
  UpdatedContext,
  UpdatedEvent,
  updatedMachine,
  UpdatedTState,
} from './updatedMachine';

const service = interpret(machine).start();

let state = service.send('PUBLISH');
if (state.matches('active') && !state.can('PUBLISH')) {
  console.log(`State ${state.value} can't be published`);
}

state = service.send('PUBLISH');
if (!state.changed) {
  console.log(`State wasn't changed after wrong event`);
}

let stateStore = JSON.stringify(state);
let sndState = State.create<Context, Event>(JSON.parse(stateStore));

const sndService = interpret(machine).start(sndState);
sndState = sndService.send('REDRAFT');

const arr: TState['value'][] = ['active', 'draft', 'retired'];
const isMatch = arr.some(sndState.matches);
if (isMatch) {
  console.log(`State is ${sndState.value} and array is [${arr}]`);
}

sndState = sndService.send('PUBLISH');

stateStore = JSON.stringify(sndState);
let thdState = State.create<UpdatedContext, UpdatedEvent>(
  JSON.parse(stateStore)
);

const updatedService = interpret(updatedMachine).start(thdState);

thdState = updatedService.send('RETIRE');
const updatedArr: UpdatedTState['value'][] = [
  'active',
  'draft',
  'retired',
  'beta',
];
const updatedIsMatch = arr.some(thdState.matches);
if (updatedIsMatch) {
  console.log(
    `Updated state is ${thdState.value} and array is [${updatedArr}]`
  );
}
