import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderRegisterDto } from './dto/rider.register.dto';
import { RiderLoginDto } from './dto/rider.login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Rider } from '@prisma/client';
import { AdminAuthGuard, RiderAuthGuard, RoleAuthGuard } from 'src/auth/role.auth.guard';


@Controller('rider')
export class RiderController {
    constructor(private riderService: RiderService) { }

    @Post('/auth/register')
    register(@Body() riderRegisterDto: RiderRegisterDto): Promise<{ token: string }> {
        return this.riderService.register(riderRegisterDto);
    }

    @Post('/auth/login')
    login(@Body() riderLoginDto: RiderLoginDto): Promise<{ token: string }> {
        return this.riderService.login(riderLoginDto);
    }


    @Get('/me/:id')
    @UseGuards(AuthGuard('jwt'), RoleAuthGuard)         
    async getUserProfile(@Param('id') id: string, @Req() req): Promise<Rider | null> {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);
        return this.riderService.getUserProfileById(id, token);
    }
}

