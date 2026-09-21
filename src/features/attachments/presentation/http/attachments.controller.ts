import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response as ExpressResponse } from 'express';
import { ResponseUtil } from '../../../../shared/utils/response.js';
import { Can } from '../../../../core/authorization/decorators/can.decorator.js';
import { AttachmentsService } from '../../application/attachments.service.js';
import { CreateAttachmentDto } from './dto/create-attachment.dto.js';
import { AttachmentResource } from './resources/attachment.resource.js';
import { UpdateAttachmentDto } from './dto/update-attachment.dto.js';
import { QueryDto } from '../../../../core/database/repositories/query.dto.js';
import { Multer } from 'multer';

@Controller('/api/v1/attachments')
export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) {}

    /**
     * Create a new attachment
     *
     * POST /attachments
     */
    @Can('attachments_create')
    @Post()
    @UseInterceptors(FileInterceptor('file'))

    async create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateAttachmentDto, @Res() res: ExpressResponse) {
        const attachment = await this.attachmentsService.create(file, dto);
        const data = AttachmentResource.make(attachment);

        return new ResponseUtil(res).success(data, 'Attachment created successfully', ResponseUtil.HTTP_CREATED);
    }

    /**
     * Get all attachments
     *
     * GET /attachments
     */
    @Can('attachments_index')
    @Get()
    async findAll(@Res() res: ExpressResponse, @Query() query: QueryDto,) {
        const result = await this.attachmentsService.findAll(query);
        const isPaginated = 'items' in result;
        const items =isPaginated? result.items: result;
        const data = {
            items: AttachmentResource.collection(
                items,
                query.include ?? [],
            ),
            ...(isPaginated && {
                pagination: result.pagination,
            }),
        };

        return new ResponseUtil(res).success(data, 'Attachments retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Get a single attachment
     *
     * GET /attachments/:id
     */
    @Can('attachments_show')
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse, @Query() query: QueryDto) {
        const attachment = await this.attachmentsService.findById(id, query);
        const data = AttachmentResource.make(attachment, query.include ?? []);

        return new ResponseUtil(res).success(data, 'Attachment retrieved successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Update an attachment
     *
     * PATCH /attachments/:id
     */
    @Can('attachments_update')
    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))

    async update(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File | undefined, @Body() dto: UpdateAttachmentDto, @Res() res: ExpressResponse) {
        const attachment = await this.attachmentsService.update(id, file, dto);
        const data = AttachmentResource.make(attachment);

        return new ResponseUtil(res).success(data, 'Attachment updated successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Soft delete an attachment
     *
     * DELETE /attachments/:id
     */
    @Can('attachments_delete')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const attachment = await this.attachmentsService.delete(id);
        const data = AttachmentResource.make(attachment);

        return new ResponseUtil(res).success(data, 'Attachment deleted successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Restore a soft-deleted attachment
     *
     * POST /attachments/:id/restore
     */
    @Can('attachments_restore')
    @Post(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const attachment = await this.attachmentsService.restore(id);
        const data = AttachmentResource.make(attachment);

        return new ResponseUtil(res).success(data, 'Attachment restored successfully', ResponseUtil.HTTP_OK);
    }

    /**
     * Force delete an attachment
     *
     * DELETE /attachments/:id/force-delete
     */
    @Can('attachments_force_delete')
    @Delete(':id/force-delete')
    async forceDelete(@Param('id', ParseIntPipe) id: number, @Res() res: ExpressResponse) {
        const attachment = await this.attachmentsService.forceDelete(id);
        const data = AttachmentResource.make(attachment);

        return new ResponseUtil(res).success(data, 'Attachment force deleted successfully', ResponseUtil.HTTP_OK);
    }
}