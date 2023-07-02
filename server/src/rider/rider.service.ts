import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { RiderLoginDto } from './dtos/rider.login.dto';
import { Rider } from '@prisma/client';
import { FindARiderDto } from './dtos/find.rider.dto';

@Injectable()
export class RiderService {
    constructor
        (
            private readonly prismaService: PrismaService,
            private jwtService: JwtService
        ) { }

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

    async create(createDto: RiderCreateDto): Promise<Rider | null> {

        // const { id, email, phone, password } = registerDto;
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
                // password: hashedPassword
            }
        });

        const message: string = `${rider} created!`;
        console.log(rider);
        // const token = this.jwtService.sign({ id: rider.id });
        return rider;
    }

    // async login(riderLoginDto: RiderLoginDto): Promise<{ token: string }> {
    //     const { email, phone, password } = riderLoginDto;
    //     if (!email && !phone) {
    //         throw new Error("Email or phone number must be provided!");
    //     }

    //     let rider;
    //     if (email) {
    //         rider = await this.prismaService.rider.findFirst({
    //             where: {
    //                 email: email
    //             }
    //         });
    //     } else if (phone) {
    //         rider = await this.prismaService.rider.findFirst({
    //             where: {
    //                 phone: phone
    //             }
    //         });
    //     }

    //     if (!rider) {
    //         throw new UnauthorizedException("Invalid credentials!");
    //     }
    //     const hashedPassword = rider.password;
    //     const isValidPassword = await bcrypt.compare(password, hashedPassword);

    //     if (!isValidPassword) {
    //         console.log("Invalid Password!");
    //         throw new HttpException("Invalid credentials!", 400);
    //     }

    //     console.log("Rider successfully login!");
    //     console.log(rider);

    //     const token = this.jwtService.sign({ id: rider.id });
    //     return { token }
    // }

    // async getUserProfileById(id: string, token: string): Promise<Rider | null> {
    //     return this.prismaService.rider.findUnique({ where: { id } });
    // }




}
