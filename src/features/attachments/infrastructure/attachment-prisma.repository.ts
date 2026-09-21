import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service.js';
import { BaseRepository } from '../../../core/database/repositories/base.repository.js';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';
import { Attachment, type AttachmentAttributes } from '../domain/attachment.model.js';
import { AttachmentRepository } from '../domain/attachment.repository.js';

@Injectable()

export class AttachmentPrismaRepository extends BaseRepository<Attachment, AttachmentAttributes> implements AttachmentRepository
{
    constructor(private readonly prisma: PrismaService) {
        super(prisma.db.orm.public.Attachment);
    }

    protected allowedSorts(): string[] {
        return [
            'id',
            'fileName',
            'originalName',
            'mimeType',
            'size',
            'objectionId',
            'violationId',
            'createdAt',
            'updatedAt',
        ];
    }

    protected allowedFilters(): string[] {
        return [
            'id',
            'fileName',
            'originalName',
            'mimeType',
            'size',
            'objectionId',
            'violationId',
            'createdAt',
        ];
    }

    protected allowedIncludes(): string[] {
        return [
            'objection',
            'violation',
        ];
    }

    protected allowedFields(): string[] {
        return [
            'id',
            'fileName',
            'originalName',
            'mimeType',
            'size',
            'path',
            'objectionId',
            'violationId',
            'createdAt',
            'updatedAt',
            'deletedAt',
        ];
    }

    protected defaultSort(): string[] {
        return [
            '-createdAt',
        ];
    }

    async create(attachment: Attachment): Promise<Attachment> {
        const data = attachment.toAttributes();

        return this.createRecord(data);
    }

    async all(options: QueryOptions = {}): Promise<any> {
        const builder = this.createQuery(options);
        const records = await builder.all();

        let attachments =
            records.map(
                (record: AttachmentAttributes) =>
                    this.toDomain(record),
            );

        /*
        =========================
        PAGINATION
        =========================
        */

        if (options.paginate === false) {
            return attachments;
        }

        const page = options.page ?? 1;

        const perPage = options.perPage ?? 10;

        const total = attachments.length;

        const start = (page - 1) * perPage;

        const items = attachments.slice(start, start + perPage);

        return {
            items,
            pagination: {
                currentPage: page,
                perPage,
                total,
                lastPage: Math.ceil(
                    total / perPage,
                ),
            },
        };
    }

    async first(options: QueryOptions = {}): Promise<Attachment | null> {
        return super.first(options);
    }

    async find(id: number, options: QueryOptions = {}): Promise<Attachment | null> {
        return super.find(id, options);
    }

    async update(id: number, data: Partial<AttachmentAttributes>): Promise<Attachment> {
        const updated =
            await this.updateRecord(
                id,
                this.toPrismaUpdateData(
                    data,
                ),
            );

        if (!updated) {
            throw new Error(`Attachment with id ${id} not found`);
        }

        return updated;
    }

    async delete(id: number): Promise<Attachment> {
        const deleted = await this.softDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Attachment with id ${id} not found`);
        }

        return deleted;
    }

    async restore(id: number): Promise<Attachment> {
        const restored = await this.restoreRecord(id);

        if (!restored) {
            throw new Error(`Attachment with id ${id} not found`);
        }

        return restored;
    }

    async forceDelete(id: number): Promise<Attachment> {
        const deleted = await this.forceDeleteRecord(id);

        if (!deleted) {
            throw new Error(`Attachment with id ${id} not found`);
        }

        return deleted;
    }

    protected toDomain(data: AttachmentAttributes): Attachment {
        return new Attachment(data);
    }

    private toPrismaUpdateData(data: Partial<AttachmentAttributes>): Record<string, unknown> {

        return {
            ...(data.fileName !== undefined && {
                fileName: data.fileName,
            }),

            ...(data.originalName !== undefined && {
                originalName: data.originalName,
            }),

            ...(data.mimeType !== undefined && {
                mimeType: data.mimeType,
            }),

            ...(data.size !== undefined && {
                size: data.size,
            }),

            ...(data.path !== undefined && {
                path: data.path,
            }),

            ...(data.objectionId !== undefined && {
                objectionId: data.objectionId,
            }),

            ...(data.violationId !== undefined && {
                violationId: data.violationId,
            }),

            ...(data.deletedAt !== undefined && {
                deletedAt: data.deletedAt,
            }),
        };
    }
}
