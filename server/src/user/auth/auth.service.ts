import { ConflictException, HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs"

interface SignupParams {
    email: string;
    password: string;
    name: string;
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

    async signUp({email, phone, password, name}: SignupParams) {

        // Find if phone or email has been taken
        const customerExists = await this.prismaService.customer.findFirst({
            where: {
                OR :[  { email: email },
                       { phone: phone }]
            }
        });

        console.log({customerExists});
        if (customerExists){
            if (customerExists.email === email) {
                console.log('Email already exists');
            }

            if (customerExists.phone === phone) {
                console.log('Phone already exists');                
            }

            throw new ConflictException();
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prismaService.customer.create({
            data: {
                email,
                name,
                phone,
                isVip: false,
                password: hashedPassword
            }
        });
        const message: String = "Customer Account Created!";
        return message;
    }

    
    async signIn({phone, email, password} : SigninParams){
        if (!email && !phone) {
            throw new Error('Email or phone number must be provided');
        }
        
        let user;
        if (email){
            user = await this.prismaService.customer.findFirst({
                where: {
                    email: email
                }
            });
        } else if (phone) {
            user = await this.prismaService.customer.findFirst({
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
        return message;

    }    
}
