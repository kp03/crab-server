import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, Matches } from "class-validator";

export class createAdminDto{
    
    @IsString()
    @IsOptional()
    first_name: string;

    @IsOptional()
    @IsString()
    last_name: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '0903622719' })
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @IsOptional()
    @IsString()
    gender: string;



    @ApiProperty({ example: 'password' })
    @IsString()
    @MinLength(5)
    password: string;

}
