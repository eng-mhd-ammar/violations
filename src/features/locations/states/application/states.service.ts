import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { State } from '../domain/state.model.js';
import type { StateAttributes } from '../domain/state.model.js';
import { STATE_REPOSITORY } from '../domain/state.repository.js';
import type { StateRepository } from '../domain/state.repository.js';
import { CreateStateDto } from '../presentation/http/dto/create-state.dto.js';
import { UpdateStateDto } from '../presentation/http/dto/update-state.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

import { StateResource } from '../presentation/http/resources/state.resource.js';

@Injectable()
export class StatesService {

    constructor(
        @Inject(STATE_REPOSITORY)
        private readonly stateRepository: StateRepository,
    ) {}

    async create(dto: CreateStateDto): Promise<State> {
        const state = new State(dto);

        return this.stateRepository.create(state);
    }

    async findAll(options: QueryOptions = {}) {
        return this.stateRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<State> {

        const state =
            await this.stateRepository.find(id, options);

        if (!state) {
            throw new NotFoundException(
                `State with id ${id} not found`,
            );
        }

        return state;
    }

    async update(id: number, dto: UpdateStateDto): Promise<State> {

        const state = await this.findById(id);

        if (dto.name !== undefined) {
            state.changeName(dto.name);
        }

        const data: Partial<StateAttributes> = {
            name: state.name,
        };

        return this.stateRepository.update(id, data);
    }

    async delete(id: number): Promise<State> {
        await this.findById(id);

        return this.stateRepository.delete(id);
    }

    async restore(id: number): Promise<State> {

        const state =
            await this.stateRepository.find(
                id,
                { trashed: 'only' },
            );

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

    async forceDelete(id: number): Promise<State> {
        await this.findById(id);

        return this.stateRepository.forceDelete(id);
    }
}