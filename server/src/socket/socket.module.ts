import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SockeyGateway } from './socket.gateway';
import { SocketController } from './socket.controller';

@Module({
  providers: [SocketService, SockeyGateway],
  exports: [SocketService],
  controllers: [SocketController],
})
export class SocketModule {}
