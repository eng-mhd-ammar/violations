import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto.js';
import { UpdatePermissionDto } from './dto/update-permission.dto.js';
import { PermissionResource } from './resources/permission.resource.js';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import type { Response as ExpressResponse } from 'express';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { PermissionsService } from '../../application/permissions.service.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/permissions')
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService,
    ) {}

    /**
     * Create a new permission
     *
     * POST /permissions
     */
    @Can('permissions_create')
    @Post()
    async create(@Body() dto: CreatePermissionDto, @Res() res: ExpressResponse) {
        const permission = await this.permissionsService.create(dto);
        const data = PermissionResource.make(permission);

        return new ResponseUtil(res).success(data, 'Permission created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
     * Get all permissions
     *
     * GET /permissions
     */
    @Can('permissions_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.permissionsService.findAll(query);

        const isPaginated = 'items' in result;

        const items = isPaginated
            ? result.items
            : result;

        const data = {
            items: PermissionResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Permissions retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Get a single permission
     *
     * GET /permissions/:id
     */
    @Can('permissions_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const permission = await this.permissionsService.findById(id);
        const data = PermissionResource.make(permission);

        return new ResponseUtil(res).success(data, 'Permission retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Update a permission
     *
     * PATCH /permissions/:id
     */
    @Can('permissions_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionDto, @Res() res: ExpressResponse) {
        const permission = await this.permissionsService.update(id, dto);
        const data = PermissionResource.make(permission);

        return new ResponseUtil(res).success(data, 'Permission updated successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Soft delete a permission
     *
     * DELETE /permissions/:id
     */
    @Can('permissions_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const permission = await this.permissionsService.delete(id);
        const data = PermissionResource.make(permission);

        return new ResponseUtil(res).success(data, 'Permission deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Restore a soft-deleted permission
     *
     * POST /permissions/:id/restore
     */
    @Can('permissions_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const permission = await this.permissionsService.restore(id);
        const data = PermissionResource.make(permission);

        return new ResponseUtil(res).success(data, 'Permission restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Force delete a permission
     *
     * DELETE /permissions/:id/force-delete
     */
    @Can('permissions_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const permission = await this.permissionsService.forceDelete(id);
        const data = PermissionResource.make(permission);

        return new ResponseUtil(res).success(data, 'Permission force deleted successfully', ResponseUtil.HTTP_OK);
    }
}
