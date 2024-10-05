import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class RegisterUserDto {

    @IsEmail()
    email: string

    @IsString()
    @IsStrongPassword()
    @IsOptional()
    password?: string
}