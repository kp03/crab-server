import { Logger, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Import the AuthModule here    
  ],
  controllers: [AdminController],
  providers: [AdminService, Logger]
})
export class AdminModule {}
