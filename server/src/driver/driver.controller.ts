import { BadRequestException, Body, Controller, Delete, Get, Header, NotFoundException, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DriverService } from './driver.service';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DriverLoginDto } from './dtos/driver.login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthGuard, DriverAuthGuard } from 'src/auth/role.auth.guard';
import { DriverCreateDto } from './dtos/driver.create.dto';
import { DriverUpdateDto } from './dtos/driver.update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path';
import { Admin } from '@prisma/client';
import { join } from 'path';
import { DriverLocationUpdateDto } from './dtos/driver.location.update.dto';


export const storage = {
    storage: diskStorage({
        destination: './uploads/admin/profileimages',
        filename: (req, file, cb) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${fileName}${extension}`);
        }
    })
}

@ApiTags('driver')
@Controller('driver')
export class DriverController {
    constructor(private driverService: DriverService) { }

    // GET ALL DRIVER
    @ApiBearerAuth()
    @Header('Authorization', 'Bearer {{token}}')
    // @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
    @ApiOperation({ summary: "Get all driver" })
    @Get()
    async getAllDriver() {
        return await this.driverService.getAllDriver();
    }

    // GET DRIVER BY ID
    @ApiOperation({ summary: "Find an driver by ID" })
    @ApiResponse({ status: 201, description: "Driver found!" })
    @ApiParam({ name: 'id', type: 'string' })
    @Get(':id')
    async getDriverById(@Param('id') id: string) {
        return await this.driverService.getDriverById(id);
    }

    // CREATE NEW DRIVER
    @ApiOperation({ summary: "Create a new driver" })
    @ApiBody({ type: DriverCreateDto })
    @Post()
    async createADriver(@Body() driverCreateDto: DriverCreateDto) {
        return await this.driverService.createADriver(driverCreateDto);
    }

    // UPDATE A DRIVER
    @ApiOperation({ summary: "Update a driver" })
    @ApiBody({ type: DriverUpdateDto })
    @Put(':id')
    async updateADriver(@Param('id') id: string, @Body() driverUpdateDto: DriverUpdateDto) {
        return await this.driverService.updateADriver(id, driverUpdateDto);
    }

    // DELETE A DRIVER
    @ApiOperation({ summary: "Delete a driver by ID" })
    @ApiParam({ name: 'id', type: 'string' })
    @Delete(':id')
    async deleteADriver(@Param('id') id: string): Promise<void> {
        try {
            await this.driverService.deleteADriver(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Driver not found');
            }
            throw error;
        }
    }

    // LOGIN AS ADMIN
    @ApiOperation({ summary: "Login as an driver" })
    @ApiBody({ type: DriverLoginDto })
    @Post('/login')
    async login(@Body() driverLoginDto: DriverLoginDto, @Req() req): Promise<{ token: string }> {
        return this.driverService.login(driverLoginDto);
    }

    @ApiBearerAuth()
    @Header('Authorization', 'Bearer {{token}}')
    @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    async uploadFile(@UploadedFile() file, @Req() req): Promise<Admin | null> {
        const userId = req.user.user.id;
        if (!file) {
            throw new BadRequestException("No file provided!");
        }
        const imagePath = file.filename;
        return this.driverService.addDriverProfilePicture(userId, imagePath);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
    @Get('profile/picture')
    async getProfilePicture(@Req() req, @Res() res): Promise<void> {
        const userId = req.user.user.id;
        const admin = await this.driverService.getDriverById(userId);

        if (!admin || !admin.avatar) {
            return res.sendFile(join(process.cwd(), 'uploads/driver/profileimages/defaut-image.png'));
        }
        res.setHeader('Content-Type', 'image/jpeg');
        return res.sendFile(join(process.cwd(), 'uploads/driver/profileimages/' + admin.avatar));
    }

    @ApiOperation({ summary: "Find an driver location by ID" })
    @ApiResponse({ status: 201, description: "Driver found!" })
    @ApiParam({ name: 'id', type: 'string' })
    @Get('/location/:id')
    async getDriverLocation(@Param('id') id: string) {
        return await this.driverService.getDriverLocation(id);
    }

    // UPDATE A DRIVER
    @ApiOperation({ summary: "Update a driver location" })
    @ApiBody({ type: DriverLocationUpdateDto })
    @Put('/location/:id')
    async updateDriverLocation(@Param('id') id: string, @Body() driverLocationUpdateDto: DriverLocationUpdateDto) {
        return await this.driverService.updateDriverLocation(id, driverLocationUpdateDto);
    }


}
