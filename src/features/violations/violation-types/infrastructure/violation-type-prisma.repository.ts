import { Injectable } from '@nestjs/common';
import { ViolationType, type ViolationTypeAttributes } from '../domain/violation-type.model.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { ViolationTypeRepository } from '../domain/violation-type.repository.js';

@Injectable()
export class ViolationTypePrismaRepository extends BaseRepository<ViolationType, ViolationTypeAttributes> implements ViolationTypeRepository
{
    constructor(private readonly prisma: PrismaService) {
        super(prisma.db.orm.public.ViolationType);
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'name',
            'description',
            'defaultFine',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'name',
            'description',
            'defaultFine',
            'isActive',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'violations',
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

    async create(violationType: ViolationType): Promise<ViolationType> {
        const data = violationType.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        const currencies =
            records.map(
                (record: ViolationTypeAttributes) =>
                    this.toDomain(record),
            );

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return currencies;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = currencies.length;

        const start = (page - 1) * perPage;

        const items =
            currencies.slice(
                start,
                start + perPage,
            );

        return {
            items,
            pagination: {
                currentPage: page,
                perPage,
                total,
                lastPage:
                    Math.ceil(
                        total / perPage,
                    ),
            },
        };
    }

    async first(options: QueryOptions = {}): Promise<ViolationType | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<ViolationType | null> {
        const builder = this.createQuery(options);

        const record =
            await builder
                .getQuery()
                .where({
                    id,
                })
                .first();
        
        if (!record) {
            return null;
        }

        return this.toDomain(record);
    }

    async update(id: number, data: Partial<ViolationTypeAttributes>): Promise<ViolationType> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(`ViolationType with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<ViolationType> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`ViolationType with id ${id} not found`);
        }

        return deleted;
    }

    async restore(id: number): Promise<ViolationType> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`ViolationType with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<ViolationType> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`ViolationType with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: ViolationTypeAttributes): ViolationType {
        return new ViolationType(data);
    }

    private toPrismaUpdateData(data: Partial<ViolationTypeAttributes>): Record<string, unknown> {
        return {
            ...(data.name !== undefined && {
                name: data.name,
            }),
            
            ...(data.description !== undefined && {
                description: data.description,
            }),
            
            ...(data.defaultFine !== undefined && {
                defaultFine: data.defaultFine,
            }),
            
            ...(data.isActive !== undefined && {
                isActive: data.isActive,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}