import { Module } from '@nestjs/common';
import { SignOutService } from './sign-out.service';
import { SignOutController } from './sign-out.controller';
import { SessionService } from '../services/session.service';

@Module({
  providers: [SignOutService, SessionService],
  controllers: [SignOutController],
})
export class SignOutModule {}
