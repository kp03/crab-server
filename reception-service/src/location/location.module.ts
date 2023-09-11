import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriberModule } from 'src/subscriber/subscriber.module';

@Module({
  imports: [
    SubscriberModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTIC_URL'),
        auth: {
          username: configService.get('ELASTIC_USERNAME'),
          password: configService.get('ELASTIC_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports : [LocationService]
})
export class LocationModule {}
