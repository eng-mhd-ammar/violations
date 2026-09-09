import { Injectable } from '@nestjs/common';

import { PermissionRepository } from '../domain/permission.repository.js';

import { PrismaService } from '../../../../core/database/prisma.service.js';
import { Permission, PermissionAttributes } from '../domain/permission.model.js';

@Injectable()
export class PermissionPrismaRepository implements PermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(permission: Permission): Promise<Permission> {
        const data = permission.toAttributes();

        const created =
            await this.prisma.db.orm.public.Permission.create({
                name: data.name,
                slug: data.slug,
                description: data.description ?? null,
            });

        return this.toDomain(created);
    }

    async findAll(): Promise<Permission[]> {
        const permissions =
            await this.prisma.db.orm.public.Permission
                .where({ deletedAt: null })
                .all();

        return permissions.map((permission) =>
            this.toDomain(permission),
        );
    }

    async findById(id: number): Promise<Permission | null> {
        const permission =
            await this.prisma.db.orm.public.Permission
                .where({
                    id,
                    deletedAt: null,
                })
                .first();

        if (!permission) {
            return null;
        }

        return this.toDomain(permission);
    }

    async findByIdIncludingDeleted(
        id: number,
    ): Promise<Permission | null> {
        const permission =
            await this.prisma.db.orm.public.Permission
                .where({ id })
                .first();

        if (!permission) {
            return null;
        }

        return this.toDomain(permission);
    }

    async findBySlug(slug: string): Promise<Permission | null> {
        const permission =
            await this.prisma.db.orm.public.Permission
                .where({
                    slug,
                    deletedAt: null,
                })
                .first();

        if (!permission) {
            return null;
        }

        return this.toDomain(permission);
    }

    async update(
        id: number,
        data: Partial<PermissionAttributes>,
    ): Promise<Permission> {
        const updateData = this.toPrismaUpdateData(data);

        const updated =
            await this.prisma.db.orm.public.Permission
                .where({
                    id,
                    deletedAt: null,
                })
                .update(updateData);

        if (!updated) {
            throw new Error(
                `Permission with id ${id} not found`,
            );
        }

        return this.toDomain(updated);
    }

    async delete(id: number): Promise<Permission> {
        const deleted =
            await this.prisma.db.orm.public.Permission
                .where({
                    id,
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date().toISOString(),
                });

        if (!deleted) {
            throw new Error(
                `Permission with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    async restore(id: number): Promise<Permission> {
        const restored =
            await this.prisma.db.orm.public.Permission
                .where({ id })
                .update({
                    deletedAt: null,
                });

        if (!restored) {
            throw new Error(
                `Permission with id ${id} not found`,
            );
        }

        return this.toDomain(restored);
    }

    async forceDelete(id: number): Promise<Permission> {
        const deleted =
            await this.prisma.db.orm.public.Permission
                .where({ id })
                .delete();

        if (!deleted) {
            throw new Error(
                `Permission with id ${id} not found`,
            );
        }

        return this.toDomain(deleted);
    }

    private toPrismaUpdateData(
        data: Partial<PermissionAttributes>,
    ): Partial<PermissionAttributes> {
        return {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.slug !== undefined && {
                slug: data.slug,
            }),

            ...(data.description !== undefined && {
                description: data.description,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }

    private toDomain(data: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    }): Permission {
        return new Permission({
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}