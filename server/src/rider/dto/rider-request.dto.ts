import { IsDefined, IsEmail, IsString, MinLength } from "class-validator";

export class riderSignupDto {

    @IsDefined()
    @IsString()
    @IsEmail()
    email!: string;

    @IsDefined()
    @IsString()    
    phone!: string;

    @IsDefined()
    @IsString()
    @MinLength(8)
    password!: string;
}

export class findRiderDto {

    @IsDefined()
    @IsString()
    @IsEmail()
    email!: string;

    @IsDefined()
    @IsString()    
    phone!: string;

    @IsDefined()
    @IsString()
    @MinLength(8)
    password!: string;
}