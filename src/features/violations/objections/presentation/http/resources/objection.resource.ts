import { UserResource } from '../../../../../iam/users/presentation/http/resources/user.resource.js';
import { ViolationResource } from '../../../../violations/presentation/http/resources/violation.resource.js';
import { Objection } from '../../../domain/objection.model.js';

export interface ObjectionResourceData {
    id: number | undefined;

    violationId: number;

    applicantId: number;
    reviewerId?: number | null;

    reason: string;
    description: string;
    status: string;

    reviewedAt?: string | null;
    reviewNotes?: string | null;

    violation?: ReturnType<typeof ViolationResource.make>;
    applicant?: ReturnType<typeof UserResource.make>;
    reviewer?: ReturnType<typeof UserResource.make>;
}

export class ObjectionResource {

    static make(objection: Objection): ObjectionResourceData {

        const resource: ObjectionResourceData = {
            id: objection.id,

            violationId: objection.violationId,

            applicantId: objection.applicantId,
            reviewerId: objection.reviewerId,

            reason: objection.reason,
            description: objection.description,
            status: objection.status,

            reviewedAt: objection.reviewedAt,
            reviewNotes: objection.reviewNotes,
        };

        if (objection.violation) {
            resource.violation = ViolationResource.make(objection.violation);
        }

        if (objection.applicant) {
            resource.applicant = UserResource.make(objection.applicant);
        }

        if (objection.reviewer) {
            resource.reviewer = UserResource.make(objection.reviewer);
        }

        return resource;
    }

    static collection(objections: Objection[]): ObjectionResourceData[] {
        return objections.map(
            (objection) =>
                this.make(objection),
        );
    }
}