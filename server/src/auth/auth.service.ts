import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) { }

    async validateUser(email: string, password: string): Promise<any> {        
        const user = await this.prismaService.rider.findUnique({ where: { email } });
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (user && user.password === password){
            const { password, email, ...rest}=user;
            return rest;
        }
    }
}
