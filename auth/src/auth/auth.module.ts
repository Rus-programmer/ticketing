import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpService } from '../services/sign-up.service';
import { SignInService } from '../services/sign-in.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SignUpService, SignInService],
})
export class AuthModule {}
