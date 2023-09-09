import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Driver, Rider } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async verify(token: string): Promise<Driver | Rider | null> {
    if (!token) {
      return null; // No token provided, deny access
    }

    const decodedToken = this.verifyToken(token);
    if (!decodedToken) {
      return null; // Invalid token, deny access
    }

    const userId = decodedToken.id;

    // Check if the user exists in the Rider table
    const rider = await this.prismaService.rider.findUnique({
      where: { id: userId },
    });

    if (rider) {
      return rider;
    } else {
      const driver = await this.prismaService.driver.findUnique({
        where: { id: userId },
      });
      
      return driver;
    }
  }

  verifyToken(token: string): { id: string } | null {
    try {
      const decoded = this.jwtService.verify(token); // Replace 'your_secret_key' with your actual secret key
      return decoded as { id: string };
    } catch (error) {
      return null; // Token verification failed
    }
  }
}
