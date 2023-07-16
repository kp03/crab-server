import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RiderUpdateDto {

    @ApiProperty({example: "0903311234"})
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone: string;

    @ApiProperty({example: "password"})
    @IsOptional()
    @IsString()
    @MinLength(5)
    password: string;

    @ApiProperty({example: "Khang Pham"})
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({example: "male"})
    @IsOptional()
    @IsString()
    gender: string;

    @ApiProperty({example: "true"})
    @IsOptional()
    @IsBoolean()
    isVip: boolean

}