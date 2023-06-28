import { ConflictException, HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"

interface SignupParams {
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  password: string;
  phone: string;
  userType: string; // Add userType property
}

interface SigninParams {
  email: string;
  password: string;
  phone: string;
  userType: string; // Add userType property
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {};
  
  async register({ email, phone, password, first_name, last_name, gender, userType }: SignupParams) {

    // Find if phone or email has been taken
    let userExists;
    switch (userType) {
      case 'driver':
        userExists = await this.prismaService.driver.findFirst({
          where: {
            OR: [
              { email: email },
              { phone: phone }
            ]
          }
        });
        break;
      case 'rider':
        userExists = await this.prismaService.rider.findFirst({
          where: {
            OR: [
              { email: email },
              { phone: phone }
            ]
          }
        });
        break;
      case 'admin':
        userExists = await this.prismaService.admin.findFirst({
          where: {
            OR: [
              { email: email },
              { phone: phone }
            ]
          }
        });
        break;
      default:
        throw new HttpException("Invalid user type", 400);
    }

    if (userExists) {
      if (userExists.email === email) {
        console.log('Email already exists');
        throw new ConflictException('Email already exists');
      }

      if (userExists.phone === phone) {
        console.log('Phone already exists');
        throw new ConflictException('Phone already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    switch (userType) {
      case 'driver':
        user = await this.prismaService.driver.create({
          data: {
            email,
            first_name,
            last_name,
            gender,
            phone,            
            password: hashedPassword
          }
        });
        break;
      case 'rider':
        user = await this.prismaService.rider.create({
          data: {
            email,
            first_name,
            last_name,
            gender,
            phone,            
            password: hashedPassword
          }
        });
        break;
      case 'admin':
        user = await this.prismaService.admin.create({
          data: {
            email,
            first_name,
            last_name,
            gender,
            phone,
            password: hashedPassword
          }
        });
        break;
      default:
        throw new HttpException("Invalid user type", 400);
    }

    const message: string = `${userType} Account Created!`;
    console.log(message);
  }


  async login({ phone, email, password, userType }: SigninParams) {
    if (!email && !phone) {
      throw new Error('Email or phone number must be provided');
    }

    let user;
    switch (userType) {
      case 'driver':
        if (email) {
          user = await this.prismaService.driver.findFirst({
            where: {
              email: email
            }
          });
        } else if (phone) {
          user = await this.prismaService.driver.findFirst({
            where: {
              phone: phone
            }
          });
        }
        break;
      case 'rider':
        if (email) {
          user = await this.prismaService.rider.findFirst({
            where: {
              email: email
            }
          });
        } else if (phone) {
          user = await this.prismaService.rider.findFirst({
            where: {
              phone: phone
            }
          });
        }
        break;
      case 'admin':
        if (email) {
          user = await this.prismaService.admin.findFirst({
            where: {
              email: email
            }
          });
        } else if (phone) {
          user = await this.prismaService.admin.findFirst({
            where: {
              phone: phone
            }
          });
        }
        break;
      default:
        throw new HttpException("Invalid user type", 400);
    }

    if (!user) {
      throw new HttpException("Invalid Credentials", 400);
    }
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) {
      console.log("Invalid password!");
      throw new HttpException("Invalid Credentials", 400);
    }
    const message: string = `${userType} Login Success!`;
    return user;
  }


}
