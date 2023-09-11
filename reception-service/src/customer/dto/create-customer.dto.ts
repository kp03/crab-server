import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  readonly phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({ example: 'id điểm đón' })
  @IsString()
  @IsNotEmpty()
  readonly address_id: string;

  @ApiProperty({ example: 'id tài xế' })
  @IsString()
  @IsNotEmpty()
  readonly driver_id: string;

  @ApiProperty({ example: 4 })
  @IsString()
  @IsNotEmpty()
  readonly seat_number: number;
}
