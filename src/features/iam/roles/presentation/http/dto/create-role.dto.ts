import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    Matches,
} from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class CreateRoleDto {
    @UniqueNotDeleted('Role', 'name')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @UniqueNotDeleted('Role', 'slug')
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

    @IsOptional()
    @IsBoolean()
    isActive: boolean = true;
}