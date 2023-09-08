import { Module, forwardRef } from '@nestjs/common';
import { MediatorService } from './mediator.service';
import { DriverModule } from 'src/driver/driver.module';
import { SocketModule } from 'src/socket/socket.module';
import { SocketService } from 'src/socket/socket.service';

@Module({
  imports: [DriverModule, forwardRef(()=> SocketModule),],
  providers: [MediatorService],
  exports: [MediatorService],
})
export class MediatorModule {}
