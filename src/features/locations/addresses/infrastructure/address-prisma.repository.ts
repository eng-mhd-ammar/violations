import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/database/prisma.service.js';

import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';

import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

import {
    Address,
    type AddressAttributes,
} from '../domain/address.model.js';

import { AddressRepository } from '../domain/address.repository.js';

@Injectable()
export class AddressPrismaRepository
    extends BaseRepository<Address, AddressAttributes>
    implements AddressRepository
{
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super(
            prisma.db.orm.public.Address,
        );
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'stateId',
            'city',
            'street',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'stateId',
            'city',
            'street',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'state',
        ];
    }

    protected allowedFields(): string[] {
        return [];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt',
        ];
    }

    async create(
        address: Address,
    ): Promise<Address> {

        const data =
            address.toAttributes();

        return this.createRecord(data);
    }

    async all(
        options: QueryOptions = {},
    ): Promise<any> {

        const builder =
            this.createQuery(options);

        const records =
            await builder.all();

        const addresses =
            records.map(
                (record: AddressAttributes) =>
                    this.toDomain(record),
            );

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return addresses;
        }

        const page =
            options.page ?? 1;

        const perPage =
            options.perPage ?? 10;

        const total =
            addresses.length;

        const start =
            (page - 1) * perPage;

        const items =
            addresses.slice(
                start,
                start + perPage,
            );

        return {
            items,
            pagination: {
                currentPage: page,
                perPage,
                total,
                lastPage:
                    Math.ceil(
                        total / perPage,
                    ),
            },
        };
    }

    async first(
        options: QueryOptions = {},
    ): Promise<Address | null> {

        return super.first(options);
    }

async find(
    id: number,
    options: QueryOptions = {},
): Promise<Address | null> {

    console.log('FIND OPTIONS:', options);

    const builder =
        this.createQuery(options);

    const record =
        await builder
            .getQuery()
            .where({
                id,
            })
            .first();

    console.log('RAW RECORD:', record);

    if (!record) {
        return null;
    }

    return this.toDomain(record);
}

    async update(
        id: number,
        data: Partial<AddressAttributes>,
    ): Promise<Address> {

        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(data),
            );

        if (!updated) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return updated;
    }

    async delete(
        id: number,
    ): Promise<Address> {

        const deleted =
            await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return deleted;
    }

    async restore(
        id: number,
    ): Promise<Address> {

        const restored =
            await this.restoreRecord(id);

        if (!restored) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return restored;
    }

    async forceDelete(
        id: number,
    ): Promise<Address> {

        const deleted =
            await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return deleted;
    }

    protected toDomain(
        data: AddressAttributes,
    ): Address {

        return new Address(data);
    }

    private toPrismaUpdateData(
        data: Partial<AddressAttributes>,
    ): Record<string, unknown> {

        return {
            ...(data.stateId !== undefined && {
                stateId: data.stateId,
            }),

            ...(data.city !== undefined && {
                city: data.city,
            }),

            ...(data.street !== undefined && {
                street: data.street,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}