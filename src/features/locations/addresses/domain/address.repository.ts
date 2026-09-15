import { Address } from './address.model.js';
import type { AddressAttributes } from './address.model.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

export const ADDRESS_REPOSITORY = Symbol('ADDRESS_REPOSITORY');

export abstract class AddressRepository {

    abstract create(
        address: Address,
    ): Promise<Address>;

    abstract all(
        options?: QueryOptions,
    ): Promise<any>;

    abstract find(
        id: number,
        options?: QueryOptions,
    ): Promise<Address | null>;

    abstract findOneBy(
        conditions: Record<string, unknown>,
        options?: QueryOptions,
    ): Promise<Address | null>;

    abstract first(
        options?: QueryOptions,
    ): Promise<Address | null>;

    abstract update(
        id: number,
        data: Partial<AddressAttributes>,
    ): Promise<Address>;

    abstract delete(
        id: number,
    ): Promise<Address>;

    abstract restore(
        id: number,
    ): Promise<Address>;

    abstract forceDelete(
        id: number,
    ): Promise<Address>;
}