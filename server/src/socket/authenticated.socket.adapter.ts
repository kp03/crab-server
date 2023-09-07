import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

export class AuthenticatedSocketAdapter extends IoAdapter {
  private readonly authSerice: AuthService;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.authSerice = this.app.get(AuthService);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);

    // middle ware for every socket request
    server.use(async (socket: any, next) => {
      console.log('authenticated adapter');
      const tokenPayload = socket.handshake.auth.token;

      if (!tokenPayload) {
        return next(new Error('Token not provided'));
      }

      const [method, token] = tokenPayload.split(' ');

      if (method !== 'Bearer') {
        return next(
          new Error('Invalid authentication method. Only Bearer is supported.'),
        );
      }

      const user = await this.authSerice.verify(token)
      if (!user) {
        throw new UnauthorizedException('Authorized error');
      }

      socket.user = user;
      next();
    });

    return server;
  }
}
