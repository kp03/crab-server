import { Body, Controller, Delete, Get, Header, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { RiderLoginDto } from './dtos/rider.login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Rider } from '@prisma/client';
import { AdminAuthGuard, RiderAuthGuard, RoleAuthGuard } from 'src/auth/role.auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindARiderDto } from './dtos/find.rider.dto';
import { RiderUpdateDto } from './dtos/rider.update.dto';

@ApiTags('rider') // Add ApiTags decorator
@Controller('rider')
export class RiderController {
    constructor(private riderService: RiderService) { }



    @ApiOperation({ summary: "Find all rider" })
    @ApiResponse({ status: 200, description: "Rider Found!" })
    @Get('')
    async getAllRider(): Promise<Rider[]> {
        return this.riderService.getAllRider();
    }

    @ApiOperation({ summary: "Find a rider by query" })
    @ApiResponse({ status: 200, description: "Rider Found!" })
    @Get('/profile')
    async findRider(@Query() query: FindARiderDto): Promise<Rider | null> {
        return this.riderService.findRider(query);
    }

    @ApiOperation({ summary: "Create a Rider" })
    @ApiBody({ type: RiderCreateDto })
    @ApiResponse({ status: 201, description: "Rider successfully created!" })
    @Post('/')
    async create(@Body() riderCreateDto: RiderCreateDto): Promise<Rider> {
        return this.riderService.create(riderCreateDto);
    }

    @ApiOperation({ summary: "Get rider profile by id" })
    @ApiResponse({ status: 201, description: "Rider found!" })
    @ApiParam({ name: 'id', type: 'string' })
    @Get('/profile/:id')
    async getRiderProfileById(@Param('id') id: string): Promise<Rider> {
        return await this.riderService.getRiderProfileById(id);
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
    @Delete('/:id')
    async deleteRiderById(@Param('id') id: string) {
        return await this.riderService.deleteRiderById(id);
    }



}

