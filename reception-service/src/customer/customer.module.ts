import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { LocationModule } from 'src/location/location.module';
import { SubscriberModule } from 'src/subscriber/subscriber.module';

@Module({
  imports: [LocationModule,SubscriberModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
