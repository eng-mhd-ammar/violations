import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, Min } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { route } from '../../../../../../core/http/helpers/route.helper.js';

export class UpdateViolationTypeDto {
    @IsOptional()
    @UniqueNotDeleted('ViolationType', 'name', route('id'))
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;
    
    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    defaultFine: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}