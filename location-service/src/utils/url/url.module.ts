import { Module } from '@nestjs/common';
import { UrlFactory } from './url-factory';

@Module({
  providers: [UrlFactory],
  exports : [UrlFactory]
})
export class UrlModule {}
