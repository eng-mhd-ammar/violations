import { IsInt, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { route } from '../../../../../core/http/helpers/route.helper.js';
import { Exists } from '../../../../../core/validation/decorators/exists.decorator.js';

export class UpdateCitizenDto {
    @UniqueNotDeleted('Citizen', 'nationalId', route('id'))
    @IsOptional()
    @IsString()
    @Length(2, 100)
    nationalId?: string;

    @IsOptional()
    @IsString()
    @Length(2, 100)
    firstName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 100)
    lastName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 100)
    fatherName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 100)
    motherName?: string;

    @IsOptional()
    @IsString()
    @Length(2, 100)
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    @Length(2, 100)
    @Matches(/^\+?[0-9]{8,15}$/, {
            message: 'phone must be a valid phone number',
        })
    phone?: string;
}