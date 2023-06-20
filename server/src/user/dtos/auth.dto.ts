import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, Matches } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @IsEmail()
    email: string;


    @IsString()
    @MinLength(5)
    password: string;
}

export class SignInDto {


    @IsOptional() // Make the phone field optional
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @IsOptional() // Make the phone field optional
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;

}