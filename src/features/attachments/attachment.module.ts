import { ATTACHMENT_REPOSITORY } from './domain/attachment.repository.js';
import { Module } from '@nestjs/common';
import { AttachmentsController } from './presentation/http/attachments.controller.js';
import { AttachmentsService } from './application/attachments.service.js';
import { AttachmentPrismaRepository } from './infrastructure/attachment-prisma.repository.js';

@Module({
    controllers: [
        AttachmentsController,
    ],

    providers: [
        AttachmentsService,

        {
            provide: ATTACHMENT_REPOSITORY,
            useClass: AttachmentPrismaRepository,
        },
    ],
})
    
export class AttachmentsModule {}