import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/database/prisma.service.js';

import {
    BaseRepository,
} from '../../../../core/database/repositories/base.repository.js';

import type {
    QueryOptions,
} from '../../../../core/database/repositories/query.types.js';

import {
    Permission,
    type PermissionAttributes,
} from '../domain/permission.model.js';

import {
    PermissionRepository,
} from '../domain/permission.repository.js';


@Injectable()
export class PermissionPrismaRepository extends BaseRepository<Permission, PermissionAttributes> implements PermissionRepository
{

    constructor(private readonly prisma: PrismaService) {
        super(
            prisma.db.orm.public.Permission,
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
            // 'permissions',
            // 'userPermissions',
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

    async create(permission: Permission): Promise<Permission> {
        const data = permission.toAttributes();

        return this.createRecord(data);
    }


    // ============================================================
    // Read
    // ============================================================

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        let permissions = records.map((record: PermissionAttributes) => this.toDomain(record));


        /*
         * ========================================================
         * INCLUDE: permissions
         * ========================================================
         *
         * إذا BaseRepository عندك حاليًا لا يدعم العلاقات
         * تلقائيًا، يمكنك مؤقتًا تحميلها هنا.
         */

        if (
            options.include?.includes(
                'permissions',
            )
        ) {

            // سنضيفها بعد تثبيت Permission relation.
        }


        /*
         * ========================================================
         * INCLUDE: userPermissions
         * ========================================================
         */

        if (
            options.include?.includes(
                'userPermissions',
            )
        ) {
            // سنضيفها بعد تثبيت UserPermission relation.
        }


        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return permissions;
        }


        const page =
            options.page ?? 1;

        const perPage =
            options.perPage ?? 10;

        const total =
            permissions.length;

        const start =
            (page - 1) * perPage;

        const items =
            permissions.slice(
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
    ): Promise<Permission | null> {

        return super.find(
            id,
            options,
        );

    }


    async findOneBy(
        conditions: Record<string, unknown>,
        options: QueryOptions = {},
    ): Promise<Permission | null> {

        return super.findOneBy(
            conditions,
            options,
        );

    }


    async first(
        options: QueryOptions = {},
    ): Promise<Permission | null> {

        return super.first(
            options,
        );

    }


    // ============================================================
    // Update
    // ============================================================

    async update(
        id: number,
        data: Partial<PermissionAttributes>,
    ): Promise<Permission> {

        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(
                    data,
                ),
            );

        if (!updated) {

            throw new Error(
                `Permission with id ${id} not found`,
            );

        }

        return updated;

    }


    // ============================================================
    // Delete
    // ============================================================

    async delete(
        id: number,
    ): Promise<Permission> {

        const deleted =
            await this.softDeleteRecord(
                id,
            );

        if (!deleted) {

            throw new Error(
                `Permission with id ${id} not found`,
            );

        }

        return deleted;

    }


    // ============================================================
    // Restore
    // ============================================================

    async restore(
        id: number,
    ): Promise<Permission> {

        const restored =
            await this.restoreRecord(
                id,
            );

        if (!restored) {

            throw new Error(
                `Permission with id ${id} not found`,
            );

        }

        return restored;

    }


    // ============================================================
    // Force Delete
    // ============================================================

    async forceDelete(
        id: number,
    ): Promise<Permission> {

        const deleted =
            await this.forceDeleteRecord(
                id,
            );

        if (!deleted) {

            throw new Error(
                `Permission with id ${id} not found`,
            );

        }

        return deleted;

    }


    // ============================================================
    // Mapping
    // ============================================================

    protected toDomain(
        data: PermissionAttributes,
    ): Permission {

        return new Permission(
            data,
        );

    }


    private toPrismaUpdateData(
        data: Partial<PermissionAttributes>,
    ): Record<string, unknown> {

        return {

            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.slug !== undefined && {
                slug: data.slug,
            }),

            ...(data.description !== undefined && {
                description:
                    data.description,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt:
                    data.deletedAt,
            }),

        };

    }

}