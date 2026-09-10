import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class UpdateAddressDto {
    @IsOptional()
    @IsInt()
    stateId?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    city?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    street?: string;
}