import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { UserRole, UserRoleAttributes } from '../domain/user-role.model.js';
import { UserRoleRepository } from '../domain/user-role.repository.js';

@Injectable()
export class UserRolePrismaRepository extends BaseRepository<UserRole, UserRoleAttributes> implements UserRoleRepository
{

    constructor(private readonly prisma: PrismaService) {
        super(
            prisma.db.orm.public.UserRole,
        );
    }

    // ============================================================
    // Query configuration
    // ============================================================

    protected allowedSorts(): string[] {
        return [];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'roleId',
            'userId',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'user',
            'role'
        ];
    }

    protected allowedFields(): string[] {
        return [];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt'
        ];
    }

    async create(userRole: UserRole): Promise<UserRole> {
        const data = userRole.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();
        console.log(records);
        let userRoles = records.map((record: UserRoleAttributes) => this.toDomain(record));

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return userRoles;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = userRoles.length;

        const start = (page - 1) * perPage;

        const items = userRoles.slice(start, start + perPage);

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

    async find(id: number, options: QueryOptions = {}): Promise<UserRole | null> {
        return super.find(id, options);
    }

    async findOneBy(conditions: Record<string, unknown>, options: QueryOptions = {}): Promise<UserRole | null> {
        return super.findOneBy(conditions, options);
    }

    async first(options: QueryOptions = {}): Promise<UserRole | null> {
        return super.first(options);
    }

    async update(id: number, data: Partial<UserRoleAttributes>): Promise<UserRole> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(`Role permission with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<UserRole> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Role permission with id ${id} not found`);
        }

        return deleted;
    }

    async restore(id: number): Promise<UserRole> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`UserRole with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<UserRole> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Role permission with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: UserRoleAttributes): UserRole {
        return new UserRole(data);
    }

    private toPrismaUpdateData(data: Partial<UserRoleAttributes>): Record<string, unknown> {
        return {
            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    async sync(userId: number, roleIds: number[]): Promise<void> {
        // Remove all roles.
        if (roleIds.length === 0) {

            const existingRelations = await this.findByUserId(userId, { trashed: 'not' });

            const ids = existingRelations
                .map(
                    (relation) =>
                        relation.id,
                )
                .filter(
                    (id): id is number =>
                        id !== undefined,
                );

            await this.deleteMany(ids);

            return;
        }

        // Remove duplicated role IDs.
        const uniqueRoleIds = [
            ...new Set(roleIds),
        ];

        const requestedRoleIds = new Set(uniqueRoleIds);

        // Get all existing relations including trashed ones.
        const existingRelations =
            await this.findByUserId(
                userId,
                {
                    trashed: 'with',
                },
            );

        // Existing role IDs.
        const existingRoleIds = new Set(
            existingRelations
                .map(
                    (relation) =>
                        relation.roleId,
                )
                .filter(
                    (roleId): roleId is number =>
                        roleId !== undefined,
                ),
        );

        // Restore deleted relations.
        const relationsToRestore =
            existingRelations
                .filter(
                    (relation) =>
                        relation.deletedAt !== null &&
                        relation.roleId !== undefined &&
                        requestedRoleIds.has(
                            relation.roleId,
                        ),
                )
                .map(
                    (relation) =>
                        relation.id,
                )
                .filter(
                    (id): id is number =>
                        id !== undefined,
                );

        // Create new relations.
        const relationsToCreate =
            uniqueRoleIds
                .filter(
                    (roleId) =>
                        !existingRoleIds.has(
                            roleId,
                        ),
                )
                .map(
                    (roleId) => ({
                        userId,
                        roleId,
                    }),
                );

        // Remove existing roles that are not requested anymore.
        const relationsToDelete =
            existingRelations
                .filter(
                    (relation) =>
                        relation.deletedAt === null &&
                        relation.roleId !== undefined &&
                        !requestedRoleIds.has(
                            relation.roleId,
                        ),
                )
                .map(
                    (relation) =>
                        relation.id,
                )
                .filter(
                    (id): id is number =>
                        id !== undefined,
                );

        // Restore existing relations.
        await this.restoreMany(relationsToRestore);

        // Create new relations.
        await this.createMany(relationsToCreate);

        // Delete removed relations.
        await this.deleteMany(relationsToDelete);
    }

    async findByUserId(userId: number, options: QueryOptions = {}): Promise<UserRole[]> {
        const query = this.createQuery(options);

        const records = await query.getQuery().where({ userId }).all();

        return records.map(
            (record: UserRoleAttributes) =>
                this.toDomain(record),
        );
    }

    async findByRoleId(roleId: number, options: QueryOptions = {}): Promise<UserRole[]> {
        const query = this.createQuery(options);

        const records = await query
            .getQuery()
            .where({
                roleId,
            })
            .all();

        return records.map(
            (record: UserRoleAttributes) =>
                this.toDomain(record),
        );
    }

    async createMany(relations: Array<{ roleId: number; userId: number }>): Promise<void> {
        if (relations.length === 0) {
            return;
        }

        await this.prisma.db.orm.public.UserRole.createAll(relations);
    }

    async restoreMany(ids: number[]): Promise<void> {
        if (ids.length === 0) {
            return;
        }

        await this.prisma.db.orm.public.UserRole
            .where((userRole) => userRole.id.in(ids))
            .updateAll({
                deletedAt: null,
            });
    }
    
    async deleteMany(ids: number[]): Promise<void> {
        if (ids.length === 0) {
            return;
        }

        await this.prisma.db.orm.public.UserRole
            .where((userRole) => userRole.id.in(ids))
            .updateAll({
                deletedAt: new Date().toISOString(),
            });
    }
}
