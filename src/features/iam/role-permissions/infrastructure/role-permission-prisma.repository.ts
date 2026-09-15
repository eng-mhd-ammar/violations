import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/database/prisma.service.js';

import {
    BaseRepository,
} from '../../../../core/database/repositories/base.repository.js';

import type {
    QueryOptions,
} from '../../../../core/database/repositories/query.types.js';
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
        return [
            // 'id',
            // 'name',
            // 'slug',
            // 'isActive',
            // 'createdAt',
            // 'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'name',
            'slug',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            // 'rolepermissions',
            // 'userRolePermissions',
        ];
    }

    protected allowedFields(): string[] {
        return [
            // 'id',
            // 'name',
            // 'slug',
            // 'description',
            // 'createdAt',
            // 'updatedAt',
            // 'deletedAt',
        ];
    }

    protected defaultSort(): string[] {
        return [
            // '-createdAt',
        ];
    }

    // ============================================================
    // Create
    // ============================================================

    async create(rolepermission: RolePermission): Promise<RolePermission> {
        const data = rolepermission.toAttributes();

        return this.createRecord(data);
    }

    // ============================================================
    // Read
    // ============================================================

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        let rolepermissions = records.map((record: RolePermissionAttributes) => this.toDomain(record));

        /*
         * ========================================================
         * INCLUDE: rolepermissions
         * ========================================================
         *
         * إذا BaseRepository عندك حاليًا لا يدعم العلاقات
         * تلقائيًا، يمكنك مؤقتًا تحميلها هنا.
         */

        if (
            options.include?.includes(
                'rolepermissions',
            )
        ) {

            // سنضيفها بعد تثبيت RolePermission relation.
        }

        /*
         * ========================================================
         * INCLUDE: userRolePermissions
         * ========================================================
         */

        if (
            options.include?.includes(
                'userRolePermissions',
            )
        ) {
            // سنضيفها بعد تثبيت UserRolePermission relation.
        }

        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return rolepermissions;
        }

        const page =
            options.page ?? 1;

        const perPage =
            options.perPage ?? 10;

        const total =
            rolepermissions.length;

        const start =
            (page - 1) * perPage;

        const items =
            rolepermissions.slice(
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


    async find(
        id: number,
        options: QueryOptions = {},
    ): Promise<RolePermission | null> {
        return super.find(
            id,
            options,
        );
    }

    async findOneBy(
        conditions: Record<string, unknown>,
        options: QueryOptions = {},
    ): Promise<RolePermission | null> {

        return super.findOneBy(
            conditions,
            options,
        );

    }

    async first(
        options: QueryOptions = {},
    ): Promise<RolePermission | null> {
        return super.first(
            options,
        );
    }

    // ============================================================
    // Update
    // ============================================================

    async update(
        id: number,
        data: Partial<RolePermissionAttributes>,
    ): Promise<RolePermission> {

        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(
                    data,
                ),
            );

        if (!updated) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return updated;
    }

    // ============================================================
    // Delete
    // ============================================================

    async delete(
        id: number,
    ): Promise<RolePermission> {

        const deleted =
            await this.softDeleteRecord(
                id,
            );

        if (!deleted) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return deleted;
    }

    // ============================================================
    // Restore
    // ============================================================

    async restore(
        id: number,
    ): Promise<RolePermission> {

        const restored =
            await this.restoreRecord(
                id,
            );

        if (!restored) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return restored;
    }


    // ============================================================
    // Force Delete
    // ============================================================

    async forceDelete(
        id: number,
    ): Promise<RolePermission> {

        const deleted =
            await this.forceDeleteRecord(
                id,
            );

        if (!deleted) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return deleted;
    }

    // ============================================================
    // Mapping
    // ============================================================

    protected toDomain(
        data: RolePermissionAttributes,
    ): RolePermission {
        return new RolePermission(
            data,
        );
    }

    private toPrismaUpdateData(
        data: Partial<RolePermissionAttributes>,
    ): Record<string, unknown> {
        return {
            ...(data.deletedAt !== undefined && {
                deletedAt:
                    data.deletedAt,
            }),
        };
    }

    async sync(
        roleId: number,
        permissionIds: number[],
    ): Promise<void> {

        /*
         * -1 means remove all permissions.
         */
        if (
            permissionIds.length === 1 &&
            permissionIds[0] === -1
        ) {
            const existingRelations =
                await this.findByRoleId(
                    roleId,
                    {
                        trashed: 'not',
                    },
                );

            for (
                const rolePermission
                of existingRelations
            ) {
                if (rolePermission.id) {
                    await this.delete(
                        rolePermission.id,
                    );
                }
            }

            return;
        }

        /*
         * Remove duplicated permission IDs.
         */
        const uniquePermissionIds =
            [...new Set(permissionIds)];

        /*
         * Get all existing relations
         * for THIS role only,
         * including soft deleted ones.
         */
        const existingRelations =
            await this.findByRoleId(
                roleId,
                {
                    trashed: 'with',
                },
            );

        /*
         * Restore existing relations
         * or create new ones.
         */
        for (
            const permissionId
            of uniquePermissionIds
        ) {
            const existing =
                existingRelations.find(
                    (relation) =>
                        relation.permissionId ===
                        permissionId,
                );

            /*
             * No relation exists at all.
             */
            if (!existing) {
                await this.create(
                    new RolePermission({
                        roleId,
                        permissionId,
                    }),
                );

                continue;
            }

            /*
             * Relation exists but is soft deleted.
             */
            if (
                existing.deletedAt !== null &&
                existing.id
            ) {
                await this.restore(
                    existing.id,
                );
            }
        }

        /*
         * Remove existing permissions
         * that are not requested anymore.
         */
        for (
            const existing
            of existingRelations
        ) {
            /*
             * Ignore already deleted relations.
             */
            if (
                existing.deletedAt !== null
            ) {
                continue;
            }

            /*
             * Permission is no longer requested.
             */
            if (
                !uniquePermissionIds.includes(
                    existing.permissionId!,
                )
            ) {
                if (existing.id) {
                    await this.delete(
                        existing.id,
                    );
                }
            }
        }
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

}