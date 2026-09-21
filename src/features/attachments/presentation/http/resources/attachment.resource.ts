

import { env } from 'process';
import { ObjectionResource } from '../../../../violations/objections/presentation/http/resources/objection.resource.js';
import { ViolationResource } from '../../../../violations/violations/presentation/http/resources/violation.resource.js';
import { Attachment } from '../../../domain/attachment.model.js';
import 'dotenv/config';

export interface AttachmentResourceData {
    id: number | undefined;

    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;

    objectionId?: number | null;
    violationId?: number | null;

    objection?: ReturnType<typeof ObjectionResource.make>;
    violation?: ReturnType<typeof ViolationResource.make>;

}

export class AttachmentResource {
    static make(attachment: Attachment, includes: string[] = []): AttachmentResourceData {

        const resource: AttachmentResourceData = {
            id: attachment.id,

            fileName: attachment.fileName,
            originalName: attachment.originalName,
            mimeType: attachment.mimeType,
            size: attachment.size,
            path: env.STORAGE_DOMAIN + attachment.path,

            objectionId: attachment.objectionId,
            violationId: attachment.violationId,
        };

        if (includes.includes('objection') && attachment.objection) {
            resource.objection = ObjectionResource.make(attachment.objection, includes);
        }

        if (includes.includes('violation') && attachment.violation) {
            resource.violation = ViolationResource.make(attachment.violation, includes);
        }

        return resource;
    }

    static collection(attachments: Attachment[], includes: string[] = []): AttachmentResourceData[] {
        return attachments.map(
            (attachment) => this.make(
                attachment,
                includes,
            ),
        );
    }
}