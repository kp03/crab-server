import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthController } from './user/auth/auth.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, PrismaModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

