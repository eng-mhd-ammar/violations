import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class UpdateStateDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name?: string;
}