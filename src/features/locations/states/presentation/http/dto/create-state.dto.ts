import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';

export class CreateStateDto {
    @UniqueNotDeleted('State', 'name')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;
}