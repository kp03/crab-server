import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateTripByCallDto {
  @ApiProperty({ example: '10.2' })
  @IsNumber()
  startLat: number;

  @ApiProperty({ example: '10.5' })
  @IsNumber()
  startLong: number;

  @ApiProperty({ example: 'Điểm A' })
  @IsString()
  source: string;

  @ApiProperty({ example: 'Điểm A' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Điểm A' })
  @IsString()
  name: string;

  @ApiProperty({ example: '4' })
  @IsNumber()
  cabSeats: number;
}
