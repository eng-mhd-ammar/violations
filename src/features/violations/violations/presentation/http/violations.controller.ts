import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../../shared/utils/response.js';
import { Can } from '../../../../../core/authorization/decorators/can.decorator.js';
import { ViolationsService } from '../../application/violations.service.js';
import { CreateViolationDto } from './dto/create-violation.dto.js';
import { ViolationResource } from './resources/violation.resource.js';
import { UpdateViolationDto } from './dto/update-violation.dto.js';
import { QueryDto } from '../../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/violations')
export class ViolationsController {

    constructor(private readonly violationsService: ViolationsService) {}

    /**
    * Create a new violation
    *
    * POST /violations
    */
    @Can('violations_create')
    @Post()
    async create(@Body() dto: CreateViolationDto, @Res() res: ExpressResponse,) {
        const violation = await this.violationsService.create(dto);
        const data = ViolationResource.make(violation);

        return new ResponseUtil(res).success(data, 'Violation created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
    * Get all violations
    *
    * GET /violations
    */
    @Can('violations_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.violationsService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: ViolationResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Violations retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Get a single violation
    *
    * GET /violations/:id
    */
    @Can('violations_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const user = await this.violationsService.findById(id);
        const data = ViolationResource.make(user, query.include ?? []);

        return new ResponseUtil(res).success(data, 'Violation retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Update a violation
    *
    * PATCH /violations/:id
    */
    @Can('violations_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateViolationDto, @Res() res: ExpressResponse) {
        const violation = await this.violationsService.update(id, dto);
        const data = ViolationResource.make(violation);

        return new ResponseUtil(res).success(
            data,
            'Violation updated successfully',
            ResponseUtil.HTTP_OK,
        );
    }

    /**
    * Soft delete a violation
    *
    * DELETE /violations/:id
    */
    @Can('violations_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const violation = await this.violationsService.delete(id);
        const data = ViolationResource.make(violation);

        return new ResponseUtil(res).success(data, 'Violation deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Restore a soft-deleted violation
    *
    * POST /violations/:id/restore
    */
    @Can('violations_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const violation = await this.violationsService.restore(id);
        const data = ViolationResource.make(violation);

        return new ResponseUtil(res).success(data, 'Violation restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
    * Force delete a violation
    *
    * DELETE /violations/:id/force-delete
    */
    @Can('violations_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const violation = await this.violationsService.forceDelete(id);
        const data = ViolationResource.make(violation);

        return new ResponseUtil(res).success(data, 'Violation force deleted successfully', ResponseUtil.HTTP_OK);
    }
}