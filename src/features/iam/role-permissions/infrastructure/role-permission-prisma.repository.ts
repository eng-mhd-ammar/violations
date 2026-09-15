import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';
import { RolePermission, RolePermissionAttributes } from '../domain/role-permission.model.js';
import { RolePermissionRepository } from '../domain/role-permission.repository.js';

@Injectable()
export class RolePermissionPrismaRepository extends BaseRepository<RolePermission, RolePermissionAttributes> implements RolePermissionRepository
{

    constructor(private readonly prisma: PrismaService) {
        super(
            prisma.db.orm.public.RolePermission,
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
            'name',
            'slug',
        ];
    }

    protected allowedIncludes(): string[] {
        return [];
    }

    protected allowedFields(): string[] {
        return [];
    }

    protected defaultSort(): string[] {
        return [];
    }

    // ============================================================
    // Create
    // ============================================================

    async create(rolePermission: RolePermission): Promise<RolePermission> {
        const data = rolePermission.toAttributes();

        return this.createRecord(data);
    }

    // ============================================================
    // Read
    // ============================================================

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        let rolePermissions = records.map((record: RolePermissionAttributes) => this.toDomain(record));

        // if (
        //     options.include?.includes(
        //         '', // model
        //     )
        // ) {
        // }

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return rolePermissions;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = rolePermissions.length;

        const start = (page - 1) * perPage;

        const items = rolePermissions.slice(start, start + perPage);

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

    async find(id: number, options: QueryOptions = {}): Promise<RolePermission | null> {
        return super.find(id, options);
    }

    async findOneBy(conditions: Record<string, unknown>, options: QueryOptions = {}): Promise<RolePermission | null> {
        return super.findOneBy(conditions, options);
    }

    async first(options: QueryOptions = {}): Promise<RolePermission | null> {
        return super.first(options);
    }

    // ============================================================
    // Update
    // ============================================================

    async update(id: number, data: Partial<RolePermissionAttributes>): Promise<RolePermission> {
        const updated = await this.updateRecord(id, this.toPrismaUpdateData(data));

        if (!updated) {
            throw new Error(`Role permission with id ${id} not found`);
        }

        return updated;
    }

    // ============================================================
    // Delete
    // ============================================================

    async delete(id: number): Promise<RolePermission> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Role permission with id ${id} not found`);
        }

        return deleted;
    }

    // ============================================================
    // Restore
    // ============================================================

    async restore(id: number): Promise<RolePermission> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`RolePermission with id ${id} not found`);
        }

        return restored;
    }


    // ============================================================
    // Force Delete
    // ============================================================

    async forceDelete(id: number): Promise<RolePermission> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Role permission with id ${id} not found`);
        }

        return deleted;
    }

    // ============================================================
    // Mapping
    // ============================================================

    protected toDomain(data: RolePermissionAttributes): RolePermission {
        return new RolePermission(data);
    }

    private toPrismaUpdateData(data: Partial<RolePermissionAttributes>): Record<string, unknown> {
        return {
            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    async sync(roleId: number, permissionIds: number[]): Promise<void> {
        // Remove all permissions.
        if (permissionIds.length === 0) {
            const existingRelations = await this.findByRoleId(roleId, { trashed: 'not' });

            const ids = existingRelations
                .map((relation) => relation.id)
                .filter((id): id is number => id !== undefined);

            await this.deleteMany(ids);

            return;
        }

        // Remove duplicated permission IDs.
        const uniquePermissionIds = [
            ...new Set(permissionIds),
        ];

        const requestedPermissionIds = new Set(
            uniquePermissionIds,
        );

        // Get all existing relations including trashed ones.
        const existingRelations = await this.findByRoleId(
            roleId,
            {
                trashed: 'with',
            },
        );

        // Existing permission IDs.
        const existingPermissionIds = new Set(
            existingRelations
                .map((relation) => relation.permissionId)
                .filter(
                    (permissionId): permissionId is number =>
                        permissionId !== undefined,
                ),
        );

        // Restore deleted relations.
        const relationsToRestore = existingRelations
            .filter(
                (relation) =>
                    relation.deletedAt !== null &&
                    relation.permissionId !== undefined &&
                    requestedPermissionIds.has(
                        relation.permissionId,
                    ),
            )
            .map((relation) => relation.id)
            .filter((id): id is number => id !== undefined);

        // Create new relations.
        const relationsToCreate = uniquePermissionIds
            .filter(
                (permissionId) =>
                    !existingPermissionIds.has(permissionId),
            )
            .map((permissionId) => ({
                roleId,
                permissionId,
            }));

        // Remove existing permissions that are not requested anymore.
        const relationsToDelete = existingRelations
            .filter(
                (relation) =>
                    relation.deletedAt === null &&
                    relation.permissionId !== undefined &&
                    !requestedPermissionIds.has(
                        relation.permissionId,
                    ),
            )
            .map((relation) => relation.id)
            .filter((id): id is number => id !== undefined);

        // Restore existing relations.
        await this.restoreMany(relationsToRestore);

        // Create new relations.
        await this.createMany(relationsToCreate);

        // Delete removed relations.
        await this.deleteMany(relationsToDelete);
    }

    async findByRoleId(roleId: number, options: QueryOptions = {}): Promise<RolePermission[]> {
        const query = this.createQuery(options);

        const records = await query
            .getQuery()
            .where({
                roleId,
            })
            .all();

        return records.map(
            (record: RolePermissionAttributes) =>
                this.toDomain(record),
        );
    }

    async createMany(relations: Array<{ roleId: number; permissionId: number }>): Promise<void> {
        if (relations.length === 0) {
            return;
        }

        await this.prisma.db.orm.public.RolePermission.createAll(relations);
    }

    async restoreMany(ids: number[]): Promise<void> {
        if (ids.length === 0) {
            return;
        }

        await this.prisma.db.orm.public.RolePermission
            .where((rolePermission) => rolePermission.id.in(ids))
            .updateAll({
                deletedAt: null,
            });
    }
    
    async deleteMany(ids: number[]): Promise<void> {
        if (ids.length === 0) {
            return;
        }

        await this.prisma.db.orm.public.RolePermission
            .where((rolePermission) => rolePermission.id.in(ids))
            .updateAll({
                deletedAt: new Date().toISOString(),
            });
    }
}
