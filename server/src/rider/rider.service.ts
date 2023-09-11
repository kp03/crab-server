import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RiderCreateDto } from './dtos/rider.create.dto';
import { Driver, Rider, RiderLocation, Trip } from '@prisma/client';
import { FindARiderDto } from './dtos/find.rider.dto';
import { RiderUpdateDto } from './dtos/rider.update.dto';
import * as bcrypt from 'bcryptjs';
import { RiderLoginDto } from './dtos/rider.login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RiderLocationUpdateDto } from './dtos/rider.location.update.dto';
import { RequestTripDto } from './dtos/rider.request.dto';
import axios from 'axios';
import { CreateTripDto } from './dtos/rider.ride.create.dto';
import { NotificationService } from 'src/notification/notification.service';
import { DriverService } from 'src/driver/driver.service';
import { SocketMessage, SocketService } from 'src/socket/socket.service';
import { CreateTripByCallDto } from './dtos/rider.ride.create.call.dto';
@Injectable()
export class RiderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly driverService: DriverService,
    private readonly socketService: SocketService,
  ) {}

  async getAllRider(): Promise<Rider[] | []> {
    return this.prismaService.rider.findMany();
  }

  async getRiderById(id: string): Promise<Rider | null> {
    const rider = await this.prismaService.rider.findUnique({
      where: { id },
    });

    if (!rider) {
      throw new NotFoundException('Rider not found!');
    }

    return await this.prismaService.rider.findUnique({ where: { id } });
  }

  async createRider(createDto: RiderCreateDto): Promise<Rider> {
    const { id, phone, name, password } = createDto;
    const riderExists = await this.prismaService.rider.findFirst({
      where: {
        OR: [{ phone: phone }, { id: id }],
      },
    });
    if (riderExists) {
      if (riderExists.id === id) {
        throw new ConflictException('ID already exists!');
      }
      if (riderExists.phone === phone) {
        throw new ConflictException('Phone already exists!');
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const rider = await this.prismaService.rider.create({
      data: {
        id,
        phone,
        password: hashedPassword,
        refresh_token: 'refresh-token',
        name,
        riderLocation: {
          create: {
            newLatitude: 10.2,
            newLongitude: 10.5,
          },
        },
      },
    });
    return rider;
  }

  async updateRiderProfileById(
    id: string,
    data: RiderUpdateDto,
  ): Promise<Rider | null> {
    const rider = await this.prismaService.rider.findUnique({
      where: { id },
    });
    if (!rider) {
      throw new NotFoundException('Rider not found!');
    }

    const { phone, name } = data;

    return await this.prismaService.rider.update({
      where: { id },
      data: {
        phone,
        name,
        updated_at: { set: new Date() },
      },
    });
  }

  async deleteRiderById(id: string): Promise<void> {
    const rider = await this.prismaService.rider.findUnique({
      where: { id },
    });
    if (!rider) {
      throw new NotFoundException('Rider not found!');
    }
    await this.prismaService.rider.delete({ where: { id } });
  }

  async findRider(riderData: FindARiderDto): Promise<Rider | null> {
    const { id, phone } = riderData;
    const riderExists = await this.prismaService.rider.findFirst({
      where: {
        OR: [{ id }, { phone }],
      },
    });

    if (riderExists) {
      return riderExists;
    } else {
      throw new NotFoundException('Rider not found');
    }
  }

  async login(
    riderLoginDto: RiderLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { phone, password } = riderLoginDto;
    if (!phone) {
      throw new Error('Phone number must be provided!');
    }

    let rider;
    if (phone) {
      rider = await this.prismaService.rider.findFirst({
        where: {
          phone: phone,
        },
      });
    }

    if (!rider) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const hashedPassword = rider.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials!', 400);
    }
    const accessToken = this.jwtService.sign({ id: rider.id });
    const refreshToken = this.generateRefreshToken(); // Implement this method to generate a refresh token and store it securely.
    await this.prismaService.rider.update({
      where: { id: rider.id },
      data: {
        refresh_token: refreshToken,
      },
    });
    return { accessToken, refreshToken };
  }

  async logout(riderId: string): Promise<void> {
    await this.prismaService.rider.update({
      where: { id: riderId },
      data: {
        refresh_token: null, // Set the refresh_token field to null to invalidate the refresh token.
      },
    });
  }

  // You may need to adjust the return type and parameters based on your actual implementation.
  // The example here assumes you're storing the user ID in the refresh token's payload.
  async refreshToken(
    refreshToken: string,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const validRider = await this.prismaService.rider.findFirst({
      where: {
        OR: [{ refresh_token: refreshToken }],
      },
    });

    if (!validRider) {
      throw new NotFoundException('Invalid refresh token!');
    }
    const newAccessToken = this.jwtService.sign({ id: validRider.id });
    const newRefreshToken = this.generateRefreshToken(); // Implement this method to generate a refresh token and store it securely.
    await this.prismaService.rider.update({
      where: { id: validRider.id },
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

  async addDeviceToken(id: string, deviceToken: string): Promise<Rider> {
    const rider = await this.prismaService.rider.findUnique({
      where: { id: id },
    });
    if (!rider) {
      throw new NotFoundException('Rider not found!');
    }

    await this.prismaService.rider.update({
      where: { id: id },
      data: { device_token: deviceToken },
    });

    return rider;
  }

  async updateRiderLocation(
    id: string,
    data: RiderLocationUpdateDto,
  ): Promise<RiderLocation> {
    const riderExists = await this.prismaService.rider.findUnique({
      where: { id },
      include: { riderLocation: true },
    });

    if (!riderExists) {
      throw new NotFoundException('Rider not found');
    }

    const { newLatitude, newLongitude } = data;
    const riderLocation = riderExists.riderLocation;

    if (!riderLocation) {
      throw new NotFoundException('Rider location not found');
    }

    const updatedRiderLocation = await this.prismaService.riderLocation.update({
      where: { id: riderLocation.id },
      data: {
        oldLatitude: riderLocation.newLatitude,
        oldLongitude: riderLocation.newLongitude,
        newLatitude,
        newLongitude,
      },
    });

    return updatedRiderLocation;
  }

  async getRiderLocation(id: string) {
    const riderExists = await this.prismaService.rider.findUnique({
      where: { id },
    });
    if (!riderExists) {
      throw new NotFoundException('Rider not found');
    }

    const updatedRiderLocation =
      await this.prismaService.riderLocation.findUnique({
        where: { id: riderExists.riderLocationID },
      });

    return updatedRiderLocation;
  }

  // Tìm driver gần nhát -> Limit là 5, có thể chỉnh sửa
  async findNearestDrivers(
    userLatitude: number,
    userLongitude: number,
    limit: number = 5,
  ): Promise<Driver[] | []> {
    const drivers = await this.prismaService.driver.findMany(); // Fetch all drivers

    //console.log(drivers);

    if (drivers.length === 0) {
      return []; // No drivers available
    }

    const nearestDrivers: { driver: Driver; distance: number }[] = [];

    var returnDrivers = [];
    for (const driver of drivers) {
      const driverLocation = await this.driverService.getDriverLocation(
        driver.id,
      );
      const distance = this.calculateDistance(
        userLatitude,
        userLongitude,
        driverLocation.newLatitude,
        driverLocation.newLongitude,
      );

      nearestDrivers.push({ driver, distance });
    }

    nearestDrivers.sort((a, b) => a.distance - b.distance); // Sort by distance
    nearestDrivers.slice(0, limit).map((item) => item.driver); // Return the first 'limit' drivers

    for (const nearestDriver of nearestDrivers) {
      returnDrivers.push(nearestDriver.driver);
    }

    return returnDrivers;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const earthRadius = 6371; // Earth's radius in kilometers

    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    return distance;
  }

  toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  async estimateTripFare(
    requestTripDto: RequestTripDto,
    requestedTime: Date,
  ): Promise<{ fare4Seats: number; fare7Seats: number }> {
    const { startLat, startLong, distance, duration } = requestTripDto;

    // Calculate the base fare per kilometer and fare per minute
    const baseFarePerKilometer = 10000; // Replace with your actual pricing
    const farePerMinute = 100; // Replace with your actual pricing
    const seatFare = 2000; // Replace with your actual pricing

    // Calculate the distance-based fare
    const distanceFare = (distance / 1000) * baseFarePerKilometer;

    // Calculate the time-based fare
    const timeFare = duration * farePerMinute;

    // Fetch weather data from OpenWeatherMap API
    const weatherData = await this.fetchWeatherData(startLat, startLong);

    // Apply traffic conditions
    const trafficMultiplier = this.calculateTrafficMultiplier(
      requestedTime,
      weatherData,
    );

    // Apply the multiplier to the time-based fare
    const adjustedTimeFare = timeFare * trafficMultiplier;

    // Calculate the total fare for 4 seats
    const totalFare4Seats = distanceFare + adjustedTimeFare + seatFare * 4;

    // Calculate the total fare for 7 seats
    const totalFare7Seats = distanceFare + adjustedTimeFare + seatFare * 7;

    // Return both estimated fares
    return { fare4Seats: totalFare4Seats, fare7Seats: totalFare7Seats };
  }

  async fetchWeatherData(lat: number, lon: number): Promise<any> {
    const axios = require('axios');

    const options = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: { q: `${lat},${lon}` },
      headers: {
        'X-RapidAPI-Key': '3fe4455360mshf68d9f9daad9c16p11ed7bjsn3252238512e6',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      return response.data.current.condition.text;
    } catch (error) {
      console.error(error);
    }
  }

  calculateTrafficMultiplier(requestedTime: Date, weatherData: any): number {
    // Implement your logic to determine the traffic multiplier based on the requested time and weather conditions
    // Use weather data from the API response to make decisions, e.g., if it's rainy, apply a multiplier of 2.0
    // Adjust the logic below based on your specific requirements

    // Convert the weather data to lowercase for case-insensitive comparison
    const lowercaseWeatherData = weatherData.toLowerCase();

    // Check if the weather data contains the word "rain"
    if (lowercaseWeatherData.includes('rain')) {
      return 2.0; // Double the fare for rainy conditions
    }

    return 1.0; // Default to no traffic impact
  }
  async createTrip(
    createTripDto: CreateTripDto,
    id: string,
  ): Promise<{ message: string; trip: Trip }> {
    try {
      const riderExists = await this.prismaService.rider.findUnique({
        where: { id },
      });

      //console.log(riderExists);

      if (!riderExists) {
        console.log(riderExists);
        throw new NotFoundException('Rider not found');
      }

      const {
        startLat,
        startLong,
        source,
        endLat,
        endLong,
        destination,
        distance,
        duration,
        cabSeats,
      } = createTripDto;
      const estTripDto = { startLat, startLong, distance, duration };
      const requestedTime = new Date();
      const estFare = await this.estimateTripFare(estTripDto, requestedTime);

      let trip_cost;
      if (cabSeats == 4) {
        trip_cost = estFare.fare4Seats;
      } else {
        trip_cost = estFare.fare7Seats;
      }

      // get neareast driver
      const allDriver = await this.findNearestDrivers(startLat, startLong, 5);
      // const allDriverTokens = allDriver.map(
      //   (driver: Driver) => driver.device_token,
      // );
      const allDriverIds = allDriver.map((driver: Driver) => driver.id);

      //console.log(allDriverTokens);

      const trip_belongs = await this.prismaService.trip.findFirst({
        where: { riderID: riderExists.id },
      });

      if (!trip_belongs) {
      }
      const newTrip = await this.prismaService.trip.create({
        data: {
          status: 'processing',
          sourceLat: startLat,
          sourceLong: startLong,
          source: source,
          destLat: endLat,
          destLong: endLong,
          destination: destination,
          cabSeats: cabSeats,
          trip_cost: trip_cost,
          trip_length: duration,
          distance: distance,
          riderID: id,
          date: new Date().toISOString(), // Convert to ISO 8601 format
        },
      });

      const tripRequestFormat = {
        id: newTrip.id,
        rider_id: newTrip.riderID,
        rider_name: riderExists.name,
        rider_phone: riderExists.phone,
        rider_avatar: riderExists.avatar ?? '',
        source: source,
        destination: destination,
        trip_cost: trip_cost.toString(),
        trip_length: distance.toString(),
        source_lat: startLat.toString(),
        source_long: startLong.toString(),
        destination_lat: endLat.toString(),
        destination_long: endLong.toString(),
      };

      //console.log(tripRequestFormat);

      // - SEND TO DRIVER
      // await this.notificationService.sendToTokens(
      //   'Một chuyến xe mới',
      //   'Khách hàng vừa yêu cầu một chuyến xe',
      //   tripRequestFormat,
      //   allDriverTokens,
      // );

      // - USING SOCKET
      const message: SocketMessage = {
        roomId: allDriverIds,
        eventName: 'trip-request',
        body: tripRequestFormat,
      };
      this.socketService.sendMessage(message);

      // Construct the JSON response
      const jsonResponse = {
        message: 'Trip created successfully',
        trip: newTrip,
      };

      return jsonResponse;
    } catch (error) {
      // Handle errors and return an error response if needed
      throw error; // You can customize error handling here
    }
  }

  // tạo chuyến thông qua tổng đài
  // không có địa chỉ kết thúc, distance, duration
  // ! Chưa test
  async createTripByCall(
    createTripDto: CreateTripByCallDto
  ): Promise<{ message: string; trip: Trip }> {
    try {
      const { startLat, startLong, source, phone, name, cabSeats } =
        createTripDto;

      // get neareast driver
      const allDriver = await this.findNearestDrivers(startLat, startLong, 5);
      // const allDriverTokens = allDriver.map(
      //   (driver: Driver) => driver.device_token,
      // );
      const allDriverIds = allDriver.map((driver: Driver) => driver.id);

      //console.log(allDriverTokens);

      const newTrip = await this.prismaService.trip.create({
        data: {
          status: 'processing',
          sourceLat: startLat,
          sourceLong: startLong,
          source: source,
          destLat: 0.0,
          destLong: 0,
          destination: '',
          cabSeats: cabSeats,
          trip_cost: 0,
          trip_length: 0,
          distance: 0,
          date: new Date().toISOString(), // Convert to ISO 8601 format
        },
      });

      const tripRequestFormat = {
        id: newTrip.id,
        rider_name: name,
        rider_phone: phone,
        source: source,
        source_lat: startLat.toString(),
        source_long: startLong.toString(),
      };

      //console.log(tripRequestFormat);

      // - SEND TO DRIVER
      // await this.notificationService.sendToTokens(
      //   'Một chuyến xe mới',
      //   'Khách hàng vừa yêu cầu một chuyến xe',
      //   tripRequestFormat,
      //   allDriverTokens,
      // );

      // - USING SOCKET
      const message: SocketMessage = {
        roomId: allDriverIds,
        eventName: 'trip-request-call',
        body: tripRequestFormat,
      };
      this.socketService.sendMessage(message);

      // Construct the JSON response
      const jsonResponse = {
        message: 'Trip created successfully',
        trip: newTrip,
      };

      return jsonResponse;
    } catch (error) {
      // Handle errors and return an error response if needed
      throw error; // You can customize error handling here
    }
  }

  async cancelTrip(id: string) {
    const riderExists = await this.prismaService.rider.findUnique({
      where: { id },
    });

    const trip_belongs = await this.prismaService.trip.findFirst({
      where: { riderID: riderExists.id },
    });
    var message: string = '';
    if (trip_belongs && trip_belongs.status != 'canceled') {
      await this.prismaService.trip.update({
        where: { id: trip_belongs.id },
        data: { status: 'canceled' },
      });

      // if(trip_belongs.driverID){
      //   const messageSocket : SocketMessage = {
      //     roomId: trip_belongs.driverID,
      //     eventName: '',
      //     body: undefined
      //   }
      //   this.socketService.sendMessage()
      // }

      message = 'Trip Canceled';
    } else {
      message = 'No trip found';
    }
    const jsonResponse = {
      message: message,
    };
    return jsonResponse;
  }
}
