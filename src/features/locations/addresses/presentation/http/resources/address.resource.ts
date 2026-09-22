import { StateResource } from '../../../../states/presentation/http/resources/state.resource.js';
import { Address } from '../../../domain/address.model.js';

export interface AddressResourceData {
    id: number | undefined;
    city: string;
    street: string;

    state?: ReturnType<typeof StateResource.make>;
}

export class AddressResource {

    static make(address: Address): AddressResourceData {

        const resource: AddressResourceData = {
            id: address.id,
            city: address.city,
            street: address.street,
        };

        if (address.state) {
            resource.state = StateResource.make(address.state);
        }

        return resource;
    }

    static collection(addresses: Address[]): AddressResourceData[] {
        return addresses.map(
            (address) =>
                this.make(address),
        );
    }
}