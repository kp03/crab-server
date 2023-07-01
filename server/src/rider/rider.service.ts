import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import { JwtService } from '@nestjs/jwt';
import { RiderRegisterDto } from './dto/rider.register.dto';
import { RiderLoginDto } from './dto/rider.login.dto';
import { Rider } from '@prisma/client';

@Injectable()
export class RiderService {
    constructor
        (
            private readonly prismaService: PrismaService,
            private jwtService: JwtService
        ) { }

    async register(registerDto: RiderRegisterDto): Promise<{ token: string }> {

        const { id, email, phone, password } = registerDto;

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

        const hashedPassword = await bcrypt.hash(password, 10);
        const rider = await this.prismaService.rider.create({
            data: {
                id,
                email,
                phone,
                password: hashedPassword
            }
        });

        const message: string = `${rider} created!`;
        console.log(rider);
        const token = this.jwtService.sign({ id: rider.id });
        return { token }
    }

    async login(riderLoginDto: RiderLoginDto): Promise<{ token: string }> {
        const { email, phone, password } = riderLoginDto;
        if (!email && !phone) {
            throw new Error("Email or phone number must be provided!");
        }

        let rider;
        if (email) {
            rider = await this.prismaService.rider.findFirst({
                where: {
                    email: email
                }
            });
        } else if (phone) {
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
            console.log("Invalid Password!");
            throw new HttpException("Invalid credentials!", 400);
        }

        console.log("Rider successfully login!");
        console.log(rider);
        
        const token = this.jwtService.sign({ id: rider.id });
        return { token }
    }

    async getUserProfileById(id: string, token: string): Promise<Rider | null> {

        try {
            const decoded = this.jwtService.verify(token);
            if (decoded.id !== id) {
                throw new UnauthorizedException("Invalid Token!");
            }
        } catch (err){
            throw new UnauthorizedException("Invalid token!");
        }
        return this.prismaService.rider.findUnique({ where: { id } });
    }


}
