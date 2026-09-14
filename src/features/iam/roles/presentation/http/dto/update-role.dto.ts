import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { route } from '../../../../../../core/http/helpers/route.helper.js';
import { ExistsOrMinusOne } from '../../../../../../core/validation/decorators/exists-or-minus-one.decorator.js';

export class UpdateRoleDto {
    @UniqueNotDeleted('Role', 'name', route('id'))
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name?: string;

    @UniqueNotDeleted('Role', 'slug', route('id'))
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
    
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @ExistsOrMinusOne('Permission', 'id', { each: true })
    permissions?: number[];
}
