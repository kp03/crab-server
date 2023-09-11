import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

//this dto only for test microservice,can remove after test
export class CreateLocationDtoFake {
  @ApiProperty()
  @IsString() 
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly fullname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phone: string;
}
