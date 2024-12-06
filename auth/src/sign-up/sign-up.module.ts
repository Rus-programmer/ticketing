import { Module } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { SignUpController } from './sign-up.controller';
import { TokenGeneratorService } from '../services/token-generator.service';
import { CreateUserModule } from '../user/create-user/create-user.module';
import { SessionService } from '../services/session.service';

@Module({
  providers: [SignUpService, TokenGeneratorService, SessionService],
  imports: [CreateUserModule],
  controllers: [SignUpController],
})
export class SignUpModule {}
