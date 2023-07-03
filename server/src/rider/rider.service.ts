import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { Rider } from '@prisma/client';
import { FindARiderDto } from './dtos/find.rider.dto';
import { RiderUpdateDto } from './dtos/rider.update.dto';
import * as bcrypt from 'bcryptjs'
@Injectable()
export class RiderService {
    constructor(private readonly prismaService: PrismaService) { }


    async getAllRider(): Promise<Rider[]> {
        return this.prismaService.rider.findMany();
    }

    // Service to find a rider by either id or phone
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

    // Service to create a new rider in database
    async create(createDto: RiderCreateDto): Promise<Rider | null> {

        const { id, email, phone, name } = createDto;
        const riderExists = await this.prismaService.rider.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone },
                    { id: id },
                ]
            }
        });

        if (riderExists) {
            if (riderExists.id === id) {
                console.log('ID exists!');
                throw new ConflictException("ID already exists!")
            }
            if (riderExists.email === email) {
                console.log('Email already exists');
                throw new ConflictException('Email already exists!');
            }

            if (riderExists.phone === phone) {
                console.log('Phone already exists');
                throw new ConflictException('Phone already exists!');
            }
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        const rider = await this.prismaService.rider.create({
            data: {
                id,
                email,
                phone,
                name
            }
        });

        const message: string = `${rider} created!`;
        console.log(rider);
        // const token = this.jwtService.sign({ id: rider.id });
        return rider;
    }



    async getRiderProfileById(id: string): Promise<Rider | null> {
        const rider = await this.prismaService.rider.findUnique({
            where: { id },
        });
        if (!rider) {
            throw new NotFoundException("Rider not found!");
        }
        return await this.prismaService.rider.findUnique({ where: { id } });
    }

    async updateRiderProfileById(id: string, data: RiderUpdateDto): Promise<Rider | null> {
        const rider = await this.prismaService.rider.findUnique({
            where: { id },
        });
        if (!rider) {
            throw new NotFoundException("Rider not found!");
        }
        const { email, phone, password, name } = data;

        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.prismaService.rider.update({
            where: { id }, data: {
                email,
                phone,
                password: hashedPassword,
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

}
