import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GeocodingModule } from './geocoding/geocoding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GeocodingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
