import {
    IsInt,
    IsNotEmpty,
    IsPositive,
} from 'class-validator';

export class CreateUserRoleDto {
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    roleId: number;
}
