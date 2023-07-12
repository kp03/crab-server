import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class DriverLocationUpdateDto {
    
    @ApiProperty({example: "example@gmail.com"})
    @IsNotEmpty()    
    @IsOptional()
    newLatitude: string;

    @ApiProperty({example: "example@gmail.com"})
    @IsNotEmpty()    
    @IsOptional()
    newLongtitude: string;

}