import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import {Objection, type ObjectionAttributes} from '../domain/objection.model.js';
import { ObjectionRepository } from '../domain/objection.repository.js';

@Injectable()
export class ObjectionPrismaRepository extends BaseRepository<Objection, ObjectionAttributes> implements ObjectionRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.db.orm.public.Objection);
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'violationId',
            'applicantId',
            'reviewerId',
            'reason',
            'status',
            'reviewedAt',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'violationId',
            'applicantId',
            'reviewerId',
            'status',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'violation',
            'applicant',
            'reviewer',
        ];
    }

    protected allowedFields(): string[] {
        return [
            'id',
            'violationId',
            'applicantId',
            'reviewerId',
            'reason',
            'description',
            'status',
            'reviewedAt',
            'reviewNotes',
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

    async create(objection: Objection): Promise<Objection> {
        const data = objection.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);

        const records = await builder.all();

        const objections = records.map(
            (record: ObjectionAttributes) => this.toDomain(record),
        );

        // ============================================================
        // Pagination
        // ============================================================

        if (options.paginate === false) {
            return objections;
        }

        const page = options.page ?? 1;
        const perPage = options.perPage ?? 10;

        const total = objections.length;

        const start = (page - 1) * perPage;

        const items = objections.slice(
            start,
            start + perPage,
        );

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

    async first(options: QueryOptions = {}): Promise<Objection | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<Objection | null> {
        return super.find(id, options,);
    }

    async update(id: number, data: Partial<ObjectionAttributes>): Promise<Objection> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(`Objection with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<Objection> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Objection with id ${id} not found`);
        }

        return deleted;
    }

    async restore(id: number): Promise<Objection> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`Objection with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<Objection> {
        const deleted =
            await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Objection with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: ObjectionAttributes): Objection {
        return new Objection(data);
    }

    private toPrismaUpdateData(data: Partial<ObjectionAttributes>): Record<string, unknown> {
        return {
            ...(data.violationId !== undefined && {
                violationId: data.violationId,
            }),

            ...(data.applicantId !== undefined && {
                applicantId: data.applicantId,
            }),

            ...(data.reviewerId !== undefined && {
                reviewerId: data.reviewerId,
            }),

            ...(data.reason !== undefined && {
                reason: data.reason,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.status !== undefined && {
                status: data.status,
            }),

            ...(data.reviewedAt !== undefined && {
                reviewedAt: data.reviewedAt,
            }),

            ...(data.reviewNotes !== undefined && {
                reviewNotes: data.reviewNotes,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}