import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Exists } from '../../../../../core/validation/decorators/exists.decorator.js';

export class CreateAttachmentDto {
    @IsNotEmpty()
    file!: Express.Multer.File;

    @IsInt()
    @IsOptional()
    @Exists('Objection', 'id')
    objectionId?: number;

    @IsInt()
    @IsOptional()
    @Exists('Violation', 'id')
    violationId?: number;

}