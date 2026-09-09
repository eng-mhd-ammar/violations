import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator';

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    @Matches(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, {
        message:
            'slug must contain only lowercase letters, numbers, dots, hyphens, or underscores',
    })
    slug?: string;

    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string | null;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
