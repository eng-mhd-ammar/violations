export type CurrencyAttributes = {
    id?: number;
    
    name: string;
    code: string;

    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    // payments?: Payment[];
};

export class Currency {
    private attributes: CurrencyAttributes;

    constructor(attributes: CurrencyAttributes) {
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

    get code(): string {
        return this.attributes.code;
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

    changeCode(code: string): void {
        this.attributes.code = code;
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

    toAttributes(): CurrencyAttributes {
        return {
            ...this.attributes,
        };
    }

    toArray(): CurrencyAttributes {
        return {
            ...this.attributes,
        };
    }
}