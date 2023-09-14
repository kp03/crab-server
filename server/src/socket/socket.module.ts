import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SockeyGateway } from './socket.gateway';
import { SocketController } from './socket.controller';
import { DriverModule } from 'src/driver/driver.module';

@Module({
  imports : [forwardRef(() => DriverModule),],
  providers: [SocketService, SockeyGateway],
  exports: [SocketService],
  controllers: [SocketController],
})
export class SocketModule {}
