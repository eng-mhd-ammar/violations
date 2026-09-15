import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto.js';
import { RolePermissionResource } from './resources/role-permission.resource.js';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto.js';
import { RolePermissionsService } from '../../application/role-permissions.service.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/role-permissions')
export class RolePermissionsController {

    constructor(
        private readonly rolePermissionsService: RolePermissionsService,
    ) {}

    /**
     * Create a new role permission
     *
     * POST /role-permissions
     */
    @Can('role_permissions_create')
    @Post()
    async create(@Body() dto: CreateRolePermissionDto, @Res() res: ExpressResponse) {
        const rolePermission = await this.rolePermissionsService.create(dto);
        const data = RolePermissionResource.make(rolePermission);

        return new ResponseUtil(res).success(data, 'Role permission created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
     * Get all role permissions
     *
     * GET /role-permissions
     */
    @Can('role_permissions_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.rolePermissionsService.findAll(query);
        const isPaginated = 'items' in result;

        const items = isPaginated
            ? result.items
            : result;

        const data = {
            items: RolePermissionResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Roles retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Get a single role permission
     *
     * GET /role-permissions/:id
     */
    @Can('role_permissions_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const rolePermission = await this.rolePermissionsService.findById(id);
        const data = RolePermissionResource.make(rolePermission, query.include ?? []);

        return new ResponseUtil(res).success(data, 'Role permission retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Update a role permission
     *
     * PATCH /role-permissions/:id
     */
    @Can('role_permissions_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolePermissionDto, @Res() res: ExpressResponse) {
        const rolePermission = await this.rolePermissionsService.update(id, dto);
        const data = RolePermissionResource.make(rolePermission);

        return new ResponseUtil(res).success(data, 'Role permission updated successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Soft delete a role permission
    *
    * DELETE /role-permissions/:id
    */
    @Can('role_permissions_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const rolePermission = await this.rolePermissionsService.delete(id);
        const data = RolePermissionResource.make(rolePermission);

        return new ResponseUtil(res).success(data, 'Role permission deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Restore a soft-deleted role permission
    *
    * Get /role-permissions/:id/restore
    */
    @Can('role_permissions_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const rolePermission = await this.rolePermissionsService.restore(id);
        const data = RolePermissionResource.make(rolePermission);

        return new ResponseUtil(res).success(data, 'Role permission restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Force delete a role permission
    *
    * DELETE /role-permissions/:id/force-delete
    */
    @Can('role_permissions_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const rolePermission = await this.rolePermissionsService.forceDelete(id);
        const data = RolePermissionResource.make(rolePermission);

        return new ResponseUtil(res).success(data, 'Role permission force deleted successfully', ResponseUtil.HTTP_OK);
    }
}