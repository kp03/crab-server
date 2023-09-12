import { Logger, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { DriverModule } from 'src/driver/driver.module';
import { RiderModule } from 'src/rider/rider.module';
import { TripModule } from 'src/trip/trip.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Import the AuthModule here    
    DriverModule,
    RiderModule,  
    TripModule  
  ],
  controllers: [AdminController],
  providers: [AdminService, Logger]
})
export class AdminModule {}
