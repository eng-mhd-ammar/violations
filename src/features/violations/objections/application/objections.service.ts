import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Objection } from '../domain/objection.model.js';
import type { ObjectionRepository } from '../domain/objection.repository.js';
import { OBJECTION_REPOSITORY } from '../domain/objection.repository.js';
import { CreateObjectionDto } from '../presentation/http/dto/create-objection.dto.js';
import { UpdateObjectionDto } from '../presentation/http/dto/update-objection.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

@Injectable()
export class ObjectionsService {
    constructor(@Inject(OBJECTION_REPOSITORY) private readonly objectionRepository: ObjectionRepository) {}

    async create(dto: CreateObjectionDto): Promise<Objection> {
        const objection = new Objection(dto);

        return this.objectionRepository.create(objection);
    }

    async findAll(options: QueryOptions = {}) {
        return this.objectionRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Objection> {
        const objection = await this.objectionRepository.find(id, options);

        if (!objection) {
            throw new NotFoundException(`Objection with id ${id} not found`);
        }

        return objection;
    }

    async update(id: number, dto: UpdateObjectionDto): Promise<Objection> {
        const objection = await this.findById(id);
        objection.update(dto);

        return this.objectionRepository.update(id, objection.toAttributes());
    }

    async delete(id: number): Promise<Objection> {
        await this.findById(id);

        return this.objectionRepository.delete(id);
    }

    async restore(id: number): Promise<Objection> {
        const objection = await this.objectionRepository.find(id, { trashed: 'only' });

        if (!objection) {
            throw new NotFoundException(`Objection with id ${id} not found`);
        }

        if (!objection.deletedAt) {
            return objection;
        }

        return this.objectionRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Objection> {
        await this.findById(id);

        return this.objectionRepository.forceDelete(id);
    }
}