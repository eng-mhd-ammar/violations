import { StateResource } from '../../../../states/presentation/http/resources/state.resource.js';

import { Address } from '../../../domain/address.model.js';

export interface AddressResourceData {
    id: number | undefined;
    city: string;
    street: string;
    state?: ReturnType<typeof StateResource.make> | null;

}

export class AddressResource {
    static make(address: Address, includes: string[] = []): AddressResourceData {
        const resource: AddressResourceData = {
            id: address.id,
            city: address.city,
            street: address.street,
        };

        if (includes.includes('state')) {
            resource.state = address.state? StateResource.make(address.state, includes): null;
        }

        return resource;
    }

    static collection(addresses: Address[], includes: string[] = []): AddressResourceData[] {

        return addresses.map(
            (address) =>
                this.make(
                    address,
                    includes,
                ),
        );

    }

}