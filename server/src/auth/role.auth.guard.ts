import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RiderAuthGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            return false; // No token provided, deny access
        }

        const decodedToken = this.verifyToken(token);
        if (!decodedToken) {
            return false; // Invalid token, deny access
        }

        const userId = decodedToken.id;

        // Check if the user exists in the Rider table
        const rider = await this.prismaService.rider.findUnique({
            where: { id: userId },
        });

        return !!rider; // Allow access if the rider exists
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

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            return false; // No token provided, deny access
        }

        const decodedToken = this.verifyToken(token);
        if (!decodedToken) {
            return false; // Invalid token, deny access
        }

        const userId = decodedToken.id;

        // Check if the user exists in the Admin table
        const admin = await this.prismaService.admin.findUnique({
            where: { id: userId },
        });

        return !!admin; // Allow access if the admin exists
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



@Injectable()
export class RoleAuthGuard implements CanActivate {
    constructor(
        private readonly riderAuthGuard: RiderAuthGuard,
        private readonly adminAuthGuard: AdminAuthGuard,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const canActivateRider = await this.riderAuthGuard.canActivate(context);
        const canActivateAdmin = await this.adminAuthGuard.canActivate(context);
        return canActivateRider || canActivateAdmin;
    }
}

