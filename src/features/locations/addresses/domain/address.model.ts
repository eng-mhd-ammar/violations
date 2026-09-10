import { State } from '../../states/domain/state.model.js';

export interface AddressAttributes {
    id?: number;

    stateId: number;
    state?: State | null;

    city: string;
    street: string;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export class Address {
    private attributes: AddressAttributes;

    constructor(attributes: AddressAttributes) {
        this.attributes = {
            state: null,
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

    get state(): State | null {
        return this.attributes.state ?? null;
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
    // Mutations
    // ============================================================

    changeState(stateId: number): void {
        this.attributes.stateId = stateId;
    }

    changeCity(city: string): void {
        this.attributes.city = city;
    }

    changeStreet(street: string): void {
        this.attributes.street = street;
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

    toAttributes(): AddressAttributes {
        return {
            ...this.attributes,
        };
    }
}