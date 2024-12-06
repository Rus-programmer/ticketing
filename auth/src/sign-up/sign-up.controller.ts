import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpService } from './sign-up.service';
import { Auth } from '../decorators/auth.decorator';
import { SessionService } from '../services/session.service';
import { AuthType } from '@my-rus-package/ticketing';

@Controller('sign-up')
export class SignUpController {
  constructor(
    private signUpService: SignUpService,
    private sessionService: SessionService,
  ) {}

  @Post()
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(@Body() createUserDto: SignUpDto, @Req() request: Request) {
    const data = await this.signUpService.signUp(createUserDto);

    this.sessionService.assign(request, data);

    return data.user;
  }
}
