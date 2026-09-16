export type ViolationTypeAttributes = {
    id?: number;
    
    name: string;
    defaultFine: number;
    description?: string | null;
    
    isActive?: boolean;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    // violations?: Violation[];
};

export class ViolationType {
    private attributes: ViolationTypeAttributes;

    constructor(attributes: ViolationTypeAttributes) {
        this.attributes = {
            isActive: true,
            description: null,
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

    get name(): string {
        return this.attributes.name;
    }

    get description(): string | null {
        return this.attributes.description ?? null;
    }

    get defaultFine(): number {
        return this.attributes.defaultFine;
    }

    get isActive(): boolean {
        return this.attributes.isActive ?? true;
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

    // get payments(): Payment[] {
    //     return this.attributes.payments?? [];
    // }

    // ============================================================
    // Mutations
    // ============================================================

    changeName(name: string): void {
        this.attributes.name = name;
    }

    changeDescription(description: string | null): void {
        this.attributes.description = description;
    }

    changeDefaultFine(defaultFine: number): void {
        this.attributes.defaultFine = defaultFine;
    }

    changeIsActive(isActive: boolean): void {
        this.attributes.isActive = isActive;
    }

    activate(): void {
        this.attributes.isActive = true;
    }

    deactivate(): void {
        this.attributes.isActive = false;
    }

    // ============================================================
    // State
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    isActiveViolationType(): boolean {
        return this.isActive;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): ViolationTypeAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): ViolationTypeAttributes {
        return {
            ...this.attributes,
        };
    }
}