import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RequestTripDto {

    @ApiProperty({example: "10.2"})
    @IsNumber()
    startLat: number;

    @ApiProperty({example: "10.5"})
    @IsNumber()
    startLong: number;

    @ApiProperty({example: "2000"})
    @IsNumber()
    distance: number;

    @ApiProperty({example: "30"})
    @IsNumber()
    duration: number


    @ApiProperty({example: "4"})
    @IsNumber()
    cabSeats: number
}