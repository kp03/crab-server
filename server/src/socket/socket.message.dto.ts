import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocketMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty()
  @IsNotEmpty()
  body: any;
}
