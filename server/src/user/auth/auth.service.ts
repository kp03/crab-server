import { ConflictException, HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import { first } from 'rxjs';

interface SignupParams {
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    password: string;    
    phone: string;
}

interface SigninParams {
    email: string;
    password: string;
    phone: string;
}

@Injectable()
export class AuthService {
    constructor (private readonly prismaService: PrismaService) {}

    async register({email, phone, password, first_name, last_name, gender}: SignupParams) {

        // Find if phone or email has been taken
        const riderExists = await this.prismaService.rider.findFirst({
            where: {
                OR :[  { email: email },
                       { phone: phone }]
            }
        });

        console.log({riderExists});
        if (riderExists){
            if (riderExists.email === email) {
                console.log('Email already exists');
            }

            if (riderExists.phone === phone) {
                console.log('Phone already exists');                
            }

            throw new ConflictException();
        }

        const hashedPassword = await bcrypt.hash(password, 10);        
        const user = await this.prismaService.rider.create({            
            data: {
                email,
                first_name,
                last_name,
                gender,
                phone,
                isVip: false,
                password: hashedPassword
            }
        });
        const message: String = "Rider Account Created!";
        console.log(message);        
    }

    
    async login({phone, email, password} : SigninParams){
        if (!email && !phone) {
            throw new Error('Email or phone number must be provided');
        }

        let user;
        if (email){
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

        if (!user) {
            throw new HttpException("Invalid Credentials", 400);
        }
        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword){
            console.log("Invalid password!");
            throw new HttpException("Invalid Credentials", 400);
        }
        const message: String = "Customer Login Success!";
        return user;

    }    
}
