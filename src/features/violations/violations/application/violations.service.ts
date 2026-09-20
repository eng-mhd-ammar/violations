import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Violation } from '../domain/violation.model.js';
import type { ViolationAttributes } from '../domain/violation.model.js';
import { VIOLATION_REPOSITORY } from '../domain/violation.repository.js';
import type { ViolationRepository } from '../domain/violation.repository.js';
import { CreateViolationDto } from '../presentation/http/dto/create-violation.dto.js';
import { UpdateViolationDto } from '../presentation/http/dto/update-violation.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

@Injectable()
export class ViolationsService {
    constructor(@Inject(VIOLATION_REPOSITORY) private readonly violationRepository: ViolationRepository) {}

    async create(dto: CreateViolationDto): Promise<Violation> {
        const violation = new Violation(dto);

        return this.violationRepository.create(violation);
    }

    async findAll(options: QueryOptions = {}) {
        return this.violationRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Violation> {
        const violation =
            await this.violationRepository.find(id, options);

        if (!violation) {
            throw new NotFoundException(`Violation with id ${id} not found`);
        }

        return violation;
    }

    async update(id: number, dto: UpdateViolationDto): Promise<Violation> {
        const violation = await this.findById(id);

        violation.update(dto);

        return this.violationRepository.update(id, violation.getUpdateAttributes());
    }

    async delete(id: number): Promise<Violation> {
        await this.findById(id);

        return this.violationRepository.delete(id);
    }

    async restore(id: number): Promise<Violation> {
        const violation = await this.violationRepository.find(id, { trashed: 'only' });

        if (!violation) {
            throw new NotFoundException(`Violation with id ${id} not found`);
        }

        if (!violation.deletedAt) {
            return violation;
        }

        const activeViolation = await this.violationRepository.findOneBy({ violationNumber: violation.violationNumber, deletedAt: null });

        if (activeViolation) {
            throw new ConflictException(`Cannot restore violation "${violation.violationNumber}" because an active violation with the same violation number already exists.`);
        }

        return this.violationRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Violation> {
        // await this.findById(id);

        return this.violationRepository.forceDelete(id);
    }
}