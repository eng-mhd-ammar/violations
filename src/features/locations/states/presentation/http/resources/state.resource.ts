import { AddressResource } from '../../../../addresses/presentation/http/resources/address.resource.js';
import { State } from '../../../domain/state.model.js';

export interface StateResourceData {
    id: number | undefined;
    name: string;
    addresses?: ReturnType<typeof AddressResource.make>[];
}

export class StateResource {

    static make(state: State): StateResourceData {

        const resource: StateResourceData = {
            id: state.id,
            name: state.name,
        };

        if (state.addresses) {
            resource.addresses = AddressResource.collection(state.addresses);
        }

        return resource;
    }

    static collection(states: State[]): StateResourceData[] {
        return states.map(
            (state) =>
                this.make(state),
        );
    }
}