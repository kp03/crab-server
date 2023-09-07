import { Logger, Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImageModule } from 'src/image/image.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, AuthModule,ImageModule,NotificationModule],
  providers: [DriverService, Logger],
  controllers: [DriverController],
  exports : [DriverService]
})
export class DriverModule {}
