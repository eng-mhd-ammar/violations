import {
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';

export class CreateStateDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;
}