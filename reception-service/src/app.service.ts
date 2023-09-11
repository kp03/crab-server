import { Injectable } from '@nestjs/common';
import { SubscriberService } from './subscriber/subscriber.service';
import {lastValueFrom} from 'rxjs'

@Injectable()
export class AppService {

  constructor(
    private readonly subscriberService : SubscriberService
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async testgetHelloMicro() : Promise<any> {
    const result = await lastValueFrom(await this.subscriberService.getHelloMicro());

    console.log(result[0])

    return result
  }

  async testpostMicro(body : any) : Promise<any>  {
    return this.subscriberService.postMicro(body)
  }

  async testpostMicroBooking(body : any) : Promise<any>  {
    return this.subscriberService.postMicroBooking(body)
  }

  async testgetHelloMicroAsync() : Promise<any>  {
    const message = this.subscriberService.getHelloMicroAsync()
    return message;
  }

  async testpublishEvent() {
    this.subscriberService.publishEvent()
    return {message : "publish success"}
  }
}
