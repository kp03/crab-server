import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RiderRegisterDto {
    @IsNotEmpty()
    @IsString()
    readonly id: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email!"})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    readonly phone: string;

    @IsString()
    @MinLength(5)
    password: string;

}