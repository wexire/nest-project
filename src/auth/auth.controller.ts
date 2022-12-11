import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post } from '@nestjs/common';
import { Request } from 'express';
import { AuthDto } from './dto';

@Controller({})
export class AuthContoller {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login();
  }

  @Post('signup')
  signup() {
    return this.authService.signup();
  }
}
