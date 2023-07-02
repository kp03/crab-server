import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { RiderLoginDto } from './dtos/rider.login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Rider } from '@prisma/client';
import { AdminAuthGuard, RiderAuthGuard, RoleAuthGuard } from 'src/auth/role.auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindARiderDto } from './dtos/find.rider.dto';

@ApiTags('rider') // Add ApiTags decorator
@Controller('rider')
export class RiderController {
    constructor(private riderService: RiderService) { }


    @ApiOperation({ summary: "Find a Rider" })
    @ApiResponse({ status: 200, description: "Rider Found!" })
    @Get('')
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

    // @ApiResponse({
    //     status: 201,
    //     description: "Rider Login successfully",
    //     schema: { properties: { token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxOTIzbGFrc21kZmxrbTAxOTIzIiwiaWF0IjoxNjg4MjgwOTgxLCJleHAiOjE2ODgzNjczODF9.g67a7q_gOdDRFQxiX7enhdnHXf-m4VtajQyuq-DbmLY' } } }
    // })
    // @Post('/auth/login')
    // login(@Body() riderLoginDto: RiderLoginDto): Promise<{ token: string }> {
    //     return this.riderService.login(riderLoginDto);
    // }

    // @ApiOperation({ summary: "Get Rider Profile" })
    // @ApiParam({ name: 'id', type: 'string' })
    // @ApiBearerAuth()
    // @UseGuards(AuthGuard('jwt'), RoleAuthGuard)
    // @Get('/me/:id')
    // async getRiderProfile(@Param('id') id: string, @Req() req): Promise<Rider | null> {
    //     const token = req.headers.authorization?.split(' ')[1];
    //     console.log(token);
    //     return this.riderService.getUserProfileById(id, token);
    // }

}

