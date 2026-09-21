import { Objection } from "../../violations/objections/domain/objection.model";
import { Violation } from "../../violations/violations/domain/violation.model";


export type AttachmentAttributes = {
    id?: number;

    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;

    objectionId?: number | null;
    violationId?: number | null;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    objection?: Objection;
    violation?: Violation;

};

export class Attachment {
    private attributes: AttachmentAttributes;

    constructor(attributes: AttachmentAttributes) {
        this.attributes = {
            objectionId: null,
            violationId: null,
            deletedAt: null,
            ...attributes,
        };
    }

    // ============================================================
    // Attributes
    // ============================================================

    get id(): number | undefined {
        return this.attributes.id;
    }

    get fileName(): string {
        return this.attributes.fileName;
    }

    get originalName(): string {
        return this.attributes.originalName;
    }

    get mimeType(): string {
        return this.attributes.mimeType;
    }

    get size(): number {
        return this.attributes.size;
    }

    get path(): string {
        return this.attributes.path;
    }

    get objectionId(): number | null | undefined {
        return this.attributes.objectionId;
    }

    get violationId(): number | null | undefined {
        return this.attributes.violationId;
    }

    get createdAt(): string | undefined {
        return this.attributes.createdAt;
    }

    get updatedAt(): string | undefined {
        return this.attributes.updatedAt;
    }

    get deletedAt(): string | null {
        return this.attributes.deletedAt ?? null;
    }

    // ============================================================
    // Relations
    // ============================================================

    get objection(): Objection | undefined {
        return this.attributes.objection;
    }

    get violation(): Violation | undefined {
        return this.attributes.violation;
    }

    // ============================================================
    // Mutations
    // ============================================================

    changeFileName(fileName: string): void {
        this.attributes.fileName = fileName;
    }

    changeOriginalName(originalName: string): void {
        this.attributes.originalName = originalName;
    }

    changeMimeType(mimeType: string): void {
        this.attributes.mimeType = mimeType;
    }

    changeSize(size: number): void {
        this.attributes.size = size;
    }

    changePath(path: string): void {
        this.attributes.path = path;
    }

    changeObjectionId(objectionId: number | null): void {
        this.attributes.objectionId = objectionId;
    }

    changeViolationId(violationId: number | null): void {
        this.attributes.violationId = violationId;
    }

    // ============================================================
    // Attachment
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): AttachmentAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): AttachmentAttributes {
        return {
            ...this.attributes,
        };
    }
}
