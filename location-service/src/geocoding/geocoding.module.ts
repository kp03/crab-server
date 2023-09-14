import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { GeocodingController } from './geocoding.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UrlModule } from 'src/utils/url/url.module';
import { redisStore } from 'cache-manager-redis-yet';
import { MapService } from 'src/map-service-plugin/map-service.plugin';

import { PlugInManager } from 'src/map-service-plugin/plugin-manager';

@Module({
  imports: [
    UrlModule,
    HttpModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: 30 * 60 * 1000,
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
      useFactory: async (
        httpService: HttpService,
        configService: ConfigService,
      ): Promise<MapService> => {
        return await PlugInManager.createMapService(
          configService.get('MAP_PLUGIN_PATH'),
          httpService,
          configService,
        );
      },
    },
  ],
})
export class GeocodingModule {}
