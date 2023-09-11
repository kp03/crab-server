import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DriverLoginDto } from './dtos/driver.login.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  AdminAuthGuard,
  DriverAuthGuard,
  RiderAuthGuard,
} from 'src/auth/role.auth.guard';
import { DriverCreateDto } from './dtos/driver.create.dto';
import { DriverUpdateDto } from './dtos/driver.update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Driver, Rider, Trip } from '@prisma/client';
import { join } from 'path';
import { DriverLocationUpdateDto } from './dtos/driver.location.update.dto';
import { JwtService } from '@nestjs/jwt';
import { DriverRefreshTokenDto } from './dtos/driver.refresh.dto';
import { DriverDeviceTokenDto } from './dtos/driver.devicetoken.dto';
import { AcceptTripDto } from './dtos/driver.trip.update.dto';
import { CompletedTripDto } from './dtos/driver.complete.trip.dto';

export const storage = {
  storage: diskStorage({
    destination: './uploads/drivers/profileimages',
    filename: (req, file, cb) => {
      const fileName: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

@ApiTags('driver')
@Controller('driver')
export class DriverController {
  constructor(
    private driverService: DriverService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
  @ApiOperation({ summary: 'Accept a trip' })
  @Put('trip/')
  async acceptTrip(@Req() req, @Body() acceptTripDto: AcceptTripDto): Promise<{status: string; trip: Trip; driver: Driver}>  {
    const userId = req.user.user.id;
    var driver = await this.driverService.getDriverById(userId);
    return await this.driverService.acceptTrip(acceptTripDto, driver.id);
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
  @ApiOperation({ summary: 'Accept a trip' })
  @Put('trip/complete')
  async completeTrip(@Req() req, @Body() completeTripDto: CompletedTripDto)  {
    const userId = req.user.user.id;
    var driver = await this.driverService.getDriverById(userId);
    return await this.driverService.completeTrip(completeTripDto, driver.id);
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
  @ApiOperation({ summary: 'Get driver Profile' })
  @Get('profile/me')
  async getProfileInformation(@Req() req): Promise<Driver | null> {
    const userId = req.user.user.id;
    return await this.driverService.getDriverById(userId);
  }

  // GET ALL DRIVER
  // @ApiBearerAuth()
  // @Header('Authorization', 'Bearer {{token}}')
  // @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
  @ApiOperation({ summary: 'Get all driver' })
  @Get()
  async getAllDriver() {
    return await this.driverService.getAllDriver();
  }

  // GET DRIVER BY ID
  @ApiOperation({ summary: 'Find an driver by ID' })
  @ApiResponse({ status: 201, description: 'Driver found!' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get('profile/:id')
  async getDriverById(@Param('id') id: string) {
    return await this.driverService.getDriverById(id);
  }

  // CREATE NEW DRIVER
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiBody({ type: DriverCreateDto })
  @Post()
  async createADriver(@Body() driverCreateDto: DriverCreateDto) {
    return await this.driverService.createDriver(driverCreateDto);
  }

  // UPDATE A DRIVER
  @ApiOperation({ summary: 'Update a driver' })
  @ApiBody({ type: DriverUpdateDto })
  @Put('profile/:id')
  async updateADriver(
    @Param('id') id: string,
    @Body() driverUpdateDto: DriverUpdateDto,
  ) {
    return await this.driverService.updateDriverById(id, driverUpdateDto);
  }

  // DELETE A DRIVER
  @ApiOperation({ summary: 'Delete a driver by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @Delete('profile/:id')
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

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: DriverRefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Returns new access token and refresh token',
  })
  @Post('refresh')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    return await this.driverService.refreshToken(refreshToken);
  }

  // LOGIN AS DRIVER
  @ApiOperation({ summary: 'Login as an driver' })
  @ApiBody({ type: DriverLoginDto })
  @Post('/login')
  async login(
    @Body() driverLoginDto: DriverLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.driverService.login(driverLoginDto);
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
  @Post('/profile/upload')
  //@UseInterceptors(FileInterceptor('file', storage))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<Driver | null> {
    const userId = req.user.user.id;
    if (!file) {
      throw new BadRequestException('No file provided!');
    }
    //const imagePath = file.filename;
    return this.driverService.addDriverProfilePicture(userId, file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
  @Get('profile/picture')
  async getProfilePicture(@Req() req, @Res() res): Promise<void> {
    const userId = req.user.user.id;
    const driver = await this.driverService.getDriverById(userId);

    if (!driver || !driver.avatar) {
      return res.sendFile(
        join(process.cwd(), 'uploads/driver/profileimages/defaut-image.png'),
      );
    }
    res.setHeader('Content-Type', 'image/jpeg');
    return res.sendFile(
      join(process.cwd(), 'uploads/driver/profileimages/' + driver.avatar),
    );
  }

  @ApiOperation({ summary: 'Find an driver location by ID' })
  @ApiResponse({ status: 201, description: 'Driver found!' })
  @ApiParam({ name: 'id', type: 'string' })
  @Get('/location/:id')
  async getDriverLocation(@Param('id') id: string) {
    return await this.driverService.getDriverLocation(id);
  }

  // UPDATE A DRIVER
  @ApiOperation({ summary: 'Update a driver location' })
  @ApiBody({ type: DriverLocationUpdateDto })
  @Put('/location/:id')
  async updateDriverLocation(
    @Param('id') id: string,
    @Body() driverLocationUpdateDto: DriverLocationUpdateDto,
  ) {
    return await this.driverService.updateDriverLocation(
      id,
      driverLocationUpdateDto,
    );
  }

  @ApiBearerAuth()
  @Header('Authorization', 'Bearer {{token}}')
  @UseGuards(AuthGuard('jwt'), DriverAuthGuard)
  @ApiBody({ type: DriverDeviceTokenDto })
  @ApiOperation({ summary: 'Update driver device token' })
  @Post('profile/deviceToken')
  async addDeviceToken(
    @Req() req,
    @Body() driverDeviceTokenDto: DriverDeviceTokenDto,
  ): Promise<Driver> {
    const userId = req.user.user.id;
    return await this.driverService.addDeviceToken(
      userId,
      driverDeviceTokenDto.deviceToken,
    );
  }
}
