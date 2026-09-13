import { Transform } from 'class-transformer';
import { Allow, IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IsIn } from 'class-validator';

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

export class QueryDto {

    @IsOptional()
    @Allow()
    filter?: Record<string, unknown>;

    @IsOptional()
    @Transform(({ value }) => toArray(value))
    @IsArray()
    @IsString({ each: true })
    sort?: string[];

    @IsOptional()
    @Transform(({ value }) => toArray(value))
    @IsArray()
    @IsString({ each: true })
    include?: string[];

    @IsOptional()
    @Transform(({ value }) => toArray(value))
    @IsArray()
    @IsString({ each: true })
    fields?: string[];

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return undefined;
        }

        return Number(value);
    })
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return undefined;
        }

        return Number(value);
    })
    @IsInt()
    @Min(1)
    perPage?: number;

    @IsOptional()
    @IsIn(['not', 'with', 'only'])
    trashed: 'not' | 'with' | 'only' = 'not';
}