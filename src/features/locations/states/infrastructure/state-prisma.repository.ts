import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { State, StateAttributes } from '../domain/state.model.js';
import { StateRepository } from '../domain/state.repository.js';

@Injectable()
export class StatePrismaRepository implements StateRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(state: State): Promise<State> {
        const data = state.toAttributes();

        const created =
            await this.prisma.db.orm.public.State.create({
                name: data.name,
            });

        return this.toDomain(created);
    }

    async findAll(): Promise<State[]> {
        const states =
            await this.prisma.db.orm.public.State
                .where({
                    deletedAt: null,
                })
                .all();

        return states.map((state) =>
            this.toDomain(state),
        );
    }

    async findById(id: number): Promise<State | null> {
        const state =
            await this.prisma.db.orm.public.State
                .where({
                    id,
                    deletedAt: null,
                })
                .first();

        if (!state) {
            return null;
        }

        return this.toDomain(state);
    }

    async findByIdIncludingDeleted(
        id: number,
    ): Promise<State | null> {
        const state =
            await this.prisma.db.orm.public.State
                .where({ id })
                .first();

        if (!state) {
            return null;
        }

        return this.toDomain(state);
    }

    async findByName(name: string): Promise<State | null> {
        const state =
            await this.prisma.db.orm.public.State
                .where({
                    name,
                    deletedAt: null,
                })
                .first();

        if (!state) {
            return null;
        }

        return this.toDomain(state);
    }

    async update(
        id: number,
        data: Partial<StateAttributes>,
    ): Promise<State> {
        const updateData =
            this.toPrismaUpdateData(data);

        const updated =
            await this.prisma.db.orm.public.State
                .where({
                    id,
                    deletedAt: null,
                })
                .update(updateData);

        if (!updated) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return this.toDomain(updated);
    }

    async delete(id: number): Promise<State> {
        const deleted =
            await this.prisma.db.orm.public.State
                .where({
                    id,
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date().toISOString(),
                });

        if (!deleted) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    async restore(id: number): Promise<State> {
        const restored =
            await this.prisma.db.orm.public.State
                .where({ id })
                .update({
                    deletedAt: null,
                });

        if (!restored) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return this.toDomain(restored);
    }

    async forceDelete(id: number): Promise<State> {
        const deleted =
            await this.prisma.db.orm.public.State
                .where({ id })
                .delete();

        if (!deleted) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    private toPrismaUpdateData(
        data: Partial<StateAttributes>,
    ): Partial<StateAttributes> {
        return {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    private toDomain(data: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    }): State {
        return new State({
            id: data.id,
            name: data.name,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}