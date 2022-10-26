import { interpret, State } from 'xstate';
import { machine } from './typgen/machine';

const service = interpret(machine).start();
let state = service.send('PUBLISH');
state = service.send('REDRAFT');
state = service.send('PUBLISH');
state = State.create(JSON.parse(JSON.stringify(state)));
const sndService = interpret(machine).start(state);
state = sndService.send('REDRAFT');
state = sndService.send('PUBLISH');
console.log(`service: ${JSON.stringify(service.status)}`);
console.log(`historyValue: ${JSON.stringify(state.historyValue)}`);
while (true) {
  console.log(`State: ${state.value}`);
  if (state.history === undefined) {
    break;
  }
  state = state.history;
}
