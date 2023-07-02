import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RiderLoginDto {
    @ApiProperty({example: "john.doe@gmail.com"})
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email!"})
    @IsOptional()
    readonly email: string;

    @ApiProperty({example: "0902211819"})
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    readonly phone: string;

    @ApiProperty({example: "password!"})
    @IsString()
    @MinLength(5)
    password: string;

}