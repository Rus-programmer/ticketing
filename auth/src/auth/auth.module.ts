import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpService } from '../services/sign-up.service';
import { SignInService } from '../services/sign-in.service';
import { TokenGeneratorService } from '../services/token-generator.service';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants/kafka.constants';
import { SessionService } from '../services/session.service';
import { UtilsModule } from '@my-rus-package/ticketing';
import { CurrentUserService } from '../services/current-user.service';
import kafkaConfig from '../config/kafka.config';

@Module({
  imports: [
    UtilsModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        ...kafkaConfig,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SignUpService,
    SignInService,
    TokenGeneratorService,
    SessionService,
    CurrentUserService,
    CurrentUserService,
  ],
})
export class AuthModule {}
