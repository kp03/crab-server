import { ConflictException, HttpException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AdminLoginDto } from './dtos/admin.login.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminCreateDto } from './dtos/admin.create.dto';
import { AdminUpdateDto } from './dtos/admin.update.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private logger: Logger
    ) {}


    async getAllAdmin(): Promise<Admin[]> {
        return this.prismaService.admin.findMany();
    }

    async getAdminById(id: string): Promise<Admin | null> {
        const admin = await this.prismaService.admin.findUnique({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }
        return await this.prismaService.admin.findUnique({ where: { id } });
    }

    async createAnAdmin(createDto: AdminCreateDto): Promise<Admin | null> {

        const { email, phone, password, name } = createDto;
        const adminExists = await this.prismaService.admin.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone },
                ]
            }
        });

        if (adminExists) {
            if (adminExists.email === email) {
                throw new ConflictException('Email already exists!');
            }
            if (adminExists.phone === phone) {
                throw new ConflictException('Phone already exists!');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await this.prismaService.admin.create({
            data: {

                email,
                phone,
                name,
                password: hashedPassword
            }
        });

        return admin;
    }

    async updateAnAdmin(id: string, data: AdminUpdateDto): Promise<Admin | null> {
        const adminExists = await this.prismaService.admin.findUnique({ where: { id } });
        if (!adminExists) {
            throw new NotFoundException('Admin not found');
        }

        const { email, phone, password, name } = data;

        const existedEmail = await this.prismaService.admin.findFirst({ where: { email } });
        const existedPhone = await this.prismaService.admin.findFirst({ where: { phone } });

        if (existedEmail) {
            this.logger.log('Email already exists');
            throw new ConflictException('Email already in use!');
        }

        if (existedPhone) {
            this.logger.log('Phone already exists');
            throw new ConflictException('Phone already in use!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.prismaService.admin.update({
            where: { id }, data: {
                email,
                phone,
                password: hashedPassword,
                name,
                updated_at: { set: new Date() },
            }
        });
    }

    async deleteAnAdmin(id: string): Promise<void> {
        const admin = await this.prismaService.admin.findUnique({
            where: { id },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        await this.prismaService.admin.delete({
            where: { id },
        });
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
            this.logger.log("Invalid Password!");
            throw new HttpException("Invalid credentials!", 400);
        }

        this.logger.log("admin successfully login!");
        this.logger.log(admin);
        const token = this.jwtService.sign({ id: admin.id });
        return { token }
    }

    async addAdminProfilePicture(id: string, imagePath: string): Promise<Admin | null> {
        const admin = await this.prismaService.admin.findUnique({ where: { id: id } });
        if (!admin) {
            throw new NotFoundException("Admin not found!");
        }

        const updatedAdmin = await this.prismaService.admin.update({
            where: { id: id },
            data: { avatar: imagePath }
        });

        return updatedAdmin;
    }
}
