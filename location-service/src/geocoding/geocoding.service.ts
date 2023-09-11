import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateGeocodingDto } from './dto/create-geocoding.dto';
import { UpdateGeocodingDto } from './dto/update-geocoding.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ThirdPartyService, UrlFactory } from 'src/utils/url/url-factory';
import { ConfigService } from '@nestjs/config';
import { MapService } from 'src/map-service-plugin/map-service.plugin';

@Injectable()
export class GeocodingService {
  constructor(
    //private readonly httpService: HttpService,
    private readonly urlFactory: UrlFactory,
    private readonly configService: ConfigService,
    @Inject('MAP_SERVICE')
    private mapService: MapService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async searchAdress(address: string) {
    const data = await this.mapService.geocoding(address);

    for (let index = 0; index < data.length; index++) {
      const place = data[index];
      await this.cacheService.set(place.place_id, place);
    }

    return data;
  }

  async findCoordinate(placeId: string) {
    const place = await this.cacheService.get(placeId);
    if (place) {
      console.log('get from cache');
      return place;
    }

    const data = await this.mapService.getPlaceDetail(placeId);

    await this.cacheService.set(data.place_id, data);

    console.log('get from api');
    return data;
  }

  // async searchAdress(address: string) {
  //   const geocodingUrl = this.urlFactory
  //     .getUrl(ThirdPartyService.GOONG)
  //     .addApiKey(this.configService.get('MAP_API_KEY'))
  //     .addPath('/geocode')
  //     .addQuery('address', address);

  //   console.log(geocodingUrl.url());

  //   const { data } = await firstValueFrom(
  //     this.httpService.get(geocodingUrl.url()).pipe(
  //       catchError((error: AxiosError) => {
  //         throw new InternalServerErrorException(
  //           'get address server error : ' + error,
  //         );
  //       }),
  //     ),
  //   );

  //   for (let index = 0; index < data.results.length; index++) {
  //     const place = data.results[index];
  //     await this.cacheService.set(place.place_id, place);
  //   }

  //   return data.results;
  // }

  // async findCoordinate(placeId: string) {
  //   const place = await this.cacheService.get(placeId);
  //   if (place) {
  //     console.log('get from cache');
  //     return place;
  //   }

  //   const geocodingUrl = this.urlFactory
  //     .getUrl(ThirdPartyService.GOONG)
  //     .addApiKey(this.configService.get('MAP_API_KEY'))
  //     .addPath('/geocode')
  //     .addQuery('place_id', placeId);

  //   console.log(geocodingUrl.url());

  //   const { data } = await firstValueFrom(
  //     this.httpService.get(geocodingUrl.url()).pipe(
  //       catchError((error: AxiosError) => {
  //         throw new InternalServerErrorException(
  //           'get address server error : ' + error,
  //         );
  //       }),
  //     ),
  //   );

  //   const searchPlace = data.results[0];
  //   await this.cacheService.set(searchPlace.place_id, searchPlace);

  //   console.log('get from api');
  //   return searchPlace;
  // }

  async testRedis(id: string) {
    console.log('86');
    console.log(id);
    const place = await this.cacheService.get(id);
    if (place) {
      console.log('get from cache');
      return place;
    }

    const placeApi = {
      name: 'new',
      coordianet: 20,
    };
    console.log('97');
    const cache = await this.cacheService.set(id, placeApi);
    console.log(cache);
    console.log('get from api');
    return placeApi;
  }
}
