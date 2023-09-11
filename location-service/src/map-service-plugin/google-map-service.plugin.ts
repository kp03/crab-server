import { catchError, firstValueFrom } from 'rxjs';
import { MapData, MapDataDetail, MapService } from './map-service.plugin';
import { AxiosError } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { CustomUrlBuilder } from './url-builder';

export class GoogleMapService extends MapService {
  host: string = 'maps.googleapis.com/maps/api';

  async geocoding(address: string): Promise<MapDataDetail[]> {
    const geoUrl = new CustomUrlBuilder(this.host)
      .addPath('/geocode/json')
      .addQuery('key', this.configService.get('MAP_API_KEY'))
      .addQuery('address', address)
      .addQuery('language', 'vi')
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
    for (let index = 0; index < data.results.length; index++) {
      const element = data.results[index];
      const place: MapDataDetail = {
        place_id: element.place_id,
        address: element.formatted_address,
        coordinates: {
          lat: 0, //! MIISING
          long: 0
        }
      };

      result.push(place);
    }

    return result;
  }
  async getPlaceDetail(placeId: string): Promise<MapDataDetail> {
    const detailUrl = new CustomUrlBuilder(this.host)
      .addPath('/place/details/json')
      .addQuery('key', this.configService.get('MAP_API_KEY'))
      .addQuery('place_id', placeId)
      .addQuery('language', 'vi')
      .addQuery('fields', 'formatted_address,geometry')
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
