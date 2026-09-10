import {
    Address,
    AddressAttributes,
} from './address.model.js';

export abstract class AddressRepository {
    abstract create(address: Address): Promise<Address>;

    abstract findAll(): Promise<Address[]>;

    abstract findById(id: number): Promise<Address | null>;

    abstract findByIdIncludingDeleted(
        id: number,
    ): Promise<Address | null>;

    abstract update(
        id: number,
        data: Partial<AddressAttributes>,
    ): Promise<Address>;

    abstract delete(id: number): Promise<Address>;

    abstract restore(id: number): Promise<Address>;

    abstract forceDelete(id: number): Promise<Address>;
}