import { Coordiantes } from 'src/location/dto/create-location.dto';
import { CreateCustomerDto } from './create-customer.dto';

export interface Place {
  place_id: string;
  address: string;
  coordiante: Coordiantes;
}

export class TripDto extends CreateCustomerDto {
    address : Place
}
