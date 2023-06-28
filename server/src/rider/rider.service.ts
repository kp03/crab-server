import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { findRiderDto, riderSignupDto } from './dto/rider-request.dto';
import { Admin } from '@prisma/client';
import * as bcrypt from 'bcryptjs'
@Injectable()
export class RiderService {
    constructor
        (            
            private readonly prismaService: PrismaService
        ) { }

    async create(riderInput: riderSignupDto): Promise<Admin> {
        const passwordHashed = await this.hashPassword(riderInput.password);
        const data = {
            email: riderInput?.email,
            phone: riderInput.phone,
            password:passwordHashed,

        }
        try {
            const createdRider = await this.prismaService.rider.create({data});
            console.log(`rider created successfully ${JSON.stringify(createdRider)}`)         
            return createdRider;
        } catch (err){
            throw new ConflictException("user already exist!")
        }
        
    }

    async findRiderByProperty(data: findRiderDto) {
        const {email, phone} = data;
    }

    async hashPassword(password: string) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }
}
