import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateTripDto {

    @ApiProperty({example: "10.2"})
    @IsNumber()
    startLat: number;

    @ApiProperty({example: "10.5"})
    @IsNumber()
    startLong: number;

    @ApiProperty({example: "Điểm A"})
    @IsString()
    source: string;

    @ApiProperty({example: "20.2"})
    @IsNumber()
    endLat: number;

    @ApiProperty({example: "20.5"})
    @IsNumber()
    endLong: number;

    @ApiProperty({example: "Điểm A"})
    @IsString()
    destination: string;

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