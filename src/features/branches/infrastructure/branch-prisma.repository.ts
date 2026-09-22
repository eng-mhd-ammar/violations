import { Injectable } from '@nestjs/common';
import { Branch, type BranchAttributes } from '../domain/branch.model.js';
import { BranchRepository } from '../domain/branch.repository.js';
import { BaseRepository } from '../../../core/database/repositories/base.repository.js';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { QueryOptions } from '../../../core/database/repositories/query.types.js';

@Injectable()
export class BranchPrismaRepository extends BaseRepository<Branch, BranchAttributes> implements BranchRepository
{
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super(
            prisma.db.orm.public.Branch,
        );
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'name',
            'code',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'name',
            'code',
            'phone',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'address',
            'address.state',
            'users',
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

    async create(branch: Branch): Promise<Branch> {
        const data = branch.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        const branches =
            records.map(
                (record: BranchAttributes) =>
                    this.toDomain(record),
            );

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return branches;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = branches.length;

        const start = (page - 1) * perPage;

        const items =
            branches.slice(
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

    async first(options: QueryOptions = {}): Promise<Branch | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<Branch | null> {
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

    async update(id: number, data: Partial<BranchAttributes>): Promise<Branch> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(`Branch with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<Branch> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Branch with id ${id} not found`);
        }

        return deleted;
    }

    async restore(id: number): Promise<Branch> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`Branch with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<Branch> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Branch with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: BranchAttributes): Branch {
        return new Branch(data);
    }

    private toPrismaUpdateData(data: Partial<BranchAttributes>): Record<string, unknown> {
        return {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.phone !== undefined && {
                phone: data.phone,
            }),

            ...(data.code !== undefined && {
                code: data.code,
            }),

            ...(data.addressId !== undefined && {
                addressId: data.addressId,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}