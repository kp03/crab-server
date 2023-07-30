import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { Rider } from '@prisma/client';
import { FindARiderDto } from './dtos/find.rider.dto';
import { RiderUpdateDto } from './dtos/rider.update.dto';
import * as bcrypt from 'bcryptjs'
import { RiderLoginDto } from './dtos/rider.login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RiderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) { }


    async getAllRider(): Promise<Rider[] | []> {
        return this.prismaService.rider.findMany();
    }

    async getRiderById(id: string): Promise<Rider | null> {
        const rider = await this.prismaService.rider.findUnique({
            where: { id },
        });

        if (!rider) {
            throw new NotFoundException("Rider not found!");
        }

        return await this.prismaService.rider.findUnique({ where: { id } });
    }

    async createRider(createDto: RiderCreateDto): Promise<Rider> {
        const { id, phone, name, password} = createDto;
        const riderExists = await this.prismaService.rider.findFirst({
            where: {
                OR: [
                    { phone: phone },
                    { id: id },
                ]
            }
        });
        if (riderExists) {
            if (riderExists.id === id) {
                throw new ConflictException("ID already exists!")
            }
            if (riderExists.phone === phone) {
                throw new ConflictException('Phone already exists!');
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const rider = await this.prismaService.rider.create({
            data: {
                id,
                phone,
                password: hashedPassword,
                name
            }
        });
        return rider;
    }

    async updateRiderProfileById(id: string, data: RiderUpdateDto): Promise<Rider | null> {
        const rider = await this.prismaService.rider.findUnique({
            where: { id },
        });
        if (!rider) {
            throw new NotFoundException("Rider not found!");
        }

        const { phone, name } = data;

        const existedPhone = await this.prismaService.driver.findFirst({ where: { phone } });

        if (existedPhone) {
            throw new ConflictException('Phone already in use!');
        }
        return await this.prismaService.rider.update({
            where: { id }, data: {
                phone,
                name,
                updated_at: { set: new Date() }
            }
        });
    }

    async deleteRiderById(id: string): Promise<void> {
        const rider = await this.prismaService.rider.findUnique({
            where: { id },
        });
        if (!rider) {
            throw new NotFoundException("Rider not found!");
        }
        await this.prismaService.rider.delete({ where: { id } });
    }

    async findRider(riderData: FindARiderDto): Promise<Rider | null> {

        const { id, phone } = riderData;
        const riderExists = await this.prismaService.rider.findFirst({
            where: {
                OR: [
                    { id },
                    { phone },
                ]
            }
        });

        if (riderExists) {
            return riderExists;
        }
        else {
            throw new NotFoundException('Rider not found');
        }
    }

    async login(riderLoginDto: RiderLoginDto): Promise<{ token: string }> {
        const { phone, password } = riderLoginDto;
        if (!phone) {
            throw new Error("Phone number must be provided!");
        }

        let rider;
        if (phone) {
            rider = await this.prismaService.rider.findFirst({
                where: {
                    phone: phone
                }
            });
        }

        if (!rider) {
            throw new UnauthorizedException("Invalid credentials!");
        }
        const hashedPassword = rider.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) {            
            throw new HttpException("Invalid credentials!", 400);
        }        
        const token = this.jwtService.sign({ id: rider.id });
        return { token };
    }
}
