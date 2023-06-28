import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, Matches } from "class-validator";

export class SignUpDto {

    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsString()
    gender: string;

    @ApiProperty({ example: '0903622719' })
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'passwor1d' })
    @IsString()
    @MinLength(5)
    password: string;

    @ApiProperty({example: 'admin'})
    @IsString()
    @IsNotEmpty()
    userType: string;
}

export class SignInDto {

    @ApiProperty({ example: '0903622719' })
    @IsOptional() // Make the phone field optional
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsOptional() // Make the phone field optional
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'passwor1d' })
    @IsString()
    @MinLength(5)
    password: string;

    @ApiProperty({example: 'admin'})
    @IsString()
    @IsNotEmpty()
    userType: string;

}