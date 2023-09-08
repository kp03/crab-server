import { Injectable } from '@nestjs/common';
import { DriverService } from 'src/driver/driver.service';
import { SocketService } from 'src/socket/socket.service';

export enum MediatorListener {
  DRIVER_LOCATION_SAVED,
}

@Injectable()
export class MediatorService {

  socketService :SocketService  
  constructor(
    private readonly driverService: DriverService,
    socketService: SocketService,
  ) {
    this.socketService = socketService;
  }

  send(listener: MediatorListener, data: any) {
    switch (listener) {
      case MediatorListener.DRIVER_LOCATION_SAVED:
        this.driverService.updateDriverLocation(data.id, data.data);
        break;

      default:
        break;
    }
  }
}
