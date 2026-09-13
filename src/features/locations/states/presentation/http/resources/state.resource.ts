import { AddressResource } from '../../../../addresses/presentation/http/resources/address.resource.js';
import { State } from '../../../domain/state.model.js';

export class StateResource {

    static make(
        state: State,
        includes: string[] = [],
    ) {
        const resource: Record<string, unknown> = {
            id: state.id,
            name: state.name,
        };

        if (
            includes.includes('addresses') &&
            state.addresses
        ) {
            resource.addresses = AddressResource.collection(
                state.addresses,
            );
        }

        return resource;
    }

    static collection(
        states: State[],
        includes: string[] = [],
    ) {
        return states.map((state) =>
            this.make(state, includes),
        );
    }
}

// import { State } from '../../../domain/state.model.js';

// export class StateResource {

//     static make(state: State) {
//         return {
//             id: state.id,
//             name: state.name,
//         };
//     }

//     static collection(states: State[]) {
//         return states.map((state) => this.make(state));
//     }
// }