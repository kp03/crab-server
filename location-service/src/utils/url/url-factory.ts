import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomUrl } from './custom-url';
import { GoongUrl } from './goong-url';

export enum ThirdPartyService {
  GOONG,
  GOOGLE_MAP,
}

@Injectable()
export class UrlFactory {
  constructor(private readonly configService: ConfigService) {}

  getUrl(from: ThirdPartyService): CustomUrl {
    switch (from) {
      case ThirdPartyService.GOONG:
        return new GoongUrl();
      default:
        return;
    }
  }
}
