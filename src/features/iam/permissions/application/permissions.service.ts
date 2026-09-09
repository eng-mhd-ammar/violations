import { Permission, PermissionAttributes } from './../domain/permission.model.js';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PermissionRepository } from '../domain/permission.repository.js';
import { CreatePermissionDto } from '../presentation/http/dto/create-permission.dto.js';
import { UpdatePermissionDto } from '../presentation/http/dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}

  /**
   * Create a new permission
   */
  async create(dto: CreatePermissionDto): Promise<Permission> {
    const existingSlug =
      await this.permissionRepository.findBySlug(dto.slug);

    if (existingSlug) {
      throw new ConflictException('Permission slug is already in use');
    }

    const permission = new Permission({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
    });

    return this.permissionRepository.create(permission);
  }

  /**
   * Get all permissions
   */
  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.findAll();
  }

  /**
   * Get permission by ID
   */
  async findById(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundException(
        `Permission with id ${id} not found`,
      );
    }

    return permission;
  }

  /**
   * Update permission
   */
  async update(
    id: number,
    dto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findById(id);

    if (
      dto.slug !== undefined &&
      dto.slug !== permission.slug
    ) {
      const existingSlug =
        await this.permissionRepository.findBySlug(dto.slug);

      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException(
          'Permission slug is already in use',
        );
      }
    }

    const data: Partial<PermissionAttributes> = {
      name:
        dto.name !== undefined
          ? dto.name
          : permission.name,

      slug:
        dto.slug !== undefined
          ? dto.slug
          : permission.slug,

      description:
        dto.description !== undefined
          ? dto.description
          : permission.description,
    };

    return this.permissionRepository.update(id, data);
  }

  /**
   * Soft delete permission
   */
  async delete(id: number): Promise<Permission> {
    const permission = await this.findById(id);

    await this.permissionRepository.delete(id);

    return permission;
  }

  /**
   * Restore soft-deleted permission
   */
  async restore(id: number): Promise<Permission> {
    const permission =
      await this.permissionRepository.findByIdIncludingDeleted(id);

    if (!permission) {
      throw new NotFoundException(
        `Permission with id ${id} not found`,
      );
    }

    if (!permission.deletedAt) {
      return permission;
    }

    return this.permissionRepository.restore(id);
  }

  /**
   * Force delete permission
   */
  async forceDelete(id: number): Promise<Permission> {
    const permission = await this.findById(id);

    await this.permissionRepository.forceDelete(id);

    return permission;
  }
}