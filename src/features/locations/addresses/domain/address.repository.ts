import { Address } from './address.model.js';
import type { AddressAttributes } from './address.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const ADDRESS_REPOSITORY = Symbol('ADDRESS_REPOSITORY');

export abstract class AddressRepository {
    abstract create(address: Address): Promise<Address>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number | undefined, options?: QueryOptions): Promise<Address | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Address | null>;

    abstract first(options?: QueryOptions): Promise<Address | null>;

    abstract update(id: number | undefined, data: Partial<AddressAttributes>): Promise<Address>;

    abstract delete(id: number | undefined): Promise<Address>;

    abstract restore(id: number | undefined): Promise<Address>;

    abstract forceDelete(id: number | undefined): Promise<Address>;
}