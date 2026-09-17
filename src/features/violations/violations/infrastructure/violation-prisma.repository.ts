import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { Violation, type ViolationAttributes } from '../domain/violation.model.js';
import { ViolationRepository } from '../domain/violation.repository.js';

@Injectable()
export class ViolationPrismaRepository extends BaseRepository<Violation, ViolationAttributes> implements ViolationRepository
{
    constructor(private readonly prisma: PrismaService) {
        super(
            prisma.db.orm.public.Violation,
        );
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'violationNumber',
            'plateNumber',
            'plateCode',
            'plateCategory',
            'make',
            'status',
            'fineAmount',
            'violationDate',
            'location',
            'cancelledAt',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'violationNumber',
            'citizenId',
            'violationTypeId',
            'branchId',
            'officerId',
            'paidCurrencyId',
            'plateNumber',
            'plateCode',
            'plateCategory',
            'vehicleType',
            'make',
            'model',
            'color',
            'manufactureYear',
            'status',
            'fineAmount',
            'violationDate',
            'location',
            'cancelledAt',
            'createdAt',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'citizen',
            'violationType',
            'branch',
            'officer',
            'paidCurrency',
        ];
    }

    protected allowedFields(): string[] {
        return [];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt',
        ];
    }

    async create(violation: Violation): Promise<Violation> {
        const data = violation.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);

        const records = await builder.all();

        let violations =
            records.map(
                (record: ViolationAttributes) =>
                    this.toDomain(record),
            );

        /*
        * =========================
        * PAGINATION
        * =========================
        */

        if (options.paginate === false) {
            return violations;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = violations.length;

        const start = (page - 1) * perPage;

        const items = violations.slice(start, start + perPage);

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

    async first(options: QueryOptions = {}): Promise<Violation | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<Violation | null> {
        return super.find(
            id,
            options,
        );
    }

    async update(id: number, data: Partial<ViolationAttributes>): Promise<Violation> {
        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(
                    data,
                ),
            );

        if (!updated) {
            throw new Error(
                `Violation with id ${id} not found`,
            );
        }

        return updated;
    }

    async delete(id: number): Promise<Violation> {
        const deleted =
            await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `Violation with id ${id} not found`,
            );
        }

        return deleted;
    }

    async restore(id: number): Promise<Violation> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`Violation with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<Violation> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Violation with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: ViolationAttributes): Violation {
        return new Violation(data);
    }

    private toPrismaUpdateData(data: Partial<ViolationAttributes>): Record<string, unknown> {
        return {
            ...(data.violationNumber !== undefined && {
                violationNumber: data.violationNumber,
            }),
            
            ...(data.citizenId !== undefined && {
                citizenId: data.citizenId,
            }),
            
            ...(data.violationTypeId !== undefined && {
                violationTypeId: data.violationTypeId,
            }),
            
            ...(data.branchId !== undefined && {
                branchId: data.branchId,
            }),
            
            ...(data.officerId !== undefined && {
                officerId: data.officerId,
            }),
            
            ...(data.paidCurrencyId !== undefined && {
                paidCurrencyId: data.paidCurrencyId,
            }),
            
            ...(data.plateNumber !== undefined && {
                plateNumber: data.plateNumber,
            }),
            
            ...(data.plateCode !== undefined && {
                plateCode: data.plateCode,
            }),
            
            ...(data.plateCategory !== undefined && {
                plateCategory: data.plateCategory,
            }),
            
            ...(data.vehicleType !== undefined && {
                vehicleType: data.vehicleType,
            }),
            
            ...(data.make !== undefined && {
                make: data.make,
            }),
            
            ...(data.model !== undefined && {
                model: data.model,
            }),
            
            ...(data.color !== undefined && {
                color: data.color,
            }),
            
            ...(data.manufactureYear !== undefined && {
                manufactureYear: data.manufactureYear,
            }),
            
            ...(data.status !== undefined && {
                status: data.status,
            }),
            
            ...(data.fineAmount !== undefined && {
                fineAmount: data.fineAmount,
            }),
            
            ...(data.violationDate !== undefined && {
                violationDate: data.violationDate,
            }),
            
            ...(data.location !== undefined && {
                location: data.location,
            }),
            
            ...(data.cancelledAt !== undefined && {
                cancelledAt: data.cancelledAt,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}