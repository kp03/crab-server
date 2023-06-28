import { Controller, Post, Body, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

 // Add this decorator to group endpoints under the 'users' tag
@ApiTags('authenticate')
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
        
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: SignUpDto })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @Post('/register')    
    @HttpCode(HttpStatus.CREATED)
    register(@Body() body: SignUpDto){        
        return this.authService.register(body);
    }

    @Post('/login')
    @HttpCode(200)
    login(@Body() body: SignInDto){
        return this.authService.login(body);
    }
    
}
