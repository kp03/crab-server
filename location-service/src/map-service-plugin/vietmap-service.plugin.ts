import { catchError, firstValueFrom } from 'rxjs';
import { MapData, MapDataDetail, MapService } from './map-service.plugin';
import { AxiosError } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { CustomUrlBuilder } from './url-builder';

export default class VietMapService extends MapService {
  host: string = 'maps.vietmap.vn/api';

 

  async geocoding(address: string): Promise<MapDataDetail[]> {
    const geoUrl = new CustomUrlBuilder(this.host)
      .addPath('/search/v3')
      .addQuery('apikey', this.configService.get('MAP_API_KEY'))
      .addQuery('text', address)
      .getUrl();

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
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const place: MapDataDetail = {
        place_id: element.ref_id,
        address: element.address,
        coordinates: {
          lat: 0,
          long: 0
        }
      };

      result.push(place);
    }

    return result;
  }
  async getPlaceDetail(placeId: string): Promise<MapDataDetail> {
    const detailUrl = new CustomUrlBuilder(this.host)
      .addPath('/place/v3')
      .addQuery('apikey', this.configService.get('MAP_API_KEY'))
      .addQuery('refid', placeId)
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
      address: place.display,
      coordinates: {
        lat: place.lat,
        long: place.lng,
      },
    };

    return result;
  }
}
