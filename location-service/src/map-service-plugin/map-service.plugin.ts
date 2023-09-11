import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

export class Coordinates {
  lat: number;
  long: number;
}

export class MapData {
  place_id: string;
  address: string;
}

export class MapDataDetail extends MapData {
  coordinates: Coordinates;
}

export abstract class MapService {
  abstract host: string;
  protected httpService: HttpService;
  protected configService: ConfigService;

  constructor(httpService: HttpService, configService: ConfigService) {
    this.httpService = httpService;
    this.configService = configService;
  }

  abstract geocoding(address: string): Promise<MapDataDetail[]>;
  abstract getPlaceDetail(placeId: string): Promise<MapDataDetail>;
}