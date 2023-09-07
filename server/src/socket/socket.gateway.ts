import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  JoinRoomMessage,
  SocketMessage,
  SocketService,
} from './socket.service';

@WebSocketGateway(8443, {
  cors: {
    origin: '*',
  },
})
export class SockeyGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.socketService
      .getEventToEmit()
      .asObservable()
      .subscribe({
        next: (data: SocketMessage) => {
          console.log(`server send to ${data.roomId} ,event ${data.eventName}`);
          console.log(data);
          server.to(data.roomId).emit(data.eventName, data.body);
        },
      });
  }

  sendToClient(clientId: string, eventName: string, data: any) {
    this.server.to(clientId).emit(eventName, data);
  }

  handleConnection(@ConnectedSocket() client: any, ...args: any[]) {
    console.log(client.user.id.toString() + ' join');
    client.join(client.user.id.toString());
  }
  handleDisconnect(@ConnectedSocket() client: any) {
    console.log(client.user.id.toString() + ' leave');

    client.leave(client.user.id.toString());
  }

  // ----- Handle message from server

  @SubscribeMessage('join-room')
  joinRoomFromClient(
    @ConnectedSocket() client: any,
    @MessageBody() body: JoinRoomMessage,
  ) {

    client.join(body.roomId);

    // - TODO join room
  }

  @SubscribeMessage('driver-location')
  sendMessageFromClient(
    @ConnectedSocket() client: any,
    @MessageBody() body: any,
  ) {
    console.log(body);

    // - TODO driver send location and send to customer (rider)
  }
}
