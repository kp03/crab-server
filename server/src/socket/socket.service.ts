import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface SocketMessage{
    roomId : string | string[]
    eventName : string
    body : any
}

export interface JoinRoomMessage{
    fromId? : string
    roomId : string,
}

export interface DriverLocationMessage{
  roomId? : string
  lat : number
  long : number
}


@Injectable()
export class SocketService {
  private event = new Subject<SocketMessage>();
  
  sendMessage(message: SocketMessage) {
    this.addEvent(message);
    return { message: 'send socket' };
  }


  addEvent(serverMessage: SocketMessage) {
    this.event.next(serverMessage);
  }

  getEventToEmit() {
    return this.event;
  }
}
