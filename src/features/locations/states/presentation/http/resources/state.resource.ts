import { AddressResource } from '../../../../addresses/presentation/http/resources/address.resource.js';
import { State } from '../../../domain/state.model.js';

export interface StateResourceData {
    id: number | undefined;
    name: string;
    addresses?: unknown[];
}

export class StateResource {

    static make(state: State, includes: string[] = []): StateResourceData {
        const resource: StateResourceData = {
            id: state.id,
            name: state.name,
        };

        if (includes.includes('addresses')) {
            resource.addresses =
                AddressResource.collection(
                    state.addresses,
                );
        }

        return resource;
    }

    static collection(states: State[], includes: string[] = []): StateResourceData[] {
        return states.map(
            (state) =>
                this.make(
                    state,
                    includes,
                ),
        );
    }
}