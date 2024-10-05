import { IsEmail, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    email: string

    @IsString()
    @IsStrongPassword()
    @IsOptional()
    password?: string
}