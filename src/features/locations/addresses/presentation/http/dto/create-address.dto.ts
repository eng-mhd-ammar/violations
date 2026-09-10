import {
    IsInt,
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';

export class CreateAddressDto {
    @IsInt()
    stateId: number;

    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    city: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    street: string;
}