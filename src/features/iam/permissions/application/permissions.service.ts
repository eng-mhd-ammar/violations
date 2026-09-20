import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '../domain/permission.model.js';
import type { PermissionAttributes } from '../domain/permission.model.js';
import { PERMISSION_REPOSITORY } from '../domain/permission.repository.js';
import type { PermissionRepository } from '../domain/permission.repository.js';
import { CreatePermissionDto } from '../presentation/http/dto/create-permission.dto.js';
import { UpdatePermissionDto } from '../presentation/http/dto/update-permission.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

@Injectable()
export class PermissionsService {

    constructor(@Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: PermissionRepository) {}

    async create(dto: CreatePermissionDto): Promise<Permission> {
        const permission = new Permission({
            name: dto.name,
            slug: dto.slug,
            description: dto.description ?? null,
        });

        return this.permissionRepository.create(permission);
    }

    async findAll(options: QueryOptions = {}) {
        return this.permissionRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Permission> {
        const permission = await this.permissionRepository.find(id, options);

        if (!permission) {
            throw new NotFoundException(`Permission with id ${id} not found`);
        }

        return permission;
    }


    async update(id: number, dto: UpdatePermissionDto): Promise<Permission> {
        const permission = await this.findById(id);

        if (dto.name !== undefined) {
            permission.changeName(dto.name);
        }

        if (dto.description !== undefined) {
            permission.changeDescription(
                dto.description,
            );
        }

        const data: Partial<PermissionAttributes> = {
            name: permission.name,
            slug: permission.slug,
            description: permission.description,
        };

        return this.permissionRepository.update(id, data);
    }


    async delete(id: number): Promise<Permission> {
        const permission = await this.findById(id);

        return this.permissionRepository.delete(id);
    }


    async restore(id: number): Promise<Permission> {
        const permission = await this.permissionRepository.find(id, { trashed: 'only' });

        if (!permission) {
            throw new NotFoundException(`Permission with id ${id} not found`);
        }

        if (!permission.deletedAt) {
            return permission;
        }

        // Check active permission with the same name
        const activePermissionByName =
            await this.permissionRepository.findOneBy({
                name: permission.name,
                deletedAt: null,
            });

        if (activePermissionByName) {
            throw new ConflictException(`Cannot restore permission "${permission.slug}" because an active permission with the same name already exists.`);
        }

        // Check active permission with the same slug
        const activePermissionBySlug =
            await this.permissionRepository.findOneBy({
                slug: permission.slug,
                deletedAt: null,
            });

        if (activePermissionBySlug) {
            throw new ConflictException(`Cannot restore permission "${permission.slug}" because an active permission with the same slug already exists.`);
        }

        return this.permissionRepository.restore(id);
    }


    async forceDelete(id: number): Promise<Permission> {
        // await this.findById(id);

        return this.permissionRepository.forceDelete(id);
    }
}