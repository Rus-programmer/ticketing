import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import { SessionService } from '../services/session.service';
import {
  Auth,
  AuthType,
  ISessionData,
  SignInDto,
  SignUpDto,
} from '@my-rus-package/ticketing';
import { Request } from 'express';
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

  @Post('refresh-token')
  @Auth(AuthType.RefreshToken)
  refreshAccessToken(@Req() request: Request) {
    const data = this.authService.refreshAccessToken(request);
    this.sessionService.assign(request, data);

    return;
  }

  @Delete('sign-out')
  signOut(@Session() session: ISessionData) {
    return this.sessionService.remove(session);
  }

  @Get('current-user')
  getCurrentUser(@Session() session: ISessionData) {
    return this.currentUserService.getCurrentUser(session);
  }
}
