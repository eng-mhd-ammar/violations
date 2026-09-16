import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class CreateViolationTypeDto {
    @UniqueNotDeleted('ViolationType', 'name')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;
    
    @IsOptional()
    @IsString()
    @Length(0, 500)
    description?: string;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    defaultFine: number;
    
    @IsOptional()
    @IsBoolean()
    isActive: boolean = true;
}