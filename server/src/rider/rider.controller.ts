import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { AuthGuard } from '@nestjs/passport';
import { Driver, Rider, Trip } from '@prisma/client';
import { AdminAuthGuard, RiderAuthGuard } from 'src/auth/role.auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindARiderDto } from './dtos/find.rider.dto';
import { RiderUpdateDto } from './dtos/rider.update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { RiderLoginDto } from './dtos/rider.login.dto';
import { RiderRefreshTokenDto } from './dtos/rider.refresh.dto';
import { RiderDeviceTokenDto } from './dtos/rider.devicetoken.dto';
import { RiderLocationUpdateDto } from './dtos/rider.location.update.dto';
import { RequestTripDto } from './dtos/rider.request.dto';
import { CreateTripDto } from './dtos/rider.ride.create.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

export const storage = {
  storage: diskStorage({
    destination: './uploads/riders/profileimages',
    filename: (req, file, cb) => {
      const fileName: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

@ApiTags('rider')
@Controller('rider')
export class RiderController {
  constructor(private riderService: RiderService) {}

  // Get all nearest drivers
  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), RiderAuthGuard)
  @ApiOperation({ summary: 'Get all nearest drivers' })
  @Get('/location/nearestDriver')
  async findNearestDrivers(@Req() req): Promise<Driver[] | null> {
    const userId = req.user.user.id;
    const riderLocation = await this.riderService.getRiderLocation(userId);
    return await this.riderService.findNearestDrivers(
      riderLocation.newLatitude,
      riderLocation.newLongitude,
    );
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), RiderAuthGuard)
  @Post('/trips/')
  async createTrip(
    @Req() req,
    @Body() createTripDto: CreateTripDto,
  ): Promise<{ message: string; trip: Trip }> {
    const userId = req.user.user.id;
    return await this.riderService.createTrip(createTripDto, userId);
  }

  @MessagePattern({ cmd: 'booking-request' })
  async createTripByCall(@Payload() request: any) {
    return await this.riderService.createTripByCall(request);
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), RiderAuthGuard)
  @Put('/trips/cancel')
  async cancelTrip(@Req() req): Promise<{ message: string }> {
    const userId = req.user.user.id;
    return await this.riderService.cancelTrip(userId);
  }

  @Post('/trip/estimate')
  async getEstimateFare(
    @Body() requestTripDto: RequestTripDto,
  ): Promise<{ fare4Seats: number; fare7Seats: number }> {
    const requestedTime = new Date();
    const returnEstimateFare = await this.riderService.estimateTripFare(
      requestTripDto,
      requestedTime,
    );
    return {
      fare4Seats: returnEstimateFare.fare4Seats,
      fare7Seats: returnEstimateFare.fare7Seats,
    };
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), RiderAuthGuard)
  @ApiOperation({ summary: 'Get driver Profile' })
  @Get('profile/me')
  async getProfileInformation(@Req() req): Promise<Rider | null> {
    const userId = req.user.user.id;
    return await this.riderService.getRiderById(userId);
  }

  @ApiOperation({ summary: 'Get all rider' })
  @Get('')
  async getAllRider(): Promise<Rider[]> {
    return this.riderService.getAllRider();
  }

  @ApiOperation({ summary: 'Find a rider by query' })
  @Get('/profile')
  async findRider(@Query() query: FindARiderDto): Promise<Rider | null> {
    return this.riderService.findRider(query);
  }

  @ApiOperation({ summary: 'Create a Rider' })
  @ApiBody({ type: RiderCreateDto })
  @ApiResponse({ status: 201, description: 'Rider successfully created!' })
  @Post('/')
  async create(@Body() riderCreateDto: RiderCreateDto): Promise<Rider> {
    return this.riderService.createRider(riderCreateDto);
  }

  @ApiOperation({ summary: 'Get rider profile by id' })
  @ApiResponse({ status: 201, description: 'Rider found!' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get('/profile/:id')
  async getRiderProfileById(@Param('id') id: string): Promise<Rider> {
    return await this.riderService.getRiderById(id);
  }

  @ApiOperation({ summary: 'Update rider profile by id' })
  @ApiResponse({ status: 201, description: 'Rider profile updated!' })
  @ApiParam({ name: 'id', type: 'string' })
  @Put('/profile/:id')
  async updateRiderProfileById(
    @Param('id') id: string,
    @Body() riderUpdateDto: RiderUpdateDto,
  ) {
    return await this.riderService.updateRiderProfileById(id, riderUpdateDto);
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
  @ApiOperation({ summary: 'Delete a rider by id' })
  @ApiResponse({ status: 201, description: 'Rider profile deleted!' })
  @ApiParam({ name: 'id', type: 'string' })
  @Delete('profile/:id')
  async deleteRiderById(@Param('id') id: string) {
    return await this.riderService.deleteRiderById(id);
  }

  @ApiOperation({ summary: 'Find a rider location by ID' })
  @ApiResponse({ status: 201, description: 'Rider found!' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get('/location/:id')
  async getRiderLocation(@Param('id') id: string) {
    return await this.riderService.getRiderLocation(id);
  }

  // UPDATE A Rider Location
  @ApiOperation({ summary: 'Update a rider location' })
  @ApiBody({ type: RiderLocationUpdateDto })
  @Put('/location/:id')
  async updateRiderLocation(
    @Param('id') id: string,
    @Body() riderLocationUpdateDto: RiderLocationUpdateDto,
  ) {
    return await this.riderService.updateRiderLocation(
      id,
      riderLocationUpdateDto,
    );
  }

  @Post('profile/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  @ApiOperation({ summary: 'Upload a rider profile image' })
  uploadFile(@UploadedFile() file): { imagePath: string } {
    return { imagePath: file.filename };
  }

  // LOGIN AS RIDER
  @ApiOperation({ summary: 'Login as a rider' })
  @ApiBody({ type: RiderLoginDto })
  @Post('/login')
  async login(
    @Body() riderLoginDto: RiderLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.riderService.login(riderLoginDto);
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), RiderAuthGuard)
  @Post('logout')
  async logout(@Req() req): Promise<void> {
    // Assuming you have extracted the authenticated rider's ID from the JWT token
    const riderId = req.user.user.id;

    // Call the logout method in the AuthService to invalidate the refresh token.
    await this.riderService.logout(riderId);
  }
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RiderRefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Returns new access token and refresh token',
  })
  @Post('refresh')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    return await this.riderService.refreshToken(refreshToken);
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), RiderAuthGuard)
  @ApiBody({ type: RiderDeviceTokenDto })
  @ApiOperation({ summary: 'Update driver device token' })
  @Post('profile/deviceToken')
  async addDeviceToken(
    @Req() req,
    @Body() driverDeviceTokenDto: RiderDeviceTokenDto,
  ): Promise<Rider> {
    const userId = req.user.user.id;
    return await this.riderService.addDeviceToken(
      userId,
      driverDeviceTokenDto.deviceToken,
    );
  }
}
