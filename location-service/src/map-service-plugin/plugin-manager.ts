import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MapService } from './map-service.plugin';

export class PlugInManager {
  //   static createMapService(
  //     filename: string,
  //     httpService: HttpService,
  //     configService: ConfigService,
  //   ) : MapService | null {
  //     import(filename).then((module) => {
  //       if (module.default) {
  //         return new module.default(httpService,configService) as MapService;
  //       } else {
  //         throw new Error(`No default export found in module: ${filename}`);
  //       }
  //     });
  //   }

  static async createMapService(
    filename: string,
    httpService: HttpService,
    configService: ConfigService,
  ): Promise<MapService | null> {
    try {
      const module = await import(filename);
      if (module.default) {
        return new module.default(httpService, configService) as MapService;
      } else {
        throw new Error(`No default export found in module: ${filename}`);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
