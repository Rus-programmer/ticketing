import { Module } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { SignInController } from './sign-in.controller';

@Module({
  providers: [SignInService],
  controllers: [SignInController]
})
export class SignInModule {}
