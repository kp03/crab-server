import { Body, Controller, Delete, Get, Header, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { AuthGuard } from '@nestjs/passport';
import { Rider } from '@prisma/client';
import { AdminAuthGuard } from 'src/auth/role.auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindARiderDto } from './dtos/find.rider.dto';
import { RiderUpdateDto } from './dtos/rider.update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path';
import { RiderLoginDto } from './dtos/rider.login.dto';

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

@ApiTags('rider')
@Controller('rider')
export class RiderController {
    constructor(private riderService: RiderService) { }

    @ApiOperation({ summary: "Get all rider" })
    @Get('')
    async getAllRider(): Promise<Rider[]> {
        return this.riderService.getAllRider();
    }

    @ApiOperation({ summary: "Find a rider by query" })
    @Get('/profile')
    async findRider(@Query() query: FindARiderDto): Promise<Rider | null> {
        return this.riderService.findRider(query);
    }

    @ApiOperation({ summary: "Create a Rider" })
    @ApiBody({ type: RiderCreateDto })
    @ApiResponse({ status: 201, description: "Rider successfully created!" })
    @Post('/')
    async create(@Body() riderCreateDto: RiderCreateDto): Promise<Rider> {
        return this.riderService.createRider(riderCreateDto);
    }

    @ApiOperation({ summary: "Get rider profile by id" })
    @ApiResponse({ status: 201, description: "Rider found!" })
    @ApiParam({ name: 'id', type: 'string' })
    @Get('/profile/:id')
    async getRiderProfileById(@Param('id') id: string): Promise<Rider> {
        return await this.riderService.getRiderById(id);
    }

    @ApiOperation({ summary: "Update rider profile by id" })
    @ApiResponse({ status: 201, description: "Rider profile updated!" })
    @ApiParam({ name: 'id', type: 'string' })
    @Put('/profile/:id')
    async updateRiderProfileById(@Param('id') id: string, @Body() riderUpdateDto: RiderUpdateDto) {
        return await this.riderService.updateRiderProfileById(id, riderUpdateDto);
    }

    @ApiBearerAuth()
    @Header('Authorization', 'Bearer {{token}}')
    @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
    @ApiOperation({ summary: "Delete a rider by id" })
    @ApiResponse({ status: 201, description: "Rider profile deleted!" })
    @ApiParam({ name: 'id', type: 'string' })
    @Delete('profile/:id')
    async deleteRiderById(@Param('id') id: string) {
        return await this.riderService.deleteRiderById(id);
    }

    @Post('profile/upload')
    @UseInterceptors(FileInterceptor('file', storage))
    @ApiOperation({ summary: "Upload a rider profile image" })
    uploadFile(@UploadedFile() file): { imagePath: string } {
        return { imagePath: file.filename };
    }

    // LOGIN AS RIDER
    @ApiOperation({ summary: "Login as a rider" })
    @ApiBody({ type: RiderLoginDto })
    @Post('/login')
    async login(@Body() riderLoginDto: RiderLoginDto, @Req() req): Promise<{ token: string }> {
        return this.riderService.login(riderLoginDto);
    }

}

