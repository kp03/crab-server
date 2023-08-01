import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RiderRefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '09486c61-ad09-46d7-834c-70b63b5bc99e' })
    refreshToken: string;
}