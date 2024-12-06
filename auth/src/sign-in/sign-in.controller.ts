import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth.type.enum';
import { SignInService } from './sign-in.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { SessionService } from '../services/session.service';

@Controller('sign-in')
export class SignInController {
  constructor(
    private signInService: SignInService,
    private sessionService: SessionService,
  ) {}

  @Post()
  @Auth(AuthType.RefreshToken)
  @UseInterceptors(ClassSerializerInterceptor)
  async signIn(@Body() updateUserDto: SignInDto, @Req() request: Request) {
    const data = await this.signInService.signIn(updateUserDto);
    this.sessionService.assign(request, data);

    return data.user;
  }
}
