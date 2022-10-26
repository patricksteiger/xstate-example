import { machine, State } from './machine';
import { updatedMachine, UpdatedState } from './updatedMachine';

machine.transition('publish');
if (machine.matches('active') && !machine.can('publish')) {
  console.log(`State ${machine.getState()} can't be published`);
}
const changed = machine.transition('publish');
if (!changed) {
  console.log(`State wasn't changed after wrong event`);
}
let store = JSON.stringify(machine.getHistory());
let history = JSON.parse(store);
machine.parseHistory(history);

machine.transition('redraft');

const arr: State[] = ['active', 'draft', 'retired'];
const isMatch = machine.matchesSome(arr);
if (isMatch) {
  console.log(`State is ${machine.getState()} and array is [${arr}]`);
}

machine.transition('publish');

store = JSON.stringify(machine.getHistory());
history = JSON.parse(store);

updatedMachine.parseHistory(history);

updatedMachine.transition('beta');
updatedMachine.transition('activate');
updatedMachine.transition('retire');

console.log(updatedMachine.getState());
console.log(updatedMachine.getHistory());
const updatedArr: UpdatedState[] = ['retired', 'beta'];
const updatedIsMatch = updatedArr.some((s) => updatedMachine.matches(s));
if (updatedIsMatch) {
  console.log(
    `Updated state is ${updatedMachine.getState()} and array is [${updatedArr}]`
  );
}
//console.log(JSON.stringify(sm));
