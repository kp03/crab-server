import { Body, Controller, Delete, Get, Header, NotFoundException, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminLoginDto } from './dtos/admin.login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard } from 'src/auth/role.auth.guard';
import { AdminCreateDto } from './dtos/admin.create.dto';
import { AdminUpdateDto } from './dtos/admin.update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path';
import { Admin } from '@prisma/client';


export const storage = {
    storage: diskStorage({
        destination: './uploads/riders/profileimages',
        filename: (req, file, cb) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${fileName}${extension}`);
        }
    })
}

@ApiTags('admin') // Add ApiTags decorator
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }


    // GET ALL ADMIN
    @ApiBearerAuth()
    @Header('Authorization', 'Bearer {{token}}')
    @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
    @ApiOperation({ summary: "Get all admin" })
    @Get()
    async getAllAdmin() {
        return await this.adminService.getAllAdmin();
    }

    // GET ADMIN BY ID
    @ApiOperation({ summary: "Find an admin by ID" })
    @ApiResponse({ status: 201, description: "Admin found!" })
    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    async getAdminById(@Param('id') id: string) {
        return await this.adminService.getAdminById(id);
    }

    // CREATE NEW ADMIN
    @ApiOperation({ summary: "Create a new admin" })
    @ApiBody({ type: AdminCreateDto })
    @Post()
    async createAnAdmin(@Body() adminCreateDto: AdminCreateDto) {
        return await this.adminService.createAnAdmin(adminCreateDto);
    }

    // UPDATE AN ADMIN
    @ApiOperation({ summary: "Update an admin" })
    @ApiBody({ type: AdminUpdateDto })
    @Put(':id')
    async updateAnAdmin(@Param('id') id: string, @Body() adminUpdateDto: AdminUpdateDto) {
        return await this.adminService.updateAnAdmin(id, adminUpdateDto);
    }

    // DELETE AN ADMIN
    @ApiOperation({ summary: "Delete an admin by ID" })
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    async deleteAnAdmin(@Param('id') id: string): Promise<void> {
        try {
            await this.adminService.deleteAnAdmin(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Admin not found');
            }
            throw error;
        }
    }

    // LOGIN AS ADMIN
    @ApiOperation({ summary: "Login as an admin" })
    @ApiBody({ type: AdminLoginDto })
    @Post('/login')
    async login(@Body() adminLoginDto: AdminLoginDto): Promise<{ token: string }> {
        return this.adminService.login(adminLoginDto);
    }



    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
    uploadFile(@UploadedFile() file, @Request() req): { imagePath: string } {        
        console.log(file);
        return { imagePath: file.filename };
    }

}
