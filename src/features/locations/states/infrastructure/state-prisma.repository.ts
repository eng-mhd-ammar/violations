import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { State, type StateAttributes } from '../domain/state.model.js';
import { StateRepository } from '../domain/state.repository.js';

@Injectable()
export class StatePrismaRepository extends BaseRepository<State, StateAttributes> implements StateRepository
{
    constructor(private readonly prisma: PrismaService) {
        super(
            prisma.db.orm.public.State,
        );
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'name',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'name',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'addresses',
        ];
    }

    protected allowedFields(): string[] {
        return [
            'id',
            'name',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt',
        ];
    }

    async create(state: State): Promise<State> {
        const data = state.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<State[]> {
        return super.all(options);
    }

    async first(options: QueryOptions = {}): Promise<State | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<State | null> {
        return super.find(id, options);
    }

    async update(id: number, data: Partial<StateAttributes>): Promise<State> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return updated;
    }

    async delete(id: number): Promise<State> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return deleted;
    }

    async restore(id: number): Promise<State> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return restored;
    }

    async forceDelete(id: number): Promise<State> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `State with id ${id} not found`,
            );
        }

        return deleted;
    }

    protected toDomain(data: StateAttributes): State {
        return new State(data);
    }

    private toPrismaUpdateData(data: Partial<StateAttributes>): Record<string, unknown> {
        return {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}