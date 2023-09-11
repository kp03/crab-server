import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateLocationDtoFake } from './temp.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Test Mircoservice')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({summary : "Gửi đến location-service bằng get"})
  @Get('/greeting')
  async getHelloMicro() {

    return this.appService.testgetHelloMicro();
  }

  @ApiOperation({summary : "Gửi đến location-service bằng post"})
  @Post('/post')
  async postMicro(@Body() body: CreateLocationDtoFake) {
    return this.appService.testpostMicro(body);
  }

  @ApiOperation({summary : "Gửi đến booking-service bằng post"})
  @Post('/booking')
  async postMicroBooking(@Body() body: CreateLocationDtoFake) {
    return this.appService.testpostMicroBooking(body);
  }

  @ApiOperation({summary : "Gửi đến location-service bằng get async"})
  @Get('/greeting-async')
  async getHelloAsyncMicro() {
    return this.appService.testgetHelloMicroAsync();
  }

  @ApiOperation({summary : "Gửi đến location-service bằng phương thức emit thay vì send (xem ghi chú khác biệt ở SubscriberService)"})
  @Get('/publish-event')
  async publishEvent() {
    this.appService.testpublishEvent();
  }
}
