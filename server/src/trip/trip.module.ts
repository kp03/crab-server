import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TripService],
  exports:[TripService]
})
export class TripModule {}
