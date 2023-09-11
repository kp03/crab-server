import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LocationService } from 'src/location/location.service';
import { CreateLocationDto } from 'src/location/dto/create-location.dto';
import { TripDto } from './dto/trip.dto';
import { SubscriberService } from 'src/subscriber/subscriber.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CustomerService {
  constructor(
    private readonly locationService: LocationService,
    private readonly subscriberService: SubscriberService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // - get address, coordiante from address_id

    // - save address to database
    const placeDetail = await this.locationService.findPlaceAndCreate(
      createCustomerDto,
    );

    //console.log(placeDetail);

    // - send to S3
    // const tripRequest: TripDto = {
    //   address: {
    //     place_id: placeDetail.place_id,
    //     address: placeDetail.address,
    //     coordiante: {
    //       lat: placeDetail.coordinate.lat,
    //       lon: placeDetail.coordinate.long,
    //     },
    //   },
    //   phone: createCustomerDto.phone,
    //   name: createCustomerDto.name,
    //   address_id: createCustomerDto.address_id,
    //   driver_id: createCustomerDto.driver_id,
    //   seat_number: createCustomerDto.seat_number,
    // };

    console.log("Place detail :")
    console.log(placeDetail);

    const tripRequest = {
      startLat: placeDetail.coordinates.lat,
      startLong: placeDetail.coordinates.long,
      source: placeDetail.address,
      phone: createCustomerDto.phone,
      name: createCustomerDto.name,
      cabSeats: createCustomerDto.seat_number,
    };

    console.log(tripRequest);

    // - get result from S3
    const result = await lastValueFrom(
      await this.subscriberService.sendToBookingService(
        'booking-request',
        tripRequest,
      ),
    );

    // TODO

    return result;
  }

  async getAllDriver() {
    const result = await lastValueFrom(
      await this.subscriberService.sendToBookingService('drivers', ''),
    );

    console.log(result);

    return result;
  }

  createTest(createCustomerDto: CreateCustomerDto) {
    const placeDetail = {
      address: '227 Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh',
      place_id:
        'LPG0o1ZmSzlgn8_EhhEsJniYYfW1dpqqsDpsp0NnqD24mSj6tU2OqHunAYYe3d0IyeLRbgoZmiq9hiFSGtUtCRWe6W4ODS5lEYqZQ74Z2hhBjnEOGsBCWO2G0S8aGEf0_',
      coordinate: {
        lat: 10.763554524000028,
        lon: 106.68216477300007,
      },
    };

    // - send to S3
    const tripRequest: TripDto = {
      address: {
        place_id: placeDetail.place_id,
        address: placeDetail.address,
        coordiante: {
          lat: placeDetail.coordinate.lat,
          lon: placeDetail.coordinate.lon,
        },
      },
      phone: createCustomerDto.phone,
      name: createCustomerDto.name,
      address_id: createCustomerDto.address_id,
      driver_id: createCustomerDto.driver_id,
      seat_number: createCustomerDto.seat_number,
    };

    // - get result from S3

    return tripRequest;
  }
}
