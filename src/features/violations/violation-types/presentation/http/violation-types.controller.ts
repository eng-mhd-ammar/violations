import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { CreateViolationTypeDto } from './dto/create-violation-type.dto.js';
import { UpdateViolationTypeDto } from './dto/update-violation-type.dto.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';
import { ViolationTypesService } from '../../application/violation-types.service.js';
import { ViolationTypeResource } from './resources/violation-type.resource.js';

@Controller('/api/v1/violation-types')
export class ViolationTypesController {

    constructor(private readonly violationTypeService: ViolationTypesService) {}

    /**
     * Create a new violationType
     *
     * POST /violationType
     */
    @Can('violationType_create')
    @Post()
    async create(@Body() dto: CreateViolationTypeDto, @Res() res: ExpressResponse,) {
        const violationType = await this.violationTypeService.create(dto);
        const data = ViolationTypeResource.make(violationType);

        return new ResponseUtil(res).success(data, 'ViolationType created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
     * Get all violationType
     *
     * GET /violationType
     */
    @Can('violationType_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.violationTypeService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: ViolationTypeResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'ViolationType retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Get a single violationType
     *
     * GET /violationType/:id
     */
    @Can('violationType_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const violationType = await this.violationTypeService.findById(id, query);
        const data = ViolationTypeResource.make( violationType, query.include ?? []);

        return new ResponseUtil(res).success(data, 'ViolationType retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Update a violationType
     *
     * PATCH /violationType/:id
     */
    @Can('violationType_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateViolationTypeDto, @Res() res: ExpressResponse) {
        const violationType = await this.violationTypeService.update(id, dto);
        const data = ViolationTypeResource.make(violationType);

        return new ResponseUtil(res).success(data, 'ViolationType updated successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Soft delete a violationType
     *
     * DELETE /violationType/:id
     */
    @Can('violationType_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const violationType = await this.violationTypeService.delete(id);
        const data = ViolationTypeResource.make(violationType);

        return new ResponseUtil(res).success(data, 'ViolationType deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Restore a soft-deleted violationType
     *
     * POST /violationType/:id/restore
     */
    @Can('violationType_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const violationType = await this.violationTypeService.restore(id);
        const data = ViolationTypeResource.make(violationType);

        return new ResponseUtil(res).success(data, 'ViolationType restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Force delete a violationType
     *
     * DELETE /violationType/:id/force-delete
     */
    @Can('violationType_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const violationType = await this.violationTypeService.forceDelete(id);
        const data = ViolationTypeResource.make(violationType);

        return new ResponseUtil(res).success(data, 'ViolationType force deleted successfully', ResponseUtil.HTTP_OK);
    }
}