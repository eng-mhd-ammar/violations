import { ViolationType } from '../../../domain/violation-type.model.js';

export interface ViolationTypeResourceData {
    id: number | undefined;

    name: string;
    description: string | null;
    defaultFine: number;
    isActive: boolean;

    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | null;

    // violations: ReturnType<typeof ViolationResource.make>[];
}

export class ViolationTypeResource {

    static make(violationType: ViolationType): ViolationTypeResourceData {

        const resource: ViolationTypeResourceData = {
            id: violationType.id,
            name: violationType.name,
            description: violationType.description,
            defaultFine: violationType.defaultFine,
            isActive: violationType.isActive,
            createdAt: violationType.createdAt,
            updatedAt: violationType.updatedAt,
            deletedAt: violationType.deletedAt,
        };

        return resource;

    }

    static collection(violationTypes: ViolationType[]): ViolationTypeResourceData[] {
        return violationTypes.map(
            (violationType) =>
                this.make(violationType),
        );
    }
}