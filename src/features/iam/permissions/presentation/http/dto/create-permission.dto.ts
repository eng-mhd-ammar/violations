import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    @Matches(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/, {
        message:
            'slug must contain only lowercase letters, numbers, hyphens, or underscores',
    })
    slug: string;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string;
}