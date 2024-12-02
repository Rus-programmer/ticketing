import { Module } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { SignUpController } from './sign-up.controller';

@Module({
  providers: [SignUpService],
  controllers: [SignUpController]
})
export class SignUpModule {}
