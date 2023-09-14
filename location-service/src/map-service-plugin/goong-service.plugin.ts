import { catchError, firstValueFrom } from 'rxjs';
import { MapData, MapDataDetail, MapService } from './map-service.plugin';
import { AxiosError } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { CustomUrlBuilder } from './url-builder';

export default class GoongService extends MapService {
  host: string = 'rsapi.goong.io';

  

  async geocoding(address: string): Promise<MapDataDetail[]> {
    const geoUrl = new CustomUrlBuilder(this.host)
      .addPath('/geocode')
      .addQuery('api_key', this.configService.get('MAP_API_KEY'))
      .addQuery('address', address)
      .getUrl();

    console.log(geoUrl);

    const { data } = await firstValueFrom(
      this.httpService.get(geoUrl).pipe(
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException(
            'get address server error : ' + error,
          );
        }),
      ),
    );

    const result: MapDataDetail[] = [];
    for (let index = 0; index < data.results.length; index++) {
      const element = data.results[index];
      const place: MapDataDetail = {
        place_id: element.place_id,
        address: element.formatted_address,
        coordinates: {
          lat: element.geometry.location.lat,
          long: element.geometry.location.lng,
        },
      };

      result.push(place);
    }

    return result;
  }
  async getPlaceDetail(placeId: string): Promise<MapDataDetail> {
    const detailUrl = new CustomUrlBuilder(this.host)
      .addPath('/geocode')
      .addQuery('api_key', this.configService.get('MAP_API_KEY'))
      .addQuery('place_id', placeId)
      .getUrl();

    const { data } = await firstValueFrom(
      this.httpService.get(detailUrl).pipe(
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException(
            'get address server error : ' + error,
          );
        }),
      ),
    );

    const place = data.result;

    const result: MapDataDetail = { 
      place_id: placeId,
      address: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat,
        long: place.geometry.location.lng,
      },
    };

    return result;
  }
}
