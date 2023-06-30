import { Body, Controller, Post } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderRegisterDto } from './dto/rider.register.dto';
import { RiderLoginDto } from './dto/rider.login.dto';

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
}
