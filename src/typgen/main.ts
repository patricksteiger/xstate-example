import { interpret, State } from 'xstate';
import { Context, Event, machine, States, TState } from './machine';
import { Typegen0 } from './machine.typegen';
import { UpdatedContext, UpdatedEvent, updatedMachine } from './updatedMachine';

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

//console.log('Keys: ' + Object.keys(machine.states));
const arr: Typegen0['matchesStates'][] = ['active', 'draft', 'retired'];
//const arr: TState[] = ['active', 'draft', 'retired'];
//const arr = [States.ACTIVE, States.DRAFT, States.RETIRED];
const isMatch = arr.some(sndState.matches);
if (isMatch) {
  console.log(`State is ${sndState.value} and array is [${arr}]`);
}

sndState = sndService.send('PUBLISH');

stateStore = JSON.stringify(sndState);
let thdState = State.create<UpdatedContext, UpdatedEvent>(
  JSON.parse(stateStore)
);

//const updatedService = interpret(machine).start(thdState);
const updatedService = interpret(updatedMachine).start(thdState);

thdState = updatedService.send('BETA');
thdState = updatedService.send('ACTIVATE');
thdState = updatedService.send('RETIRE');
