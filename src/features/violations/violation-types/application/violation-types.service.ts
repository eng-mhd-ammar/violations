import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { ViolationType, ViolationTypeAttributes } from '../domain/violation-type.model.js';
import { CreateViolationTypeDto } from '../presentation/http/dto/create-violation-type.dto.js';
import { VIOLATION_TYPE_REPOSITORY, ViolationTypeRepository } from '../domain/violation-type.repository.js';
import { UpdateViolationTypeDto } from '../presentation/http/dto/update-violation-type.dto.js';

@Injectable()
export class ViolationTypesService {
    constructor(@Inject(VIOLATION_TYPE_REPOSITORY) private readonly violationTypesRepository: ViolationTypeRepository) {}

    async create(dto: CreateViolationTypeDto): Promise<ViolationType> {
        const violationTypes = new ViolationType({
            name: dto.name,
            defaultFine: dto.defaultFine,
            description: dto.description,
            isActive: dto.isActive,
        });

        return this.violationTypesRepository.create(violationTypes);
    }

    async findAll(options: QueryOptions = {}) {
        return this.violationTypesRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<ViolationType> {
        const violationTypes = await this.violationTypesRepository.find(id, options);

        if (!violationTypes) {
            throw new NotFoundException(`ViolationType with id ${id} not found`);
        }

        return violationTypes;
    }

    async update(id: number, dto: UpdateViolationTypeDto): Promise<ViolationType> {
        const violationTypes = await this.findById(id);

        if (dto.name !== undefined) {
            violationTypes.changeName(dto.name);
        }

        if (dto.defaultFine !== undefined) {
            violationTypes.changeDefaultFine(dto.defaultFine);
        }

        if (dto.description !== undefined) {
            violationTypes.changeDescription(dto.description);
        }

        if (dto.isActive !== undefined) {
            violationTypes.changeIsActive(dto.isActive);
        }

        const data: Partial<ViolationTypeAttributes> = {
            name: violationTypes.name,
            defaultFine: violationTypes.defaultFine,
            description: violationTypes.description,
            isActive: violationTypes.isActive,
        };

        return this.violationTypesRepository.update(id, data);
    }

    async delete(id: number): Promise<ViolationType> {
        await this.findById(id);

        return this.violationTypesRepository.delete(id);
    }

    async restore(id: number): Promise<ViolationType> {
        const violationTypes = await this.violationTypesRepository.find(id, { trashed: 'only' });

        if (!violationTypes) {
            throw new NotFoundException(`ViolationType with id ${id} not found`);
        }

        if (!violationTypes.deletedAt) {
            return violationTypes;
        }
        
        // Check active violationTypes with the same name
        const activeViolationTypeByName =
            await this.violationTypesRepository.findOneBy({
                name: violationTypes.name,
                deletedAt: null,
            });

        if (activeViolationTypeByName) {
            throw new ConflictException(`Cannot restore violationTypes "${violationTypes.name}" because an active violationTypes with the same name already exists.`);
        }

        return this.violationTypesRepository.restore(id);
    }

    async forceDelete(id: number): Promise<ViolationType> {
        await this.findById(id);

        return this.violationTypesRepository.forceDelete(id);
    }
}