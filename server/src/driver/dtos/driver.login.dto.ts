import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class DriverLoginDto {
    
    @ApiProperty({example: "0903311234"})
    @IsNotEmpty()    
    @IsString()
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @ApiProperty({example: "password"})
    @IsString()
    @MinLength(5)
    password: string;

}