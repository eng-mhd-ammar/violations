import { Inject, Injectable, NotFoundException} from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { Attachment, type AttachmentAttributes} from '../domain/attachment.model.js';
import { ATTACHMENT_REPOSITORY } from '../domain/attachment.repository.js';
import type { AttachmentRepository } from '../domain/attachment.repository.js';
import { CreateAttachmentDto } from '../presentation/http/dto/create-attachment.dto.js';
import { UpdateAttachmentDto } from '../presentation/http/dto/update-attachment.dto.js';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';
@Injectable()
export class AttachmentsService {

    private readonly uploadDirectory = join(process.cwd(), 'storage', 'attachments');

    constructor(@Inject(ATTACHMENT_REPOSITORY) private readonly attachmentRepository: AttachmentRepository) {
        this.ensureUploadDirectory();
    }

    async create(file: Express.Multer.File, dto: CreateAttachmentDto): Promise<Attachment> {

        const fileName = `${randomUUID()}${extname(file.originalname)}`;
        const filePath = join(this.uploadDirectory, fileName);
        const databasePath = join('storage', 'attachments', fileName);
        writeFileSync(filePath, file.buffer);

        const attachment =
            new Attachment({
                ...dto,
                fileName,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                path: databasePath,
            });

        try {
            return await this.attachmentRepository.create(attachment);
        } catch (error) {
            this.deleteFile(databasePath);
            throw error;
        }
    }

    async findAll(options: QueryOptions = {}) {
        return this.attachmentRepository.all(options);
    }

    async findById(id: number, options: QueryOptions = {}): Promise<Attachment> {
        const attachment = await this.attachmentRepository.find(id, options);

        if (!attachment) {
            throw new NotFoundException(`Attachment with id ${id} not found`);
        }

        return attachment;
    }

    async update(id: number, file: Express.Multer.File | undefined, dto: UpdateAttachmentDto): Promise<Attachment> {
        const attachment = await this.findById(id);

        const data: Partial<AttachmentAttributes> = {...dto};

        if (file) {
            const oldPath = attachment.path;
            const fileName = `${randomUUID()}${extname(file.originalname)}`;
            const filePath = join(this.uploadDirectory, fileName);
            const databasePath = join('storage', 'attachments', fileName);

            writeFileSync(filePath, file.buffer);

            data.fileName = fileName;
            data.originalName = file.originalname;
            data.mimeType = file.mimetype;
            data.size = file.size;
            data.path = databasePath;

            try {
                const updated = await this.attachmentRepository.update(id, data);
                this.deleteFile(oldPath);

                return updated;
            } catch (error) {
                this.deleteFile(databasePath);
                throw error;
            }
        }

        return this.attachmentRepository.update(id, data);
    }

    async delete(id: number): Promise<Attachment> {
        await this.findById(id);

        return this.attachmentRepository.delete(id);
    }

    async restore(id: number): Promise<Attachment> {
        const attachment = await this.attachmentRepository.find(id, { trashed: 'only' });

        if (!attachment) {
            throw new NotFoundException(`Attachment with id ${id} not found`);
        }

        if (!attachment.deletedAt) {
            return attachment;
        }

        return this.attachmentRepository.restore(id);
    }

    async forceDelete(id: number): Promise<Attachment> {
        const attachment =
            await this.attachmentRepository.find(id, { trashed: 'with' });

        if (!attachment) {
            throw new NotFoundException(`Attachment with id ${id} not found`);
        }

        const deleted = await this.attachmentRepository.forceDelete(id);
        this.deleteFile(attachment.path);

        return deleted;
    }

    private ensureUploadDirectory(): void {
        if (!existsSync(this.uploadDirectory)) {
            mkdirSync(this.uploadDirectory, { recursive: true });
        }
    }

    private deleteFile(path: string): void {
        const filePath = join(process.cwd(), path);

        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }
    }
}