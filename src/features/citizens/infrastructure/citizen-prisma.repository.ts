import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';
import { Citizen, type CitizenAttributes } from '../domain/citizen.model.js';
import { CitizenRepository } from '../domain/citizen.repository.js';

@Injectable()
export class CitizenPrismaRepository extends BaseRepository<Citizen, CitizenAttributes> implements CitizenRepository
{
    constructor(private readonly prisma: PrismaService) {
        super(
            prisma.db.orm.public.Citizen,
        );
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'nationalId',
            'firstName',
            'lastName',
            'fatherName',
            'motherName',
            'addressId',
            'dateOfBirth',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'nationalId',
            'firstName',
            'lastName',
            'fatherName',
            'motherName',
            'addressId',
            'dateOfBirth',
            'createdAt',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'address',
        ];
    }

    protected allowedFields(): string[] {
        return [
            'id',
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

    async create(citizen: Citizen): Promise<Citizen> {
        const data = citizen.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);

        const records = await builder.all();

        let citizens =
            records.map(
                (record: CitizenAttributes) =>
                    this.toDomain(record),
            );

        /*
        * =========================
        * PAGINATION
        * =========================
        */

        if (options.paginate === false) {
            return citizens;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = citizens.length;

        const start = (page - 1) * perPage;

        const items = citizens.slice(start, start + perPage);

        return {
            items,

            pagination: {
                currentPage: page,
                perPage,
                total,
                lastPage: Math.ceil(
                    total / perPage,
                ),
            },
        };
    }

    async first(options: QueryOptions = {}): Promise<Citizen | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<Citizen | null> {
        return super.find(
            id,
            options,
        );
    }

    async update(id: number, data: Partial<CitizenAttributes>): Promise<Citizen> {
        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(
                    data,
                ),
            );

        if (!updated) {
            throw new Error(
                `Citizen with id ${id} not found`,
            );
        }

        return updated;
    }

    async delete(id: number): Promise<Citizen> {
        const deleted =
            await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `Citizen with id ${id} not found`,
            );
        }

        return deleted;
    }

    async restore(id: number): Promise<Citizen> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`Citizen with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<Citizen> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Citizen with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: CitizenAttributes): Citizen {
        return new Citizen(data);
    }

    private toPrismaUpdateData(data: Partial<CitizenAttributes>): Record<string, unknown> {
        return {
            ...(data.nationalId !== undefined && {
                nationalId: data.nationalId,
            }),
            
            ...(data.firstName !== undefined && {
                firstName: data.firstName,
            }),
            
            ...(data.lastName !== undefined && {
                lastName: data.lastName,
            }),
            
            ...(data.fatherName !== undefined && {
                fatherName: data.fatherName,
            }),
            
            ...(data.motherName !== undefined && {
                motherName: data.motherName,
            }),
            
            ...(data.addressId !== undefined && {
                addressId: data.addressId,
            }),
            
            ...(data.dateOfBirth !== undefined && {
                dateOfBirth: data.dateOfBirth,
            }),
            
            ...(data.phone !== undefined && {
                phone: data.phone,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}