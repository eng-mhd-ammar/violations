import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/database/prisma.service.js';

import {
    BaseRepository,
} from '../../../../core/database/repositories/base.repository.js';

import type {
    QueryOptions,
} from '../../../../core/database/repositories/query.types.js';

import {
    Role,
    type RoleAttributes,
} from '../domain/role.model.js';

import {
    RoleRepository,
} from '../domain/role.repository.js';


@Injectable()
export class RolePrismaRepository
    extends BaseRepository<Role, RoleAttributes>
    implements RoleRepository
{

    constructor(
        private readonly prisma: PrismaService,
    ) {

        super(
            prisma.db.orm.public.Role,
        );

    }


    // ============================================================
    // Query configuration
    // ============================================================

    protected allowedSorts(): string[] {

        return [
            'id',
            'name',
            'slug',
            'isActive',
            'createdAt',
            'updatedAt',
        ];

    }


    protected allowedFilters(): string[] {

        return [
            'id',
            'name',
            'slug',
            'isActive',
        ];

    }


    protected allowedIncludes(): string[] {

        return [
            'permissions',
            'userRoles',
        ];

    }


    protected allowedFields(): string[] {

        return [
            'id',
            'name',
            'slug',
            'description',
            'isActive',
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


    // ============================================================
    // Create
    // ============================================================

    async create(
        role: Role,
    ): Promise<Role> {

        const data = role.toAttributes();

        return this.createRecord(data);
    }


    // ============================================================
    // Read
    // ============================================================

    async all(
        options: QueryOptions = {},
    ): Promise<any> {

        const builder =
            this.createQuery(options);

        const records =
            await builder.all();

        let roles = records.map(
            (record: RoleAttributes) =>
                this.toDomain(record),
        );


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
         * INCLUDE: userRoles
         * ========================================================
         */

        if (
            options.include?.includes(
                'userRoles',
            )
        ) {

            // سنضيفها بعد تثبيت UserRole relation.
        }


        // ========================================================
        // Pagination
        // ========================================================

        if (options.paginate === false) {
            return roles;
        }


        const page =
            options.page ?? 1;

        const perPage =
            options.perPage ?? 10;

        const total =
            roles.length;

        const start =
            (page - 1) * perPage;

        const items =
            roles.slice(
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
    ): Promise<Role | null> {

        return super.find(
            id,
            options,
        );

    }


    async findOneBy(
        conditions: Record<string, unknown>,
        options: QueryOptions = {},
    ): Promise<Role | null> {

        return super.findOneBy(
            conditions,
            options,
        );

    }


    async first(
        options: QueryOptions = {},
    ): Promise<Role | null> {

        return super.first(
            options,
        );

    }


    // ============================================================
    // Update
    // ============================================================

    async update(
        id: number,
        data: Partial<RoleAttributes>,
    ): Promise<Role> {

        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(
                    data,
                ),
            );

        if (!updated) {

            throw new Error(
                `Role with id ${id} not found`,
            );

        }

        return updated;

    }


    // ============================================================
    // Delete
    // ============================================================

    async delete(
        id: number,
    ): Promise<Role> {

        const deleted =
            await this.softDeleteRecord(
                id,
            );

        if (!deleted) {

            throw new Error(
                `Role with id ${id} not found`,
            );

        }

        return deleted;

    }


    // ============================================================
    // Restore
    // ============================================================

    async restore(
        id: number,
    ): Promise<Role> {

        const restored =
            await this.restoreRecord(
                id,
            );

        if (!restored) {

            throw new Error(
                `Role with id ${id} not found`,
            );

        }

        return restored;

    }


    // ============================================================
    // Force Delete
    // ============================================================

    async forceDelete(
        id: number,
    ): Promise<Role> {

        const deleted =
            await this.forceDeleteRecord(
                id,
            );

        if (!deleted) {

            throw new Error(
                `Role with id ${id} not found`,
            );

        }

        return deleted;

    }


    // ============================================================
    // Mapping
    // ============================================================

    protected toDomain(
        data: RoleAttributes,
    ): Role {

        return new Role(
            data,
        );

    }


    private toPrismaUpdateData(
        data: Partial<RoleAttributes>,
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

            ...(data.isActive !== undefined && {
                isActive:
                    data.isActive,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt:
                    data.deletedAt,
            }),

        };

    }

}