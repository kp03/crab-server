import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class AcceptTripDto {

    @ApiProperty({ example: 'd44ab069-d7b6-41ae-8ce6-70e62d46a05e' })
    @IsNotEmpty()
    @IsString()
    trip_id: string;

    @ApiProperty({ example: 'true' })
    @IsNotEmpty()
    accept: boolean;

}