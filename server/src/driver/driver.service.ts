import { ConflictException, HttpException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Driver } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DriverCreateDto } from './dtos/driver.create.dto';
import * as bcrypt from 'bcryptjs';
import { DriverLoginDto } from './dtos/driver.login.dto';
import { JwtService } from '@nestjs/jwt';
import { DriverUpdateDto } from './dtos/driver.update.dto';
import { DriverLocationUpdateDto } from './dtos/driver.location.update.dto';

@Injectable()
export class DriverService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService, private logger: Logger) { }

    async getAllDriver(): Promise<Driver[] | []> {
        return this.prismaService.driver.findMany();
    }

    async getDriverById(id: string): Promise<Driver | null> {
        const driver = await this.prismaService.driver.findUnique({
            where: { id },
        });

        if (!driver) {
            throw new NotFoundException("Driver not found!");
        }

        return await this.prismaService.driver.findUnique({ where: { id } });
    }

    async createADriver(createDto: DriverCreateDto): Promise<Driver | null> {

        const { email, phone, password, name } = createDto;
        const driverExists = await this.prismaService.driver.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone },
                ]
            }
        });

        if (driverExists) {
            if (driverExists.email === email) {
                this.logger.log('Email already exists!');
                throw new ConflictException('Email already exists!');
            }
            if (driverExists.phone === phone) {
                this.logger.log('Phone already exists!');
                throw new ConflictException('Phone already exists!')
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const driver = await this.prismaService.driver.create({
            data: {
                email,
                phone,
                name,
                password: hashedPassword,
            }
        });

        await this.prismaService.driverLocation.create({
            data: {
                driver: {
                    connect: { id: driver.id }
                },
                oldLatitude: "some-old-latitude",
                oldLongtitude: "some-old-longitude",
                newLatitude: "some-new-latitude",
                newLongtitude: "some-new-longitude"
            }
        });

        const message: string = `${driver} created!`;
        this.logger.log(driver);
        return driver;

    }

    async updateADriver(id: string, data: DriverUpdateDto): Promise<Driver | null> {
        const driverExists = await this.prismaService.driver.findUnique({ where: { id } });
        if (!driverExists) {
            throw new NotFoundException('driver not found');
        }

        const { email, phone, password, name } = data;

        const existedEmail = await this.prismaService.driver.findFirst({ where: { email } });
        const existedPhone = await this.prismaService.driver.findFirst({ where: { phone } });

        if (existedEmail) {
            this.logger.log('Email already exists');
            throw new ConflictException('Email already in use!');
        }

        if (existedPhone) {
            this.logger.log('Phone already exists');
            throw new ConflictException('Phone already in use!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.prismaService.driver.update({
            where: { id }, data: {
                email,
                phone,
                password: hashedPassword,
                name,
                updated_at: { set: new Date() },
            }
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

    async login(driverLoginDto: DriverLoginDto): Promise<{ token: string }> {
        const { email, phone, password } = driverLoginDto;
        if (!email && !phone) {
            throw new Error("Email or phone number must be provided!");
        }

        let driver;
        if (email) {
            driver = await this.prismaService.driver.findFirst({
                where: {
                    email: email
                }
            });
        } else if (phone) {
            driver = await this.prismaService.driver.findFirst({
                where: {
                    phone: phone
                }
            });
        }

        if (!driver) {
            throw new UnauthorizedException("Invalid credentials!");
        }
        const hashedPassword = driver.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) {
            this.logger.log("Invalid Password!");
            throw new HttpException("Invalid credentials!", 400);
        }

        this.logger.log("driver successfully login!");
        this.logger.log(driver);
        const token = this.jwtService.sign({ id: driver.id });
        return { token };
    }

    async addDriverProfilePicture(id: string, imagePath: string): Promise<Driver | null> {
        const driver = await this.prismaService.driver.findUnique({ where: { id: id } });
        if (!driver) {
            throw new NotFoundException("Driver not found!");
        }

        const updatedDriver = await this.prismaService.driver.update({
            where: { id: id },
            data: { avatar: imagePath }
        });

        return updatedDriver;
    }

    async updateDriverLocation(id: string, data: DriverLocationUpdateDto) {
        const driverExists = await this.prismaService.driver.findUnique({ where: { id } });
        if (!driverExists) {
            throw new NotFoundException('driver not found');
        }

        const { newLatitude, newLongtitude } = data;
        const updatedDriverLocation = await this.prismaService.driverLocation.update({
            where: { id: driverExists.driverLocationID },
            data: {
              newLatitude,
              newLongtitude
            }
          });
        
          return updatedDriverLocation;
    }


    async getDriverLocation(id: string) {
        const driverExists = await this.prismaService.driver.findUnique({ where: { id } });
        if (!driverExists) {
            throw new NotFoundException('driver not found');
        }
        
        const updatedDriverLocation = await this.prismaService.driverLocation.findUnique({
            where: { id: driverExists.driverLocationID },
          });
        
        return updatedDriverLocation;
    }

}
