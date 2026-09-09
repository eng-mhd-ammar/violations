import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';


import {
    UpdateRolePermissionDto,
} from '../presentation/http/dto/update-role-permission.dto.js';
import { RolePermissionRepository } from '../domain/user-role.repository.js';
import { CreateRolePermissionDto } from '../presentation/http/dto/create.role-permission.dto.js';
import { RolePermission } from '../domain/user-role.model.js';

@Injectable()
export class RolePermissionsService {

    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
    ) {}

    // ============================================================
    // Create
    // ============================================================

    async create(
        dto: CreateRolePermissionDto,
    ): Promise<RolePermission> {

        const rolePermission = new RolePermission({

            roleId: dto.roleId,

            permissionId: dto.permissionId,

        });

        return this.rolePermissionRepository.create(
            rolePermission,
        );
    }

    // ============================================================
    // Find All
    // ============================================================

    async findAll(): Promise<RolePermission[]> {

        return this.rolePermissionRepository.findAll();

    }

    // ============================================================
    // Find By ID
    // ============================================================

    async findById(
        id: number,
    ): Promise<RolePermission> {

        const rolePermission =
            await this.rolePermissionRepository.findById(id);

        if (!rolePermission) {

            throw new NotFoundException(
                `RolePermission with id ${id} not found`,
            );

        }

        return rolePermission;
    }

    // ============================================================
    // Update
    // ============================================================

    async update(
        id: number,
        dto: UpdateRolePermissionDto,
    ): Promise<RolePermission> {

        await this.findById(id);

        return this.rolePermissionRepository.update(
            id,
            dto,
        );
    }

    // ============================================================
    // Soft Delete
    // ============================================================

    async delete(
        id: number,
    ): Promise<RolePermission> {

        await this.findById(id);

        return this.rolePermissionRepository.delete(id);
    }

    // ============================================================
    // Restore
    // ============================================================

    async restore(
        id: number,
    ): Promise<RolePermission> {

        const rolePermission =
            await this.rolePermissionRepository
                .findByIdIncludingDeleted(id);

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

    // ============================================================
    // Force Delete
    // ============================================================

    async forceDelete(
        id: number,
    ): Promise<RolePermission> {

        const rolePermission =
            await this.rolePermissionRepository
                .findByIdIncludingDeleted(id);

        if (!rolePermission) {

            throw new NotFoundException(
                `RolePermission with id ${id} not found`,
            );

        }

        return this.rolePermissionRepository.forceDelete(id);
    }
}