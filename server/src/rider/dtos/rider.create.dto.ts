import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RiderCreateDto {
    @ApiProperty({ example: 'firebase-id-something' })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({ example: 'jhon.doe@gmail.com' })
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email!" })
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '0903622719' })
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @ApiProperty({ example: 'Khang Pham' })
    @IsNotEmpty()    
    name: string;

    // @ApiProperty({example: "password"})
    // @IsString()
    // @MinLength(5)
    // password: string;

}