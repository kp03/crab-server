import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBody, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createAdminDto } from './dtos/create-admin-dto';
import { Admin } from '@prisma/client';
import { AdminLoginDto } from './dtos/admin.login.dto';


interface SignupParams {
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    password: string;
    phone: string;
    userType: string; // Add userType property
}

@ApiTags('admin') // Add ApiTags decorator
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }


    @Get()    
    async getAllAdmin() {
        return await this.adminService.findAll();
    }

    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    async getAdminById(id: string) {
        return await this.adminService.findById(id);
    }

    @Post()
    @ApiBody({ type: createAdminDto })
    async create(@Body() body: SignupParams) {
        return await this.adminService.create(body);
    }

    @Put()
    async updateAdmin(id: string, data) {
        return await this.adminService.update(id, data);
    }

    @Delete('id')
    async deleteAdmin(id: string) {
        return await this.adminService.delete(id);
    }

    @Post('/auth/login')
    login(@Body() adminLoginDto: AdminLoginDto): Promise<{ token: string }> {
        return this.adminService.login(adminLoginDto);
    }
}
