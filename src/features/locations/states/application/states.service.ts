import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    State,
    StateAttributes,
} from '../domain/state.model.js';

import { StateRepository } from '../domain/state.repository.js';

import { CreateStateDto } from '../presentation/http/dto/create-state.dto.js';
import { UpdateStateDto } from '../presentation/http/dto/update-state.dto.js';

@Injectable()
export class StatesService {

    constructor(
        private readonly stateRepository: StateRepository,
    ) {}

    /**
     * Create a new state
     */
    async create(
        dto: CreateStateDto,
    ): Promise<State> {

        const existingName =
            await this.stateRepository.findByName(dto.name);

        if (existingName) {
            throw new ConflictException(
                'State name is already in use',
            );
        }

        const state = new State({
            name: dto.name,
        });

        return this.stateRepository.create(state);
    }

    /**
     * Get all states
     */
    async findAll(): Promise<State[]> {

        return this.stateRepository.findAll();

    }

    /**
     * Get state by ID
     */
    async findById(id: number): Promise<State> {

        const state =
            await this.stateRepository.findById(id);

        if (!state) {
            throw new NotFoundException(
                `State with id ${id} not found`,
            );
        }

        return state;
    }

    /**
     * Update state
     */
    async update(
        id: number,
        dto: UpdateStateDto,
    ): Promise<State> {

        const state = await this.findById(id);

        /**
         * Check name uniqueness only when
         * the name is actually changed.
         */
        if (
            dto.name !== undefined &&
            dto.name !== state.name
        ) {

            const existingName =
                await this.stateRepository.findByName(
                    dto.name,
                );

            if (
                existingName &&
                existingName.id !== id
            ) {
                throw new ConflictException(
                    'State name is already in use',
                );
            }
        }

        /**
         * Apply domain mutations.
         */
        if (dto.name !== undefined) {
            state.changeName(dto.name);
        }

        /**
         * Persist the updated domain entity.
         */
        const data: Partial<StateAttributes> = {
            name: state.name,
        };

        return this.stateRepository.update(
            id,
            data,
        );
    }

    /**
     * Soft delete state
     */
    async delete(id: number): Promise<State> {

        const state = await this.findById(id);

        await this.stateRepository.delete(id);

        return state;
    }

    /**
     * Restore soft-deleted state
     */
    async restore(id: number): Promise<State> {

        const state =
            await this.stateRepository
                .findByIdIncludingDeleted(id);

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
     * Force delete state
     */
    async forceDelete(
        id: number,
    ): Promise<State> {

        const state = await this.findById(id);

        await this.stateRepository.forceDelete(id);

        return state;
    }
}