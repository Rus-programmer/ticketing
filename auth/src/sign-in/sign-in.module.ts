import { Module } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { SignInController } from './sign-in.controller';
import { GetUserModule } from '../user/get-user/get-user.module';
import { TokenGeneratorService } from '../services/token-generator.service';
import { SessionService } from '../services/session.service';

@Module({
  imports: [GetUserModule],
  providers: [SignInService, TokenGeneratorService, SessionService],
  controllers: [SignInController],
})
export class SignInModule {}
