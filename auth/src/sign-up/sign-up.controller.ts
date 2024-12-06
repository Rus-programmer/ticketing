import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpService } from './sign-up.service';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth.type.enum';
import { SessionService } from '../services/session.service';

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
