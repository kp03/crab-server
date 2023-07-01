import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [    
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: process.env.JWT_EXPIRE,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RiderController],
  providers: [RiderService, PrismaService],
  exports: [],
})
export class RiderModule {}
