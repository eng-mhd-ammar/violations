import { Injectable } from '@nestjs/common';

import { AddressRepository } from '../domain/address.repository.js';

import { PrismaService } from '../../../../core/database/prisma.service.js';

import {
    Address,
    AddressAttributes,
} from '../domain/address.model.js';

import { State } from '../../states/domain/state.model.js';

@Injectable()
export class AddressPrismaRepository
    implements AddressRepository
{
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    // ============================================================
    // Create
    // ============================================================

    async create(address: Address): Promise<Address> {
        const data = address.toAttributes();

        const created =
            await this.prisma.db.orm.public.Address.create({
                stateId: data.stateId,
                city: data.city,
                street: data.street,
            });

        return this.toDomain(created);
    }

    // ============================================================
    // Find All
    // ============================================================

    async findAll(): Promise<Address[]> {
        const addresses =
            await this.prisma.db.orm.public.Address
                .where({
                    deletedAt: null,
                })
                .include('state')
                .all();

        return addresses.map((address) =>
            this.toDomain(address),
        );
    }

    // ============================================================
    // Find By ID
    // ============================================================

    async findById(
        id: number,
    ): Promise<Address | null> {
        const address =
            await this.prisma.db.orm.public.Address
                .where({
                    id,
                    deletedAt: null,
                })
                .include('state')
                .first();

        if (!address) {
            return null;
        }

        return this.toDomain(address);
    }

    // ============================================================
    // Find By ID Including Deleted
    // ============================================================

    async findByIdIncludingDeleted(
        id: number,
    ): Promise<Address | null> {
        const address =
            await this.prisma.db.orm.public.Address
                .where({
                    id,
                })
                .include('state')
                .first();

        if (!address) {
            return null;
        }

        return this.toDomain(address);
    }

    // ============================================================
    // Update
    // ============================================================

    async update(
        id: number,
        data: Partial<AddressAttributes>,
    ): Promise<Address> {
        const updateData =
            this.toPrismaUpdateData(data);

        const updated =
            await this.prisma.db.orm.public.Address
                .where({
                    id,
                    deletedAt: null,
                })
                .update(updateData);

        if (!updated) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        const address = await this.findById(id);

        if (!address) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return address;
    }

    // ============================================================
    // Soft Delete
    // ============================================================

    async delete(id: number): Promise<Address> {
        const deleted =
            await this.prisma.db.orm.public.Address
                .where({
                    id,
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date().toISOString(),
                });

        if (!deleted) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    // ============================================================
    // Restore
    // ============================================================

    async restore(id: number): Promise<Address> {
        const restored =
            await this.prisma.db.orm.public.Address
                .where({
                    id,
                })
                .update({
                    deletedAt: null,
                });

        if (!restored) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        const address = await this.findById(id);

        if (!address) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return address;
    }

    // ============================================================
    // Force Delete
    // ============================================================

    async forceDelete(id: number): Promise<Address> {
        const deleted =
            await this.prisma.db.orm.public.Address
                .where({
                    id,
                })
                .delete();

        if (!deleted) {
            throw new Error(
                `Address with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    // ============================================================
    // Prisma Update Data
    // ============================================================

    private toPrismaUpdateData(
        data: Partial<AddressAttributes>,
    ): {
        stateId?: number;
        city?: string;
        street?: string;
        deletedAt?: string | null;
    } {
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

    // ============================================================
    // To Domain
    // ============================================================

    private toDomain(
        data: {
            id: number;
            stateId: number;
            city: string;
            street: string;
            createdAt: string;
            updatedAt: string;
            deletedAt: string | null;
            state?: {
                [key: string]: unknown;
            } | null;
        },
    ): Address {
        const state = data.state;

        return new Address({
            id: data.id,

            stateId: data.stateId,

            state:
                state &&
                typeof state.id === 'number' &&
                typeof state.name === 'string'
                    ? new State({
                          id: state.id,
                          name: state.name,
                          createdAt:
                              typeof state.createdAt ===
                              'string'
                                  ? state.createdAt
                                  : undefined,
                          updatedAt:
                              typeof state.updatedAt ===
                              'string'
                                  ? state.updatedAt
                                  : undefined,
                          deletedAt:
                              typeof state.deletedAt ===
                              'string'
                                  ? state.deletedAt
                                  : null,
                      })
                    : null,

            city: data.city,
            street: data.street,

            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}