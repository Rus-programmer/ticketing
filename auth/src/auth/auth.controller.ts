import { Body, Controller, Delete, Post, Req, Session } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { Auth } from '../decorators/auth.decorator';
import { AuthType, SignInDto, SignUpDto } from '@my-rus-package/ticketing';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SessionData } from 'express-session';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

  @Post('sign-up')
  @Auth(AuthType.None)
  async signUp(@Body() createUserDto: SignUpDto, @Req() request: Request) {
    const data = await this.authService.signUp(createUserDto);
    this.sessionService.assign(request, data);

    return data.user;
  }

  @Post('sign-in')
  @Auth(AuthType.None)
  async signIn(@Body() updateUserDto: SignInDto, @Req() request: Request) {
    const data = await this.authService.signIn(updateUserDto);
    this.sessionService.assign(request, data);

    return data.user;
  }

  @Delete('sign-out')
  async signOut(@Session() session: SessionData) {
    return this.sessionService.remove(session);
  }
}
