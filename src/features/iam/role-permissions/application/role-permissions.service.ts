import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RolePermission } from '../domain/role-permission.model.js';
import type { RolePermissionAttributes } from '../domain/role-permission.model.js';
import { ROLE_PERMISSION_REPOSITORY } from '../domain/role-permission.repository.js';
import type { RolePermissionRepository } from '../domain/role-permission.repository.js';
import { CreateRolePermissionDto } from '../presentation/http/dto/create-role-permission.dto.js';
import { UpdateRolePermissionDto } from '../presentation/http/dto/update-role-permission.dto.js';
import type { QueryOptions } from '../../../../core/database/repositories/query.types.js';

@Injectable()
export class RolePermissionsService {
    constructor(@Inject(ROLE_PERMISSION_REPOSITORY) private readonly rolePermissionRepository: RolePermissionRepository) {}

    async create(dto: CreateRolePermissionDto): Promise<RolePermission> {
        const rolePermission = new RolePermission({
            permissionId: dto.permissionId,
            roleId: dto.roleId,
        });

        return this.rolePermissionRepository.create(rolePermission);
    }

    async findAll(options: QueryOptions = {}) {
        return this.rolePermissionRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<RolePermission> {
        const rolePermission =
            await this.rolePermissionRepository.find(
                id,
                options,
            );

        if (!rolePermission) {
            throw new NotFoundException(
                `RolePermission with id ${id} not found`,
            );
        }

        return rolePermission;
    }

    async update(id: number, dto: UpdateRolePermissionDto): Promise<RolePermission> {
        const rolePermission = await this.findById(id);

        const data: Partial<RolePermissionAttributes> = {
            roleId: rolePermission.roleId,
            permissionId: rolePermission.permissionId,
        };

        return this.rolePermissionRepository.update(id, data);
    }

    async delete(id: number): Promise<RolePermission> {
        const rolePermission = await this.findById(id);

        return this.rolePermissionRepository.delete(id);
    }


    async restore(id: number): Promise<RolePermission> {
        const rolePermission = await this.rolePermissionRepository.find(id, { trashed: 'only'});

        if (!rolePermission) {
            throw new NotFoundException(
                `RolePermission with id ${id} not found`,
            );
        }

        if (!rolePermission.deletedAt) {
            return rolePermission;
        }

        return this.rolePermissionRepository.restore(id);
    }


    async forceDelete(
        id: number,
    ): Promise<RolePermission> {

        await this.findById(id);

        return this.rolePermissionRepository.forceDelete(id);
    }
}