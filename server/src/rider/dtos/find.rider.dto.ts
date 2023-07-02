import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class FindARiderDto {
    @ApiProperty({example: "abc-xyz-fire-base",  required:false})
    @IsNotEmpty()    
    @IsOptional()
    id?: string;

    @ApiProperty({example: "0902211819", required:false})
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
        message: "Invalid phone number!",
    })
    phone?: string;

}