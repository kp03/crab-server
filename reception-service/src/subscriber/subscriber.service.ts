import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SubscriberService {
  // 2 client để giao tiếp với 2 service :location và booking
  // check cài đặt 2 client này ở SubscriberModule
  constructor(
    @Inject('SUBSCRIBER_SERVICE_LOCATION')
    private clientLocation: ClientProxy,
    @Inject('SUBSCRIBER_SERVICE_BOOKING')
    private clientBooking: ClientProxy,
  ) {}

  async sendToLocationService(pattern: string, data: any) {
    return this.clientLocation.send({ cmd: pattern }, data);
  }

  async sendToBookingService(pattern: string, data: any) {
    return this.clientBooking.send({ cmd: pattern }, data);
  }

  // Gửi thep pattern 'greeting' đến client của Location
  async getHelloMicro(): Promise<any> {
    return this.clientLocation.send({ cmd: 'greeting' }, 'Reception');
  }

  async postMicro(body: any): Promise<any> {
    return this.clientLocation.send({ cmd: 'body' }, body);
  }

  // Gửi thep pattern 'booking' đến client của Booking
  async postMicroBooking(body: any): Promise<any> {
    return this.clientBooking.send({ cmd: 'booking' }, body);
  }

  async getHelloMicroAsync(): Promise<any> {
    const message = await this.clientLocation.send(
      { cmd: 'greeting-async' },
      'Reception',
    );
    console.log(message);
    return message;
  }

  // - send sẽ đợi bên Consumer trả lời
  // - emit thì không đợi bên Consumer trả lời
  async publishEvent() {
    this.clientLocation.emit('event', {
      addres: 'Tan Binh',
      name: 'Chi Hien',
    });
  }
}
