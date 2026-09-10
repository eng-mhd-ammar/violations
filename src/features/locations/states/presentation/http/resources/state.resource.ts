import { State } from '../../../domain/state.model.js';

export class StateResource {

    static make(state: State) {
        return {
            id: state.id,
            name: state.name,
        };
    }

    static collection(states: State[]) {
        return states.map((state) => this.make(state));
    }
}