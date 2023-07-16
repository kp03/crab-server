import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RiderCreateDto {

    @ApiProperty({ example: 'firebase-id' })
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '0123456789' })
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @ApiProperty({ example: 'Pham Van A' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "password" })
    @IsString()
    @MinLength(5)
    password: string;

}