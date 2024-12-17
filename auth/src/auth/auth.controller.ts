import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import {
  Auth,
  AuthType,
  Cookies,
  ICookiesData,
  SignInDto,
  SignUpDto,
} from '@my-rus-package/ticketing';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUserService } from '../services/current-user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private currentUserService: CurrentUserService,
  ) {}

  @Post('sign-up')
  @Auth(AuthType.None)
  async signUp(
    @Body() createUserDto: SignUpDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.signUp(createUserDto);
    this.sessionService.assign(request, response, data);

    return data.user;
  }

  @Post('sign-in')
  @Auth(AuthType.None)
  async signIn(
    @Body() updateUserDto: SignInDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.signIn(updateUserDto);
    this.sessionService.assign(request, response, data);

    return data.user;
  }

  @Post('refresh-token')
  @Auth(AuthType.RefreshToken)
  refreshAccessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = this.authService.refreshAccessToken(request);
    this.sessionService.assign(request, response, data);

    return;
  }

  @Delete('sign-out')
  signOut(@Res({ passthrough: true }) response: Response) {
    return this.sessionService.remove(response);
  }

  @Get('current-user')
  getCurrentUser(@Cookies() cookies: ICookiesData) {
    return this.currentUserService.getCurrentUser(cookies);
  }
}
