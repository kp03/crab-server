import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { GeocodingController } from './geocoding.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UrlModule } from 'src/utils/url/url.module';
import { redisStore } from 'cache-manager-redis-yet';
import { MapService } from 'src/map-service-plugin/map-service.plugin';
import { GoogleMapService } from 'src/map-service-plugin/google-map-service.plugin';
import { GoongService } from 'src/map-service-plugin/goong-service.plugin';

@Module({
  imports: [
    UrlModule,
    HttpModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GeocodingController],
  providers: [
    GeocodingService,
    {
      provide: 'MAP_SERVICE',
      inject: [HttpService, ConfigService],
      useFactory: (
        httpService: HttpService,
        configService: ConfigService,
      ): MapService => {
        return new GoongService(httpService, configService);
      },
    },
  ],
})
export class GeocodingModule {}
