import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TripService {
    constructor(
        private readonly prismaService: PrismaService){}
    
        async getTripTotal() {
            return this.prismaService.trip.count();
        }

        async getTotalRevenue(): Promise<Number>{
            const trips = await this.prismaService.trip.findMany();
            var totalRevenue = 0;
        
            for (const trip of trips) {
            totalRevenue += trip.trip_cost;
            }
        
            totalRevenue = totalRevenue - totalRevenue * 0.85;
            return totalRevenue;
          }
}
