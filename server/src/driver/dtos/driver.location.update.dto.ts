import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class DriverLocationUpdateDto {
    
    @ApiProperty({example: "41.20"})
    @IsNotEmpty()    
    @IsOptional()
    @IsNumber()
    newLatitude: number;

    @ApiProperty({example: "39.13"})
    @IsNotEmpty()    
    @IsOptional()
    @IsNumber()
    newLongitude: number;

}