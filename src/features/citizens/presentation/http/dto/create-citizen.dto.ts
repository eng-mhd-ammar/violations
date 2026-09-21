import { IsInt, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { UniqueNotDeleted } from '../../../../../core/validation/decorators/unique-not-deleted.decorator.js';
import { Exists } from '../../../../../core/validation/decorators/exists.decorator.js';

export class CreateCitizenDto {
    @UniqueNotDeleted('Citizen', 'nationalId')
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    nationalId: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    firstName: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    lastName: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    fatherName: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    motherName: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    dateOfBirth: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    @Matches(/^\+?[0-9]{8,15}$/, {
            message: 'phone must be a valid phone number',
        })
    phone: string;
}