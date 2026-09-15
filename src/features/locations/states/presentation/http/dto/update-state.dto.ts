import { IsOptional, IsString, Length } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { route } from '../../../../../../core/http/helpers/route.helper.js';

export class UpdateStateDto {
    @UniqueNotDeleted('State', 'name', route('id'))
    @IsOptional()
    @IsString()
    @Length(2, 100)
    name?: string;
}