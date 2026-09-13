import { Address } from '../../addresses/domain/address.model.js';

export type StateAttributes = {
    id?: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    addresses?: Address[];
};

export class State {
    private attributes: StateAttributes;

    constructor(attributes: StateAttributes) {
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

    get name(): string {
        return this.attributes.name;
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

    get addresses(): Address[] {
        return this.attributes.addresses ?? [];
    }

    // ============================================================
    // Mutations
    // ============================================================

    changeName(name: string): void {
        this.attributes.name = name;
    }

    // ============================================================
    // State
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): StateAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): StateAttributes {
        return {
            ...this.attributes,
        };
    }
}