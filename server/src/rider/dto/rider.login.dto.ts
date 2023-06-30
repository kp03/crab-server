import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RiderLoginDto {
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email!"})
    @IsOptional()
    readonly email: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    readonly phone: string;

    @IsString()
    @MinLength(5)
    password: string;

}