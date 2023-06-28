import { BadRequestException, Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { createAdminParams } from './admin-interface';

@Injectable()
export class AdminService {
    constructor(private readonly prismaService: PrismaService) { }

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
}
