import { Transform } from 'class-transformer';
import {
    Allow,
    IsArray,
    IsBoolean,
    IsInt,
    IsIn,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

function toArray(value: unknown): string[] | undefined {
    if (
        value === undefined ||
        value === null ||
        value === ''
    ) {
        return undefined;
    }

    if (Array.isArray(value)) {
        return value.map(String);
    }

    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function toBoolean(value: unknown): boolean | undefined {
    if (
        value === undefined ||
        value === null ||
        value === ''
    ) {
        return undefined;
    }

    if (value === true || value === 'true') {
        return true;
    }

    if (value === false || value === 'false') {
        return false;
    }

    return undefined;
}

export class QueryDto {
    // ============================================================
    // Filter
    // ============================================================

    @IsOptional()
    @Allow()
    filter?: Record<string, unknown>;

    // ============================================================
    // Sort
    // ============================================================

    @IsOptional()
    @Transform(({ value }) => toArray(value))
    @IsArray()
    @IsString({ each: true })
    sort?: string[];

    // ============================================================
    // Include
    // ============================================================

    @IsOptional()
    @Transform(({ value }) => toArray(value))
    @IsArray()
    @IsString({ each: true })
    include?: string[];

    // ============================================================
    // Fields
    // ============================================================

    @IsOptional()
    @Transform(({ value }) => toArray(value))
    @IsArray()
    @IsString({ each: true })
    fields?: string[];

    // ============================================================
    // Search
    // ============================================================

    @IsOptional()
    @IsString()
    search?: string;

    // ============================================================
    // Pagination
    // ============================================================

    @IsOptional()
    @Transform(({ value }) => {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return 1;
        }

        return Number(value);
    })
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return 10;
        }

        return Number(value);
    })
    @IsInt()
    @Min(1)
    perPage: number = 10;

    @IsOptional()
    @Transform(({ value }) => {
        const result = toBoolean(value);

        return result ?? true;
    })
    @IsBoolean()
    paginate: boolean = true;

    // ============================================================
    // Trashed
    // ============================================================

    @IsOptional()
    @IsIn(['not', 'with', 'only'])
    trashed: 'not' | 'with' | 'only'
}