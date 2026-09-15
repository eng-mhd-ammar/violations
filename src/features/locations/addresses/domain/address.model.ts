import { State } from "../../states/domain/state.model";

export type AddressAttributes = {
    id?: number;
    stateId: number;
    city: string;
    street: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    state?: State;
};

export class Address {
    private attributes: AddressAttributes;

    constructor(attributes: AddressAttributes) {
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

    get stateId(): number {
        return this.attributes.stateId;
    }

    get city(): string {
        return this.attributes.city;
    }

    get street(): string {
        return this.attributes.street;
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

    get state(): State | undefined {
        return this.attributes.state;
    }

    // ============================================================
    // Mutations
    // ============================================================

    changeStateId(stateId: number): void {
        this.attributes.stateId = stateId;
    }

    changeCity(city: string): void {
        this.attributes.city = city;
    }

    changeStreet(street: string): void {
        this.attributes.street = street;
    }

    // ============================================================
    // Address
    // ============================================================

    isDeleted(): boolean {
        return this.deletedAt !== null;
    }

    // ============================================================
    // Serialization
    // ============================================================

    toAttributes(): AddressAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): AddressAttributes {
        return {
            ...this.attributes,
        };
    }
}