import { Attachment } from './attachment.model.js';
import type { AttachmentAttributes } from './attachment.model.js';
import type { QueryOptions } from '../../../core/database/repositories/query.types.js';

export const ATTACHMENT_REPOSITORY = Symbol('ATTACHMENT_REPOSITORY');

export abstract class AttachmentRepository {
    abstract create(attachment: Attachment): Promise<Attachment>;

    abstract all(options?: QueryOptions): Promise<any>;

    abstract find(id: number, options?: QueryOptions): Promise<Attachment | null>;

    abstract findOneBy(conditions: Record<string, unknown>, options?: QueryOptions): Promise<Attachment | null>;

    abstract first(options?: QueryOptions): Promise<Attachment | null>;

    abstract update(id: number, data: Partial<AttachmentAttributes>): Promise<Attachment>;

    abstract delete(id: number): Promise<Attachment>;

    abstract restore(id: number): Promise<Attachment>;

    abstract forceDelete(id: number): Promise<Attachment>;
}