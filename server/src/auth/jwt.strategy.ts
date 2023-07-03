import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

// @Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Replace with your actual secret key
    });
  }

  async validate(user: any) {
    // Validate the payload or perform additional checks if required
    // For example, you can check if the user exists in the database
    // using the `payload.sub` field, which represents the user ID
    return {  user };
  }
}
