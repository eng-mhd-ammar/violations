import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../shared/utils/response.js';
import { Can } from '../../../../core/authorization/decorators/can.decorator.js';
import { BranchesService } from '../../application/branches.service.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
import { BranchResource } from './resources/branch.resource.js';
import { UpdateBranchDto } from './dto/update-branch.dto.js';
import { QueryDto } from '../../../../core/database/repositories/query.dto.js';

@Controller('/api/v1/branches')
export class BranchesController {

    constructor(private readonly branchService: BranchesService) {}

    /**
     * Create a new branch
     *
     * POST /branch
     */
    @Can('branch_create')
    @Post()
    async create(@Body() dto: CreateBranchDto, @Res() res: ExpressResponse,) {
        const branch = await this.branchService.create(dto);
        const data = BranchResource.make(branch);

        return new ResponseUtil(res).success(data, 'Branch created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
     * Get all branch
     *
     * GET /branch
     */
    @Can('branch_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto) {
        const result = await this.branchService.findAll(query);
        const isPaginated = 'items' in result;
        const items = isPaginated? result.items: result;

        const data = {
            items: BranchResource.collection(
                items,
                query.include ?? [],
            ),

            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Branch retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Get a single branch
     *
     * GET /branch/:id
     */
    @Can('branch_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const branch = await this.branchService.findById(id, query);
        const data = BranchResource.make( branch, query.include ?? []);

        return new ResponseUtil(res).success(data, 'Branch retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Update a branch
     *
     * PATCH /branch/:id
     */
    @Can('branch_update')
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBranchDto, @Res() res: ExpressResponse) {
        const branch = await this.branchService.update(id, dto);
        const data = BranchResource.make(branch);

        return new ResponseUtil(res).success(data, 'Branch updated successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Soft delete a branch
     *
     * DELETE /branch/:id
     */
    @Can('branch_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const branch = await this.branchService.delete(id);
        const data = BranchResource.make(branch);

        return new ResponseUtil(res).success(data, 'Branch deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Restore a soft-deleted branch
     *
     * POST /branch/:id/restore
     */
    @Can('branch_restore')
    @Get(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const branch = await this.branchService.restore(id);
        const data = BranchResource.make(branch);

        return new ResponseUtil(res).success(data, 'Branch restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Force delete a branch
     *
     * DELETE /branch/:id/force-delete
     */
    @Can('branch_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const branch = await this.branchService.forceDelete(id);
        const data = BranchResource.make(branch);

        return new ResponseUtil(res).success(data, 'Branch force deleted successfully', ResponseUtil.HTTP_OK);
    }
}