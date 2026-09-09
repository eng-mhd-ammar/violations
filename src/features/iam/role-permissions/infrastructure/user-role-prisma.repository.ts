import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../core/database/prisma.service.js';

import {
    Role,
    RoleAttributes,
} from '../../roles/domain/role.model.js';

import {
    Permission,
    PermissionAttributes,
} from '../../permissions/domain/permission.model.js';
import { RolePermissionRepository } from '../domain/user-role.repository.js';
import { RolePermission, RolePermissionAttributes } from '../domain/user-role.model.js';

@Injectable()
export class RolePermissionPrismaRepository
    implements RolePermissionRepository
{
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(
        rolePermission: RolePermission,
    ): Promise<RolePermission> {
        const data = rolePermission.toAttributes();

        const created =
            await this.prisma.db.orm.public.RolePermission.create({
                roleId: data.roleId,
                permissionId: data.permissionId,
            });

        return this.toDomain(created);
    }

    async findAll(): Promise<RolePermission[]> {
        const rolePermissions =
            await this.prisma.db.orm.public.RolePermission
                .where({
                    deletedAt: null,
                })
                .include('role')
                .include('permission')
                .all();

        return rolePermissions.map((rolePermission) =>
            this.toDomain(rolePermission),
        );
    }

    async findById(
        id: number,
    ): Promise<RolePermission | null> {
        const rolePermission =
            await this.prisma.db.orm.public.RolePermission
                .where({
                    id,
                    deletedAt: null,
                })
                .include('role')
                .include('permission')
                .first();

        if (!rolePermission) {
            return null;
        }

        return this.toDomain(rolePermission);
    }

    async findByIdIncludingDeleted(
        id: number,
    ): Promise<RolePermission | null> {
        const rolePermission =
            await this.prisma.db.orm.public.RolePermission
                .where({ id })
                .include('role')
                .include('permission')
                .first();

        if (!rolePermission) {
            return null;
        }

        return this.toDomain(rolePermission);
    }

    async update(
        id: number,
        data: Partial<RolePermissionAttributes>,
    ): Promise<RolePermission> {
        const updateData =
            this.toPrismaUpdateData(data);

        const updated =
            await this.prisma.db.orm.public.RolePermission
                .where({
                    id,
                    deletedAt: null,
                })
                .update(updateData);

        if (!updated) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return this.toDomain(updated);
    }

    async delete(
        id: number,
    ): Promise<RolePermission> {
        const deleted =
            await this.prisma.db.orm.public.RolePermission
                .where({
                    id,
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date().toISOString(),
                });

        if (!deleted) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    async restore(
        id: number,
    ): Promise<RolePermission> {
        const restored =
            await this.prisma.db.orm.public.RolePermission
                .where({ id })
                .update({
                    deletedAt: null,
                });

        if (!restored) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return this.toDomain(restored);
    }

    async forceDelete(
        id: number,
    ): Promise<RolePermission> {
        const deleted =
            await this.prisma.db.orm.public.RolePermission
                .where({ id })
                .delete();

        if (!deleted) {
            throw new Error(
                `RolePermission with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    private toPrismaUpdateData(
        data: Partial<RolePermissionAttributes>,
    ) {
        return {
            ...(data.roleId !== undefined && {
                roleId: data.roleId,
            }),

            ...(data.permissionId !== undefined && {
                permissionId: data.permissionId,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    private toDomain(data: {
        id: number;
        roleId: number;
        permissionId: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        role?: Record<string, unknown>;
        permission?: Record<string, unknown>;
    }): RolePermission {
        return new RolePermission({
            id: data.id,

            roleId: data.roleId,
            permissionId: data.permissionId,

            role: data.role
                ? new Role(
                    data.role as unknown as RoleAttributes,
                )
                : undefined,

            permission: data.permission
                ? new Permission(
                    data.permission as unknown as PermissionAttributes,
                )
                : undefined,

            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}