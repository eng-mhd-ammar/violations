import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    UserRole,
} from '../domain/user-role.model.js';

import {
    UserRoleRepository,
} from '../domain/user-role.repository.js';

import {
    UpdateUserRoleDto,
} from '../presentation/http/dto/update-user-role.dto.js';
import { CreateUserRoleDto } from '../presentation/http/dto/create.user-role.dto.js';

@Injectable()
export class UserRolesService {

    constructor(
        private readonly userRoleRepository: UserRoleRepository,
    ) {}

    // ============================================================
    // Create
    // ============================================================

    async create(
        dto: CreateUserRoleDto,
    ): Promise<UserRole> {

        const userRole = new UserRole({
            userId: dto.userId,
            roleId: dto.roleId,
        });

        return this.userRoleRepository.create(
            userRole,
        );
    }

    // ============================================================
    // Find All
    // ============================================================

    async findAll(): Promise<UserRole[]> {
        return this.userRoleRepository.findAll();
    }

    // ============================================================
    // Find By ID
    // ============================================================

    async findById(
        id: number,
    ): Promise<UserRole> {

        const userRole =
            await this.userRoleRepository.findById(id);

        if (!userRole) {
            throw new NotFoundException(
                `UserRole with id ${id} not found`,
            );
        }

        return userRole;
    }

    // ============================================================
    // Update
    // ============================================================

    async update(
        id: number,
        dto: UpdateUserRoleDto,
    ): Promise<UserRole> {

        await this.findById(id);

        return this.userRoleRepository.update(
            id,
            dto,
        );
    }

    // ============================================================
    // Soft Delete
    // ============================================================

    async delete(
        id: number,
    ): Promise<UserRole> {

        await this.findById(id);

        return this.userRoleRepository.delete(id);
    }

    // ============================================================
    // Restore
    // ============================================================

    async restore(
        id: number,
    ): Promise<UserRole> {

        const userRole =
            await this.userRoleRepository
                .findByIdIncludingDeleted(id);

        if (!userRole) {
            throw new NotFoundException(
                `UserRole with id ${id} not found`,
            );
        }

        if (!userRole.deletedAt) {
            return userRole;
        }

        return this.userRoleRepository.restore(id);
    }

    // ============================================================
    // Force Delete
    // ============================================================

    async forceDelete(
        id: number,
    ): Promise<UserRole> {

        const userRole =
            await this.userRoleRepository
                .findByIdIncludingDeleted(id);

        if (!userRole) {
            throw new NotFoundException(
                `UserRole with id ${id} not found`,
            );
        }

        return this.userRoleRepository.forceDelete(id);
    }
}