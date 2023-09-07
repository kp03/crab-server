import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Driver, DriverLocation, Rider } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DriverCreateDto } from './dtos/driver.create.dto';
import * as bcrypt from 'bcryptjs';
import { DriverLoginDto } from './dtos/driver.login.dto';
import { JwtService } from '@nestjs/jwt';
import { DriverUpdateDto } from './dtos/driver.update.dto';
import { DriverLocationUpdateDto } from './dtos/driver.location.update.dto';
import { v4 as uuidv4 } from 'uuid';
import { ImageService } from 'src/image/image.service';
import { AcceptTripDto } from './dtos/driver.trip.update.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class DriverService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly imageService: ImageService,
    private readonly notificationService: NotificationService,
  ) {}

  async getAllDriver(): Promise<Driver[] | []> {
    return this.prismaService.driver.findMany();
  }

  async getDriverById(id: string): Promise<Driver | null> {
    const driver: Driver = await this.prismaService.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found!');
    }

    return await this.prismaService.driver.findUnique({ where: { id } });
  }

  async createDriver(createDto: DriverCreateDto): Promise<Driver> {
    const { phone, password, name } = createDto;

    const driverExists = await this.prismaService.driver.findFirst({
      where: {
        OR: [{ phone: phone }],
      },
    });

    if (driverExists) {
      if (driverExists.phone === phone) {
        throw new ConflictException('Phone already exists!');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = await this.prismaService.driver.create({
      data: {
        phone,
        name,
        password: hashedPassword,
        refresh_token: 'refresh-token',
        device_token: 'device-token',
        driverLocation: {
          create: {
            newLatitude: 10.2,
            newLongitude: 10.5,
          },
        },
      },
      include: { driverLocation: true }, // Include the driver location in the response
    });
    return driver;
  }

  async updateDriverById(
    id: string,
    data: DriverUpdateDto,
  ): Promise<Driver | null> {
    const driverExists = await this.prismaService.driver.findUnique({
      where: { id },
    });
    if (!driverExists) {
      throw new NotFoundException('driver not found');
    }

    const { phone, password, name, gender, cabSeats, licenseNumber } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prismaService.driver.update({
      where: { id },
      data: {
        phone,
        password: hashedPassword,
        name,
        gender,
        cabSeats,
        licenseNumber,
        updated_at: { set: new Date() },
      },
    });
  }

  async deleteADriver(id: string): Promise<void> {
    const driver = await this.prismaService.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found!');
    }
    await this.prismaService.driver.delete({
      where: { id },
    });
  }

  async login(
    driverLoginDto: DriverLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { phone, password } = driverLoginDto;
    if (!phone) {
      throw new Error('Phone number must be provided!');
    }

    let driver;
    if (phone) {
      driver = await this.prismaService.driver.findFirst({
        where: {
          phone: phone,
        },
      });
    }

    if (!driver) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const hashedPassword = driver.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials!', 400);
    }

    const accessToken = this.jwtService.sign({ id: driver.id });
    const refreshToken = this.generateRefreshToken(); // Implement this method to generate a refresh token and store it securely.
    await this.prismaService.driver.update({
      where: { id: driver.id },
      data: {
        refresh_token: refreshToken,
      },
    });
    return { accessToken, refreshToken };
  }

  // You may need to adjust the return type and parameters based on your actual implementation.
  // The example here assumes you're storing the user ID in the refresh token's payload.
  async refreshToken(
    refreshToken: string,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const validDriver = await this.prismaService.driver.findFirst({
      where: {
        OR: [{ refresh_token: refreshToken }],
      },
    });

    if (!validDriver) {
      throw new NotFoundException('Invalid refresh token!');
    }
    const newAccessToken = this.jwtService.sign({ id: validDriver.id });
    const newRefreshToken = this.generateRefreshToken(); // Implement this method to generate a refresh token and store it securely.
    await this.prismaService.driver.update({
      where: { id: validDriver.id },
      data: {
        refresh_token: newRefreshToken,
      },
    });
    return { newAccessToken, newRefreshToken };
  }

  generateRefreshToken(): string {
    const refreshToken = uuidv4(); // Generate a random UUID as the refresh token
    // Optionally, you can add an expiration date to the refresh token
    // Save the refresh token in a secure manner (e.g., in the database) if you plan to implement token rotation.

    return refreshToken;
  }

  async addDriverProfilePicture(
    id: string,
    file: Express.Multer.File,
  ): Promise<Driver | null> {
    const imagePath = await this.imageService.saveImageToCloud(file);

    const driver = await this.prismaService.driver.findUnique({
      where: { id: id },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found!');
    }

    const updatedDriver = await this.prismaService.driver.update({
      where: { id: id },
      data: { avatar: imagePath },
    });

    return updatedDriver;
  }

  async updateDriverLocation(
    id: string,
    data: DriverLocationUpdateDto,
  ): Promise<DriverLocation> {
    const driverExists = await this.prismaService.driver.findUnique({
      where: { id },
      include: { driverLocation: true },
    });

    if (!driverExists) {
      throw new NotFoundException('Driver not found');
    }

    const { newLatitude, newLongitude } = data;
    const driverLocation = driverExists.driverLocation;

    if (!driverLocation) {
      throw new NotFoundException('Driver location not found');
    }

    const updatedDriverLocation =
      await this.prismaService.driverLocation.update({
        where: { id: driverLocation.id },
        data: {
          oldLatitude: driverLocation.newLatitude,
          oldLongitude: driverLocation.newLongitude,
          newLatitude,
          newLongitude,
        },
      });

    return updatedDriverLocation;
  }

  async getDriverLocation(id: string) {
    const driverExists = await this.prismaService.driver.findUnique({
      where: { id },
    });
    if (!driverExists) {
      throw new NotFoundException('driver not found');
    }

    const updatedDriverLocation =
      await this.prismaService.driverLocation.findUnique({
        where: { id: driverExists.driverLocationID },
      });

    return updatedDriverLocation;
  }

  async addDeviceToken(id: string, deviceToken: string): Promise<Driver> {
    const driver = await this.prismaService.driver.findUnique({
      where: { id: id },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found!');
    }

    await this.prismaService.driver.update({
      where: { id: id },
      data: { device_token: deviceToken },
    });

    return driver;
  }

  async acceptTrip(acceptTripDto: AcceptTripDto, id: string) {
    const { trip_id, accept } = acceptTripDto;

    const trip_info = await this.prismaService.trip.findFirst({
      where: { id: trip_id },
    });
    const driver = await this.prismaService.driver.findUnique({
      where: { id: id },
    });
    //console.log(driver)

    //console.log(trip_info);
    var trip_status = trip_info.status;
    var message = '';
    if (accept == true) {
      if (trip_status == 'processing') {
        await this.prismaService.trip.update({
          where: { id: trip_id },
          data: {
            driverID: driver.id,
            status: 'accepted',
          },
        });
        message = 'ACCEPTED';
      }
      else if (trip_status == 'cancel') {
        message = 'CANCELLED';
      } else {
        message = 'ALREADY_ACCEPTED';
      }
    } else {
      if (trip_status == 'processing') {
        message = 'Trip Declined';
      }
      if (trip_status == 'cancel') {
        message = 'Trip Canceled By User';
      } else {
        message = 'Trip Already Accepted';
      }
    }

    const rider: Rider = await this.prismaService.rider.findUnique({
      where: { id: trip_info.riderID },
    });

    const acceptRequestFormat = {
      id: trip_info.id,
      driver_name: driver.name,
      driver_phone : driver.phone,
      driver_avatar: driver.avatar ?? "",
      driver_license: driver.licenseNumber,
      trip_cost: trip_info.trip_cost.toString(),
    };

    console.log(acceptRequestFormat)

    // SEND TO CUSTOMER
    await this.notificationService.sendToTokens(
      'Đã tìm thấy tài xế !',
      'Tài xế đang đi đến chỗ của bạn',
      acceptRequestFormat,
      [rider.device_token],
    );

    // Construct the JSON response
    const jsonResponse = {
      status: message,
      trip: trip_info,
      driver: driver,
      rider: rider,
    };
    return jsonResponse;
  }
}
