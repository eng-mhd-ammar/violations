export type PermissionAttributes = {
  id?: number;
  name: string;
  slug: string;
  description?: string | null;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export class Permission {
  private attributes: PermissionAttributes;

  constructor(attributes: PermissionAttributes) {
    this.attributes = {
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

  get slug(): string {
    return this.attributes.slug;
  }

  get description(): string | null {
    return this.attributes.description ?? null;
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

  changeName(name: string): void {
    this.attributes.name = name;
  }

  changeSlug(slug: string): void {
    this.attributes.slug = slug;
  }

  changeDescription(description: string | null): void {
    this.attributes.description = description;
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

  toAttributes(): PermissionAttributes {
    return {
      ...this.attributes,
    };
  }
}