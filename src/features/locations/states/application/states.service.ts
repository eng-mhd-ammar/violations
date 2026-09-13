import { Injectable, NotFoundException } from '@nestjs/common';
import { State, StateAttributes } from '../domain/state.model.js';
import { StateRepository } from '../domain/state.repository.js';
import { CreateStateDto } from '../presentation/http/dto/create-state.dto.js';
import { UpdateStateDto } from '../presentation/http/dto/update-state.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

@Injectable()
export class StatesService {
    constructor(private readonly stateRepository: StateRepository) {}

    /**
     * Create a new state.
     */
    async create(dto: CreateStateDto): Promise<State> {
        const state = new State(dto);

        return this.stateRepository.create(state);
    }

    /**
     * Get all states.
     */
    async findAll(options: QueryOptions = {}): Promise<State[]> {
        return this.stateRepository.all(options);
    }

    /**
     * Get state by ID.
     */
    async findById(id: number, options: QueryOptions = {}): Promise<State> {
        const state = await this.stateRepository.find(id, options);

        if (!state) {
            throw new NotFoundException(
                `State with id ${id} not found`,
            );
        }

        return state;
    }

    /**
     * Update state.
     */
    async update(id: number, dto: UpdateStateDto): Promise<State> {
        const state = await this.findById(id);

        if (dto.name !== undefined) {
            state.changeName(
                dto.name,
            );
        }

        const data: Partial<StateAttributes> = {
            name: state.name,
        };

        return this.stateRepository.update(id, data);
    }

    /**
     * Soft delete state.
     */
    async delete(id: number): Promise<State> {
        await this.findById(id);

        return this.stateRepository.delete(id);
    }

    /**
     * Restore state.
     */
    async restore(id: number): Promise<State> {
        const state = await this.stateRepository.find(id, { trashed: 'only' });

        if (!state) {
            throw new NotFoundException(
                `State with id ${id} not found`,
            );
        }

        if (!state.deletedAt) {
            return state;
        }

        return this.stateRepository.restore(id);
    }

    /**
     * Force delete state.
     */
    async forceDelete(id: number): Promise<State> {
        await this.findById(id);

        return this.stateRepository.forceDelete(id);
    }
}