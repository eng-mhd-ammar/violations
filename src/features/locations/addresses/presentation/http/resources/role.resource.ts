import { Address } from "../../../domain/address.model";

export class AddressResource {
    static make(address: Address) {
        return {
            id: address.id,
            stateId: address.stateId,
            city: address.city,
            street: address.street,

            state: address.state
                ? {
                      id: address.state.id,
                      name: address.state.name,
                  }
                : null,

            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
            deletedAt: address.deletedAt,
        };
    }

    static collection(addresses: Address[]) {
        return addresses.map((address) => this.make(address));
    }
}