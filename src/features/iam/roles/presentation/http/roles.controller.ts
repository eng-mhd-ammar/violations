import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
} from '@nestjs/common';

import type { Response as ExpressResponse } from 'express';

import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';

import { RolesService } from '../../application/roles.service.js';

import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { RoleResource } from './resources/role.resource.js';

import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/roles')
export class RolesController {

    constructor(
        private readonly rolesService: RolesService,
    ) {}

    /**
     * Create a new role
     *
     * POST /roles
     */
    @Can('roles_create')
    @Post()
    async create(
        @Body() dto: CreateRoleDto,
        @Res() res: ExpressResponse,
    ) {
        const role = await this.rolesService.create(dto);

        const data = RoleResource.make(role);

        return new ResponseUtil(res).success(
            data,
            'Role created successfully',
            ResponseUtil.HTTP_CREATED,
        );
    }

    /**
     * Get all roles
     *
     * GET /roles
     */
    @Can('roles_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.rolesService.findAll(query);

        const isPaginated = 'items' in result;

        const items = isPaginated
            ? result.items
            : result;

        const data = {
            items: RoleResource.collection(
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
     * Get a single role
     *
     * GET /roles/:id
     */
    @Can('roles_show')
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const service = await this.rolesService.findById(id);
        const data = RoleResource.make(service, query.include ?? []);

        return new ResponseUtil(res).success(
            data,
            'Role retrieved successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Update a role
     *
     * PATCH /roles/:id
     */
    @Can('roles_update')
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleDto,
        @Res() res: ExpressResponse,
    ) {
        const role = await this.rolesService.update(id, dto);

        const data = RoleResource.make(role);

        return new ResponseUtil(res).success(
            data,
            'Role updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Soft delete a role
     *
     * DELETE /roles/:id
     */
    @Can('roles_delete')
    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const role = await this.rolesService.delete(id);

        const data = RoleResource.make(role);

        return new ResponseUtil(res).success(
            data,
            'Role deleted successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Restore a soft-deleted role
     *
     * POST /roles/:id/restore
     */
    @Can('roles_restore')
    @Get(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const role = await this.rolesService.restore(id);

        const data = RoleResource.make(role);

        return new ResponseUtil(res).success(
            data,
            'Role restored successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
     * Force delete a role
     *
     * DELETE /roles/:id/force-delete
     */
    @Can('roles_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: ExpressResponse,
    ) {
        const role = await this.rolesService.forceDelete(id);

        const data = RoleResource.make(role);

        return new ResponseUtil(res).success(
            data,
            'Role force deleted successfully',
            ResponseUtil.HTTP_OK,
        );
    }
}