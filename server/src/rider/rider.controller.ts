import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RiderService } from './rider.service';
import { findRiderDto, riderSignupDto } from './dto/rider-request.dto';
import { riderSignupResponseDto } from './dto/rider-response.dto';

@Controller('rider')
@ApiTags('rider')
export class RiderController {
    constructor
        (
            private readonly riderService: RiderService,
        ) { }

    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        // respone dto type
        type: riderSignupResponseDto,
        description: 'Rider successfully created!'
    })
    @ApiOkResponse({ type: riderSignupResponseDto, description: '' })
    @ApiOperation({ description: "rider create api" })
    @ApiConsumes("APPLICATION/JSON")
    @Post('')
    public async CreateRider(@Body() body: riderSignupDto) {
        try {
            console.log(JSON.stringify(body));
            return await this.riderService.create(body);
        } catch (err) {
            throw err;
        }
    }

}
