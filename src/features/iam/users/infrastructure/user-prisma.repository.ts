import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { AllowedFilter, AllowedInclude, BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { User, type UserAttributes } from '../domain/user.model.js';
import { UserRepository } from '../domain/user.repository.js';

@Injectable()
export class UserPrismaRepository extends BaseRepository<User, UserAttributes> implements UserRepository
{
    constructor(private readonly prisma: PrismaService) {
        super(prisma.db.orm.public.User);
    }

    // ============================================================
    // Query configuration
    // ============================================================

    protected allowedSorts(): string[] {
        return [];
    }

    protected allowedFilters(): AllowedFilter[] {
        return [
            'id',
            'username',
            'firstName',
            'lastName',
            'phone',
            'isActive',
            {
                path: 'userRoles.role.slug',
                alias: 'role',
            },
        ];
    }

    protected allowedIncludes(): AllowedInclude[] {
        return [
            'userRoles.role',
            'branch',
            {
                path: 'userRoles.role',
                alias: 'role',
            },
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

    async create(user: User): Promise<User> {
        const data = user.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        let users = records.map((record: UserAttributes) => this.toDomain(record));

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return users;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = users.length;

        const start = (page - 1) * perPage;

        const items = users.slice(start, start + perPage);

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

    async find(id: number, options: QueryOptions = {}): Promise<User | null> {
        return super.find(id, options);
    }

    async findOneBy(conditions: Record<string, unknown>, options: QueryOptions = {},): Promise<User | null> {
        return super.findOneBy(conditions, options);
    }

    async first(options: QueryOptions = {}): Promise<User | null> {
        return super.first(options);
    }

    async update(id: number, data: Partial<UserAttributes>): Promise<User> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(
                `User with id ${id} not found`,
            );
        }

        return updated;
    }

    async delete(id: number): Promise<User> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `User with id ${id} not found`,
            );
        }

        return deleted;
    }

    async restore(id: number): Promise<User> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(
                `User with id ${id} not found`,
            );
        }

        return restored;
    }

    async forceDelete(id: number): Promise<User> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(
                `User with id ${id} not found`,
            );
        }

        return deleted;
    }

    protected toDomain(data: UserAttributes): User {
        return new User(data);
    }

    private toPrismaUpdateData(
        data: Partial<UserAttributes>,
    ): Record<string, unknown> {
        return {
            ...(data.username !== undefined && {
                username: data.username,
            }),
            ...(data.phone !== undefined && {
                phone: data.phone,
            }),
            ...(data.password !== undefined && {
                password: data.password,
            }),
            ...(data.firstName !== undefined && {
                firstName: data.firstName,
            }),
            ...(data.lastName !== undefined && {
                lastName: data.lastName,
            }),
            ...(data.isActive !== undefined && {
                isActive: data.isActive,
            }),
            ...(data.branchId !== undefined && {
                branchId: data.branchId,
            }),
            ...(data.deletedAt !== undefined && {
                deletedAt:
                    data.deletedAt,
            }),
        };
    }
}