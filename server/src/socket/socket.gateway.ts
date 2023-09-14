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
  DriverLocationMessage,
  DriverStateMessage,
  JoinRoomMessage,
  SocketMessage,
  SocketService,
} from './socket.service';
import { DriverService } from 'src/driver/driver.service';

@WebSocketGateway(8443, {
  cors: {
    origin: '*',
  },
})
export class SockeyGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private socketService: SocketService,
    private readonly driverService: DriverService,
  ) {}

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

  sendToClient(clientId: string | string[], eventName: string, data: any) {
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
    console.log(`${client.user.id} join room : ${body.roomId}`);

    client.join(body.roomId);

    // - TODO join room
  } 

  @SubscribeMessage('driver-location')
  sendMessageFromClient(
    @ConnectedSocket() client: any,
    @MessageBody() body: DriverLocationMessage,
  ) {
    
    this.driverService.updateDriverLocation(client.user.id, {
      newLatitude: body.lat,
      newLongitude: body.long,
    });

    if (body.roomId) {
      // console.log(
      //   `${client.user.id} send to ${body.roomId} : {${body.lat},${body.long}}`,
      // );
      this.sendToClient(body.roomId, 'driver-location', body);
    }
  }

  @SubscribeMessage('trip')
  updateTrip(
    @ConnectedSocket() client: any,
    @MessageBody() body: DriverStateMessage,
  ) {
    this.sendToClient(body.roomId, 'trip', {state : body.state});
  }
}
