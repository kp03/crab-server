import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface Coordiantes {
  readonly lat: number;
  readonly lon: number;
}

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly place_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly fullname: string;

  @ApiProperty({
    example: {
      lat: 10,
      lon: 10,
    },
  })
  readonly coordinates: Coordiantes;
}
