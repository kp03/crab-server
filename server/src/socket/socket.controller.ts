import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {  SocketService } from './socket.service';
import { SocketMessageDto } from './socket.message.dto';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Post()
  testConnection(@Body() body: SocketMessageDto) {
    console.log(body)
    this.socketService.sendMessage(body);
  }
}
