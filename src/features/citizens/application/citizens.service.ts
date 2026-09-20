import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Citizen } from '../domain/citizen.model.js';
import type { CitizenAttributes } from '../domain/citizen.model.js';
import { CITIZEN_REPOSITORY } from '../domain/citizen.repository.js';
import type { CitizenRepository } from '../domain/citizen.repository.js';
import { CreateCitizenDto } from '../presentation/http/dto/create-citizen.dto.js';
import { UpdateCitizenDto } from '../presentation/http/dto/update-citizen.dto.js';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';

@Injectable()
export class CitizensService {
    constructor(@Inject(CITIZEN_REPOSITORY) private readonly citizenRepository: CitizenRepository) {}

    async create(dto: CreateCitizenDto): Promise<Citizen> {
        const citizen = new Citizen(dto);

        return this.citizenRepository.create(citizen);
    }

    async findAll(options: QueryOptions = {}) {
        return this.citizenRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Citizen> {
        const citizen = await this.citizenRepository.find(id, options);

        if (!citizen) {
            throw new NotFoundException(`Citizen with id ${id} not found`);
        }

        return citizen;
    }

    async update(id: number, dto: UpdateCitizenDto): Promise<Citizen> {
        const citizen = await this.findById(id);

        if (dto.nationalId !== undefined) {
            citizen.changeNationalId(dto.nationalId);
        }

        if (dto.firstName !== undefined) {
            citizen.changeFirstName(dto.firstName);
        }

        if (dto.lastName !== undefined) {
            citizen.changeLastName(dto.lastName);
        }

        if (dto.fatherName !== undefined) {
            citizen.changeFatherName(dto.fatherName);
        }

        if (dto.motherName !== undefined) {
            citizen.changeMotherName(dto.motherName);
        }

        if (dto.addressId !== undefined) {
            citizen.changeAddressId(dto.addressId);
        }

        if (dto.dateOfBirth !== undefined) {
            citizen.changeDateOfBirth(dto.dateOfBirth);
        }

        if (dto.phone !== undefined) {
            citizen.changePhone(dto.phone);
        }

        const data: Partial<CitizenAttributes> = {
            nationalId: citizen.nationalId,
            firstName: citizen.firstName,
            lastName: citizen.lastName,
            fatherName: citizen.fatherName,
            motherName: citizen.motherName,
            addressId: citizen.addressId,
            dateOfBirth: citizen.dateOfBirth,
            phone: citizen.phone,
        };

        return this.citizenRepository.update(id, data);
    }

    async delete(id: number): Promise<Citizen> {
        await this.findById(id);

        return this.citizenRepository.delete(id);
    }

    async restore(id: number): Promise<Citizen> {
        const citizen = await this.citizenRepository.find(id, { trashed: 'only' });

        if (!citizen) {
            throw new NotFoundException(
                `Citizen with id ${id} not found`,
            );
        }

        if (!citizen.deletedAt) {
            return citizen;
        }

        const activeCitizen = await this.citizenRepository.findOneBy({ nationalId: citizen.nationalId, deletedAt: null });

        if (activeCitizen) {
            throw new ConflictException(`Cannot restore citizen "${citizen.nationalId}" because an active citizen with the same national id already exists.`);
        }

        return this.citizenRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Citizen> {
        // await this.findById(id);

        return this.citizenRepository.forceDelete(id);
    }
}