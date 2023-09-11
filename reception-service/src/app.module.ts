import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule} from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriberModule } from './subscriber/subscriber.module';
import { LocationModule } from './location/location.module';
import { CustomerModule } from './customer/customer.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SubscriberModule,
    LocationModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
