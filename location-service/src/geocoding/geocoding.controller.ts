import { Controller, Get, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GeocodingService } from './geocoding.service';


@Controller('test')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @MessagePattern({ cmd: 'address' })
  search(@Payload() address: string) {
    return this.geocodingService.searchAdress(address);
  }

  @MessagePattern({ cmd: 'place' })
  searchCoordinate(@Payload() placeId: string) {
    return this.geocodingService.findCoordinate(placeId);
  }

}
