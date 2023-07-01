import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { createAdminParams } from './admin-interface';
import { AdminLoginDto } from './dtos/admin.login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) { }

    async findAll(): Promise<Admin[]> {
        return this.prismaService.admin.findMany();
    }

    async findById(id: string): Promise<Admin | null> {
        return this.prismaService.admin.findUnique({ where: { id } });
    }

    async create(data: createAdminParams): Promise<Admin> {
        const { email, phone } = data;
        const userExists = await this.prismaService.admin.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        return this.prismaService.admin.create({ data });
    }

    async update(id: string, data): Promise<Admin | null> {
        const userExist = await this.prismaService.admin.findUnique({ where: { id } });
        return this.prismaService.admin.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Admin | null> {
        return this.prismaService.admin.delete({ where: { id } });
    }

    async login(adminLoginDto: AdminLoginDto): Promise<{ token: string }> {
        const { email, phone, password } = adminLoginDto;
        if (!email && !phone) {
            throw new Error("Email or phone number must be provided!");
        }

        let admin;
        if (email) {
            admin = await this.prismaService.admin.findFirst({
                where: {
                    email: email
                }
            });
        } else if (phone) {
            admin = await this.prismaService.admin.findFirst({
                where: {
                    phone: phone
                }
            });
        }

        if (!admin) {
            throw new UnauthorizedException("Invalid credentials!");
        }
        const hashedPassword = admin.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) {
            console.log("Invalid Password!");
            throw new HttpException("Invalid credentials!", 400);
        }

        console.log("admin successfully login!");
        console.log(admin);
        
        const token = this.jwtService.sign({ id: admin.id });
        return { token }
    }
}
