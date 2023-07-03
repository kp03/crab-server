import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthGuard, RiderAuthGuard, RoleAuthGuard } from 'src/auth/role.auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [    
    ConfigModule,
    AuthModule,
  ],
  controllers: [RiderController],
  providers: [RiderService, PrismaService, AdminAuthGuard, RoleAuthGuard, RiderAuthGuard],
  exports: [],
})
export class RiderModule {}
