import { User } from '../../../iam/users/domain/user.model.js';

import { Violation } from '../../violations/domain/violation.model.js';

export type ObjectionAttributes = {
    id?: number;

    violationId: number;
    applicantId: number;
    reviewerId?: number | null;

    reason: string;
    description: string;
    status: string;

    reviewedAt?: string | null;
    reviewNotes?: string | null;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    violation?: Violation;
    applicant?: User;
    reviewer?: User;
};

export type ObjectionUpdateAttributes = Partial<
    Pick<
        ObjectionAttributes,
        | 'violationId'
        | 'applicantId'
        | 'reviewerId'
        | 'reason'
        | 'description'
        | 'status'
        | 'reviewedAt'
        | 'reviewNotes'
    >
>;

export class Objection {
    private attributes: ObjectionAttributes;

    constructor(attributes: ObjectionAttributes) {
        this.attributes = {
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

    get violationId(): number {
        return this.attributes.violationId;
    }

    get applicantId(): number {
        return this.attributes.applicantId;
    }

    get reviewerId(): number | null | undefined {
        return this.attributes.reviewerId;
    }

    get reason(): string {
        return this.attributes.reason;
    }

    get description(): string {
        return this.attributes.description;
    }

    get status(): string {
        return this.attributes.status;
    }

    get reviewedAt(): string | null | undefined {
        return this.attributes.reviewedAt;
    }

    get reviewNotes(): string | null | undefined {
        return this.attributes.reviewNotes;
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

    get violation(): Violation | undefined {
        return this.attributes.violation;
    }

    get applicant(): User | undefined {
        return this.attributes.applicant;
    }

    get reviewer(): User | undefined {
        return this.attributes.reviewer;
    }

    // ============================================================
    // Mutations
    // ============================================================

    update(attributes: ObjectionUpdateAttributes): void {
        Object.assign(this.attributes, attributes);
    }

    // ============================================================
    // Objection
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): ObjectionAttributes {
        return {
            ...this.attributes,
        };
    }
}