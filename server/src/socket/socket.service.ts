import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface SocketMessage {
  roomId: string | string[];
  eventName: string;
  body: any;
}

export interface SocketDestination {
  roomId?: string | string[];
  eventName?: string;
}

export interface JoinRoomMessage {
  fromId?: string;
  roomId: string;
}

export interface DriverLocationMessage extends SocketDestination {
  lat: number;
  long: number;
}

export interface DriverStateMessage extends SocketDestination {
  state: string;
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
